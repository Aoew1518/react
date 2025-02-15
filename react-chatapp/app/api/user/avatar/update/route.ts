import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // 从请求体中获取用户 ID 和头像数据
        const { userId, avatar } = await request.json();

        // 检查用户是否存在
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({
                error: "用户不存在",
                code: 1,
            }, { status: 404 });
        }

        // 更新用户的头像
        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            // 更新头像字段
            data: {
                avatar: avatar
            },
        });

        return NextResponse.json({
            code: 0,
            message: "头像更新成功",
            data: {
                avatar: updatedUser.avatar
            },
        });
    }
    catch (error) {
        console.error('图片上传错误:', error);
        return NextResponse.json({
            error: "未知错误，图片上传失败！",
            code: -1,
        }, { status: 500 });
    }
}