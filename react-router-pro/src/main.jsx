import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'

// 1. 导入路由router
import router from './router'

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}>
    {/* <App /> */}
  </RouterProvider>,
)
