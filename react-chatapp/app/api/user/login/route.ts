import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET as string;
    // 设置 Token 过期时间为 1 小时
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });

    // 设置 Cookie
    const response = NextResponse.json({
        code: 0,
        message: "登录成功",
        data: {
            userName: user.username,
            userId: user.id,
        },
    });

    // 设置 httpOnly 和 secure 属性
    // httpOnly：为 true 时，表示这个 Cookie 不能通过 document.cookie 来访问，防止跨站脚本攻击（XSS）
    // secure：为 true 时，表示这个 Cookie 只能通过 HTTPS 连接发送，在 HTTP 连接中，浏览器不会发送这个 Cookie
    response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return response;
}
