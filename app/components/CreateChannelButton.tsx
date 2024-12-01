// slackプライベートチャンネル作成を自動で行うボタン

"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface CreateChannelButtonProps {
  members: string[]; // メンバーのメールアドレス(slackのメールアドレスと一致する必要がある)
  channelName: string; // チャンネル名
}

const CreateChannelButton: React.FC<CreateChannelButtonProps> = ({
  members,
  channelName,
}) => {
  const router = useRouter();
  const createChannel = async () => {
    // メンバーとチャンネル名をPOSTで送信
    const response = await fetch("/api/createChannel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ members, channelName }),
    });

    const data = await response.json();

    if (data.success) {
      alert("チャンネルが作成されました！Slackを確認してください！");
      router.push("/i-team/project-list");
    } else {
      alert(
        `[エラー]slackのメールアドレスが正しいか確認してください: ${data.error}`
      );
    }
  };

  return (
    <button
      onClick={createChannel}
      className="text-blue-400 text-lg font-extrabold hover:text-blue-200"
    >
      Slackチャンネルを作成
    </button>
  );
};

export default CreateChannelButton;
