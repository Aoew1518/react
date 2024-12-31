# 构建 react 项目
- 不兼容 react 18 版本，建议不要使用
    npx create-react-app react-basic
- Next.js
    npx create-next-app@latest
- vite
    npm create vite@latest

# day 1
- 通过 {} 来插入变量
- react 18 组件化 + 函数式写法
- jsx = js + xml，通过 babel 转换为 js 给浏览器编译
- useState， 状态管理，用于数据驱动视图更新，会替换掉原来的数据，而不是修改数据
- lodash 库，用于处理数据进行排序，返回的是一个深拷贝的数据，不会影响原数据
- classnames 库，用于处理类名，可以传入多个类名，返回的是一个字符串

# day 2
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

# day 3
- redux: store 传递数据 + actons 数据行为 + reducer 执行逻辑  + dispatch 提交数据 + subscrib 监听数据 + getState 获取状态
    - Redux Toolkit: 用于简化 redux 的使用，包括 createSlice, configureStore, useDispatch, useSelector
    - react-redux: 用于连接 react 和 redux
    - useSelector: 用于获取 store 中的数据
    - useDispatch: 用于提交数据

# day 4
- react-router-dom: 用于路由管理
    - BrowserRouter: 路由容器
    - Route: 路由规则
    - Link: 路由链接
    - Switch: 路由切换
    - Redirect: 路由重定向

