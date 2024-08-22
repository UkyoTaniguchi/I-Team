"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";

// type HeaderProps = {
//   isLoggedIn: boolean;
// };

const Header = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // ユーザーの認証状態を監視
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut(); // FirebaseのsignOutメソッドを呼び出す
      router.push("/"); // ログアウト後にホームページへリダイレクト
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  };
  return (
    <div className="flex w-full h-28">
      <div className="flex items-center bg-gray-800 w-full">
        <div className="flex mx-10 items-center justify-center">
          <Link href={isLoggedIn ? "/i-team/top" : "/"}>
            <Image
              src="/logo.png"
              alt="I-Team logo"
              width={100}
              height={100}
              className="my-2 rounded-full"
            />
          </Link>
        </div>
        <nav>
          <ul className="flex gap-10 text-2xl">
            {!isLoggedIn ? (  // isLoggedIn が false のときにログイン、新規登録を表示
              <>
                <li>
                  <Link href="/auth/login" className="text-cyan-50 hover:underline">
                    ログイン
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="text-cyan-50 hover:underline">
                    新規登録
                  </Link>
                </li>
              </>
            ) : (  // isLoggedIn が true のときにホーム、プロフィール、ログアウトを表示
              <>
                <li>
                  <Link href="/i-team/home" className="text-cyan-50 hover:underline">
                    ホーム
                  </Link>
                </li>
                <li>
                  <Link href="/i-team/project-create" className="text-cyan-50 hover:underline">
                    プロジェクト作成
                  </Link>
                </li>
                <li>
                  <Link href="/i-team/project-list" className="text-cyan-50 hover:underline">
                    参加プロジェクト
                  </Link>
                </li>
                <li>
                  <Link href="/i-team/project-list" className="text-cyan-50 hover:underline">
                    過去作品
                  </Link>
                </li>
                <li>
                  <Link href="/i-team/profile" className="text-cyan-50 hover:underline">
                    プロフィール
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-cyan-50 hover:underline"
                  >
                    ログアウト
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
