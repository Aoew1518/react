import { Metadata } from "next"

// Metadata 用来设置页面标题
export const metadata: Metadata = {
    title: "Chat"
}

export default function Chat() {
    return (
        <main className=''>
            <h1>Chat</h1>
        </main>
    )
}