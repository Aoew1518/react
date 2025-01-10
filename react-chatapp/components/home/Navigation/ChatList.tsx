import { groupByDate } from "@/common/util"
import { Chat } from "@/types/chat"
import { useEffect, useMemo, useState } from "react"
import ChatItem from "./ChatItem"
import { useDispatch, useSelector } from "react-redux";
import eventBus from "@/store/eventBus";
import { useRef } from "react"
import { setSelectedChat } from "@/store/modules/mainStore"

export default function ChatList() {
    // 测试数据
    // const [chatList, setChatList] = useState<Chat[]>([
    //     {
    //         id: "1",
    //         title: "React入门实战教程",
    //         updateTime: Date.now()
    //     },
    //     {
    //         id: "2",
    //         title: "如何使用Next.js创建React项目",
    //         updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2
    //     },
    //     {
    //         id: "3",
    //         title: "如何使用Next.js创建React项目",
    //         updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2
    //     },
    //     {
    //         id: "4",
    //         title: "如何使用Next.js创建React项目",
    //         updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2
    //     },
    //     {
    //         id: "5",
    //         title: "如何使用Next.js创建React项目",
    //         updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2
    //     },
    //     {
    //         id: "6",
    //         title: "如何使用Next.js创建React项目",
    //         updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2
    //     },
    //     {
    //         id: "7",
    //         title: "如何使用Next.js创建React项目",
    //         updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2
    //     },
    //     {
    //         id: "8",
    //         title: "如何使用Next.js创建React项目",
    //         updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2
    //     },
    //     {
    //         id: "9",
    //         title: "如何使用Next.js创建React项目",
    //         updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2
    //     },
    //     {
    //         id: "10",
    //         title: "如何使用Next.js创建React项目",
    //         updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2
    //     },
    //     {
    //         id: "11",
    //         title: "如何使用Next.js创建React项目",
    //         updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2
    //     },
    //     {
    //         id: "12",
    //         title: "如何使用Next.js创建React项目",
    //         updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2
    //     },
    //     {
    //         id: "13",
    //         title: "如何使用Next.js创建React项目",
    //         updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2
    //     },
    //     {
    //         id: "14",
    //         title: "如何使用Next.js创建React项目",
    //         updateTime: Date.now() - 1000 * 60 * 60 * 24 * 2
    //     },
    //     {
    //         id: "15",
    //         title: "Aoew GitHub",
    //         updateTime: Date.now() + 2
    //     }
    // ])
    // 选中的聊天内容
    const dispatch = useDispatch()
    // 聊天列表
    const [chatList, setChatList] = useState<Chat[]>([])
    // 分页
    const pageRef = useRef(1)
    const { selectedChat } = useSelector((state: any) => state.mainStore)

    // 得到分组好的列表
    const groupList = useMemo(() => {
        return groupByDate(chatList)
    }, [chatList])

    // 获取当前聊天列表数据
    async function getChatListData() {
        const response = await fetch(`/api/chat/list?page=${pageRef.current}`, {
            method: "GET"
        })

        if (!response.ok) {
            console.error(response.statusText)
            return
        }

        const { data } = await response.json()
        // 更新当前对话列表
        if (pageRef.current === 1) {
            setChatList(data.list)
        }
        else {
            setChatList((list) => list.concat(data.list))
        }
    }

    useEffect(() => {
        getChatListData()
    }, [])

    // useEffect(() => {
    //     // 发布订阅模式，当有新的聊天内容时，更新chatList
    //     const callback: EventListener = () => {
    //         console.log("fetchChatList")
    //     }
    //     subscribe("fetchChatList", callback)
    //     // 组件卸载时取消订阅
    //     return () => unsubscribe("fetchChatList", callback)
    // }, [])

    useEffect(() => {
        const callback = () => {
            console.log("fetchChatList");
            // 收到事件通知时，重置当前页码，重新获取列表数据
            pageRef.current === 1
            getChatListData();
        };

        // 订阅事件
        eventBus.subscribe("fetchChatList", callback);

        // 组件卸载时取消订阅
        return () => {
            eventBus.unsubscribe("fetchChatList", callback);
        };
    }, []);

    return (
        <div className='flex-1 mb-[48px] mt-2 flex flex-col overflow-y-auto'>
            {groupList.map(([date, list]) => {
                return (
                    <div key={date}>
                        <div className='sticky top-0 z-10 p-3 text-sm bg-gray-900 text-gray-500'>
                            {date}
                        </div>
                        <ul>
                            {list.map((item) => {
                                const selected = selectedChat?.id === item.id
                                return (
                                    <ChatItem
                                        key={item.id}
                                        item={item}
                                        selected={selected}
                                        onSelected={(chat) => {
                                            dispatch(setSelectedChat(chat))
                                        }}
                                    />
                                )
                            })}
                        </ul>
                    </div>
                )
            })}
        </div>
    )
}
