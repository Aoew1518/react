"use client"

import { LuPanelLeftOpen } from "react-icons/lu";
import { TbMessageCirclePlus } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { setIsShowNav } from "@/store/modules/navStore"
import { Space, Button, Tooltip } from "antd";
import { antdButtonStyle } from "@/components/common/AntdButtonStyle";
import {
    setSelectedChat
} from '@/store/modules/mainStore'
import ChatDropdown from "../Navigation/ChatDropdown"

export default function SimpleNavigation() {
    const dispatch = useDispatch();

    return (
        <div className="flex flex-col justify-between w-[68px] min-w-[68px] h-full py-2 theme-nav left-0 top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
            <Space
                direction="vertical"
                size="middle"
                className="w-full p-2 items-center"
            >
                <Tooltip placement="right" title="展开菜单">
                    <Button
                        type="text"
                        size="large"
                        className={antdButtonStyle}
                        onClick={() => dispatch(setIsShowNav(true))}
                    >
                        <LuPanelLeftOpen className="text-2xl" />
                    </Button>
                </Tooltip>

                <Tooltip placement="right" title="开始新对话">
                    <Button
                        type="text"
                        size="large"
                        className={antdButtonStyle}
                        onClick={() => dispatch(dispatch(setSelectedChat(null)))}
                    >
                        <TbMessageCirclePlus className="text-2xl" />
                    </Button>
                </Tooltip>
            </Space>

            <Space
                direction="vertical"
                size="middle"
                className="w-full p-2 flex flex-col items-center"
            >
                <Tooltip placement="right" title="系统设置">
                    <ChatDropdown
                        arrow={false}
                    >
                        <Button
                            type="text"
                            size="large"
                            className={antdButtonStyle}
                        >
                            <IoSettingsOutline className="text-2xl" />
                        </Button>
                    </ChatDropdown>
                </Tooltip>
            </Space>
        </div>
    )
}