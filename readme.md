# 常见 npm 包下载地址
## 构建 react 项目
- 不兼容 react 18 版本，建议不要使用cra
```npx create-react-app```
- Next.js
```npx create-next-app@latest```
- vite
```npm create vite@latest```
## 创建 react-redux 项目
```npm install @reduxjs/toolkit react-redux```
## 创建 react-router-dom 项目
```npm install react-router-dom```


# react 学习历程
## day 1
- 通过 {} 来插入变量
- react 18 组件化 + 函数式写法
- jsx = js + xml，通过 babel 转换为 js 给浏览器编译
- useState， 状态管理，用于数据驱动视图更新，会替换掉原来的数据，而不是修改数据
- lodash 库，用于处理数据进行排序，返回的是一个深拷贝的数据，不会影响原数据
- classnames 库，用于处理类名，可以传入多个类名，返回的是一个字符串

## day 2
- useRef + useState 进行表单受控
- uuid 生成唯一id + day.js 处理日期格式
- 组件通信
    - 父传子：props
    - 子传父：on + 方法名
    - 跨层组件通信：引入 createContext + 传递 Ctx.Provider + 使用 useContext
- 发送网路请求或者改变 DOM，需要放在 useEffect 中，类似 vue 的 onMounted
    - 可选参数为空，则出发组件渲染还会执行
    - 可选参数为空数组，则只会在组件渲染时执行一次
    - 可选参数为 [state]，则会在 state 变化时执行
    - 可选参数为 [state1, state2]，则会在 state1 或者 state2 变化时执行
    - 清除副作用：在 useEffect 末尾 return 中返回一个函数，函数中执行清除副作用的逻辑
- 自定义 hooks 函数，以 use 开头，用于封装公共逻辑
- json-server 库模拟后端接口，通过 axios 调用接口

## day 3
- redux: store 传递数据 + actons 数据行为 + reducer 执行逻辑  + dispatch 提交数据 + subscrib 监听数据 + getState 获取状态
    - Redux Toolkit: 用于简化 redux 的使用，包括 createSlice, configureStore, useDispatch, useSelector
    - react-redux: 用于连接 react 和 redux
    - useSelector: 用于获取 store 中的数据
    - useDispatch: 用于提交数据
- 仿美团外卖的购物车demo
    - redux 实现购物车休息传递和修改

## day 4
- react-router-dom: 用于路由管理:
     `npm install react-router-dom`
    - BrowserRouter: 路由容器
    - Route: 路由规则
    - Link: 路由链接
    - Switch: 路由切换
    - Redirect: 路由重定向
    - 主文件引入路由
        import { RouterProvider } from 'react-router-dom'
    - 导入路由模式
        import { createBrowserRouter, createHashRouter } from 'react-router-dom'
    - 路由跳转
        import { Link, useNavigate } from 'react-router-dom'
        - Link 组件：用于在页面中创建导航链接，浏览器会解析为a标签
        ```<Link to="/article?id=1001&name=jack">文章</Link>```
        - useNavigate：用于在函数组件中实现导航功能， 如
        ```onClick={() => navigate('/article?id=1001&name=jack')}```
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

## day 5
 - 记帐本：
     - 1.使用redux进行状态管理
     - 2.使用react-router-dom进行路由管理
     - 3.使用dayjs进行时间处理
     - 4.使用classnames进行class类名处理
     - 5.使用antd-mobile进行移动端组件库
     - 6.使用axios插件进行请求
     - 7.使用json-server进行数据mock
 - 后续想法：
     - 1.完成登录请求部分
     - 2.使用 koa + mysql 搭建后端完成整个项目请求
     - 3.扩充功能：
        - 增加记账备注功能，需要使用到编辑器功能
        - 增加图像可视化功能，需要使用到echarts