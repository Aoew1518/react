"use client"
import { configureStore }  from '@reduxjs/toolkit';
// 导入子模块reducer
import navStore from './modules/navStore';

// 创建store实例，将子模块reducer注册到store中
const store = configureStore({
    reducer: {
        navStore,
    }
})

export default store;