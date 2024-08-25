"use client";

import React, { Suspense, useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
  const [explain, setExplain] = useState<string[]>(["", ""]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [finish, setFinish] = useState(false);
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
      try {
        const projectDoc = await getDoc(doc(db, "projects", projectId));

        if (projectDoc.exists()) {
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

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const storageRef = ref(storage, `images/${projectId}/${file.name}`); // Storage に保存するパスを指定

      try {
        // Firebase Storage に画像をアップロード
        await uploadBytes(storageRef, file);

        // アップロードした画像のダウンロード URL を取得
        const downloadURL = await getDownloadURL(storageRef);

        // ダウンロード URL を状態に保存
        setSelectedImages((prevImages) => {
          const newImages = [...prevImages];
          newImages[index] = downloadURL;
          return newImages;
        });
      } catch (error) {
        console.error("画像のアップロードに失敗しました:", error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!projectId) {
      console.error("プロジェクトIDが見つかりません");
      return;
    }
    setFinish(true);

    try {
      const projectRef = doc(db, "projects", projectId);

      await setDoc(
        projectRef,
        {
          title,
          description,
          link,
          ideapoint,
          background,
          explain,
          end: true,
          createdAt: new Date(),
          images: selectedImages,
        },
        { merge: true }
      );

      console.log("プロジェクトが正常に更新されました");
      router.push("/i-team/past-work");
    } catch (error) {
      console.error("プロジェクトの更新に失敗しました:", error);
    }
  };

  return (
    <Suspense>
      <div className="flex bg-gray-800 w-full min-h-screen justify-center p-10">
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
            <h1 className="text-cyan-50 text-5xl font-bold">
              プロジェクト詳細
            </h1>
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
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="text-center w-full my-2">
              <h1 className="text-cyan-50 text-3xl font-semibold">
                ここが魅力！
              </h1>
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
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="text-center w-full my-2">
              <h1 className="text-cyan-50 text-3xl font-semibold">
                作品の背景
              </h1>
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
            <h1 className="text-cyan-50 text-5xl font-bold">作品の概要</h1>
          </div>
        </div>
        <div className="w-full h-screen">
          <div className="flex justify-center">
            <div className="w-11/12 p-2 mb-4">
              <label className="text-cyan-50 text-xl mr-3">説明</label>
              <input
                value={explain[0]}
                onChange={(e) => {
                  const newExplain = [...explain];
                  newExplain[0] = e.target.value;
                  setExplain(newExplain);
                }}
                required
                placeholder="アプリの写真の説明情報"
                className="border rounded-lg h-10 w-1/2"
              />
            </div>
          </div>
          <div className="flex justify-center h-5/6">
            <div className="flex relative w-11/12 h-5/6 border justify-center items-center">
              {selectedImages[0] ? (
                <Image
                  src={selectedImages[0]}
                  alt="selected1"
                  fill
                  style={{objectFit:"cover"}}
                  className="w-full h-full"
                />
              ) : (
                <div className="h-20">
                  <p className="text-cyan-50 text-center text-2xl">
                    ここに画像が表示されます
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 0)} // 最初の画像を選択
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div className="w-full h-screen">
          <div className="flex justify-center">
            <div className="w-11/12 p-2 mb-4">
              <label className="text-cyan-50 text-xl mr-3">説明</label>
              <input
                value={explain[1]}
                onChange={(e) => {
                  const newExplain = [...explain];
                  newExplain[1] = e.target.value;
                  setExplain(newExplain);
                }}
                required
                placeholder="アプリの写真の説明情報"
                className="border rounded-lg h-10 w-1/2"
              />
            </div>
          </div>
          <div className="flex justify-center h-5/6">
            <div className="flex relative w-11/12 h-5/6 border justify-center items-center">
              {selectedImages[1] ? (
                <Image
                  src={selectedImages[1]}
                  alt="selected2"
                  fill
                  style={{objectFit:"cover"}}
                  className="w-full h-full"
                />
              ) : (
                <div className="h-20">
                  <p className="text-cyan-50 text-center text-2xl">
                    ここに画像が表示されます
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 1)} // 2番目の画像を選択
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-cyan-50 h-14 text-xl p-3 rounded-lg hover:bg-blue-600"
            >
              投稿する
            </button>
          </div>
        </div>
      </div>
    </div>
    </Suspense>  
  );
};

export default Submit;
