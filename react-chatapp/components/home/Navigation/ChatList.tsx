import { groupByDate } from "@/common/util"
import { Chat } from "@/types/chat"
import { useEffect, useMemo, useState, memo } from "react"
import ChatItem from "./ChatItem"
import { useDispatch, useSelector } from "react-redux";
import eventBus from "@/store/eventBus";
import { useRef } from "react"
import { setSelectedChat } from "@/store/modules/mainStore"
import { setUserId } from '@/store/modules/userStore';
import sendFetch from "@/util/fetch"

function ChatList() {
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
    // 分页
    const pageRef = useRef(1)
    const loadMoreRef = useRef(null)
    // 是否还有更多数据
    const hasMoreRef = useRef(false)
    const loadingRef = useRef(false)

    // 聊天列表
    const [chatList, setChatList] = useState<Chat[]>([])
    const { selectedChat } = useSelector((state: any) => state.mainStore)
    const { userId } = useSelector((state: any) => state.userStore)

    // 得到分组好的列表
    const groupList = useMemo(() => {
        return groupByDate(chatList)
    }, [chatList])

    useEffect(() => {
        if (userId) {
            getChatListData()
        }
    }, [userId])

    useEffect(() => {
        const callback = () => {
            // 收到事件通知时，重置当前页码，重新获取列表数据
            pageRef.current = 1
            getChatListData();
        };

        // 订阅事件
        eventBus.subscribe("fetchChatList", callback);

        // 组件卸载时取消订阅
        return () => {
            eventBus.unsubscribe("fetchChatList", callback);
        };
    }, [userId]);

    useEffect(() => {
        let observer: IntersectionObserver | null = null
        let div = loadMoreRef.current
        if (div) {
            // 监听消息标题列表底部是否出现可视窗口
            observer = new IntersectionObserver((entries) => {
                // 滑动到底部时，加载更多数据
                if (entries[0].isIntersecting && hasMoreRef.current) {
                    console.log("滑动到底部，发送fetchChatList")
                    getChatListData()
                }
            })
            observer.observe(div)
        }

        // 组件卸载时取消监听
        return () => {
            if (observer && div) {
                observer.unobserve(div)
            }
        }
    }, [userId])


    // 获取当前聊天列表数据
    async function getChatListData() {
        // 避免反复滑动列表底部而进行多次请求
        if (loadingRef.current) {
            return
        }
        loadingRef.current = true

        const response = await sendFetch(`/api/chat/list?page=${pageRef.current}&userId=${userId}`, {method: "GET"})
        if (!response) {
            console.warn("服务器异常，请求失败！")
            return
        }

        const { data } = await response?.json()
        hasMoreRef.current = data?.hasMore || false

        // 更新当前对话列表
        if (pageRef.current === 1) {
            setChatList(data.list)
        }
        else {
            setChatList((list) => list.concat(data.list))
        }
        // 每次发送请求后，页码递增
        pageRef.current++
        loadingRef.current = false
    }

    return (
        <div className='flex-1 mb-[48px] mt-2 flex flex-col overflow-y-auto'>
            {groupList.map(([date, list]) => {
                return (
                    <div key={date}>
                        <div className='sticky top-0 z-10 p-3 text-sm dark:bg-gray-900 dark:text-gray-500 font-semibold'>
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
                        {groupList.length !== 1 && (<div className='w-full h-6'></div>)}
                    </div>
                )
            })}
            <div ref={loadMoreRef}>&nbsp;</div>
        </div>
    )
}

export default memo(ChatList)