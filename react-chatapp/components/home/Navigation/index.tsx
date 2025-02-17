// nav 侧边栏
"use client"

import Menubar from "./Menubar"
import Toolbar from "./Toolbar"
import ChatList from "./ChatList"
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setIsShowNav } from '@/store/modules/navStore'
import { useIsMobile } from "@/util/devices"

export default function Navigation() {
    const dispatch = useDispatch()
    const isMobile  = useIsMobile()
    const { isShowNav } = useSelector((state: any) => state.navStore)

    const NAV_STYLE = {
        PUBLIC_STYLE: 'flex flex-col overflow-hidden h-full theme-nav dark:bg-gray-900 dark:text-gray-300 z-[52]',
        SHOW_PC_STYLE: 'relative transition-all duration-100 ease-out w-[260px] p-2',
        HIDDEN_PC_STYLE: 'relative w-0 p-0',
        SHOW_WISE_STYLE: 'absolute left-0 transition-all duration-200 ease-out w-[260px] p-2',
        HIDDEN_WISE_STYLE: 'absolute left-[-260px] transition-all duration-200 ease-out w-[260px] p-2',
    }
    useEffect(() => {
        let hasChangedShowNav = true

        const handleResize = () => {
            let innerWidth = window.innerWidth
            console.log('hasChangedShowNav', hasChangedShowNav)
            if (innerWidth < 1200 && hasChangedShowNav) {
                hasChangedShowNav = false
                dispatch(setIsShowNav(false))
            }

            if (innerWidth >= 1200){
                hasChangedShowNav = true
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
        <>
            {/* 展示左侧导航栏且为移动端的时候显示遮罩 */}
            {(isShowNav && isMobile) && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-[51]"
                    onClick={() => dispatch(setIsShowNav(false))}
                />
            )}
            <nav
                className={
                    NAV_STYLE.PUBLIC_STYLE
                    + " "
                    + (isShowNav && isMobile ? NAV_STYLE.SHOW_WISE_STYLE : "")
                    + (isShowNav && !isMobile ? NAV_STYLE.SHOW_PC_STYLE : "")
                    + (!isShowNav && isMobile ? NAV_STYLE.HIDDEN_WISE_STYLE : "")
                    + (!isShowNav && !isMobile ? NAV_STYLE.HIDDEN_PC_STYLE : "")
                }
            >
                <Menubar />
                <ChatList />
                <Toolbar />
            </nav>
        </>
    );
}
