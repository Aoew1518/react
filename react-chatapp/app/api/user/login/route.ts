import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// 登录接口
export async function POST(request: NextRequest) {
    const body = await request.json();
    const { username, password } = body;

    // 查找用户
    const user = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    if (!user) {
        return NextResponse.json({
            code: 1,
            message: "无该用户或用户名错误",
        });
    }

    // 比较密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return NextResponse.json({
            code: 1,
            message: "密码错误",
        });
    }

    return NextResponse.json({
        code: 0,
        message: "登录成功",
        data: {
            username: user.username,
        },
    });
}
