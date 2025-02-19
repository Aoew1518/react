"use client"

import { LuPanelLeftOpen } from "react-icons/lu";
import { TbMessageCirclePlus } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { setIsShowNav } from "@/store/modules/navStore"
import { Space, Button, Tooltip } from "antd";
import { antdButtonStyle } from "@/components/common/AntdButtonStyle";
import { setSelectedChat } from '@/store/modules/mainStore'
import ChatDropdown from "../Navigation/ChatDropdown"
import { useTranslation } from 'react-i18next';

export default function SimpleNavigation() {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    return (
        <div className="flex flex-col justify-between w-[68px] min-w-[68px] h-full py-2 theme-nav left-0 top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
            <Space
                direction="vertical"
                size="middle"
                className="w-full p-2 items-center"
            >
                <Tooltip placement="right" title={t('expandMenu')}>
                    <Button
                        type="text"
                        size="large"
                        className={antdButtonStyle}
                        onClick={() => dispatch(setIsShowNav(true))}
                    >
                        <LuPanelLeftOpen className="text-2xl" />
                    </Button>
                </Tooltip>

                <Tooltip placement="right" title={t('startNewChat')}>
                    <Button
                        type="text"
                        size="large"
                        className={antdButtonStyle}
                        onClick={() => dispatch(setSelectedChat(null))}
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
                <ChatDropdown
                    arrow={false}
                >
                    <Tooltip placement="right" title={t('systemSettings')}>

                        <Button
                            type="text"
                            size="large"
                            className={antdButtonStyle}
                        >
                            <IoSettingsOutline className="text-2xl" />
                        </Button>
                    </Tooltip>
                </ChatDropdown>
            </Space>
        </div>
    )
}