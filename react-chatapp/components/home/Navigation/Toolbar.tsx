// 侧边栏低部工具栏
import NativeButton from "@/components/common/Button"
import ChatDropdown from "./ChatDropdown"
import { MdLightMode, MdDarkMode, MdInfo } from "react-icons/md"
import { useDispatch, useSelector } from 'react-redux';
import { setThemeMode } from "@/store/modules/navStore"
import { defaultUserAvatar } from "@/util/base64"

export default function Toolbar() {
    const dispatch = useDispatch();
    const { themeMode } = useSelector((state: any) => state.navStore);
    const { userName, userAvatar } = useSelector((state: any) => state.userStore);

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
                        icon={"dark" === "dark" ? MdDarkMode : MdLightMode}
                        variant='text'
                        className="hover:bg-blue-100"
                        onClick={() => {
                            dispatch(setThemeMode(themeMode === "dark" ? "light" : "dark"))
                        }}
                    />
                    <NativeButton
                        className="hover:bg-blue-100"
                        icon={MdInfo}
                        variant='text'
                    />
                </div>
            </div>
        </>
    )
}
