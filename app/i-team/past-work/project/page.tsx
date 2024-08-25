"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import {getDoc, doc, setDoc} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import exp from "constants";


const Project = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [ideapoint, setIdeapoint] = useState("");
  const [background, setBackground] = useState("");
  const [explain, setExplain] = useState<string[]>(["", ""]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const router = useRouter();
  const storage = getStorage();
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
          setLink(projectData.link);
          setIdeapoint(projectData.ideapoint);
          setBackground(projectData.background);
          setExplain(projectData.explain);
          setSelectedImages(projectData.images);

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
    <div className="bg-gray-800 w-full min-h-screen text-cyan-50 p-4">
        <div className="h-screen w-full p-4">
            <div className="h-3/4 w-full p-4">
                <h1 className="text-6xl text-center mb-12 font-bold">{title}</h1>
                <h2 className="text-4xl text-center mb-2 font-medium">開発内容</h2>
                <div className="flex justify-center mb-12">
                    <p className="bg-sky-900 w-4/6 h-60 overflow-y-auto p-4 rounded-xl text-2xl">{description}</p>
                </div>
                <h2 className="text-4xl text-center mb-2 font-medium">リンク</h2>
                <div className="flex justify-center">
                    <p className="bg-sky-900 h-16 w-4/6 p-4 rounded-lg text-3xl">{link}</p>
                </div>
            </div>
            <div className="h-1/4 pt-24">
                <div className="flex justify-center">
                    <h1 className="text-5xl text-center font-bold w-9/12 pb-5 border-b">プロジェクト詳細</h1>
                </div>
            </div>
        </div>
        <div className="flex justify-center w-full">
            <div className="flex justify-evenly w-11/12">
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
                    <div className="flex w-full h-44 overflow-y-auto justify-center items-center">
                        <p className="text-xl">{ideapoint}</p>
                    </div>
                </div>
                <div className="bg-sky-900 w-1/3 h-96 rounded-3xl p-5">
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
                    <div className="flex w-full h-44 overflow-y-auto justify-center items-center">
                        <p className="text-xl">{background}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col justify-between h-screen w-full mt-24 p-4">
            <div className="">
                <div className="flex justify-center">
                    <h1 className="text-5xl text-center font-bold w-9/12 pb-5 border-b">プロジェクト詳細</h1>
                </div>
            </div>
            <div className="mt-5">
                <div className="flex justify-center">
                    <p className="text-xl w-11/12 h-10 pb-2">説明：{explain[0]}</p>
                </div>
            </div>
            <div className="flex justify-center h-full">
                <div className="flex relative w-11/12 h-full justify-center items-center">
                    <Image
                        src={selectedImages[0]}
                        alt="Selected"
                        fill
                        style={{objectFit:'cover'}}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
        </div> 
        <div className="flex flex-col justify-between h-screen w-full p-4 border">
            <div className="mt-14">
                <div className="flex justify-center">
                    <p className="text-xl w-11/12 h-10 pb-2">説明：{explain[1]}</p>
                </div>
            </div>
            <div className="flex justify-center h-full border">
                <div className="flex relative w-11/12 h-full border justify-center items-center">
                    <Image
                        src={selectedImages[1]}
                        alt="Selected"
                        fill
                        style={{objectFit:'cover'}}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default Project;