"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { auth, db } from "../../firebaseConfig";  // Firestoreもインポート
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, setDoc } from "firebase/firestore";  // Firestoreの関数をインポート

type Inputs = {
  email: string;
  password: string;
  accountName: string;
  gender: string;
  experienceLanguage: string;
};

const Register = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onsubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      // Firebase Authでユーザーを作成
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // Firestoreにユーザーの追加情報を保存
      await setDoc(doc(db, "users", user.uid), {
        accountName: data.accountName,
        gender: data.gender,
        experienceLanguage: data.experienceLanguage,
        email: data.email,
        profileImage: "",
        createdAt: new Date(),
      });

      alert("アカウントが作成されました！");
      router.push("/auth/login");
    } catch (error) {
      // エラーハンドリング部分
      const firebaseError = error as { code: string; message: string };
      if (firebaseError.code === "auth/email-already-in-use") {
        alert("このメールアドレスは既に使用されています．");
      } else {
        alert(firebaseError.message);
      }
    }
  };

  return (
    <div className="bg-gray-800 h-screen flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="bg-sky-800 p-8 rounded-lg shadow-lg w-4/6"
      >
        <h1 className="text-cyan-50 mb-4 text-4xl font-bold">新規登録</h1>

        <div className="mb-4">
          <label className="text-cyan-50 block text-xl font-medium">アカウント名</label>
          <input
            {...register("accountName", { required: "アカウント名は必須です．" })}
            type="text"
            className="mt-1 border-2 rounded-md w-full p-2"
          />
          {errors.accountName && (
            <span className="text-red-600 text-sm">{errors.accountName.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="text-cyan-50 block text-xl font-medium">性別</label>
          <div className="flex text-cyan-50 text-base gap-4 mt-1">
            <label>
              <input
                {...register("gender", { required: "性別は必須です．" })}
                type="radio"
                value="男"
              />
              男
            </label>
            <label>
              <input
                {...register("gender", { required: "性別は必須です．" })}
                type="radio"
                value="女"
              />
              女
            </label>
            <label>
              <input
                {...register("gender", { required: "性別は必須です．" })}
                type="radio"
                value="どちらでもない"
              />
              どちらでもない
            </label>
          </div>
          {errors.gender && (
            <span className="text-red-600 text-sm">{errors.gender.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="text-cyan-50 block text-xl font-medium">経験言語</label>
          <input
            {...register("experienceLanguage", { required: "経験言語は必須です．" })}
            type="text"
            className="mt-1 border-2 rounded-md w-full p-2"
          />
          {errors.experienceLanguage && (
            <span className="text-red-600 text-sm">{errors.experienceLanguage.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="text-cyan-50 block text-xl font-medium">メールアドレス</label>
          <input
            {...register("email", {
              required: "メールアドレスは必須です．",
              pattern: {
                value:
                  /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                message: "メールアドレスの形式が正しくありません．",
              },
            })}
            type="text"
            className="mt-1 border-2 rounded-md w-full p-2"
          />
          {errors.email && (
            <span className="text-red-600 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="text-cyan-50 block text-xl font-medium">パスワード</label>
          <input
            {...register("password", {
              required: "パスワードは必須です．",
              minLength: {
                value: 6,
                message: "パスワードは6文字以上で入力してください．",
              },
            })}
            type="password"
            className="mt-1 border-2 rounded-md w-full p-2"
          />
          {errors.password && (
            <span className="text-red-600 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            新規登録
          </button>
        </div>
        
        <div className="mt-4">
          <span className="text-cyan-50 text-sm">
            既にアカウントをお持ちですか？
          </span>
          <Link
            href="/auth/login"
            className="text-orange-500 text-sm font-bold hover:text-orange-400"
          >
            ログイン
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
