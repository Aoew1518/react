import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    // 从 url 中获取 id 参数
    const id = request.nextUrl.searchParams.get("id")
    // 没有 id，则返回错误码
    if (!id) {
        return NextResponse.json({ message: "Missing id information", code: -1 })
    }

    const messageToDelete = await prisma.message.findUnique({
        where: { id },
    });

    // 没有找到消息，则返回错误码
    if (!messageToDelete) {
        return NextResponse.json({ message: "Message not found", code: -1 })
    }

    // 否则删除数据库中的消息记录
    await prisma.message.delete({
        where: {
            id
        }
    })
    
    return NextResponse.json({ message: "Message deleted successfully", code: 0 })
}