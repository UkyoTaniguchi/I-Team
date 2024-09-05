"use client";

import React, { Suspense } from "react";
import ChatPage from "@/app/components/chat";

const Chat = () => {
  return(
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ChatPage/>
    </Suspense>
    </div>
  )
};

export default Chat;