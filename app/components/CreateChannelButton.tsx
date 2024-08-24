// slackプライベートチャンネル作成を自動で行うボタン

"use client";

import React from "react";

interface CreateChannelButtonProps {
  members: string[]; // メンバーのメールアドレス(slackのメールアドレスと一致する必要がある)
  channelName: string; // チャンネル名
}

const CreateChannelButton: React.FC<CreateChannelButtonProps> = ({
  members,
  channelName,
}) => {
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
    } else {
      alert(`エラーが発生しました: ${data.error}`);
    }
  };

  return <button onClick={createChannel}>チャンネル作成</button>;
};

export default CreateChannelButton;
