// 使用交互特性需要使用客户端组件
"use client"
import Navigation from "@/components/home/Navigation"
import Main from "@/components/home/Main"
import { useSelector, useDispatch } from 'react-redux'
import { setUserId } from '@/store/modules/userStore';

export default function Home() {
    const dispatch = useDispatch();
    const { themeMode } = useSelector((state: any) => state.navStore);
    const userInfo = localStorage.getItem("userInfo");
    const { userId } = userInfo ? JSON.parse(userInfo) : { userId: ""};
    dispatch(setUserId(userId));

    return (
        <div className={`${themeMode} h-full flex`}>
            <Navigation />
            <Main />
        </div>
    )
}
