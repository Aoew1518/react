import { NextRequest, } from "next/server";
import { MessageRequestBody } from "@/types/chat"
import openai from "@/lib/openai";
import { tools, callTool } from "@/util/function-call-tools"

// 辅助函数：发送流数据
function sendStreamData(controller: ReadableStreamDefaultController, encoder: TextEncoder, type: string, content: any) {
    const data = { type, content };
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
}

export async function POST(request: NextRequest) {
    try {
        // 从请求中获取从客户端传递的 json 数据，提取用户的文本内容
        const { messages, model, max_tokens, temperature } = (await request.json()) as MessageRequestBody
        // 编码成字节流
        const encoder = new TextEncoder()
        // stream api 详细可看：https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream
        // 使用数据流的形式返回，即一个字符地返回
        const stream = new ReadableStream({
            async start(controller) {
                let reasoningContent = "";
                let content = "";

                const completion = await openai.chat.completions.create({
                    messages: [{ role: "system", content: "You are a helpful assistant." }, ...messages],
                    model: model || "deepseek-chat",
                    // 限制生成文本的最大长度
                    max_tokens: max_tokens || 1024,
                    // 生成文本的随机性，值越大越随机
                    temperature: temperature || 1,
                    stream: true,
                });

                for await (const chunk of completion) {
                    const choice = chunk.choices[0];
                    if (!choice) continue;

                    // 获取思维链内容
                    const reasoningDelta = (choice.delta as any)?.reasoning_content;
                    if (reasoningDelta) {
                        reasoningContent += reasoningDelta;
                        // 发送结构化数据
                        const data = {
                            type: 'reasoning',
                            content: reasoningDelta
                        };
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                    }
                    // 获取正文内容
                    const message = choice.delta?.content;
                    if (message) {
                        content += message;
                        // 发送结构化数据
                        const data = {
                            type: 'content',
                            content: message
                        };
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                    }
                }
                controller.close();
            }
        })

        return new Response(stream)
    }
    catch (error) {
        return new Response("服务器错误，请稍后再试！", { status: 500 });
    }
};