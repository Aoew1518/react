"use client"
import { createSlice } from "@reduxjs/toolkit";
import { Message } from "@/types/chat"

const mainStore = createSlice({
    name: 'main',
    initialState: {
        // 当前模型选择
        currentModel: 'gpt-3.5-turbo',
        // 消息列表
        messageList: [] as Message[],
        // 数据流 id
        streamingId: '',
    },
    reducers: {
        setCurrentModel(state, action) {
            state.currentModel = action.payload
        },
        // setMessageList(state, action) {
        //     state.messageList = action.payload
        // },
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
        }
    }
});

// 调用同步reducers中的方法传入异步数据
export const {
    setCurrentModel,
    addMessageList,
    updataMessageList,
    removeMessageList,
    setStreamingId
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
