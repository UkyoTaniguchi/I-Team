import React, { useEffect, useRef } from "react";

export default function Modal({
  isOpenModal,
  setIsOpenModal,
  projects,
  membersName,
}: {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  projects: any;
  membersName: any;
}) {
  // モーダル外をクリックした時の処理
  const modalRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !(modalRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsOpenModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, setIsOpenModal]);

  // モーダル表示中: 背面のスクロールを禁止
  useEffect(() => {
    if (isOpenModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpenModal]);

  return (
    <>
      {isOpenModal && (
        <div className="fixed z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50">
          <div
            className="relative z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[95vh] md:max-h-[90vh] w-[97vw] md:w-[80vw] p-4 md:p-10 md:pb-20 bg-slate-100 border-2 border-neutral-950 shadow-lg rounded-xl overflow-auto text-black"
            ref={modalRef}
          >
            <h1 className="text-2xl font-bold mb-3">{projects.title}</h1>
            <p>メンバー：{membersName.join(", ")}</p>
            <p>開発内容：{projects.description}</p>
            <p>開発技術：{projects.language}</p>
            <p>開発人数：{projects.teamSize}人</p>
            <p>開発期間：{projects.duration}</p>
            <p>そのほか：{projects.others}</p>
          </div>
        </div>
      )}
    </>
  );
}
