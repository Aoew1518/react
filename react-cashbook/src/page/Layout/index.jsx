import { TabBar } from "antd-mobile"
import { useEffect, useState } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { getBillList } from "@/store/modules/billStore"
import './index.scss'
import {
    BillOutline,
    CalculatorOutline,
    AddCircleOutline
} from 'antd-mobile-icons'

const tabs = [
    {
        key: '/month',
        title: '月度账单',
        icon: <BillOutline />,
    },
    {
        key: '/new',
        title: '记账',
        icon: <AddCircleOutline />,
    },
    {
        key: '/year',
        title: '年度账单',
        icon: <CalculatorOutline />,
    },
]

const Layout = () => {
    // 异步请求获取账单
    const dispatch = useDispatch()
    const location = useLocation();
    useEffect(() => {
        dispatch(getBillList())
    }, [dispatch])

    // 当前激活项的item
    const [activeKey, setActiveKey] = useState('/month')

    // 动态监听 URL 的变化
    useEffect(() => {
        // 获取第一个路径部分
        const firstPath = location.pathname.split('/')[1]
        setActiveKey(`/${firstPath || 'month'}`);
    }, [location.pathname]);

    // 切换菜单跳转路由
    const navigate = useNavigate()
    const swithRoute = (path) => {
        setActiveKey(path)
        navigate(path)
    }

    return (
        <div className="layout">
            <div className="container">
                <Outlet />
            </div>
            <div className="footer">
                <TabBar activeKey={activeKey} onChange={value => swithRoute(value)}>
                    {tabs.map(item => (
                        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                    ))}
                </TabBar>
            </div>
        </div>
    )
}

export default Layout