import Example from "./Example"
import ModelSelect from "./ModelSelect"

// 欢迎标题
export default function Welcome() {
    return (
        <div className='w-full max-w-4xl mx-auto mb-[150px] flex flex-col items-center px-4 pt-12'>
            <ModelSelect />
                <h1 className='mt-20 text-4xl font-bold'>
                    AI 问答聊天助手，免费使用 OpenAI 服务
                </h1>
            <Example />
        </div>
    )
}
