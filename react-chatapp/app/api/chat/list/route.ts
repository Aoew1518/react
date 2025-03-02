import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const param = request.nextUrl.searchParams.get("page")
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
        return new Response(JSON.stringify({ error: '缺少用户id信息!', code: -1 }), { status: 401 });
    }

    // 转换数字类型，如果为空则默认为1，即第一页内容
    const page = param ? parseInt(param) : 1
    // findMany 查询数据库，skip和take用于分页，orderBy用于排序
    const list = await prisma.chat.findMany({
        where: {
            // userId: Number(userId),
            userId
        },
        // 需要跳过的条数
        skip: (page - 1) * 20,
        // 每页20条数据
        take: 20,
        // 根据updateTime字段降序排序，即最新的在前面
        orderBy: {
            updateTime: "desc"
        }
    })

    // 获取当前返回的数据条数
    const count = await prisma.chat.count()
    const hasMore = count > page * 20
    // 返回对话列表
    return NextResponse.json({ code: 0, data: { list, hasMore } })
}