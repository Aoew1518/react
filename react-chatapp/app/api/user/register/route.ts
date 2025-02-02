import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// 注册接口
export async function POST(request: NextRequest) {
    const body = await request.json();
    const { username, password } = body;

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    if (existingUser) {
        return NextResponse.json({
            code: 1,
            message: "该用户名已存在",
        });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 保存用户到数据库
    const newUser = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
        },
    });

    return NextResponse.json({
        code: 0,
        message: "注册成功",
        data: {
            ...newUser,
            userId: newUser.id
        },
    });
}