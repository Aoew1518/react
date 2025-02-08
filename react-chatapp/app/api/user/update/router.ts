import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    // 从请求体中获取用户 ID 和新密码
    const { id, newPassword } = await request.json();

    // 检查 ID 和新密码是否存在
    if (!id || !newPassword) {
        return NextResponse.json({ error: "缺少用户 ID 或新密码", code: -1 }, { status: 400 });
    }

    // 更新数据库中的用户密码
    await prisma.user.update({
        where: {
            id: Number(id)
        },
        data: {
            // 确保在这里对密码进行加密处理
            password: newPassword
        }
    });

    return NextResponse.json({ message: "密码修改成功", code: 0 });
}