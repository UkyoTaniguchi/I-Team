// 参加メンバーのみのプライベートチャンネルを作成するAPI

import { NextRequest, NextResponse } from "next/server";
import { WebClient } from "@slack/web-api";

const slackClient = new WebClient(process.env.NEXT_SLACK_BOT_TOKEN); // discordインスタンスの作成

export async function POST(req: NextRequest) {
  try {
    const { members, channelName } = await req.json();

    // チャンネル名の設定
    const uniqueChannelName = `${channelName}-${Date.now()}`;

    // プライベートチャンネルの作成
    const channel = await slackClient.conversations.create({
      name: uniqueChannelName,
      is_private: true,
    });

    const channelId = channel.channel?.id; // チャンネルID

    if (channelId) {
      // メンバーを招待
      for (const email of members) {
        const userIdResponse = await slackClient.users.lookupByEmail({ email });
        const userId = userIdResponse.user?.id;

        if (userId) {
          await slackClient.conversations.invite({
            channel: channelId,
            users: userId,
          });
        } else {
          return NextResponse.json({
            success: false,
            error: `ユーザーIDが見つかりませんでした: ${email}`,
          });
        }
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({
        success: false,
        error: "チャンネルIDが取得できませんでした",
      });
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    } else {
      return NextResponse.json({
        success: false,
        error: "不明なエラーが発生しました",
      });
    }
  }
}
