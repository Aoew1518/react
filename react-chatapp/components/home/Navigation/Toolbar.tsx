// 侧边栏低部工具栏
import NativeButton from "@/components/common/Button"
import ChatDropdown from "./ChatDropdown"
import { MdLightMode, MdDarkMode } from "react-icons/md"
import { useDispatch, useSelector } from 'react-redux';
import { setThemeMode } from "@/store/modules/navStore"
import { defaultUserAvatar } from "@/util/avatar"
import { FaShareFromSquare } from "react-icons/fa6";
import { changeThemeMode } from "@/util/settings";

export default function Toolbar() {
    const dispatch = useDispatch();
    const { themeMode } = useSelector((state: any) => state.navStore);
    const { userName, userAvatar } = useSelector((state: any) => state.userStore);

    function share() {
        const shareData = {
            title: '分享',
            text: '分享内容',
            url: 'https://react-chatapp-alpha.vercel.app/',
        }

        navigator.share(shareData)
    }

    function handleThemeChange(value: string) {
        dispatch(setThemeMode(value));
        changeThemeMode(value)
    };

    return (
        <>
            <div className='absolute bottom-0 left-0 right-0 dark:bg-gray-800 flex p-2 justify-between hover:bg-blue-50 dark:hover:bg-gray-800'>
                <ChatDropdown>
                    <div className="flex items-center gap-2 cursor-pointer">
                        <img src={userAvatar || defaultUserAvatar} className="w-8 h-8 rounded-full" />
                        <span>{userName}</span>
                    </div>
                </ChatDropdown>
                <div className="flex items-center gap-2"></div>
                <div>
                    <NativeButton
                        icon={themeMode === "dark" ? MdDarkMode : MdLightMode}
                        variant='text'
                        className="hover:bg-blue-100"
                        onClick={() => {
                            handleThemeChange(themeMode === "dark" ? "light" : "dark")
                        }}
                    />
                    <NativeButton
                        className="hover:bg-blue-100"
                        icon={FaShareFromSquare}
                        variant='text'
                        onClick={share}
                    />
                </div>
            </div>
        </>
    )
}
