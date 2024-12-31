import { createSlice } from "@reduxjs/toolkit";

const counterStore = createSlice({
    name: 'counter',
    // 初始化state
    initialState: {
        count: 0
    },
    // 修改状态的方法 同步方法 支持直接修改
    reducers: {
        // state为当前数据源
        inscrement(state) {
            state.count++
        },
        decrement(state) {
            state.count--
        },
        // 传参的数据放在action.payload中
        addToNum(state, action) {
            state.count = action.payload
        }
    }
});

// 解构出来actionCreater函数，以按需导出的方式导出actionCreater
export const { inscrement, decrement, addToNum } = counterStore.actions;
// 获取reducer，以默认导出的方式导出reducer
export default counterStore.reducer;