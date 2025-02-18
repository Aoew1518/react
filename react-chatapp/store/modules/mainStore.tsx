"use client"
import { createSlice } from "@reduxjs/toolkit";
import { Chat, Message } from "@/types/chat"

const mainStore = createSlice({
    name: 'main',
    initialState: {
        // 当前模型选择
        currentModel: 'deepseek-chat',
        // 消息列表
        messageList: [] as Message[],
        // 数据流 id
        streamingId: '',
        // 选择的聊天列表
        selectedChat: {} as Chat,
        // 选择的聊天列表的标题
        selectedChatTitle: '',
        // 加载开始
        isLoading: false,
    },
    reducers: {
        setCurrentModel(state, action) {
            state.currentModel = action.payload
        },
        setMessageList(state, action) {
            state.messageList = action.payload
        },
        addMessageList(state, action) {
            state.messageList.push(action.payload as Message)
        },
        updataMessageList(state, action) {
            const messageList = state.messageList.map((message) => {
                if (message.id === action.payload.id) {
                    return action.payload
                }
                return message;
            })
            state.messageList = messageList
        },
        removeMessageList(state, action) {
            state.messageList = state.messageList.filter((message) => message.id !== action.payload.id)
        },
        setStreamingId(state, action) {
            state.streamingId = action.payload
        },
        // 更新选中聊天的内容或者通过id来选中聊天标题（创建新对话时通过id来选中新的聊天内容）
        setSelectedChat(state, action) {
            if (action && action?.payload?.length === 1 && action?.payload?.id) {
                state.selectedChat = {
                    ...state.selectedChat, // 保留其他属性
                    id: action.payload.id, // 更新 id
                };
            }
            else {
                // 否则，完全替换 selectedChat
                state.selectedChat = action.payload;
            }
        },
        setSelectedChatTitle(state, action) {
            state.selectedChatTitle = action.payload;
        },
        setIsLoading(state, action) {
            state.isLoading = action.payload
        }
    }
});

// 调用同步reducers中的方法传入异步数据
export const {
    setCurrentModel,
    setMessageList,
    addMessageList,
    updataMessageList,
    removeMessageList,
    setStreamingId,
    setSelectedChat,
    setSelectedChatTitle,
    setIsLoading
} = mainStore.actions;
// 异步请求部分，将异步请求数据注入到store中
// const fetchChannlList = () => {
//     return async (dispatch) => {
//         const res = await axios.get('http://geek.itheima.net/v1_0/channels')
//         dispatch(setChannels(res.data.data.channels))
//     }
// };

// export { fetchChannlList };
export default mainStore.reducer;
