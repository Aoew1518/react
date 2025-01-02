import { createRoot } from 'react-dom/client'
import './main.css'
import App from '@/App'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import {Provider } from 'react-redux'
import store from './store'
// 导入全局主题样式
import './theme.css'

createRoot(document.getElementById('root')).render(
  // 数据源包裹
  <Provider store={store}>
    {/* 路由包裹 */}
    <RouterProvider router={router}>
      {/* <App /> */}
    </RouterProvider>
  </Provider>,
)
