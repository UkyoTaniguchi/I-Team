import React from "react";
import Image from "next/image";
import Link from "next/link";

const HomePage = () => {
  return (
    <div>
      <div className="flex bg-gray-800 h-screen justify-center items-center text-cyan-50">
        <div className="bg-sky-900 h-5/6 w-11/12 p-10 rounded-3xl">
          <div>
            <h1 className="text-7xl mb-5">気軽なチーム開発を</h1>
            <p className="text-2xl mb-12">I-TEAMではIT職を希望する学生や社会人のためのチーム開発プラットフォームを提供しています</p>
            <p className="text-2xl mb-5">こんな経験はありませんか？</p>
          </div>
          <div className="flex justify-evenly">
            <div className="w-80 rounded-2xl">
              <Image
                src="/reson1.png"
                alt="Experience1"
                width={300}
                height={300}
                className="h-72 w-80 object-cover rounded-2xl bg-white"
              />
              <p className="mt-5 text-2xl">ITに興味があり勉強をしているが開発の経験が少ない</p>
            </div>
            <div className="w-80 rounded-2xl">
              <Image
                src="/reson2.jpg"
                alt="Experience1"
                width={300}
                height={300}
                className="h-72 w-80 object-cover rounded-2xl bg-white"
              />
              <p className="mt-5 text-2xl">チームでの開発を経験したことがない</p>
            </div>
            <div className="w-80 rounded-2xl">
              <Image
                src="/reson3.png"
                alt="Experience3"
                width={300}
                height={300}
                className="h-72 w-80 object-cover rounded-2xl bg-white"
              />
              <p className="mt-5 text-2xl">就職までにガクチカで話せる幅を増やしたい</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 h-screen text-cyan-50">
        <div className="flex justify-center">
          <h1 className="text-4xl">このような悩みを解決できるプラットフォームが「I-TEAM」</h1>
        </div>
        <div className="flex justify-center mt-10">
          <Image
            src="/logo.png"
            alt="I-Team logo"
            width={500}
            height={500}
          />
        </div>
        <div className="bg-sky-800 px-2 py-5 mt-10">
          <ul className="text-3xl text-center">
            <li className="mb-5">I-TEAMではオンラインでチーム開発をする仲間を募集、参加することができる</li>
            <li className="mb-5">初対面の人とチーム開発を行うことでコミュニケーション能力向上やチーム開発を経験できる</li>
            <li className="">開発の内容はルーム作成者が決めるかみんなで話し合ってブラッシュアップしよう！</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-gray-800 text-cyan-50">
        <div className="flex justify-center">
          <h1 className="text-4xl">さっそく始めよう！</h1>
        </div>
        <div className="flex mt-16 pb-16 justify-center gap-60">
          <div>
            <Link
              href="/auth/register"
              className="text-3xl bg-gray-600 px-5 py-3 rounded-2xl hover:bg-gray-500"
            >
              新規登録
            </Link>
          </div>
          <div>
            <Link
              href="/auth/login"
              className="text-3xl bg-gray-600 px-5 py-3 rounded-2xl hover:bg-gray-500"
            >
              ログイン
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
