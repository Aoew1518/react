// 侧边栏低部工具栏
import Button from "@/components/common/Button"
import { MdLightMode, MdDarkMode, MdInfo } from "react-icons/md"
import { useDispatch, useSelector } from 'react-redux';
import { setThemeMode } from "@/store/modules/navStore"
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { SettingOutlined, UserOutlined, ClearOutlined, LogoutOutlined } from '@ant-design/icons';
import { userUrl } from "@/util/base64"

export default function Toolbar() {
    const dispatch = useDispatch();
    const { themeMode } = useSelector((state: any) => state.navStore);

    const items: MenuProps['items'] = [
        {
            label: (
                <>
                    <UserOutlined />
                    <span style={{ padding: '10px'}}>
                        个人信息
                    </span>
                </>
            ),
            key: '0',
        },
        {
            label: (
                <>
                    <SettingOutlined />
                    <span style={{ padding: '10px'}}>
                        系统设置
                    </span>
                </>
            ),
            key: '1',
        },
        {
            label: (
                <>
                    <ClearOutlined />
                    <span style={{ padding: '10px'}}>
                        删除所有对话
                    </span>
                </>

            ),
            key: '2',
        },
        {
            type: 'divider',
        },
        {
            label: (
                <>
                    <LogoutOutlined />
                    <span style={{ padding: '10px'}}>
                        退出登录
                    </span>
                </>
            ),
            key: '3',
        },
    ];

    return (
        <div className='absolute bottom-0 left-0 right-0 dark:bg-gray-800 flex p-2 justify-between hover:bg-blue-50 dark:hover:bg-gray-800'>
            <Dropdown
                menu={{ items }}
                trigger={['click']}
                placement="topLeft"
                arrow
                overlayStyle={{ marginBottom: '35px' }}
            >
                <a 
                    className="flex" 
                    onClick={(e) => e.preventDefault()}
                >
                    <div className="flex items-center gap-2 cursor-pointer">
                        <img src={`${userUrl}`} className="w-8 h-8 rounded-full" />
                        <span>Aoew</span>
                    </div>
                </a>
            </Dropdown>

            <div>
                <Button
                    icon={"dark" === "dark" ? MdDarkMode : MdLightMode}
                    variant='text'
                    className="hover:bg-blue-100"
                    onClick={() => {
                        dispatch(setThemeMode(themeMode === "dark" ? "light" : "dark"))
                    }}
                />
                <Button
                    className="hover:bg-blue-100"
                    icon={MdInfo}
                    variant='text'
                />
            </div>
        </div>
    )
}
