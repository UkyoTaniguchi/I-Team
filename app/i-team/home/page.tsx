"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const Home = () => {
  const [projects, setProjects] = useState<any[]>([]); //プロジェクト配列定義

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc")); //作成したプロジェクトを時間順にリスト化
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map((doc) => ({ //各ドキュメントのデータをオブジェクトとして取り出す
        id: doc.id, //id情報取得
        ...doc.data(), //ドキュメントのデータフィールド展開
      }));
      setProjects(projectsData); //フェッチしたデータをprojectsに保存
    };

    fetchProjects(); //コンポーネントのレンダリング時にデータ取得
  }, []);

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="text-cyan-50 p-4">
        <h1 className="text-2xl font-bold mb-4">プロジェクト一覧</h1>
        {projects.map((project) => (
          <div key={project.id} className="bg-sky-900 border border-gray-700 rounded-2xl p-4 mb-4">
            <h2 className="text-xl font-bold">{project.title}</h2>
            <p>{project.description}</p>
            <p>開発言語: {project.language}</p>
            <p>開発人数: {project.teamSize}</p>
            <p>開発期間: {project.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
