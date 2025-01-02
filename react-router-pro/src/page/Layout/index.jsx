import { Link, Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div>
      我是一级路由layout组件
      <Link to="/">面板</Link>
      <Link to="/about">关于</Link>
      {/* 配置二级路由的出口，在二级路由匹配成功时，渲染子路由，这里是出现二级路由组件的位置 */}
      <Outlet />
    </div>
  )
}

export default Layout