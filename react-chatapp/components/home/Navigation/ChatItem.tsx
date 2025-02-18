import { Chat } from "@/types/chat"
import { useEffect, useState } from "react"
import { AiOutlineEdit } from "react-icons/ai"
import { MdCheck, MdClose, MdDeleteOutline } from "react-icons/md"
import { PiChatBold, PiTrashBold } from "react-icons/pi"
import { useDispatch, useSelector } from "react-redux"
import { setSelectedChat, setSelectedChatTitle } from "@/store/modules/mainStore"
import eventBus from "@/store/eventBus";
import { message } from 'antd';

type Props = {
    item: Chat
    selected: boolean
    // 选中的回调函数
    onSelected: (chat: Chat) => void
}

export default function ChatItem({ item, selected, onSelected }: Props) {
    const [messageApi, contextHolder] = message.useMessage();
    // 选中和删除状态
    const [editing, setEditing] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [title, setTitle] = useState(item.title || "新对话")
    const dispatch = useDispatch()

    // selected 变化时，重置编辑和删除状态
    useEffect(() => {
        resetState()
    }, [selected])

    // 重置状态
    function resetState() {
        setEditing(false)
        setDeleting(false)
    }

    // 手动更改聊天的标题
    async function updateChat() {
        const response = await fetch("/api/chat/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: item.id, title })
        })

        if (!response.ok) {
            console.warn(response.statusText)
            return
        }

        const { code } = await response.json()
        if (code === 0) {
            messageApi.success('标题更新成功！');
            // 手动更改标题后，更新标题
            dispatch(setSelectedChatTitle(title));
            // 更新成功，重置状态，发布一次订阅
            eventBus.publish("fetchChatList");
        }
    }

    // 删除聊天及其所有消息内容
    async function deleteChat() {
        const response = await fetch(`/api/chat/delete?id=${item.id}`, {
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
        if (code === 0) {
            messageApi.success('删除聊天成功！');
            // 删除成功，重置状态，发布一次订阅
            eventBus.publish("fetchChatList");
            // 将当前选择的聊天置为空
            dispatch(setSelectedChat(null))
        }
    }

    return (
        <>
            {contextHolder}
            <li
                onClick={() => {
                    onSelected(item)
                }}
                className={`relative group flex items-center p-3 space-x-3 cursor-pointer rounded-md ${selected ? "pr-[3.5em] bg-blue-100 dark:bg-slate-800" : "hover:bg-blue-50 dark:hover:bg-slate-800"
                    }`}
            >
                {/* 删除状态时，把消息图标换成全部删除图标 */}
                <div>{deleting ? <PiTrashBold /> : <PiChatBold />}</div>
                {/* 根据是否点击了编辑按钮来展现input或者div */}
                {editing ? (
                    <input
                        // 自动获取焦点
                        autoFocus={true}
                        className='flex-1 text-sm min-w-0 bg-transparent outline-none'
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value)
                        }}
                    />
                ) : (
                    <div className='relative flex-1 text-sm truncate'>
                        {item.title}
                        <span
                            className={`dark:group-hover:from-gray-800 absolute right-0 inset-y-0 w-8 bg-gradient-to-l ${selected ? "from-blue-100 dark:from-gray-800" : "dark:from-gray-900"
                                }`}
                        ></span>
                    </div>
                )}
                {/* 根据选中的状态来显示对应俩个修改按钮 */}
                {selected && (
                    <div className='absolute right-1 flex'>
                        {editing || deleting ? (
                            // 编辑或者删除状态则显示对勾或叉号图标
                            <>
                                <button
                                    onClick={(e) => {
                                        if (deleting) {
                                            deleteChat()
                                        }
                                        else {
                                            updateChat()
                                        }
                                        resetState()
                                        // 阻止事件冒泡
                                        e.stopPropagation()
                                    }}
                                    className='p-1 hover:text-white'
                                >
                                    <MdCheck />
                                </button>
                                <button
                                    onClick={(e) => {
                                        resetState()
                                        e.stopPropagation()
                                    }}
                                    className='p-1 hover:text-white'
                                >
                                    <MdClose />
                                </button>
                            </>
                        ) : (
                            // 显示编辑和删除图标
                            <>
                                <button
                                    onClick={(e) => {
                                        setEditing(true)
                                        e.stopPropagation()
                                    }}
                                    className='p-1 hover:text-white'
                                >
                                    <AiOutlineEdit />
                                </button>
                                <button
                                    onClick={(e) => {
                                        setDeleting(true)
                                        e.stopPropagation()
                                    }}
                                    className='p-1 hover:text-white'
                                >
                                    <MdDeleteOutline />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </li>
        </>
    )
}
