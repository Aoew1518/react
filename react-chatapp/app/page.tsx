// 使用交互特性需要使用客户端组件
"use client"
import Navigation from "@/components/home/Navigation"
import Main from "@/components/home/Main"
import { useSelector } from 'react-redux'

export default function Home() {
    const { themeMode } = useSelector((state: any) => state.navStore);
    
    return (
        <div className={`${themeMode} h-full flex`}>
            <Navigation />
            <Main />
        </div>
    )
}
