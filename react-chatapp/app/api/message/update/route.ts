import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { id, userId,...data } = body
    // 如果没有chatId，则创建一个新对话
    if (!data.chatId) {
        // chat 属性是 prisma 数据库中的表名
        const chat = await prisma.chat.create({
            data: {
                title: "新对话",
                userId,
            }
        })
        // 将 chatId 设置为新创建的对话的 id
        data.chatId = chat.id
    }
    else {
        // 如果有 chatId，则更新对话
        await prisma.chat.update({
            data: {
                updateTime: new Date(),
            },
            where: {
                id: data.chatId
            }
        })
    }

    // prisma 中的 upsert 用于创建或更新数据
    const message = await prisma.message.upsert({
        // 需要创造的数据
        create: data,
        // 需要更新的数据
        update: data,
        // 如果找到 id 则更新，否则创建
        where: {
            id
        }
    })

    // let message
    // if (id) {
    //     message = await prisma.message.update({
    //         data,
    //         where: {
    //             id
    //         }
    //     })
    // }
    // else {
    //     message = await prisma.message.create({
    //         data
    //     })
    // }
    return NextResponse.json({ code: 0, data: { message } })
}