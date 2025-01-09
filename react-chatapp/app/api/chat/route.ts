import { sleep } from "@/common/util";
import { NextRequest, } from "next/server";
import { MessageRequestBody } from "@/types/chat"

export async function POST(request: NextRequest) {
    // 从请求中获取从客户端传递的 json 数据，提取用户的文本内容
    const { messages } = (await request.json()) as MessageRequestBody
    // 编码成字节流
    const encoder = new TextEncoder()
    // stream api 详细可看：https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream
    // 使用数据流的形式返回，即一个字符地返回
    const stream = new ReadableStream({
        async start(controller) {
            // 获取消息内容的组后一条消息，即用户提问的消息
            const messageText = messages[messages.length - 1].content
            for (let i = 0; i < messageText.length; i++) {
                // // 添加延迟查看数据发送效果
                await sleep(50)
                // 遍历消息内容发送给客户端
                controller.enqueue(encoder.encode(messageText[i]))
            }
            // 关闭数据流
            controller.close()
        }
    })
    return new Response(stream)
}