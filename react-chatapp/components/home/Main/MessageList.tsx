import Markdown from "@/components/common/Markdown"
import { Message } from "@/types/chat"
import { SiOpenai } from "react-icons/si"
// import { FaRegUser } from "react-icons/fa"
import { useSelector, useDispatch } from "react-redux"
import { setMessageList, setSelectedChatTitle } from "@/store/modules/mainStore"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import ChatInput from "./ChatInput"
import { LoadingOutlined } from '@ant-design/icons';

export default function MessageList() {
    // 返回消息测试数据
    // const messageList: Message[] = [
    //     {
    //         id: "1",
    //         role: "user",
    //         content: "怎么使用nextjs创建react项目"
    //     },
    //     {
    //         id: "2",
    //         role: "assistant",
    //         content:
    //             "要使用Next.js创建一个React项目，请按照以下步骤进行操作：\n\n1. 确保你的计算机上已经安装了Node.js。你可以从Node.js官方网站（https://nodejs.org）下载安装程序，并按照指示进行安装。\n\n2. 打开命令行终端，并创建一个新的项目文件夹。进入项目文件夹。\n\n3. 运行以下命令来初始化一个新的Next.js项目：\n   ```\n   npx create-next-app .\n   ```\n   这将使用Next.js的官方脚手架工具来初始化项目文件夹。\n\n4. 在初始化完成后，你可以根据需要进行一些自定义配置。在项目文件夹中，你可以编辑`next.config.js`文件来配置构建选项，编辑`pages`文件夹中的文件来创建页面，编辑`styles`文件夹中的CSS文件来自定义样式等。\n\n5. 运行以下命令来启动开发服务器：\n   ```\n   npm run dev\n   ```\n   这将启动Next.js的开发服务器，并在http://localhost:3000上运行你的应用程序。\n\n现在，你已经成功使用Next.js创建了一个React项目。你可以继续在项目中开发页面、组件等，并且Next.js会自动处理构建、路由等方面的事务。请记得查阅Next.js的官方文档（https://nextjs.org/docs）以获取更详细的信息和使用指南。"
    //     },
    //     {
    //         id: "3",
    //         role: "user",
    //         content:
    //             '我想让你充当前端开发专家。我将提供一些关于Js、Node等前端代码问题的具体信息，而你的工作就是想出为我解决问题的策略。这可能包括建议代码、代码逻辑思路策略。我的第一个请求是"我需要能够动态监听某个元素节点距离当前电脑设备屏幕的左上角的X和Y轴，通过拖拽移动位置浏览器窗口和改变大小浏览器窗口。"\n'
    //     },
    //     {
    //         id: "4",
    //         role: "assistant",
    //         content:
    //             "你可以使用 JavaScript 的 `getBoundingClientRect()` 方法来获取一个元素相对于视窗的位置。它返回一个对象，包含了元素的高度、宽度以及其相对于视窗的左、上、右、下位置。这将帮助我们了解元素当前与视窗左上角的 X 和 Y 轴的距离。\n\n我们可以通过添加`mousemove`和`resize`事件监听器来持续更新元素的位置信息。以下是一个可行的策略：\n\n1. 选取你需要监听的元素。\n\n```javascript\nlet element = document.getElementById('your-element-id');\n```\n\n2. 定义一个函数来获取元素位置信息。\n\n```javascript\nfunction getElementPosition(element) {\n    let bounding = element.getBoundingClientRect();\n    let x = bounding.left;\n    let y = bounding.top;\n    return { x, y };\n}\n```\n\n3. 注册`mousemove`和`resize`事件来动态更新元素位置信息。\n\n```javascript\nwindow.addEventListener('mousemove', function() {\n    let position = getElementPosition(element);\n    console.log('X: ' + position.x + ', Y: ' + position.y); \n});\n\nwindow.addEventListener('resize', function() {\n    let position = getElementPosition(element);\n    console.log('X: ' + position.x + ', Y: ' + position.y); \n});\n```\n\n通过这些步骤，你就可以在控制台看到你的元素相对于视窗的 X 和 Y 位置信息。以上是最基本的实现，你可以根据你的需要进行修改和扩展。"
    //     }
    // ]
    const defaultMessage = '服务器异常，请稍后再试！';
    const dispatch = useDispatch()
    const { messageList, streamingId, selectedChat, isLoading } = useSelector((state: any) => state.mainStore)
    const [isShowFunction, setIsShowFunction] = useState(false);

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
            console.warn(response.statusText)
            return
        }
        const { data } = await response.json()
        dispatch(setMessageList(data.list))
    }

    return (
        <>
            <div className='overflow-y-auto w-full min-w-[375px] mb-12 pb-44 dark:text-gray-300'>
                <div>
                    {messageList.map((message: Message, index: number) => {
                        const isUser = message?.role === "user"
                        const isDefaultMessage = (message === undefined) || (!message.content)
                        const len = messageList.length

                        return (
                            <div
                                key={message?.id || uuidv4()}
                                className="relative bg-white dark:bg-gray-800"
                                onMouseEnter={() => setIsShowFunction(true)}
                                onMouseLeave={() => setIsShowFunction(false)}
                            >
                                <div className='w-full max-w-4xl mx-auto flex px-4 py-6 text-lg'>
                                    <div className='flex justify-start text-3xl leading-[1] w-10'>
                                        {!isUser && (<SiOpenai />)}
                                    </div>
                                    <div className={`${isUser ? "user-message" : "assistant-message"} flex-1 min-w-[300px]`}>
                                        {/* 展现 markdown 消息，并末尾显示光标 */}
                                        {/* 结测试，这里的插值写法不要换行，不然会样式错乱 */}
                                        <Markdown
                                            isAssistant={!isUser}
                                            isShowFunction={isShowFunction}
                                        >
                                            {isDefaultMessage ? defaultMessage : `${message.content}${message.id === streamingId ? "▍" : ""}`}
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
            <ChatInput />
        </>
    )
}