"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { FaSearch } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import { MdJoinInner } from "react-icons/md";
import { BsFileEarmarkPost } from "react-icons/bs";

type HeaderProps = {
  isLoggedIn: boolean;
};

const Header: React.FC<HeaderProps> = ({ isLoggedIn }) => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isPopupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await auth.signOut(); // FirebaseのsignOutメソッドを呼び出す
      router.push("/"); // ログアウト後にホームページへリダイレクト
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // ポップアップが表示されていて、かつクリックされた場所がポップアップやuserEmail要素でない場合にポップアップを閉じる
      if (
        isPopupVisible &&
        event.target instanceof HTMLElement &&
        !event.target.closest(".popup") &&
        !event.target.closest(".user-email")
      ) {
        setPopupVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isPopupVisible]);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
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
              className="rounded-full"
            />
          </Link>
        </div>
        <nav>
          <ul className="flex gap-5 text-xl">
            {!isLoggedIn ? (
              <>
                <li>
                  <Link
                    href="/auth/login"
                    className="text-cyan-50 hover:underline"
                  >
                    ログイン
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/register"
                    className="text-cyan-50 hover:underline"
                  >
                    新規登録
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center">
                  <Link
                    href="/i-team/home"
                    className="text-cyan-50 hover:underline hidden lg:text-base lg:block"
                  >
                    チームを探す
                  </Link>
                  <Link
                    href="/i-team/home"
                    className="text-cyan-50 hover:underline lg:hidden"
                  >
                    <FaSearch className="size-10"/>
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link
                    href="/i-team/project-create"
                    className="text-cyan-50 hover:underline hidden lg:text-base lg:block"
                  >
                    チームを作る
                  </Link>
                  <Link
                    href="/i-team/project-create"
                    className="text-cyan-50 hover:underline lg:hidden"
                  >
                    <IoIosCreate className="size-10"/>
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link
                    href="/i-team/project-list"
                    className="text-cyan-50 hover:underline hidden lg:text-base lg:block"
                  >
                    参加中のチーム
                  </Link>
                  <Link
                    href="/i-team/project-list"
                    className="text-cyan-50 hover:underline lg:hidden"
                  >
                    <MdJoinInner className="size-10"/>
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link
                    href="/i-team/past-work"
                    className="text-cyan-50 hover:underline hidden lg:text-base lg:block"
                  >
                    みんなの制作物
                  </Link>
                  <Link
                    href="/i-team/past-work"
                    className="text-cyan-50 hover:underline lg:hidden"
                  >
                    <BsFileEarmarkPost className="size-10"/>
                  </Link>
                </li>

                <li className="flex items-center mr-1">
                  <p
                    onClick={togglePopup}
                    className="text-cyan-50 cursor-pointer hover:underline user-email text-xs sm:text-base"
                  >
                    {userEmail}
                  </p>
                  {isPopupVisible && (
                    <div className="absolute bg-gray-700 text-white right-0 mt-2 mr-3 w-40 py-2 rounded-lg shadow-lg popup">
                      <Link
                        href="/i-team/profile"
                        className="block px-4 py-2 hover:bg-gray-600"
                      >
                        プロフィール
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 hover:bg-gray-600"
                      >
                        ログアウト
                      </button>
                    </div>
                  )}
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
