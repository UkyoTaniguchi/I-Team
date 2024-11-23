"use client";

import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const Pastwork = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        likes: doc.data().likes || 0, // Firestore から likes を取得
        liked: false, // 初期の「いいね」状態はfalse
        ...doc.data(),
      }));
      setProjects(projectsData);
    };

    fetchProjects();
  }, []);

  const handleLikeToggle = async (projectId: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              liked: !project.liked,
              likes: project.liked ? project.likes - 1 : project.likes + 1,
            }
          : project
      )
    );

    // Firestore の likes を更新
    const projectRef = doc(db, "projects", projectId);
    const selectedProject = projects.find(
      (project) => project.id === projectId
    );
    if (selectedProject) {
      await updateDoc(projectRef, {
        likes: selectedProject.liked
          ? selectedProject.likes - 1
          : selectedProject.likes + 1,
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)]">
      <div className="flex flex-col items-center text-cyan-50 p-4">
        <div className="w-[90%] px-2">
          <h1 className="text-2xl sm:text-4xl font-bold w-full mb-8 p-3 border-b">
            みんなの制作物一覧
          </h1>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {projects.map(
            (project) =>
              project.end && (
                <div
                  key={project.id}
                  className="bg-sky-900 w-80 h-96 border border-gray-700 rounded-2xl p-1 mb-4"
                >
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
                    <h1 className="text-3xl text-center font-semibold">
                      {project.title}
                    </h1>
                  </div>
                  <div className="flex justify-evenly items-center h-20 w-full">
                    <Link
                      href={`/i-team/past-work/project?projectId=${project.id}`}
                      className="bg-blue-600 p-3 rounded-lg hover:bg-blue-700"
                    >
                      詳細を確認する
                    </Link>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleLikeToggle(project.id)}
                    >
                      {project.liked ? (
                        <AiFillHeart className="text-red-500 size-8" />
                      ) : (
                        <AiOutlineHeart className="text-red-500 size-8" />
                      )}
                      <p className="ml-2 mt-1.5 text-sm">
                        {isNaN(project.likes) ? "0" : project.likes.toString()}
                      </p>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Pastwork;
