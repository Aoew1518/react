"use client"
import { createSlice } from "@reduxjs/toolkit";

const navStore = createSlice({
    name: 'nav',
    initialState: {
        isShowNav: true,
        themeMode: 'light',
        language: 'chinese',
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
        }
    }
});

export const {
    setIsShowNav,
    setThemeMode,
    setLanguage,
} = navStore.actions;
export default navStore.reducer;
