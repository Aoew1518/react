"use client"
import { createSlice } from "@reduxjs/toolkit";

const navStore = createSlice({
    name: 'nav',
    initialState: {
        // 是否展示则边栏
        isShowNav: true,
        // 主题选择
        themeMode: 'light',
        // 语言选择
        language: 'chinese',
        // 是否展示右设置抽屉
        showRightDrawer: false,
        // 是否展示下拉菜单
        isShowDropdown: false,
    },
    reducers: {
        setIsShowNav(state, action) {
            state.isShowNav = action.payload
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
        },
    }
});

export const {
    setIsShowNav,
    setThemeMode,
    setLanguage,
    setShowRightDrawer,
    setIsShowDropdown,
} = navStore.actions;
export default navStore.reducer;
