"use client"
import { configureStore }  from '@reduxjs/toolkit';
// 导入子模块reducer
import navStore from './modules/navStore';
import mainStore from './modules/mainStore';

// 创建store实例，将子模块reducer注册到store中
const store = configureStore({
    reducer: {
        navStore,
        mainStore
    }
})

export default store;