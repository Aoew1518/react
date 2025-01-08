// nav 侧边栏
"use client"

// import { useAppContext } from "@/components/AppContext"
import Menubar from "./Menubar"
import Toolbar from "./Toolbar"
import ChatList from "./ChatList"
import { useSelector } from 'react-redux'

export default function Navigation() {
    // const {
    //     state: { displayNavigation }
    // } = useAppContext()

    const { isShowNav } = useSelector((state: any) => state.navStore)

    return (
        <nav
            // className={`${
            //     isShowNav ? "" : "hidden"
            // } flex flex-col dark relative h-full w-[260px] bg-gray-900 text-gray-300 p-2`}
            // className={`${
            //     isShowNav ? "translate-x-0" : "-translate-x-full hidden"
            //   } flex flex-col dark relative h-full w-[260px] bg-gray-900 text-gray-300 p-2 transition-transform duration-500 ease-out`}
            className={`${
                isShowNav ? "translate-x-0" : "-translate-x-full invisible"
            } flex flex-col dark absolute top-0 left-0 h-full w-[260px] bg-gray-900 text-gray-300 p-2 transition-all duration-500 ease-out z-10`}              
        >
            <Menubar />
            <ChatList />
            <Toolbar />
        </nav>
    )
}
