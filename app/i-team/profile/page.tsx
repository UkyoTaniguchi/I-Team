"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { auth, db, storage } from "../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [accountName, setAccountName] = useState<string>(""); //アカウント管理
  const [gender, setGender] = useState<string>(""); //性別管理
  const [experienceLanguage, setExperienceLanguage] = useState<string>(""); //経験言語管理
  const [profileImage, setProfileImage] = useState<string>(""); //プロフィール写真管理
  const [isEditing, setIsEditing] = useState<boolean>(false); // 編集モードの管理
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null); // 新しいプロフィール画像管理
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => { //ユーザデータを非同期で取得する関数
      const user = auth.currentUser; //現在ログインしているユーザ情報取得
      if (user) {
        const docRef = doc(db, "users", user.uid); //現在のユーザの""users"ドキュメントを参照する変数
        const docSnap = await getDoc(docRef); //docRefを使ってドキュメントを取得

        if (docSnap.exists()) {
          const userData = docSnap.data(); //オブジェクト形式でデータを取得
          setAccountName(userData.accountName);
          setGender(userData.gender);
          setExperienceLanguage(userData.experienceLanguage);
          setProfileImage(userData.profileImage); //状態更新
        } else {
          console.log("No such document!");
        }
      } else {
        router.push("/auth/login");
      }
    };

    fetchUserData();
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { //画像アップロードハンドラー
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfileImage(file); // 新しい画像を一時的に保存
      setProfileImage(URL.createObjectURL(file)); // プレビューを更新
    }
  };

  const handleSaveChanges = async () => { //変更保存ハンドラー
    const user = auth.currentUser; //現在ログインしているユーザ情報取得
    if (user) {
      let downloadURL = profileImage;

      if (newProfileImage) { //新しい画像がある場合
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, newProfileImage);
        downloadURL = await getDownloadURL(storageRef); //firebase storageにアップ，そのURL取得
      }

      await setDoc(doc(db, "users", user.uid), { //firestoreにデータの変更をマージ
        accountName,
        gender,
        experienceLanguage,
        profileImage: downloadURL,
      }, { merge: true });

      setIsEditing(false); // 編集モードを終了
      alert("プロフィールが更新されました。");
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex justify-center">
      <div className="bg-cyan-50 p-8 m-5 rounded-lg w-11/12">
        <div className="flex justify-center">
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profile Image"
              width={150}
              height={150}
              className="rounded-full border border-black"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center">
              No Image
            </div>
          )}
        </div>
        {isEditing && (
          <div className="mt-4 text-center">
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
        )}
        <div>
          <h1 className="mb-4 text-2xl font-bold">プロフィール</h1>
          <div className="mb-4">
            <label className="block text-sm font-medium">アカウント名</label>
            {isEditing ? (
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="mt-1 border-2 rounded-md w-full p-2"
              />
            ) : (
              <p className="mt-1 border-2 rounded-md w-full p-2">{accountName}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">性別</label>
            {isEditing ? (
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-1 border-2 rounded-md w-full p-2"
              >
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="non-binary">どちらでもない</option>
              </select>
            ) : (
              <p className="mt-1 border-2 rounded-md w-full p-2">{gender}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">経験言語</label>
            {isEditing ? (
              <input
                type="text"
                value={experienceLanguage}
                onChange={(e) => setExperienceLanguage(e.target.value)}
                className="mt-1 border-2 rounded-md w-full p-2"
              />
            ) : (
              <p className="mt-1 border-2 rounded-md w-full p-2">{experienceLanguage}</p>
            )}
          </div>
          <div className="flex justify-center">
            {isEditing ? (
              <button
                onClick={handleSaveChanges}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
              >
                登録
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
              >
                設定
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
