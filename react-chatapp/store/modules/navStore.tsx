"use client"
import { createSlice } from "@reduxjs/toolkit";

const navStore = createSlice({
    name: 'nav',
    initialState: {
        // 是否展示则边栏
        isShowNav: true,
        // 侧边栏展示是否遮罩
        isShowMaskNav: false,
        themeMode: 'light',
        language: 'chinese',
        showRightDrawer: false,
        isShowDropdown: false,
    },
    reducers: {
        setIsShowNav(state, action) {
            state.isShowNav = action.payload
        },
        setIsShowMaskNav(state, action) {
            state.isShowMaskNav = action.payload
        },
        setThemeMode(state, action) {
            state.themeMode = action.payload
        },
        setLanguage(state, action) {
            state.language = action.payload
        },
        setShowRightDrawer(state, action) {
            state.showRightDrawer = action.payload
        },
        setIsShowDropdown(state, action) {
            state.isShowDropdown = action.payload
        }
    }
});

export const {
    setIsShowNav,
    setIsShowMaskNav,
    setThemeMode,
    setLanguage,
    setShowRightDrawer,
    setIsShowDropdown,
} = navStore.actions;
export default navStore.reducer;
