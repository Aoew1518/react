// main 主页面内容
// import Menu from "../SimpleNavigation"
import Welcome from "./Welcome"
import ChatInput from "./ChatInput"
import MessageList from "./MessageList"
import { useSelector } from "react-redux"

export default function Main() {
    const { selectedChat } = useSelector((state: any) => state.mainStore)

    return (
        <div className='flex-1 relative'>
            <main className='overflow-y-auto flex flex-col w-full h-full bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 pb-[60px]'>
                {!selectedChat?.id ? <Welcome /> : <MessageList />}
            </main>
            <div className='absolute bottom-0 left-0 right-0'>
                <ChatInput hideButton={true} />
            </div>
        </div>
    )
}
