import Button from "@/components/common/Button"
import { MdRefresh } from "react-icons/md"
import { PiLightningFill, PiStopBold } from "react-icons/pi"
import { FiSend } from "react-icons/fi"
import TextareaAutoSize from "react-textarea-autosize"
import { useState, useRef, useEffect } from "react"
// import { v4 as uuidv4 } from "uuid"
import { Message, MessageRequestBody } from "@/types/chat"
import { useSelector, useDispatch } from "react-redux";
import {
    addMessageList,
    updataMessageList,
    removeMessageList,
    setStreamingId,
    setSelectedChat
} from '@/store/modules/mainStore'
import eventBus from "@/store/eventBus";
import { message } from "antd";

// 聊天输入框
export default function ChatInput() {
    // 记录用户输入消息
    const [messageText, setMessageText] = useState("")
    // 记录用户是否正在输入，useRef 的值更新不会导致组件重渲染。
    const stopRef = useRef(false)
    // 保存对话id
    const chatIdRef = useRef("")
    const { messageList, streamingId, currentModel, selectedChat } = useSelector((state: any) => state.mainStore)
    const { userId } = useSelector((state: any) => state.userStore);
    const dispatch = useDispatch()
    const [messageApi, contextHolder] = message.useMessage();

    // 订阅创建新对话事件，这里订阅推荐列表的事件，发送推介列表消息
    useEffect(() => {
        const callback = (data: string) => {
            clickSendMessages(data)
            // 收到事件通知时，重置当前页码，重新获取列表数据
        };

        // 订阅事件
        eventBus.subscribe("createNewChat", callback);

        // 组件卸载时取消订阅
        return () => {
            eventBus.unsubscribe("createNewChat", callback);
        };
    }, []);

    // 更新输入款所发送的消息所对应的消息列表的id
    useEffect(() => {
        if (chatIdRef.current === selectedChat?.id) {
            return
        }
        chatIdRef.current = selectedChat?.id ?? ""
        // 如果正在回复消息则停止接受消息
        stopRef.current = true
    }, [selectedChat])

    // 服务端创建消息或者更新消息
    async function createOrUpdateMessage(message: Message) {
        const response = await fetch("/api/message/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({userId, ...message})
        })
        if (!response.ok) {
            console.warn(response.statusText)
            return
        }
        const { data } = await response.json()
        // 在服务端创建好消息后，需要返回一个 chatid，用来标识对话
        if (!chatIdRef.current) {
            chatIdRef.current = data.message.chatId
            // publish("fetchChatList")
            // 没有chatid，发布一个事件，让服务端重新获取对话列表
            eventBus.publish("fetchChatList");
            // 创建新对话时，将当前对话设置为选中
            dispatch(setSelectedChat({ id: chatIdRef.current }))
        }
        return data.message
    }

    // 点击发送消息
    async function clickSendMessages(content: string) {
        if (currentModel === 'GPT-4' || currentModel === 'gpt-35-turbo') {
            messageApi.info({
                content: '该模型暂未开放，请选择deepseek-chat模型',
                duration: 2,
            })
            return
        }
        // 服务端请求用户信息
        const message: Message = await createOrUpdateMessage({
            role: "user",
            content,
            id: "",
            chatId: chatIdRef.current
        })
        // 把用户输入的消息添加到消息列表
        const messages = messageList.concat([message])
        // 添加进 store 消息列表
        dispatch(addMessageList(message))
        // 清空输入款
        setMessageText("")
        // 发送消息请求
        sendMessage(messages)

        if (!selectedChat?.title || selectedChat.title === '新对话') {
            updateChatTitle(messages)
        }
    }

    // 更新聊天的标题
    async function updateChatTitle(messages: Message[]) {
        const message: Message = {
            id: "",
            role: "user",
            chatId: chatIdRef.current,
            content: "使用5到10个字符直接返回这句话的简要主题，不要解释、不要标点、不要语气词、不要多余文本、如果没有主题则直接返回'新对话'",
        }

        // 获取聊天标题，给后面更新聊天标题用，防止请求过程中切换了标题而导致id错误
        const chatId = chatIdRef.current
        // 把聊天标题大致内容请求添加到消息列表
        const body: MessageRequestBody = { messages: [...messages, message], model: currentModel }
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // 把用户输入的消息包装成 json 格式
            body: JSON.stringify(body)
        })

        // 状态码是否正常
        if (!response.ok) {
            console.warn(response.statusText)
            return
        }
        // 获取返回的消息是否存在
        if (!response.body) {
            console.warn("body error")
            return
        }

        // 获取返回的数据流
        const reader = response.body.getReader()
        // 从字节流解码为字符串
        const decoder = new TextDecoder()
        // 是否读取完成
        let done = false
        // 循环读取数据流，获得返回的对话主题title
        let title = ''
        // 循环读取数据流
        while (!done) {
            const result = await reader.read()
            // 数据流是否读完
            done = result.done
            // 解码数据流为字符串
            const chunk = decoder.decode(result.value)
            title += chunk
        }

        const updateResponse = await fetch("/api/chat/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: chatId, title })
        })

        if (!updateResponse.ok) {
            console.warn(updateResponse.statusText)
            return
        }

        const { code } = await updateResponse.json()
        if (code === 0) {
            // 更新成功，重置状态，发布一次订阅
            eventBus.publish("fetchChatList");
        }
    }

    // 发送消息
    async function sendMessage(messages: Message[]) {
        // 保证发送前的停止发送为默认值 false
        stopRef.current = false
        const body: MessageRequestBody = { messages, model: currentModel }
        const controller = new AbortController()
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                // 通过 signal 传递一个 AbortController 实例，以便在需要时取消请求
                signal: controller.signal,
                // 把用户输入的消息包装成 json 格式
                body: JSON.stringify(body)
            })
            
            // 状态码是否正常
            if (!response.ok) {
                console.warn(response.statusText)
                return
            }
            // 获取返回的消息是否存在
            if (!response.body) {
                console.warn("body error")
                return
            }

            // 请求成功后把服务端的消息添加到消息列表
            const responseMessage: Message = await createOrUpdateMessage({
                id: "",
                role: "assistant",
                content: "",
                chatId: chatIdRef.current
            })

            // 添加一个空消息列表，后续请求时不断更新该消息内容
            dispatch(addMessageList(responseMessage))
            dispatch(setStreamingId(responseMessage.id))
            // 获取返回的数据流
            const reader = response.body.getReader()
            // 从字节流解码为字符串
            const decoder = new TextDecoder()
            // 是否读取完成
            let done = false
            let content = ''
            // 循环读取数据流
            while (!done) {
                // 如果停止生成则关闭数据流
                if (stopRef.current) {
                    stopRef.current = false
                    // 关闭数据流，中止网络请求
                    controller.abort()
                    break
                }
                const result = await reader.read()
                // 数据流是否读完
                done = result.done
                // 解码数据流为字符串
                const chunk = decoder.decode(result.value)
                content += chunk
                // 读取过程中不断更新该消息内容，进行一个实时更新返回的消息
                dispatch(updataMessageList({
                    ...responseMessage,
                    content: content
                }))
            }
            // 读取完成，更新服务端消息内容
            createOrUpdateMessage({ ...responseMessage, content })
            // 重置消息流 id
            dispatch(setStreamingId(''))
        }
        catch (error) {
            console.error("网络错误，请求失败:", error);
        }
    }

    // 重新发送
    async function resend() {
        const messages = [...messageList] as Message[]
        // 删除最后一个消息且且是回复的消息
        if (
            messages.length !== 0 &&
            messages[messages.length - 1].role === "assistant"
        ) {
            // 获取最后一个消息
            const lastMessage = messages[messages.length - 1];
            // 接口调用失败则打印错误日志
            const result = await deleteMessage(lastMessage?.id || '')
            if (!result) {
                console.warn("delete error")
                return
            }

            dispatch(removeMessageList(lastMessage))
            // 从本地数组中删除最后一个消息
            // messages.splice(messages.length - 1, 1)
            messages.pop()
        }
        sendMessage(messages)
    }

    // 删除消息
    async function deleteMessage(id: string) {
        const response = await fetch(`/api/message/delete?id=${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!response.ok) {
            console.warn(response.statusText)
            return
        }
        const { code } = await response.json()
        // 为 0 则删除成功
        return code === 0
    }

    return (
        <>
            {contextHolder}
            <div className='absolute bottom-0 inset-x-0 bg-gradient-to-b from-[rgba(255,255,255,0)] from-[13.94%] to-[#fff] to-[54.73%] pt-10 dark:from-[rgba(53,55,64,0)] dark:to-[#353740] dark:to-[58.85%]'>
                <div className='w-full max-w-4xl mx-auto flex flex-col items-center px-4 space-y-4'>
                    {/* 是否显示按钮，正在生成则显示停止生成，否则显示重新生成 */}
                    {messageList.length !== 0 &&
                        (streamingId !== "" ? (
                            <Button
                                icon={PiStopBold}
                                variant='primary'
                                onClick={() => {
                                    stopRef.current = true
                                }}
                                className='font-medium'
                            >
                                停止生成
                            </Button>
                        ) : (
                            <Button
                                icon={MdRefresh}
                                variant='primary'
                                onClick={() => {
                                    resend()
                                }}
                                className='font-medium'
                            >
                                重新生成
                            </Button>
                        ))}
                    <div className='flex items-end w-full border border-black/10 dark:border-gray-800/50 bg-white dark:bg-gray-700 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] py-4'>
                        <div className='mx-3 mb-2.5'>
                            <PiLightningFill />
                        </div>
                        {/* 消息输入框 */}
                        <TextareaAutoSize
                            className='outline-none flex-1 max-h-64 mb-1.5 bg-transparent text-black dark:text-white resize-none border-0'
                            placeholder='输入一条消息...'
                            rows={1}
                            value={messageText}
                            onChange={(e) => {
                                setMessageText(e.target.value)
                            }}
                        />
                        {/* 发送按钮 */}
                        <Button
                            className='mx-3 !rounded-lg'
                            icon={FiSend}
                            // 为空或者正在生成时禁用
                            disabled={messageText.trim() === '' || streamingId !== ''}
                            variant='primary'
                            onClick={() => {
                                clickSendMessages(messageText)
                            }}
                        />
                    </div>
                    {/* 底部来源信息 */}
                    <footer className='text-center text-sm text-gray-700 dark:text-gray-300 px-4 pb-6'>
                        ©️{new Date().getFullYear()}&nbsp;{" "}
                        <a
                            className='font-medium py-[1px] border-b border-dotted border-black/60 hover:border-black/0 dark:border-gray-200 dark:hover:border-gray-200/0 animated-underline'
                            href='https://github.com/Aoew1518'
                            target='_blank'
                        >
                            Aoew1518
                        </a>
                        .&nbsp;基于 OpenAI 提供的内容
                    </footer>
                </div>
            </div>
        </>
    )
}
