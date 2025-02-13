// nav 侧边栏
"use client"

import Menubar from "./Menubar"
import Toolbar from "./Toolbar"
import ChatList from "./ChatList"
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setIsShowNav } from '@/store/modules/navStore'

export default function Navigation() {
    const dispatch = useDispatch()
    const { isShowNav } = useSelector((state: any) => state.navStore)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 720) {
                dispatch(setIsShowNav(false))
            }
        };

        // 初始检查
        handleResize();

        // 添加窗口大小变化监听器
        window.addEventListener('resize', handleResize);

        // 清理监听器
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <nav
            className={`flex flex-col relative overflow-hidden h-full theme-nav dark:bg-gray-900 dark:text-gray-300
                ${isShowNav ? 'transition-all duration-100 ease-out w-[260px] p-2' : 'w-0 p-0'}
            `}
        >
            <Menubar />
            <ChatList />
            <Toolbar />
        </nav>
    )
}
