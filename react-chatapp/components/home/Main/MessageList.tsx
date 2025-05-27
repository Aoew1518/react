import Markdown from "@/components/common/Markdown"
import { Message } from "@/types/chat"
import { SiOpenai } from "react-icons/si"
import { useSelector, useDispatch } from "react-redux"
import { setMessageList, setSelectedChatTitle } from "@/store/modules/mainStore"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import DeepSeekMessage from "./DeepSeekMessage";
import { LoadingOutlined } from '@ant-design/icons';

export default function MessageList() {
    const defaultMessage = '服务器异常，请稍后再试！';
    const dispatch = useDispatch()
    const { messageList, streamingId, selectedChat, isLoading } = useSelector((state: any) => state.mainStore)
    const [isShowFunction, setIsShowFunction] = useState(-1);

    useEffect(() => {
        if (selectedChat && selectedChat.id) {
            // 选择的当前聊天存在，则获取消息列表数据，并设置当前聊天标题
            dispatch(setSelectedChatTitle(selectedChat.title))
            getMessageListData(selectedChat.id)
        }
        else {
            dispatch(setMessageList([]))
        }
    }, [selectedChat])

    // 获取对应聊天的消息列表数据
    async function getMessageListData(chatId: string) {
        const response = await fetch(`/api/message/list?chatId=${chatId}`, {
            method: "GET"
        })

        if (!response.ok) {
            console.error(response.statusText)
            return
        }
        const { data } = await response.json()
        dispatch(setMessageList(data.list))
    }

    function handleShowFunction(index: Number, messageLen: Number, isLoadingMesssage: Boolean) {
        // 如果是最后一条消息，并且没有正在加载消息，则加载更多消息
        if (index === messageLen && !isLoadingMesssage) {
            return true
        }
        else if (index === messageLen && isLoadingMesssage) {
            return false
        }
        else {
            return isShowFunction === index
        }
    }

    return (
        <>
            <div
                className='overflow-y-auto w-full min-w-[375px] mb-12 pb-44 dark:text-gray-300'
                id='messageList'
            >
                <div>
                    {messageList.map((message: Message, index: number) => {
                        const isUser = message?.role === "user"
                        const messageId = message?.id || uuidv4()
                        const isDefaultMessage = (!message.content && !message.reasoningContent)
                        const messageLen = messageList.length - 1
                        const isLoadingMesssage = message.id === streamingId && message.content !== ''

                        return (
                            <div
                                key={messageId}
                                className="relative bg-white dark:bg-gray-800"
                                onMouseEnter={() => setIsShowFunction(index)}
                                onMouseLeave={() => setIsShowFunction(-1)}
                            >
                                <div className='w-full max-w-4xl mx-auto flex px-4 py-8 text-lg'>
                                    <div className='flex justify-start text-3xl leading-[1] w-10'>
                                        {!isUser && (<SiOpenai />)}
                                    </div>
                                    <div className={`${isUser ? "user-message" : "assistant-message"} relative flex-1 min-w-[300px]`}>
                                        {/* 显示思维链内容 */}
                                        {message.reasoningContent && (
                                            <DeepSeekMessage reasoningContent={message.reasoningContent} />
                                        )}
                                        {/* 展现 markdown 消息，并末尾显示光标 */}
                                        {/* 结测试，这里的插值写法不要换行，不然会样式错乱 */}
                                        <Markdown
                                            messageId={messageId}
                                            isAssistant={!isUser}
                                            isShowFunction={handleShowFunction(index, messageLen, isLoadingMesssage)}
                                        >
                                            {isDefaultMessage ? defaultMessage : `${message.content}${isLoadingMesssage ? "▍" : ""}`}
                                        </Markdown>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div className={`${isLoading ? "" : "hidden"} bg-white dark:bg-gray-800`}>
                        <div className="w-full max-w-4xl mx-auto flex px-4 py-6 text-lg">
                            <div className="flex justify-start text-3xl leading-[1] w-10">
                                <SiOpenai />
                            </div>
                            <div className="assistant-message flex-1 pl-[10px]">
                                <LoadingOutlined />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}