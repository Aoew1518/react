// import { sleep } from "@/common/util";
import { NextRequest, } from "next/server";
import { MessageRequestBody } from "@/types/chat"
import openai from "@/lib/openai";

// 超时返回
const timeoutPromise = new Promise<Response>((_, reject) => {
    setTimeout(() => {
        reject(new Response("网络超时，请稍后再试！", { status: 504 }));
    }, 10000);
});

export async function POST(request: NextRequest) {
    try {
        // 从请求中获取从客户端传递的 json 数据，提取用户的文本内容
        const { messages, model } = (await request.json()) as MessageRequestBody
        // 编码成字节流
        const encoder = new TextEncoder()
        // stream api 详细可看：https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream
        // 使用数据流的形式返回，即一个字符地返回
        const stream = new ReadableStream({
            async start(controller) {
                const completion = await openai.chat.completions.create({
                    messages: [{ role: "system", content: "You are a helpful assistant." }, ...messages],
                    model: model || "deepseek-chat",
                    // 限制生成文本的最大长度
                    max_tokens: 1024,
                    stream: true,
                });

                // 使用 for await 处理流式返回
                for await (const chunk of completion) {
                    for (const choice of chunk.choices) {
                        // 使用 delta 获取内容， 表示每次返回的新文本部分
                        const message = choice.delta?.content;
                        if (message) {
                            controller.enqueue(encoder.encode(message));
                        }
                    }
                }
                controller.close()
            }
        })

        // 使用Promise.race来处理超时
        return Promise
            .race([new Response(stream), timeoutPromise])
            .catch(error => {
                // 返回超时的错误响应
                return error;
            });
    }
    catch (error) {
        return new Response("服务器错误，请稍后再试！", { status: 500 });
    }
};