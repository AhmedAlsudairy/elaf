import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chat_room_id, content, sender_company_profile_id, receiver_company_profile_id } = body;

    if (!chat_room_id || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }


    const message = await prisma.message.create({
      data: {
        chat_room_id,
        content,
        sender_company_profile_id,
        receiver_company_profile_id,
        read_status: "unread",
      },
    });


    await pusherServer.trigger(`chat-${chat_room_id}`, "new-message", message);

    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    console.error("Error sending message:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
