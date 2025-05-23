import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const chatId = request.nextUrl.searchParams.get("chatId")
    // 没对话id返回错误
    if (!chatId) {
        return NextResponse.json({ code: -1 })
    }
    // 获取聊天的消息列表
    const list = await prisma.message.findMany({
        where: {
            chatId
        },
        orderBy: {
            // 按照时间升序排列
            createTime: "asc"
        }
    })
    return NextResponse.json({ code: 0, data: { list } })
}