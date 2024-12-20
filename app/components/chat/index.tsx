"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDoc,
  runTransaction,
  Firestore,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { User, onAuthStateChanged } from "firebase/auth";
import CreateChannelButton from "@/app/components/CreateChannelButton";
import Modal from "../Modal";
import { IoMdInformationCircleOutline } from "react-icons/io";

// メンバーをプロジェクトへ追加・システムメッセージの送信する関数
const incrementProjectMemberCount = async (
  db: Firestore,
  projectId: string,
  currentUser: User,
  router: ReturnType<typeof useRouter>
) => {
  const projectDocRef = doc(db, "projects", projectId);
  const projectDocSnap = await getDoc(projectDocRef);

  // プロジェクトのドキュメントが存在するか確認
  if (projectDocSnap.exists()) {
    const projectData = projectDocSnap.data();
    const teamSize = projectData.teamSize; // チーム人数を取得

    // ユーザーが既に参加していないか確認
    if (
      projectData.joinauth &&
      !projectData.joinauth.includes(currentUser.uid)
    ) {
      // トランザクションを実行してプロジェクトのドキュメントを更新し、現在のユーザーを参加承認配列に追加する
      await runTransaction(db, async (transaction) => {
        transaction.update(projectDocRef, {
          joinauth: [...projectData.joinauth, currentUser.uid],
        });

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        // ユーザーのアカウント名を取得
        const userName = userDoc.exists()
          ? userDoc.data()?.accountName
          : "Anonymous";

        const messageRef = doc(collection(db, "projects", projectId, "chats"));
        // システムメッセージをでユーザーがプロジェクトに参加したことを通知
        transaction.set(messageRef, {
          text: `${userName}さんが参加しました`,
          createdAt: serverTimestamp(),
          userId: "botID",
          userName: "bot",
        });
      });
    }

    // チームの制限人数に達したとき
    if (projectData.joinauth.length > teamSize) {
      router.push("/i-team/home");
      console.log("チームの制限人数に達しました");
    }
  }
};

const ChatPage = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userProfileImages, setUserProfileImages] = useState<{
    [key: string]: string;
  }>({});
  const [members, setMembers] = useState<string[]>([]);
  const [projects, setProjects] = useState<any | null>(null);
  const [membersName, setMembersName] = useState<string[]>([]);
  const [channelName, setChannelName] = useState<string>("");
  const [isRecruitmentClosed, setIsRecruitmentClosed] = useState<boolean>();
  const [isOpenModal, setIsOpenModal] = React.useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  // 募集状態を切り替える関数
  const handleToggleRecruitment = async () => {
    if (!projectId) {
      console.error("プロジェクトIDが指定されていません");
      return;
    }

    try {
      const projectDocRef = doc(db, "projects", projectId);

      await updateDoc(projectDocRef, {
        recruitment: !isRecruitmentClosed,
      });
      setIsRecruitmentClosed(!isRecruitmentClosed);
    } catch (error) {
      console.log("募集切り替えに失敗しました", error);
    }
  };

  useEffect(() => {
    if (!projectId) {
      router.push("/i-team/home");
      console.log("プロジェクトIDがありません");
      return;
    }

    const q = query(
      collection(db, "projects", projectId, "chats"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [projectId, router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && projectId) {
        incrementProjectMemberCount(db, projectId, user, router);
      }
    });

    return () => unsubscribe();
  }, [projectId, router]);

  useEffect(() => {
    const fetchProfileImages = async () => {
      const newProfileImages: { [key: string]: string } = {};

      for (const message of messages) {
        if (!userProfileImages[message.userId]) {
          const userDoc = await getDoc(doc(db, "users", message.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            newProfileImages[message.userId] = userData?.profileImage || "";
          }
        }
      }

      if (Object.keys(newProfileImages).length > 0) {
        setUserProfileImages((prevImages) => ({
          ...prevImages,
          ...newProfileImages,
        }));
      }
    };

    fetchProfileImages();
  }, [messages, userProfileImages]);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (projectId) {
        const projectDocRef = doc(db, "projects", projectId);
        const projectDocSnap = await getDoc(projectDocRef);

        if (projectDocSnap.exists()) {
          const projectData = projectDocSnap.data();
          setProjects({
            id: projectId,
            ...projectData,
          });
          const memberEmails: string[] = [];
          const memberNames: string[] = [];

          for (const userId of projectData.joinauth) {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
              const userEmail = userDoc.data()?.email;
              const userName = userDoc.data()?.accountName;
              if (userEmail) memberEmails.push(userEmail);
              if (userName) memberNames.push(userName);
            }
          }

          setMembers(memberEmails);
          setMembersName(memberNames);
          setChannelName(projectData.title);
          setIsRecruitmentClosed(projectData.recruitment);
          console.log(memberEmails);
        }
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !auth.currentUser || !projectId) return;

    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      const userName = userData ? userData.accountName : "Anonymous";

      await addDoc(collection(db, "projects", projectId, "chats"), {
        text: newMessage,
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        userName: userName,
      });
      setNewMessage("");
    } catch (error) {
      console.log("メッセージの送信に失敗しました", error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col w-full px-8">
      <div className="mb-6 flex justify-center">
        {projects ? (
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-bold">{projects.title}</h2>
            <button onClick={() => setIsOpenModal(true)} className="">
              <IoMdInformationCircleOutline className="text-2xl" />
            </button>
            <Modal
              isOpenModal={isOpenModal}
              setIsOpenModal={setIsOpenModal}
              projects={projects}
              membersName={membersName}
            />
          </div>
        ) : (
          <p>Loading project data...</p>
        )}
      </div>
      {!projects.end && (
        <>
          <div className="flex justify-evenly items-center w-full">
            <div
              className={`border p-3 ${
                isRecruitmentClosed ? "bg-slate-500" : "border-blue-400"
              }`}
            >
              <button
                onClick={handleToggleRecruitment}
                className="w-full h-full"
              >
                <div className="relative w-full h-full">
                  <div className="flex justify-center items-center">
                    <p
                      className={`text-lg font-extrabold hover:text-blue-200 ${
                        isRecruitmentClosed ? "text-slate-300" : "text-blue-400"
                      }`}
                    >
                      {isRecruitmentClosed
                        ? "募集を再開する"
                        : "募集を締め切る"}
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="border border-blue-400 p-3">
              <div className="relative w-full h-full">
                <div className="flex justify-center items-center">
                  <CreateChannelButton
                    members={members}
                    channelName={channelName}
                  />
                </div>
              </div>
            </div>

            <div className="border border-blue-400 p-3">
              <Link href={`/chat/submit?projectId=${projectId}`}>
                <div className="flex justify-center items-center">
                  <p className="text-blue-400 text-lg font-extrabold hover:text-blue-200">
                    作品を投稿する
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}

      <div className="w-full">
        <div className="bg-gray-700 p-4 rounded-lg overflow-y-auto my-4 h-[480px]">
          {messages.map((message) =>
            auth.currentUser?.uid === message.userId ? (
              <div key={message.id} className="py-4 px-2 flex justify-end">
                <p className="text-white text-l bg-green-500 p-3 rounded-3xl px-4">
                  {message.text}
                </p>
              </div>
            ) : (
              <div key={message.id} className="flex items-center">
                {userProfileImages[message.userId] ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white">
                    <Image
                      src={userProfileImages[message.userId]}
                      alt="profile Image"
                      fill
                      style={{ objectFit: "cover" }}
                      className="object-cover"
                    />
                  </div>
                ) : message.userId === "botID" ? (
                  <div className="flex w-12 h-12 rounded-full text-xs bg-white items-center justify-center">
                    <p className="text-center">BOT</p>
                  </div>
                ) : (
                  <div className="flex w-12 h-12 rounded-full text-xs bg-white items-center">
                    <p className="text-center">No Image</p>
                  </div>
                )}
                <div className="p-5 text-left">
                  <p
                    className={`${
                      message.userId === "botID"
                        ? "text-red-500"
                        : "text-cyan-50"
                    }`}
                  >
                    <strong>{message.userName}</strong>
                  </p>
                  <p
                    className={`text-l ${
                      message.userId === "botID" ? "text-red-500" : "text-white"
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-2 rounded-l-lg border-none text-black"
            placeholder="メッセージを入力..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
          >
            送信
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
