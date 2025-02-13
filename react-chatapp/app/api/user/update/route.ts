import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'; // 推荐使用 bcryptjs 进行密码加密

export async function POST(request: NextRequest) {
    try {
        // 从请求体中获取用户 ID 和新密码
        const { id, newPassword } = await request.json();

        // 检查 ID 和新密码是否存在
        if (!id || !newPassword) {
            return NextResponse.json({
                error: "缺少用户 ID 或新密码",
                code: -1
            }, { status: 400 });
        }

        // 对密码进行加密
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 更新数据库中的用户密码
        await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: {
                password: hashedPassword
            }
        });

        return NextResponse.json({
            message: "密码修改成功",
            code: 0
        });
    }
    catch (error) {
        console.error('密码更新错误:', error);
        return NextResponse.json({
            error: "密码更新失败",
            code: -1
        }, { status: 500 });
    }
}