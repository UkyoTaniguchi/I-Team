"use client";

import React, { Suspense } from "react";
import ChatPage from "@/app/components/chat";

const Chat = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatPage />
    </Suspense>
  );
};

export default Chat;
