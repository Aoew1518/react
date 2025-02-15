import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';

export async function GET(request: NextRequest) {
    // 从 Authorization 头中获取 token
    // const token = request.headers.get("Authorization")?.split(" ")[1];
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: "未提供 token" }, { status: 401 });
    }

    try {
        // 验证 token 并获取用户 ID
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET));

        // 查询用户信息
        const user = await prisma.user.findUnique({
            where: {
                id: Number(payload.userId)
            },
            select: {
                id: true,
                username: true,
                avatar: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "用户未找到" }, { status: 404 });
        }

        const response = NextResponse.json({
            code: 0,
            message: "用户信息更新成功",
            data: {
                userName: user.username,
                userId: user.id,
                avatar: user.avatar
            },
        });

        return response;
    }
    catch (error) {
        return NextResponse.json({ error: "无效的 token" }, { status: 401 });
    }
}