"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { auth } from "../../firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onsubmit: SubmitHandler<Inputs> = async (data) => {
    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        router.push("/i-team/top");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-credential") {
          alert("無効なメールアドレスまたはパスワードです．");
        } else {
          alert(error.message);
        }
      });
  };

  return (
    <div
      className="bg-gray-800 flex flex-col items-center justify-center"
      style={{ height: "calc(100vh - 10rem)" }}
    >
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="bg-sky-800 p-8 rounded-lg shadow-lg w-1/3"
      >
        <h1 className="text-cyan-50 mb-4 text-3xl font-bold">ログイン</h1>
        <div className="mb-4">
          <label className=" text-cyan-50 block text-xl font-medium">
            メールアドレス
          </label>
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
          <label className="text-cyan-50 block text-xl font-medium">
            パスワード
          </label>
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
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            ログイン
          </button>
        </div>
        <div className="mt-4">
          <span className="text-cyan-50 text-sm">初めてご利用の方ですか？</span>
          <Link
            href="/auth/register"
            className="text-orange-500 text-sm font-bold hover:text-orange-400"
          >
            新規登録
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
