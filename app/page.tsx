import React from "react";
import Image from "next/image";
import Link from "next/link";

const HomePage = () => {
  return (
    <div>
      <div className="flex flex-col bg-gray-800 min-h-screen p-5 w-full justify-center text-cyan-50">
        <div className="bg-[#135389] w-full h-5/6 p-10 rounded-3xl">
          <div>
            <h1 className="text-orange-400 text-5xl sm:text-6xl font-bold mb-5">気軽なチーム開発を</h1>
            <p className="text-xl sm:text-2xl mb-12">I-TEAMではIT職を希望する学生や社会人のためのチーム開発プラットフォームを提供しています</p>
            <p className="text-xl sm:text-2xl mb-5">こんな <span className="border-b text-2xl sm:text-3xl">経験</span> はありませんか？</p>
          </div>
          <div className="flex justify-evenly gap-3">
            <div className="max-w-72 h-full">
              <div className="relative aspect-square w-full">
                <Image
                  src="/reson1.png"
                  alt="Experience1"
                  fill
                  style={{ objectFit: "cover" }}
                  className="h-72 w-80 object-cover rounded-2xl bg-white"
                />
              </div>
              <p className="mt-5 text-xl text-center sm:text-2xl">ITに興味があり勉強をしているが開発の経験が少ない</p>
            </div>
            <div className="max-w-72 h-full">
              <div className="relative aspect-square w-full">
                <Image
                  src="/reson2.jpg"
                  alt="Experience1"
                  fill
                  style={{ objectFit: "cover" }}
                  className="h-72 w-80 object-cover rounded-2xl bg-white"
                />
              </div>
              <p className="mt-5 text-xl text-center sm:text-2xl">チームでの開発を経験したことがない</p>
            </div>
            <div className="max-w-72 h-full">
              <div className="relative aspect-square w-full">
                <Image
                  src="/reson3.png"
                  alt="Experience3"
                  fill
                  style={{ objectFit: "cover" }}
                  className="h-72 w-80 object-cover rounded-2xl bg-white"
                />
              </div>
              <p className="mt-5 text-xl text-center sm:text-2xl">就職までにガクチカで話せる幅を増やしたい</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-5">
          <h1 className="text-4xl text-center">このような悩みを解決できるプラットフォームが<span className="text-orange-400 font-bold">「I-TEAM」</span></h1>
        </div>
        <div className="flex justify-center mt-10">
          <div className="relative aspect-square w-6/12 sm:w-4/12">
            <Image
              src="/logo.png"
              alt="I-Team logo"
              fill
              style={{ objectFit: "cover" }}
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
        <div className="bg-[#135389] rounded-xl px-2 py-5 mt-10">
          <ul className="text-xl sm:text-3xl text-center">
            <li className="mb-5">I-TEAMではオンラインでチーム開発をする仲間を募集、参加することができる</li>
            <li className="mb-5">初対面の人とチーム開発を行うことでコミュニケーション能力向上やチーム開発を経験できる</li>
            <li className="">開発の内容はルーム作成者が決めるかみんなで話し合ってブラッシュアップしよう！</li>
          </ul>
          <div className="flex justify-center mt-16">
            <h1 className="text-4xl font-bold text-orange-400">さっそく始めよう！</h1>
          </div>
          <div className="flex mt-10 mb-5 justify-evenly">
            <div>
              <Link
                href="/auth/register"
                className="text-xl sm:text-3xl bg-blue-600 px-5 py-3 rounded-2xl hover:bg-blue-500"
              >
                新規登録
              </Link>
            </div>
            <div>
              <Link
                href="/auth/login"
                className="text-xl sm:text-3xl bg-blue-600 px-5 py-3 rounded-2xl hover:bg-blue-500"
              >
                ログイン
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
