import Example from "./Example"
import ModelSelect from "./ModelSelect"
import { useIsMobile } from "@/util/devices"

// 欢迎标题
export default function Welcome() {
    const isMobile  = useIsMobile()

    return (
        <div className='w-full max-w-4xl mx-auto mb-[150px] flex flex-col items-center px-4 pt-5'>
            <ModelSelect />
                <h1
                    className={`${isMobile ? 'text-xl mt-10' : 'text-2xl mt-20'} font-bold`}
                >
                    我是AI聊天助手，很高兴见到你！
                </h1>
            <Example />
        </div>
    )
}
