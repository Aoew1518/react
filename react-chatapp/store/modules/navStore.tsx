"use client"
import { createSlice } from "@reduxjs/toolkit";

const navStore = createSlice({
    name: 'nav',
    initialState: {
        isShowNav: true,
        themeMode: 'light',
        language: 'chinese',
        showRightDrawer: false,
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
        }
    }
});

export const {
    setIsShowNav,
    setThemeMode,
    setLanguage,
    setShowRightDrawer,
} = navStore.actions;
export default navStore.reducer;
