"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDoc, doc, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import exp from "constants";


const Submit = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [ideapoint, setIdeapoint] = useState("");
  const [background, setBackground] = useState("");
  const [explain, setExplain] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  useEffect(() => {
    if (!projectId) {
      router.push("/i-team/home");
      return;
    }

    const fetchProjectdata = async () => {
      try{
        const projectDoc = await getDoc(doc(db, "projects", projectId));

        if (projectDoc.exists()){
          const projectData = projectDoc.data();
          setTitle(projectData.title);
          setDescription(projectData.description);
        } else {
          console.log("プロジェクトが存在しません");
        }
      } catch (error) {
        console.log("プロジェクトデータの取得に失敗しました", error);
      }
    };

    fetchProjectdata();
  }, [projectId, router]);

  return(
    <div className="flex bg-gray-800 w-full min-h-screen justify-center p-4">
      <div className="w-11/12 h-full">
        <div className="flex justify-center my-12">
          <label className="text-cyan-50 text-3xl mr-3">タイトル</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border rounded-lg h-10 w-1/2"
          />
        </div>
        <div className="flex justify-center my-12">
          <label className="text-cyan-50 text-3xl mr-3">開発内容</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={10}
            className="border rounded-lg w-1/2"
          />
        </div>
        <div className="flex justify-center my-12">
          <label className="text-cyan-50 text-3xl mr-10">リンク</label>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
            placeholder="GitHubなどのプロジェクトに関連するURLを添付（任意）"
            className="border rounded-lg h-10 w-1/2"
          />
        </div>
        <div className="flex justify-center my-14">
          <div className="border-b w-9/12 h-30 p-5 text-center">
            <h1 className="text-cyan-50 text-5xl font-bold">プロジェクト詳細</h1>
          </div>
        </div>
        <div className="flex justify-evenly">
          <div className="bg-sky-900 w-1/3 h-96 rounded-3xl p-5">
            <div className="flex justify-center w-full">
              <div className="relative flex justify-center w-28 h-28 rounded-full overflow-hidden">
                <Image
                  src="/idea.webp"
                  alt="idea"
                  fill
                  style={{objectFit:'cover'}}
                />
              </div>
            </div>
            <div className="text-center w-full my-2">
              <h1 className="text-cyan-50 text-3xl font-semibold">ここが魅力！</h1>
            </div>
            <div className="flex w-full justify-center">
              <textarea
                value={ideapoint}
                onChange={(e) => setIdeapoint(e.target.value)}
                required
                rows={7}
                placeholder="技術的チャレンジやこのアプリならではのアイデアを伝えよう！"
                className="rounded-lg w-5/6 bg-transparent text-cyan-50"
              />
            </div>
          </div>
          <div className="bg-sky-900 w-1/3 h-96 rounded-3xl p-4">
            <div className="flex justify-center w-full">
              <div className="relative flex justify-center w-28 h-28 rounded-full overflow-hidden">
                <Image
                  src="/background.jpg"
                  alt="background"
                  fill
                  style={{objectFit:'cover'}}
                />
              </div>
            </div>
            <div className="text-center w-full my-2">
              <h1 className="text-cyan-50 text-3xl font-semibold">作品の背景</h1>
            </div>
            <div className="flex w-full justify-center">
              <textarea
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                required
                rows={7}
                placeholder="作品を作ろうと考えた背景を伝えよう！"
                className="rounded-lg w-5/6 bg-transparent text-cyan-50"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center my-14">
          <div className="border-b w-9/12 h-30 p-5 text-center">
            <h1 className="text-cyan-50 text-5xl font-bold">使用方法</h1>
          </div>
        </div>
        <div className="w-full h-screen">
          <div className="flex justify-center">
            <div className="w-10/12 p-2 mb-4">
              <label className="text-cyan-50 text-xl mr-3">説明</label>
              <input
                value={explain}
                onChange={(e) => setExplain(e.target.value)}
                required
                placeholder="アプリの写真の説明情報"
                className="border rounded-lg h-10 w-1/2"
              />
            </div>
          </div>
          <div className="flex justify-center h-5/6">
            <div className="relative w-10/12 h-5/6 border">
              
            </div>
          </div> 
        </div>
        <div className="w-full h-screen">
          <div className="flex justify-center">
            <div className="w-10/12 p-2 mb-4">
              <label className="text-cyan-50 text-xl mr-3">説明</label>
              <input
                value={explain}
                onChange={(e) => setExplain(e.target.value)}
                required
                placeholder="アプリの写真の説明情報"
                className="border rounded-lg h-10 w-1/2"
              />
            </div>
          </div>
          <div className="flex justify-center h-5/6">
            <div className="w-10/12 h-5/6 border">

            </div>
          </div> 
        </div>
      </div>
    </div>
  );
};

export default Submit;