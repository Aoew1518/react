import { configureStore }  from '@reduxjs/toolkit';
// 导入子模块reducer
import channelSlice from './modules/channelStore';
import counterStore from './modules/counterStore';

// 创建store实例，将子模块reducer注册到store中
const store = configureStore({
    reducer: {
        channel: channelSlice,
        counter: counterStore
    }
})

export default store;