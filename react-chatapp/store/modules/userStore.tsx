"use client"
import { createSlice } from "@reduxjs/toolkit";

const userStore = createSlice({
    name: 'user',
    initialState: {
        userId: '',
    },
    reducers: {
        setUserId(state, action) {
            state.userId = action.payload
        }
    }
});

export const {
    setUserId,
} = userStore.actions;
export default userStore.reducer;
