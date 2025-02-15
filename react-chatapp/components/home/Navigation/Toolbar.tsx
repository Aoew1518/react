// 侧边栏低部工具栏
import NativeButton from "@/components/common/Button"
import RightDrawer from "./Settings"
import { MdLightMode, MdDarkMode, MdInfo } from "react-icons/md"
import { useDispatch, useSelector } from 'react-redux';
import { setThemeMode, setShowRightDrawer } from "@/store/modules/navStore"
import { setSelectedChat } from '@/store/modules/mainStore'
import { Dropdown, Modal, message, Button } from 'antd';
import type { MenuProps } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { SettingOutlined, UserOutlined, ClearOutlined, LogoutOutlined } from '@ant-design/icons';
import { userUrl } from "@/util/base64"
import { useState } from "react";
import sendFetch from "@/util/fetch"
import eventBus from "@/store/eventBus";

export default function Toolbar() {
    const dispatch = useDispatch();
    const { themeMode } = useSelector((state: any) => state.navStore);
    const { userId, userName, userAvatar } = useSelector((state: any) => state.userStore);
    const [open, setOpen] = useState(false);
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [contentText, setContentText] = useState('');
    // const [titleText, setTitleText] = useState('');
    const [selectKey, setSelectKey] = useState('');
    const [messageApi, contextHolder] = message.useMessage();
    // 是否出现modal组件的取消按钮和右上角的叉号
    const [showCancel, setShowCancel] = useState(true);

    const items: MenuProps['items'] = [
        {
            icon: <UserOutlined />,
            label: (
                <div onClick={() => handleMenuClick('0')}>
                    个人信息
                </div>
            ),
            key: '0',
        },
        {
            icon: <SettingOutlined />,
            label: (
                <div onClick={() => handleMenuClick('1')}>
                    系统设置
                </div>
            ),
            key: '1',
        },
        {
            icon: <ClearOutlined />,
            label: (
                <div onClick={() => handleMenuClick('2')}>
                    删除所有对话
                </div>
            ),
            key: '2',
        },
        {
            type: 'divider',
        },
        {
            icon: <LogoutOutlined />,
            label: (
                <div onClick={() => handleMenuClick('3')}>
                    退出登录
                </div>
            ),
            key: '3',
        },
    ];

    // 通用处理函数
    function handleMenuClick(key: string) {
        setSelectKey(key);
        switch (key) {
            case '0':
                openSetting()
                setContentText('个人信息');
                break;
            case '1':
                openSetting()
                setContentText('系统设置');
                break;
            case '2':
                setContentText('删除所有对话?');
                setOpen(true);
                break;
            case '3':
                setContentText('退出登录?');
                setOpen(true);
                break;
            default:
                break;
        }
    };

    // 提示弹层
    function handleOk() {
        switch (selectKey) {
            case '0':

                break;
            case '1':
                break;
            case '2':
                handleDeleteAll()
                break;
            case '3':
                handleLogout()
                break;
            default:
                break;
        }
    };

    function handleCancel() {
        setRightDrawerOpen(false);
        setOpen(false);
    };

    // 打开右侧抽屉组件
    function openSetting() {
        dispatch(setShowRightDrawer(true));
    };

    // 清空所有聊天
    async function handleDeleteAll() {
        setConfirmLoading(true);
        const response = await sendFetch(`/api/chat/delete?userId=${userId}`)
        const { code } = await response?.json()
        if (response && code === 0) {
            setOpen(false);
            setConfirmLoading(false)
            messageApi.info('成功删除全部聊天！')
            // 删除成功，重置状态，发布一次订阅
            eventBus.publish("fetchChatList")
            // 将当前选择的聊天置为空
            dispatch(setSelectedChat(null))
        }
        else {
            messageApi.error('网络异常，删除失败！')
        }
    }

    // 处理退出登录的函数
    function handleLogout() {
        setConfirmLoading(true);
        setTimeout(() => {
            localStorage.removeItem("userInfo");
            setOpen(false);
            setConfirmLoading(false);
            window.location.href = '/login';
        }, 2000);
    };

    return (
        <>
            {contextHolder}
            <Modal
                zIndex={9999}
                title={
                    <>
                        <ExclamationCircleOutlined style={{ marginRight: 8, color: '#ffb300' }} />
                        {contentText}
                    </>
                }
                closable={showCancel}
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
                okText={'确认'}
                cancelText={'取消'}
                // 根据 modalOptions 动态控制取消按钮
                footer={showCancel ? undefined : [
                    <Button
                        key="submit"
                        variant="outlined"
                        color="primary"
                        loading={confirmLoading}
                        onClick={handleOk}
                    >
                        确认
                    </Button>
                ]}
            >
                <p>{`${contentText}`}</p>
            </Modal>
            <RightDrawer
                // triggerModel={triggerModel}
            />
            <div className='absolute bottom-0 left-0 right-0 dark:bg-gray-800 flex p-2 justify-between hover:bg-blue-50 dark:hover:bg-gray-800'>
                <Dropdown
                    menu={{ items }}
                    trigger={['click']}
                    placement="topLeft"
                    arrow
                    overlayStyle={{ marginBottom: '35px' }}
                    rootClassName={`dropdown`}
                >
                    <a
                        className="flex"
                        onClick={(e) => e.preventDefault()}
                    >
                        <div className="flex items-center gap-2 cursor-pointer">
                            <img src={userAvatar || userUrl} className="w-8 h-8 rounded-full" />
                            <span>{userName}</span>
                        </div>
                    </a>
                </Dropdown>
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
