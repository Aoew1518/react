import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // 从请求体中获取用户 ID 和新密码
        const { userId, avatar } = await request.json();

    }
    catch (error) {
        console.error('图片上传错误:', error);
        return NextResponse.json({
            error: "网络错误，图片上传失败！",
            code: -1
        }, { status: 500 });
    }
}