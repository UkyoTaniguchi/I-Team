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
import { FiAlignJustify } from "react-icons/fi";
import { Description } from "@radix-ui/react-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type HeaderProps = {
  isLoggedIn: boolean;
};

const Header: React.FC<HeaderProps> = ({ isLoggedIn }) => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleLinkClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
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
    <div className="flex w-full h-28 bg-gray-800">
      <div className="flex items-center bg-gray-800 w-full">
        <div className="flex mx-2 sm:mx-10 items-center justify-center">
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
        <nav className="hidden lg:block">
          <ul className="flex gap-5 text-base">
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
                    className="text-cyan-50 hover:underline"
                  >
                    チームを探す
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link
                    href="/i-team/project-create"
                    className="text-cyan-50 hover:underline"
                  >
                    チームを作る
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link
                    href="/i-team/project-list"
                    className="text-cyan-50 hover:underline"
                  >
                    参加中のチーム
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link
                    href="/i-team/past-work"
                    className="text-cyan-50 hover:underline"
                  >
                    みんなの制作物
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
      <div className="lg:hidden flex flex-grow justify-end mr-5 bg-gray-800">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger>
            <FiAlignJustify className="h-10 w-10 text-white" />
          </SheetTrigger>
          {isLoggedIn && (
            <SheetContent className="px-0 pt-10">
              <SheetHeader className="mb-3">
                <SheetTitle className="text-center">{userEmail}</SheetTitle>
                <Description></Description>
              </SheetHeader>
              <div className="flex flex-col w-full text-center">
                <button
                  onClick={() => handleLinkClick("/i-team/profile")}
                  className="border-y py-5"
                >
                  プロフィール
                </button>
                <button
                  onClick={() => handleLinkClick("/i-team/home")}
                  className="border-b py-5"
                >
                  チームを探す
                </button>
                <button
                  onClick={() => handleLinkClick("/i-team/project-create")}
                  className="border-b py-5"
                >
                  チームを作る
                </button>
                <button
                  onClick={() => handleLinkClick("/i-team/project-list")}
                  className="border-b py-5"
                >
                  参加中のチーム
                </button>
                <button
                  onClick={() => handleLinkClick("/i-team/past-work")}
                  className="border-b py-5"
                >
                  みんなの制作物
                </button>
                <button onClick={handleLogout} className="border-b py-5">
                  ログアウト
                </button>
              </div>
            </SheetContent>
          )}
          {!isLoggedIn && (
            <SheetContent className="px-0 pt-10">
              <SheetHeader className="mb-3">
                <SheetTitle className="text-center">Not logged in</SheetTitle>
                <Description></Description>
              </SheetHeader>
              <div className="flex flex-col w-full text-center">
                <button
                  onClick={() => handleLinkClick("/auth/register")}
                  className="border-y py-5"
                >
                  新規登録
                </button>
                <button
                  onClick={() => handleLinkClick("/auth/login")}
                  className="border-b py-5"
                >
                  ログイン
                </button>
              </div>
            </SheetContent>
          )}
        </Sheet>
      </div>
    </div>
  );
};

export default Header;
