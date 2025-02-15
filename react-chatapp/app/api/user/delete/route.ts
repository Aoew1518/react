import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { userId, ...data } = body
    // 没有 id，则返回错误码
    if (!userId) {
        return NextResponse.json({ error:"未知错误，请重试", code: -1 }, {status: 400 })
    }

    // 查找与 userId 相关的所有聊天记录
    const chats = await prisma.chat.findMany({
        where: {
            userId: Number(userId)
        }
    })

    // 获取查找的 chat 表中的获取所有聊天的 id
    const chatIds = chats.map(chat => chat.id);

    // 删除与 userId 相关的所有消息
    const deleteMessages = prisma.message.deleteMany({
        where: {
            chatId: { in: chatIds }
        }
    })

    // 删除与 userId 相关的所有聊天记录
    const deleteChat = prisma.chat.deleteMany({
        where: {
            userId: Number(userId)
        }
    })

    // 删除user表中的用户信息
    const deleteUser = prisma.user.delete({
        where: {
            id: Number(userId)
        }
    })

    try {
        // $transaction 事务可以保证数据的一致性，要么同时成功，要么同时失败
        // await prisma.$transaction([deleteMessages, deleteChat, deleteUser]);
        return NextResponse.json({ message: "注销用户成功", code: 0 });
    } catch (error) {
        console.error("Error deleting user data:", error);
        return NextResponse.json({ error: "注销用户失败，请稍后再试", code: -1 }, { status: 500 });
    }
}