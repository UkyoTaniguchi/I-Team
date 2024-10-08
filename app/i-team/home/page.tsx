"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, doc, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Home = () => {
  const [projects, setProjects] = useState<any[]>([]); //プロジェクト配列定義
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc")); //作成したプロジェクトを時間順にリスト化
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map((doc) => ({
        //各ドキュメントのデータをオブジェクトとして取り出す
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
        <h1 className="text-4xl font-bold mb-8 ml-32">募集中のチーム一覧</h1>
        {projects.map((project) => (
          <div key={project.id} className="flex justify-center">
            {" "}
            {/* 各要素を一意にするためにkeyを追加 */}
            {project.joinauth.length < project.teamSize && (
              <div className="bg-sky-900 w-full md:w-5/6 border border-gray-700 rounded-2xl p-1 mb-4">
                <div className="flex w-full">
                  <div className="w-1/5 py-3 flex flex-col justify-center items-center">
                    <div className="flex relative bg-white w-24 h-24 md:w-32 md:h-32 rounded-full border border-black justify-center items-center">
                      {project.creatorProfileImage ? (
                        <Image
                          src={project.creatorProfileImage}
                          alt="Creator Profile Image"
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex w-16 h-16 text-black items-center justify-center text-center">
                          No Image
                        </div>
                      )}
                    </div>
                    {/* <div className="text-center">
                      <p>募集者</p>
                    </div> */}
                  </div>
                  <div className="w-4/5 p-3 mt-3 rounded-lg">
                    <h2 className="text-2xl font-bold mb-3">{project.title}</h2>
                    <p className="text-orange-600 font-bold">
                      開発内容:{" "}
                      <span className="text-white">{project.description}</span>
                    </p>
                    <p className="text-orange-600 font-bold">
                      開発技術:{" "}
                      <span className="text-white">{project.language}</span>
                    </p>
                    <p className="text-orange-600 font-bold">
                      開発人数:{" "}
                      <span className="text-white">{project.teamSize}</span>
                    </p>
                    <p className="text-orange-600 font-bold">
                      開発期間:{" "}
                      <span className="text-white">{project.duration}</span>
                    </p>
                    <p className="text-orange-600 font-bold">
                      そのほか:{" "}
                      <span className="text-white">{project.others}</span>
                    </p>
                    <div className="flex justify-center">
                      <Link
                        href={`/chat/main?projectId=${project.id}`}
                        className="bg-blue-600 rounded p-2 hover:bg-blue-700"
                      >
                        参加する
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
