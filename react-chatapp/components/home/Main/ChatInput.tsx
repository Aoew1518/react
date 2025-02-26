import Button from "@/components/common/Button"
import { MdRefresh } from "react-icons/md"
import { PiLightningFill, PiStopBold } from "react-icons/pi"
import { FiSend } from "react-icons/fi"
import TextareaAutoSize from "react-textarea-autosize"
import { useState, useRef, useEffect } from "react"
import { Message, MessageRequestBody } from "@/types/chat"
import { useSelector, useDispatch } from "react-redux";
import {
    addMessageList,
    updataMessageList,
    removeMessageList,
    setStreamingId,
    setSelectedChat,
    setSelectedChatTitle,
    setIsLoading,
} from '@/store/modules/mainStore'
import eventBus from "@/store/eventBus";
import { message } from "antd";
import sendFetch from "@/util/fetch"
import { setUserId } from '@/store/modules/userStore';
import { useIsMobile } from "@/util/devices"
import { useTranslation } from 'react-i18next';

// 聊天输入框
export default function ChatInput({ hideButton = false }) {
    const { t } = useTranslation();
    const isMobile = useIsMobile()
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

        const inputMessageCallback = (data: string) => {
            setMessageText(data)
        }

        // 订阅事件
        eventBus.subscribe("createNewChat", callback);
        eventBus.subscribe("setInputMessage", inputMessageCallback)
        // 组件卸载时取消订阅
        return () => {
            eventBus.unsubscribe("createNewChat", callback);
            eventBus.unsubscribe("setInputMessage", inputMessageCallback)
        };
    }, [userId]);

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
        const optinion = {
            body: JSON.stringify({
                userId: userId,
                ...message
            })
        }
        const response = await sendFetch("/api/message/update", optinion)
        if (!response) {
            console.error("消息发送失败！")
            return
        }
        const { data } = await response.json()
        // 在服务端创建好消息后，需要返回一个 chatid，用来标识对话
        if (!chatIdRef.current) {
            chatIdRef.current = data.message.chatId
            // 没有chatid，发布一个事件，让服务端重新获取对话列表
            eventBus.publish("fetchChatList");
            // 创建新对话时，将当前对话设置为选中
            dispatch(setSelectedChat({ id: chatIdRef.current }))
        }
        return data.message
    }

    // 点击发送消息
    async function clickSendMessages(content: string) {
        dispatch(setIsLoading(true))
        if (currentModel === 'GPT-4' || currentModel === 'gpt-35-turbo') {
            messageApi.info({
                content: '该模型暂未开放，请选择deepseek-chat模型',
                duration: 2,
            })
            return
        }

        // 服务端请求用户信息
        // 这里id为空是以为id不应该前端去生成，而是由服务端生成，前端只是传递了个id参数给服务端
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
        let optinion = {
            // 把用户输入的消息包装成 json 格式
            body: JSON.stringify(body),
        }
        const response = await sendFetch(`/api/chat`, optinion)
        if (!response) {
            console.warn('获取返回数据失败！');
            return
        }

        // 获取返回的数据流
        const reader = response?.body?.getReader()
        // 从字节流解码为字符串
        const decoder = new TextDecoder()
        // 是否读取完成
        let done = false
        // 循环读取数据流，获得返回的对话主题title
        let title = ''
        // 循环读取数据流
        while (!done) {
            const result = await reader?.read()
            // 数据流是否读完
            done = result?.done || false
            // 解码数据流为字符串
            const chunk = decoder.decode(result?.value)
            title += chunk
        }

        optinion = {
            body: JSON.stringify({ id: chatId, title })
        }
        const updateResponse = await sendFetch("/api/chat/update", optinion)
        if (!updateResponse) {
            console.warn('更新聊天标题失败')
            return
        }

        const { code } = await updateResponse.json()
        if (code === 0) {
            // 更新标题
            dispatch(setSelectedChatTitle(title))
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
            const optinion = {
                signal: controller.signal,
                body: JSON.stringify(body)
            }
            // 获取字符流
            const response = await sendFetch("/api/chat", optinion)
                .then((res) => {
                    dispatch(setIsLoading(false))
                    console.log('字符流res', res)
                    return res
                })
                .catch((error) => {
                    dispatch(setIsLoading(false))
                    console.error('error', error)
                    return
                })
            if (!response) {
                // 清空用户信息，要求重新登录
                dispatch(setUserId(''));
                return
            }

            // 这里创建一个assistant消息
            // 请求成功后把服务端的消息添加到消息列表
            const responseMessage: Message = await createOrUpdateMessage({
                id: "",
                role: "assistant",
                content: "",
                chatId: chatIdRef.current
            })

            // 添加一个空消息列表，后续请求时不断更新该消息内容
            dispatch(addMessageList(responseMessage))
            dispatch(setStreamingId(responseMessage?.id))
            // 获取返回的数据流
            const reader = response?.body?.getReader()
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
                const result = await reader?.read()
                // 数据流是否读完
                done = result?.done || false
                // 解码数据流为字符串
                const chunk = decoder.decode(result?.value)
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
            const isDelete = await deleteMessage(lastMessage?.id || '')
            if (!isDelete) {
                console.warn("delete error")
                return
            }
            else {
                dispatch(setIsLoading(true))
            }

            dispatch(removeMessageList(lastMessage))
            // 从本地数组中删除最后一个消息
            // messages.splice(messages.length - 1, 1)
            messages.pop()
        }
        // 再重新请求一条消息
        sendMessage(messages)

        // 更新对话标题
        if (!selectedChat?.title || selectedChat.title === '新对话') {
            updateChatTitle(messages)
        }
    }

    // 删除消息
    async function deleteMessage(id: string) {
        const response = await sendFetch(`/api/message/delete?id=${id}`)
        const { code } = await response?.json()
        // 为 0 则删除成功
        return code === 0
    }

    return (
        <>
            {contextHolder}
            <div className='absolute bottom-0 inset-x-0 bg-gradient-to-b from-[rgba(255,255,255,0)] from-[13.94%] to-[#fff] to-[54.73%] pt-10 dark:from-[rgba(53,55,64,0)] dark:to-[#353740] dark:to-[58.85%]'>
                <div className='w-full max-w-4xl mx-auto flex flex-col items-center px-4 space-y-4'>
                    {/* 是否显示按钮，正在生成则显示停止生成，否则显示重新生成 */}
                    {messageList.length !== 0 && !hideButton &&
                        (streamingId !== "" ? (
                            <Button
                                icon={PiStopBold}
                                variant='primary'
                                onClick={() => {
                                    stopRef.current = true
                                }}
                                className='font-medium z-10'
                            >
                                {t('stopGenerating')}
                            </Button>
                        ) : (
                            <Button
                                icon={MdRefresh}
                                variant='primary'
                                onClick={() => {
                                    resend()
                                }}
                                className='font-medium z-10'
                            >
                                {t('regenerateBtn')}
                            </Button>
                        ))}
                    <div className={`${!isMobile ? "py-4" : "py-2"
                        } flex items-end w-full border border-black/10 dark:border-gray-800/50 bg-white dark:bg-gray-700 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)]`}
                    >
                        <div className='mx-3 mb-2.5 text-primary-500'>
                            <PiLightningFill />
                        </div>
                        {/* 消息输入框 */}
                        <TextareaAutoSize
                            className='outline-none flex-1 max-h-64 mb-1.5 bg-transparent text-black dark:text-white resize-none border-0'
                            id="message-input"
                            placeholder={t('enterMessage')}
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
                    {!isMobile ? (
                        <footer className='text-center text-sm text-gray-700 dark:text-gray-300 px-4 pb-4'>

                            <>
                                ©️{new Date().getFullYear()}&nbsp;{" "}
                                <a
                                    className='font-medium py-[1px] border-b border-dotted border-black/60 hover:border-black/0 dark:border-gray-200 dark:hover:border-gray-200/0 animated-underline'
                                    href='https://github.com/Aoew1518'
                                    target='_blank'
                                >
                                    Aoew1518
                                </a>
                            </>
                            .&nbsp;{t('contentGeneratedByAI')}
                        </footer>
                    )
                    : <footer className='pb-1' />
                }
                </div>
            </div>
        </>
    )
}
