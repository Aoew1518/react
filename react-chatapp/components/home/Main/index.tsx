// main 主页面内容
import Menu from "./Menu"
import Welcome from "./Welcome"
import ChatInput from "./ChatInput"
import MessageList from "./MessageList"
import { useSelector } from "react-redux"

export default function Main() {
    const { selectedChat } = useSelector((state: any) => state.mainStore)

    return (
        <div className='flex-1 relative'>
            <main className='overflow-y-auto w-full h-full bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100'>
                <Menu />
                {!selectedChat?.id && <Welcome />}
                <MessageList />
                <ChatInput />
            </main>
        </div>
    )
}
