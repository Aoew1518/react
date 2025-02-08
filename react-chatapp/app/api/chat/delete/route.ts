import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");
    const userId = request.nextUrl.searchParams.get("userId");

    if (id) {
        // 根据关联id删除聊天和消息内容
        const deleteMessages = prisma.message.deleteMany({
            where: {
                chatId: id
            }
        })
        const deleteChat = prisma.chat.delete({
            where: {
                id
            }
        })
        // $transaction 事务可以保证数据的一致性，要么同时成功，要么同时失败
        await prisma.$transaction([deleteMessages, deleteChat])
    }
    else if (userId) {
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

        // $transaction 事务可以保证数据的一致性，要么同时成功，要么同时失败
        await prisma.$transaction([deleteMessages, deleteChat])
    }
    else {
        return NextResponse.json({ code: -1, message: "缺少Id参数" });
    }
    
    return NextResponse.json({ code: 0, message: 'success' })
}