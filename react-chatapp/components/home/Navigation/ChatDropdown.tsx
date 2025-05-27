import { Dropdown, Modal, message, Button } from 'antd';
import {
    SettingOutlined,
    UserOutlined, ClearOutlined,
    LogoutOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setShowRightDrawer } from "@/store/modules/navStore";
import { setSelectedChat } from '@/store/modules/mainStore';
import RightDrawer from "../Settings";
import sendFetch from "@/util/fetch";
import eventBus from "@/store/eventBus";
import { useTranslation } from 'react-i18next';

export default function ChatDropdown({
    children,
    arrow = true,
}: {
    children: React.ReactNode;
    arrow?: boolean;
}) {
    const dispatch = useDispatch();
    const { userId } = useSelector((state: any) => state.userStore);
    const [open, setOpen] = useState(false);
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [contentText, setContentText] = useState('');
    const [selectKey, setSelectKey] = useState('');
    const [messageApi, contextHolder] = message.useMessage();
    // 是否出现modal组件的取消按钮和右上角的叉号
    const [showCancel, setShowCancel] = useState(true);
    const { t } = useTranslation();

    const items: MenuProps['items'] = [
        {
            icon: <UserOutlined />,
            label: (
                <div onClick={() => handleMenuClick('0')}>
                    {t('personalInfo')}
                </div>
            ),
            key: '0',
        },
        {
            icon: <SettingOutlined />,
            label: (
                <div onClick={() => handleMenuClick('1')}>
                    {t('systemSettings')}
                </div>
            ),
            key: '1',
        },
        {
            icon: <ClearOutlined />,
            label: (
                <div onClick={() => handleMenuClick('2')}>
                    {t('deleteAllChats')}
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
                    {t('logOut')}
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
                break;
            case '1':
                openSetting()
                break;
            case '2':
                setContentText(t('deleteAllChats') + '?');
                setOpen(true);
                break;
            case '3':
                setContentText(t('logOut') + '?');
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

    // modal取消
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
        const { code, message } = await response?.json()
        if (response && code === 0) {
            messageApi.success(message)
            // 删除成功，重置状态，发布一次订阅
            eventBus.publish("fetchChatList")
            // 将当前选择的聊天置为空
            dispatch(setSelectedChat(null))
        }
        else {
            messageApi.error(message)
        }
        setOpen(false);
        setConfirmLoading(false)
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
                okText={t('confirm')}
                cancelText={t('cancel')}
                // 根据 modalOptions 动态控制取消按钮
                footer={showCancel ? undefined : [
                    <Button
                        key="submit"
                        variant="outlined"
                        color="primary"
                        loading={confirmLoading}
                        onClick={handleOk}
                    >
                        {t('confirm')}
                    </Button>
                ]}
            >
                <p>{`${contentText}`}</p>
            </Modal>
            <Dropdown
                menu={{ items }}
                trigger={['click']}
                placement="topLeft"
                arrow={arrow}
                overlayStyle={{ marginBottom: '37px' }}
                rootClassName={`dropdown`}
            >
                <a
                    className="flex"
                    onClick={(e) => e.preventDefault()}
                >
                    {children}
                </a>
            </Dropdown>
            <RightDrawer
                radioValue={selectKey === '0' ? 'accountInfo' : 'generalSettings'}
            />
        </>
    )
}