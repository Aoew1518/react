"use client"
import { createSlice } from "@reduxjs/toolkit";

const userStore = createSlice({
    name: 'user',
    initialState: {
        userId: '',
        userAvatar: '',
        userName: '',
    },
    reducers: {
        setUserId(state, action) {
            state.userId = action.payload
        },
        setUserAvatar(state, action) {
            state.userAvatar = action.payload
        },
        setUserName(state, action) {
            state.userName = action.payload
        }
    }
});

export const {
    setUserId,
    setUserAvatar,
    setUserName
} = userStore.actions;
export default userStore.reducer;
