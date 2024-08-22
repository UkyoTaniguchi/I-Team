"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { auth, db } from "../../firebaseConfig";
import { collection, doc, addDoc, updateDoc, query, orderBy, onSnapshot, serverTimestamp, getDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";

const ChatPage = () => {
  const [messages, setMessages] = useState<any[]>([]); // メッセージの配列
  const [newMessage, setNewMessage] = useState(""); // 新しいメッセージ
  const [userProfileImages, setUserProfileImages] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId"); // URLからプロジェクトIDを取得

  useEffect(() => {
    if (!projectId) {
      router.push("/i-team/home"); // プロジェクトIDがなければホームにリダイレクト
      return;
    }

    const q = query(
      collection(db, "projects", projectId, "chats"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => { //リアルタイムにデータを取得
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [projectId, router]);

  useEffect(() => {
    //プロジェクトの人数を増やす処理
    const incrementProjectMemberCount = async () => {
      if (projectId) {
        const projectDocRef = doc(db, "projects", projectId);
        const projectDocSnap = await getDoc(projectDocRef);

        if (projectDocSnap.exists()) {
          const projectData = projectDocSnap.data();
          const teamSize = projectData.teamSize; //上限人数

          if (projectData.joinauth && !projectData.joinauth.includes(auth.currentUser?.uid)) {
            await updateDoc(projectDocRef, {
              joinauth: [...projectData.joinauth, auth.currentUser?.uid],
            });
          }

          if (projectData.joinauth.length > teamSize) {
            //プロジェクトが満員になった場合、ホーム画面から削除する処理
            router.push("/i-team/home");
          }
        }
      }
    };

    incrementProjectMemberCount();
  }, [projectId, router]);

  useEffect(() => {
    const fetchProfileImages = async () => {
      const newProfileImages: { [key: string]: string } = {};

      for (const message of messages) {
        if (!userProfileImages[message.userId]) { // まだプロフィール画像を取得していないユーザーに対してのみ取得
          const userDoc = await getDoc(doc(db, "users", message.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            newProfileImages[message.userId] = userData?.profileImage || "";
          }
        }
      }

      setUserProfileImages((prevImages) => ({ ...prevImages, ...newProfileImages }));
    };

    fetchProfileImages();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const user = auth.currentUser;

    if (user && projectId) {
      try{
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;
        const userName = userData ? userData.accountName : "Annoymous";

        

        await addDoc(collection(db, "projects", projectId, "chats"), {
          text: newMessage,
          createdAt: serverTimestamp(),
          userId: user.uid,
          userName: userName, // ユーザー名を保存
        });
        setNewMessage(""); // 入力フィールドをリセット

      } catch(error){
        console.log("メッセージの送信に失敗しました", error);
      }
      

      
    }
  };

  return (
    <div className="h-screen bg-gray-800 p-4">
      {/* <h1 className="text-4xl font-bold text-cyan-50 mb-8">チャット</h1> */}
      <div className="bg-gray-700 p-4 rounded-lg overflow-y-auto h-4/6 my-4">
        {messages.map((message) => (
          auth.currentUser?.uid === message.userId ? (
            <div key={message.id} className="p-2 text-right">
              <p className="text-white">{message.text}</p>
            </div>
          ) : (
            <div className="flex items-center" key={message.id}>
              {userProfileImages[message.userId] ? (
                <div className="relative w-10 h-10 rounded-full bg-white">
                  <Image
                    src = {userProfileImages[message.userId]}
                    alt="profile Image"
                    layout="fill"
                    objectFit="cover"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex w-12 h-12 rounded-full text-xs bg-white items-center">
                  <p className="text-center">No Image</p>
                </div>
              )};
              
              <div key={message.id} className="p-2 text-left">
                <p className="text-cyan-50"><strong>{message.userName}</strong></p>
                <p className="text-white">{message.text}</p>
              </div>
            </div>
            
          )    
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 rounded-l-lg border-none"
          placeholder="メッセージを入力..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600">
          送信
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
