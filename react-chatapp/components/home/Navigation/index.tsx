// nav 侧边栏
"use client"

import Menubar from "./Menubar"
import Toolbar from "./Toolbar"
import ChatList from "./ChatList"
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setIsShowNav, setIsShowMaskNav } from '@/store/modules/navStore'

export default function Navigation() {
    const dispatch = useDispatch()
    const { isShowNav, isShowMaskNav } = useSelector((state: any) => state.navStore)
    const NAV_STYLE = {
        PUBLIC_STYLE: 'flex flex-col overflow-hidden h-full theme-nav dark:bg-gray-900 dark:text-gray-300 z-[52]',
        SHOW_FULL_WIDTH_STYLE: 'relative transition-all duration-100 ease-out w-[260px] p-2',
        HIDDEN_FULL_WIDTH_STYLE: 'relative w-0 p-0',
        SHOW_LACK_WIDTH_STYLE: 'absolute left-0 transition-all duration-200 ease-out w-[260px] p-2',
        HIDDEN_LACK_WIDTH_STYLE: 'absolute left-[-260px] transition-all duration-200 ease-out w-[260px] p-2',
    }
    useEffect(() => {
        const handleResize = () => {
            let innerWidth = window.innerWidth
            if (innerWidth < 1200) {
                dispatch(setIsShowNav(false))
            }

            if (innerWidth < 767) {
                dispatch(setIsShowMaskNav(true))
            }
            else {
                dispatch(setIsShowMaskNav(false))
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
            {(isShowNav && isShowMaskNav) && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-[51]"
                    onClick={() => dispatch(setIsShowNav(false))}
                />
            )}
            <nav
                className={
                    NAV_STYLE.PUBLIC_STYLE
                    + " "
                    + (isShowNav && isShowMaskNav ? NAV_STYLE.SHOW_LACK_WIDTH_STYLE : "")
                    + (isShowNav && !isShowMaskNav ? NAV_STYLE.SHOW_FULL_WIDTH_STYLE : "")
                    + (!isShowNav && isShowMaskNav ? NAV_STYLE.HIDDEN_LACK_WIDTH_STYLE : "")
                    + (!isShowNav && !isShowMaskNav ? NAV_STYLE.HIDDEN_FULL_WIDTH_STYLE : "")
                }
            >
                <Menubar />
                <ChatList />
                <Toolbar />
            </nav>
        </>
    );
}
