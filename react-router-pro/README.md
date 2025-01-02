# 创建 react-router-dom 项目
 - npm install react-router-dom
 - 主文件引入路由
    import { RouterProvider } from 'react-router-dom'
 - 导入路由模式
    import { createBrowserRouter, createHashRouter } from 'react-router-dom'
 - 路由跳转
    import { Link, useNavigate } from 'react-router-dom'
    - Link 组件：用于在页面中创建导航链接，浏览器会解析为a标签
    ```<Link to="/article?id=1001&name=jack">文章</Link>```
    - useNavigate：用于在函数组件中实现导航功能， 如
    ```onClick={() => navigate('/article?id=1001&name=jack')```
 - 路由参数
    - 动态路由参数：在路由路径中使用冒号来定义动态参数，如 `/article/:id/:name`
    - 查询参数：在路由路径中使用问号来定义查询参数，如 `/article?id=1001&name=jack`
    - 获取路由参数：使用 useParams、useSearchParams 钩子函数来获取路由参数
    - useParams：用于获取动态路由参数，如
    ```const { id, name } = useParams()```
    - useSearchParams：用于获取查询参数，如
    ```const [params] = useSearchParams()```
 - 路由匹配
    import { Route, Routes } from 'react-router-dom'
    - Route 组件：用于定义路由规则
    - Routes 组件：用于包裹所有的 Route 组件，用于路由匹配
 - 路由守卫
    import { Outlet } from 'react-router-dom'
    - Outlet 组件：用于在路由匹配成功时渲染子路由，如
    ```<Outlet />```
 - 路由重定向
    import { Navigate } from 'react-router-dom'
    - Navigate 组件：用于实现路由重定向，如
    ```<Navigate to="/home" />```
