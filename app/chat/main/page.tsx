"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";

const ChatPage = () => {
  const [messages, setMessages] = useState<any[]>([]); // メッセージの配列
  const [newMessage, setNewMessage] = useState(""); // 新しいメッセージ
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

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [projectId, router]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const user = auth.currentUser;

    if (user && projectId) {
      await addDoc(collection(db, "projects", projectId, "chats"), {
        text: newMessage,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName || "Anonymous", // ユーザー名を保存
      });

      setNewMessage(""); // 入力フィールドをリセット
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 p-4">
      <h1 className="text-4xl font-bold text-cyan-50 mb-8">チャット</h1>
      <div className="bg-gray-700 p-4 rounded-lg overflow-y-auto h-96 mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`p-2 ${auth.currentUser?.uid === message.userId ? 'text-right' : 'text-left'}`}>
            <p className="text-cyan-50"><strong>{message.userName}</strong></p>
            <p className="text-white">{message.text}</p>
          </div>
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
