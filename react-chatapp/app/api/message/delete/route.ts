import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    // 从 url 中获取 id 参数
    const id = request.nextUrl.searchParams.get("id")
    // 没有 id，则返回错误码
    if (!id) {
        return NextResponse.json({ code: -1 })
    }
    // 否则删除数据库中的消息记录
    await prisma.message.delete({
        where: {
            id
        }
    })
    
    return NextResponse.json({ code: 0 })
}