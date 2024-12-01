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
    const fetchUserData = async () => {
      //ユーザデータを非同期で取得する関数
      const user = auth.currentUser; //現在ログインしているユーザ情報取得
      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid)); //現在のユーザの""users"ドキュメントを参照,取得

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
        router.push("/auth/login"); //リダイレクト
      }
    };

    fetchUserData();
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //画像アップロードハンドラー
    if (e.target.files && e.target.files[0]) {
      //ファイルを選択している場合
      const file = e.target.files[0]; //ユーザが選択したファイルを変数に格納
      setNewProfileImage(file); // 新しい画像を一時的に保存
      setProfileImage(URL.createObjectURL(file)); // プレビューを更新
    }
  };

  const handleSaveChanges = async () => {
    //変更保存ハンドラー
    const user = auth.currentUser; //現在ログインしているユーザ情報取得
    if (user) {
      let downloadURL = profileImage; //プロフィール画像のURL格納

      if (newProfileImage) {
        //新しい画像がある場合
        const storageRef = ref(storage, `profileImages/${user.uid}`); //ユーザのUIDを使ったファイルパス生成
        await uploadBytes(storageRef, newProfileImage); //パスを使って新しい画像ファイルをfirebase storageにアップロード
        downloadURL = await getDownloadURL(storageRef); //firebase storageにアップロードした公開URL取得
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          //firestoreにデータの変更をマージ
          accountName,
          gender,
          experienceLanguage,
          profileImage: downloadURL,
        },
        { merge: true }
      );

      setIsEditing(false); // 編集モードを終了
      alert("プロフィールが更新されました。");
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex justify-center text-black">
      <div className="bg-[#232323] p-8 m-5 rounded-lg w-11/12">
        <div className="flex justify-center">
          {profileImage ? (
            <div className="relative bg-white w-36 h-36 rounded-full border border-white overflow-hidden">
              <Image
                src={profileImage}
                alt="Profile Image"
                fill
                style={{ objectFit: "cover" }}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center">
              No Image
            </div>
          )}
        </div>
        {isEditing && (
          <div className="mt-4 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-cyan-50"
            />
          </div>
        )}
        <div>
          {/* <h1 className="mt-10 mb-4 text-3xl font-bold">プロフィール</h1> */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-cyan-50">
              アカウント名
            </label>
            {isEditing ? (
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="mt-1 border-2 rounded-md w-full p-2"
              />
            ) : (
              <p className="mt-1 border-2 rounded-md w-full p-2 text-cyan-50">
                {accountName}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-cyan-50">
              性別
            </label>
            {isEditing ? (
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-1 border-2 rounded-md w-full p-2"
              >
                <option value="男">男</option>
                <option value="女">女</option>
                <option value="どちらでもない">どちらでもない</option>
              </select>
            ) : (
              <p className="mt-1 border-2 rounded-md w-full p-2 text-cyan-50">
                {gender}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-cyan-50">
              経験言語
            </label>
            {isEditing ? (
              <input
                type="text"
                value={experienceLanguage}
                onChange={(e) => setExperienceLanguage(e.target.value)}
                className="mt-1 border-2 rounded-md w-full p-2"
              />
            ) : (
              <p className="mt-1 border-2 rounded-md w-full p-2 text-cyan-50">
                {experienceLanguage}
              </p>
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
                プロフィールの編集
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
