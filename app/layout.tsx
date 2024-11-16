"use client";

import React, { useState, useEffect } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { auth } from "./firebaseConfig"; // Firebaseの設定ファイルをインポート
import Footer from "./components/Footer";

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
    <html lang="ja" className="bg-gray-800">
      <body className={inter.className}>
        <Header isLoggedIn={isLoggedIn} /> {/* ログイン状態をHeaderに渡す */}
        {children}
        <Footer />
      </body>
    </html>
  );
}
