import { Chat } from "@/types/chat"
import { useEffect, useState } from "react"
import { AiOutlineEdit } from "react-icons/ai"
import { MdCheck, MdClose, MdDeleteOutline } from "react-icons/md"
import { PiChatBold, PiTrashBold } from "react-icons/pi"

type Props = {
    item: Chat
    selected: boolean
    // 选中的回调函数
    onSelected: (chat: Chat) => void
}

export default function ChatItem({ item, selected, onSelected }: Props) {
    // 选中和删除状态
    const [editing, setEditing] = useState(false)
    const [deleting, setDeleting] = useState(false)

    // selected 变化时，重置编辑和删除状态
    useEffect(() => {
        resetState()
    }, [selected])

    // 重置状态
    const resetState = () => {
        setEditing(false)
        setDeleting(false)
    }

    return (
        <li
            onClick={() => {
                onSelected(item)
            }}
            className={`relative group flex items-center p-3 space-x-3 cursor-pointer rounded-md hover:bg-gray-800 ${
                selected ? "bg-gray-800 pr-[3.5em]" : ""
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
                    defaultValue={item.title}
                />
            ) : (
                <div className='relative flex-1 text-sm truncate'>
                    {item.title}
                    <span
                        className={`group-hover:from-gray-800 absolute right-0 inset-y-0 w-8 bg-gradient-to-l ${
                            selected ? "from-gray-800" : "from-gray-900"
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
                                        console.log("deleted")
                                    }
                                    else {
                                        console.log("edited")
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
    )
}
