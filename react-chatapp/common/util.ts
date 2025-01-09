import { Chat } from "@/types/chat"

// 将传入的 chatList（聊天记录列表）根据 updateTime（更新时间）字段进行分组，并按时间顺序排序
// 分组的依据是聊天记录的更新时间相对当前时间的差异
export function groupByDate(chatList: Chat[]) {
    // 储存分组后的聊天记录
    const groupMap = new Map<string, Chat[]>()

    chatList.forEach((item) => {
        const now = new Date()
        const updateTime = new Date(item.updateTime)
        let key = "未知时间"
        const dayDiff = Math.floor(
            (now.getTime() - updateTime.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (dayDiff === 0 && now.getDate() === updateTime.getDate()) {
            key = "今天"
        }
        else if (dayDiff <= 7) {
            key = "最近7天"
        }
        else if (dayDiff <= 31) {
            key = "最近一个月"
        }
        else if (now.getFullYear() === updateTime.getFullYear()) {
            key = `${updateTime.getMonth() + 1}月`
        }
        else {
            key = `${updateTime.getFullYear()}`
        }

        // 如果 groupMap 中已经存在该 key，则将当前聊天记录添加到对应的数组中
        if (groupMap.has(key)) {
            groupMap.get(key)?.push(item)
        }
        // 否则，创建一个新的数组，并将当前聊天记录添加到该数组中
        else {
            groupMap.set(key, [item])
        }
    })

    // 按照 updateTime 降序排序
    groupMap.forEach((item) => {
        item.sort((a, b) => b.updateTime - a.updateTime)
    })

    // 将 groupMap 转换为数组并返回
    // 数组中每个元素是 [key, value] 格式，其中 value 是包含多个元素的数组，每个元素有 updateTime 属性
    const groupList = Array.from(groupMap).sort(([, list1], [, list2]) => {
        return (
            // 按照每个组中最后一个元素的 updateTime 排序
            list2[list2.length - 1].updateTime - list1[list1.length - 1].updateTime
        )
    })

    return groupList
}

export function sleep(time: number) {
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve('time is up')
        }, time)
    )
}