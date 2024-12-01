"use client";

import React, { useState, useEffect } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { auth } from "./firebaseConfig"; // Firebaseの設定ファイルをインポート
import Footer from "./components/Footer";
import { Kaisei_Tokumin } from "next/font/google";
import { Zen_Antique } from "next/font/google";
import { Noto_Serif_JP } from "next/font/google";
import { Noto_Sans_JP } from "next/font/google";
import localFont from "next/font/local";

const kaiseiTokumin = Kaisei_Tokumin({
  subsets: ["latin"], // 必要なサブセットを指定します
  weight: ["400", "700"], // 使用するフォントウェイトを指定
});

const ZenAntique = Zen_Antique({
  subsets: ["latin"], // 必要なサブセットを指定します
  weight: ["400"], // 使用するフォントウェイトを指定
});

const NoteSerifJP = Noto_Serif_JP({
  subsets: ["latin"], // 必要なサブセットを指定します
  weight: ["400", "700"], // 使用するフォントウェイトを指定
});

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400"] });

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

  return (
    <html lang="ja" className="dark">
      <body className={NoteSerifJP.className}>
        <Header isLoggedIn={isLoggedIn} /> {/* ログイン状態をHeaderに渡す */}
        {children}
        <Footer />
      </body>
    </html>
  );
}
