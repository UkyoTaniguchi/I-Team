"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDoc, doc, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";


const Submit = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
    <div className="flex bg-gray-800 w-full min-h-screen justify-center">
      <div className="w-11/12 h-full p-4">
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
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border rounded-lg h-10 w-1/2"
          />
        </div>
      </div>
    </div>
  );
};

export default Submit;