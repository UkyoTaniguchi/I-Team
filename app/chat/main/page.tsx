"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDoc,
  runTransaction,
  Firestore,
} from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { User, onAuthStateChanged } from "firebase/auth";

// メンバーをプロジェクトへ追加・システムメッセージの送信する関数
const incrementProjectMemberCount = async (
  db: Firestore,
  projectId: string,
  currentUser: User,
  router: ReturnType<typeof useRouter>
) => {
  const projectDocRef = doc(db, "projects", projectId);
  const projectDocSnap = await getDoc(projectDocRef);

  // プロジェクトのドキュメントが存在するか確認
  if (projectDocSnap.exists()) {
    const projectData = projectDocSnap.data();
    const teamSize = projectData.teamSize; // チーム人数を取得

    // ユーザーが既に参加していないか確認
    if (
      projectData.joinauth &&
      !projectData.joinauth.includes(currentUser.uid)
    ) {
      // トランザクションを実行してプロジェクトのドキュメントを更新し、現在のユーザーを参加承認配列に追加する
      await runTransaction(db, async (transaction) => {
        transaction.update(projectDocRef, {
          joinauth: [...projectData.joinauth, currentUser.uid],
        });

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        // ユーザーのアカウント名を取得
        const userName = userDoc.exists()
          ? userDoc.data()?.accountName
          : "Anonymous";

        const messageRef = doc(collection(db, "projects", projectId, "chats"));
        // システムメッセージをでユーザーがプロジェクトに参加したことを通知
        transaction.set(messageRef, {
          text: `${userName}さんが参加しました`,
          createdAt: serverTimestamp(),
          userId: "botID",
          userName: "bot",
        });
      });
    }

    // チームの制限人数に達したとき
    if (projectData.joinauth.length >= teamSize) {
      router.push("/i-team/home");
    }
  }
};

const ChatPage = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userProfileImages, setUserProfileImages] = useState<{
    [key: string]: string;
  }>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  useEffect(() => {
    if (!projectId) {
      router.push("/i-team/home");
      return;
    }

    const q = query(
      collection(db, "projects", projectId, "chats"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [projectId, router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && projectId) {
        incrementProjectMemberCount(db, projectId, user, router);
      }
    });

    return () => unsubscribe();
  }, [projectId, router]);

  useEffect(() => {
    const fetchProfileImages = async () => {
      const newProfileImages: { [key: string]: string } = {};

      for (const message of messages) {
        if (!userProfileImages[message.userId]) {
          const userDoc = await getDoc(doc(db, "users", message.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            newProfileImages[message.userId] = userData?.profileImage || "";
          }
        }
      }

      // 新しく取得したプロフィール画像がある場合のみ、状態を更新
      if (Object.keys(newProfileImages).length > 0) {
        setUserProfileImages((prevImages) => ({
          ...prevImages,
          ...newProfileImages,
        }));
      }
    };

    fetchProfileImages();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !auth.currentUser || !projectId) return;

    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      const userName = userData ? userData.accountName : "Anonymous";

      await addDoc(collection(db, "projects", projectId, "chats"), {
        text: newMessage,
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        userName: userName,
      });
      setNewMessage("");
    } catch (error) {
      console.log("メッセージの送信に失敗しました", error);
    }
  };

  const handleStartProject = () => {
    // プロジェクト開始のロジックを実装
  };

  return (
    <div className="h-screen bg-gray-800 p-4">
      <div className="bg-gray-700 p-4 rounded-lg overflow-y-auto h-4/6 my-4">
        {messages.map((message) =>
          auth.currentUser?.uid === message.userId ? (
            <div key={message.id} className="p-2 text-right">
              <p className="text-white">{message.text}</p>
            </div>
          ) : (
            <div key={message.id} className="flex items-center">
              {userProfileImages[message.userId] ? (
                <div className="relative w-10 h-10 rounded-full bg-white">
                  <Image
                    src={userProfileImages[message.userId]}
                    alt="profile Image"
                    fill
                    style={{ objectFit: "cover" }}
                    className="object-cover"
                  />
                </div>
              ) : message.userId === "system" ? (
                <div className="flex w-12 h-12 rounded-full text-xs bg-white items-center justify-center">
                  <p className="text-center">bot</p>
                </div>
              ) : (
                <div className="flex w-12 h-12 rounded-full text-xs bg-white items-center">
                  <p className="text-center">No Image</p>
                </div>
              )}

              <div className="p-2 text-left">
                <p className="text-cyan-50">
                  <strong>{message.userName}</strong>
                </p>
                <p className="text-white">{message.text}</p>
              </div>
            </div>
          )
        )}
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
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
          >
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
                style={{ objectFit: "cover", filter: "blur(2px)" }}
              />
              <div className="absolute inset-0 flex justify-center items-center">
                <p className="text-blue-400 text-3xl font-extrabold">
                  このメンバーで始める
                </p>
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
                style={{ objectFit: "contain", filter: "blur(2px)" }}
              />
              <div className="absolute inset-0 flex justify-center items-center">
                <p className="text-blue-600 text-3xl font-extrabold">
                  Slackへ移動
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className="w-80 h-44">
          <Link href={`/chat/submit?projectId=${projectId}`}>
            <div className="relative w-full h-full rounded-3xl overflow-hidden">
              <Image
                src="/submit.jpeg"
                alt="start_button"
                fill
                style={{ objectFit: "cover", filter: "blur(3px)" }}
              />
              <div className="absolute inset-0 flex justify-center items-center">
                <p className="text-blue-600 text-3xl font-extrabold">
                  作品を投稿する
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
