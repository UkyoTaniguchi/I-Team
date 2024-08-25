"use client";

import React, {useState, useEffect} from "react";
import { db, auth } from "../../firebaseConfig";
import { collection, getDocs, doc, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; //インポート

const Pastwork = () => {
  
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

  return(
    <div className="min-h-screen bg-gray-800">
      <div className="text-cyan-50 p-4">
        <h1 className="text-4xl font-bold w-5/6 mb-8 ml-32 p-3 border-b">プロジェクト</h1>
        {projects.map((project) => (
            <div key={project.id} className="flex justify-center">
                {project.end && (
                    <div className="bg-sky-900 w-80 h-96 border border-gray-700 rounded-2xl p-1 mb-4">
                        <div className="flex justify-center items-end h-36 w-full">
                            <div className="flex relative bg-white w-32 h-32 rounded-full border border-black justify-center items-center">
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
                        </div>
                        <div className="flex justify-center items-center p-3 h-36 w-full">
                            <h1 className="text-3xl text-center font-semibold">{project.title}</h1>
                        </div>
                        <div className="flex justify-center items-center h-20 w-full">
                            <Link 
                                href={`/i-team/past-work/project?projectId=${project.id}`}
                                className="bg-blue-600 p-3 rounded-lg hover:bg-blue-700"
                            >
                                詳細を確認する
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  )
};

export default Pastwork;