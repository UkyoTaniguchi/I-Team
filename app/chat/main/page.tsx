"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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

  const handleStartProject = () => {

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
            <div key={message.id} className="flex items-center">
              {userProfileImages[message.userId] ? (
                <div className="relative w-10 h-10 rounded-full bg-white">
                  <Image
                    src = {userProfileImages[message.userId]}
                    alt="profile Image"
                    fill
                style={{objectFit: 'cover'}}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex w-12 h-12 rounded-full text-xs bg-white items-center">
                  <p className="text-center">No Image</p>
                </div>
              )}
              
              <div key={message.id} className="p-2 text-left">
                <p className="text-cyan-50"><strong>{message.userName}</strong></p>
                <p className="text-white">{message.text}</p>
              </div>
            </div>
            
          )    
        ))}
      </div>
      <div>
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
      <div className="flex mt-4 justify-evenly">
        <div className="w-80 h-44">
          <button onClick={handleStartProject} className="w-full h-full">
            <div className="relative w-full h-full rounded-3xl overflow-hidden">
              <Image
                src="/start.jpg"
                alt="start_button"
                fill
                style={{objectFit: 'cover', filter: 'blur(2px)'}}
              />
              <div className="absolute inset-0 flex justify-center items-center">
                <p className="text-blue-400 text-3xl font-extrabold">このメンバーで始める</p>
              </div>
            </div>
          </button>
        </div>
        <div className="w-80 h-44">
          <Link href="/chat/submit">
            <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white">
              <Image
                src="/slack2.webp"
                alt="start_button"
                fill
                style={{objectFit: 'contain', filter: 'blur(2px)'}}
              />
              <div className="absolute inset-0 flex justify-center items-center">
                <p className="text-blue-600 text-3xl font-extrabold">Slackへ移動</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="w-80 h-44">
          <Link href="/chat/submit">
            <div className="relative w-full h-full rounded-3xl overflow-hidden">
              <Image
                src="/submit.jpeg"
                alt="start_button"
                fill
                style={{objectFit: 'cover', filter: 'blur(3px)'}}
              />
              <div className="absolute inset-0 flex justify-center items-center">
                <p className="text-blue-600 text-3xl font-extrabold">作品を投稿する</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
