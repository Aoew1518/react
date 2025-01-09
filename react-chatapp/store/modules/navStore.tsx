"use client"
import { createSlice } from "@reduxjs/toolkit";

const navStore = createSlice({
    name: 'nav',
    initialState: {
        isShowNav: true,
        themeMode: 'light',
    },
    reducers: {
        setIsShowNav(state, action) {
            state.isShowNav = action.payload
        },
        setThemeMode(state, action) {
            state.themeMode = action.payload
        }
    }
});

export const { setIsShowNav, setThemeMode } = navStore.actions;
export default navStore.reducer;
