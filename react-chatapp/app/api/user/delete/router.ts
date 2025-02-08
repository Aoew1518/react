import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    // 从 url 中获取 id 参数
    const id = request.nextUrl.searchParams.get("id")
    // 没有 id，则返回错误码
    if (!id) {
        return NextResponse.json({ error:"未知错误，请重试", code: -1 }, {status: 400 })
    }
    // 否则删除数据库中的消息记录
    await prisma.user.delete({
        where: {
            id: Number(id)
        }
    })
    
    return NextResponse.json({ message:"用户删除删除成功", code: 0 })
}