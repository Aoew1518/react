"use client"
import { createSlice } from "@reduxjs/toolkit";

const mainStore = createSlice({
    name: 'main',
    initialState: {
        currentModel: 'gpt-3.5-turbo',
    },
    reducers: {
        setCurrentModel(state, action) {
            state.currentModel = action.payload
        },
    }
});

// 调用同步reducers中的方法传入异步数据
export const { setCurrentModel } = mainStore.actions;
// 异步请求部分，将异步请求数据注入到store中
// const fetchChannlList = () => {
//     return async (dispatch) => {
//         const res = await axios.get('http://geek.itheima.net/v1_0/channels')
//         dispatch(setChannels(res.data.data.channels))
//     }
// };

// export { fetchChannlList };
export default mainStore.reducer;
