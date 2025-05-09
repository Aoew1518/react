import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { corsHeaders, handleCors } from '@/util/cors';

// 注册接口
export async function POST(request: NextRequest) {
    // 处理预检请求
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

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

    // 生成 JWT token
    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET as string;
    const token = jwt.sign({ userId: newUser.id }, jwtSecret, { expiresIn: '24h' });

    // 设置 Cookie
    const response = NextResponse.json({
        code: 0,
        message: "注册成功",
        data: {
            userId: newUser.id,
            userName: newUser.username,
            avatar: newUser.avatar
        },
        // 设置 CORS 头
    }, { headers: corsHeaders(request) as any});

    response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return response;
}