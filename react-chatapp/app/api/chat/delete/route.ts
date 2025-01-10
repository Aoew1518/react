import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id")
    if (!id) {
        return NextResponse.json({ code: -1, message: "缺少id参数" })
    }

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
    return NextResponse.json({ code: 0, message: 'success' })
}