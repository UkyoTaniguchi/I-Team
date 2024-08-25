"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebaseConfig";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

const ProjectCreate = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [teamSize, setTeamSize] = useState("2");
  const [duration, setDuration] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = auth.currentUser; // 現在のユーザーを取得

      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid)); //現在のユーザの""users"ドキュメントを参照，取得
        const userData = userDoc.exists() ? userDoc.data() : null;
        const userProfileImage = userData ? userData.profileImage : null;

        const docRef = await addDoc(collection(db, "projects"), {
          title,
          description,
          language,
          teamSize,
          duration,
          end: false,
          createdAt: new Date(),
          createdBy: user.uid, // 作成者のUIDを保存
          joinauth: [user.uid], //プロジェクト参加者を保存
          creatorProfileImage: userProfileImage, // 作成者のアイコンURLを保存
        });

        alert("プロジェクトが作成されました！");
        setTitle("");
        setDescription("");
        setLanguage("");
        setTeamSize("2");
        setDuration(""); // フォーム内を空にリセット

        router.push(`/chat/main?projectId=${docRef.id}`);
      }
    } catch (e) {
      console.error("プロジェクトの作成に失敗しました", e);
      alert("プロジェクトの作成に失敗しました");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-4"
      style={{ height: "calc(100vh - 7rem)" }}
    >
      <div className="flex justify-center mb-10">
        <label className="text-cyan-50 text-3xl mr-3">タイトル</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border rounded-lg h-10 w-1/2"
        />
      </div>
      <div className="flex justify-center mb-10">
        <label className="text-cyan-50 text-3xl mr-3">開発内容</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={10}
          className="border rounded-lg w-1/2"
        />
      </div>
      <div className="flex justify-center mb-10">
        <label className="text-cyan-50 text-3xl mr-3">開発言語</label>
        <input
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          required
          className="border rounded-lg w-1/2"
        />
      </div>
      <div className="flex justify-center mb-10">
        <label className="text-cyan-50 text-3xl mr-3">開発人数</label>
        <select
          value={teamSize}
          onChange={(e) => setTeamSize(e.target.value)}
          required
          className="border rounded-lg w-1/2 h-10"
        >
          <option value="2">2人</option>
          <option value="3">3人</option>
          <option value="4">4人</option>
          <option value="5">5人</option>
          <option value="6">6人</option>
        </select>
      </div>
      <div className="flex justify-center mb-10">
        <label className="text-cyan-50 text-3xl mr-3">開発期間</label>
        <input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          className="border rounded-lg w-1/2"
        />
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-500 text-white h-12 w-24 rounded-lg px-4 py-2 hover:bg-blue-600"
        >
          作成
        </button>
      </div>
    </form>
  );
};

export default ProjectCreate;
