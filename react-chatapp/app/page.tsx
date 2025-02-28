// 使用交互特性需要使用客户端组件
"use client";
import Navigation from "@/components/home/Navigation";
import Main from "@/components/home/Main";
import SimpleNavigation from "@/components/home/SimpleNavigation";
import { useSelector, useDispatch } from 'react-redux';
import { setUserId, setUserName, setUserAvatar } from '@/store/modules/userStore';
import { setLanguage, setThemeMode } from '@/store/modules/navStore';
import { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import eventBus from '@/store/eventBus';
import sendFetch from "@/util/fetch";
import { useIsMobile } from "@/util/devices";
import i18n, { getLanguageFromValue } from "@/util/language";
import {
    getLocalStorageData,
    getUserInfo,
    updataLocalStorageData
} from "@/util/settings";

export default function Home() {
    const dispatch = useDispatch();
    const isMobile = useIsMobile()
    const { themeMode } = useSelector((state: any) => state.navStore);
    const { isShowNav } = useSelector((state: any) => state.navStore);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('用户信息失效，请重新登录！');

    // 初始化系统相关信息设置
    useEffect(() => {
        handleSettings()
        const { userId, userName, avatar } = getUserInfo();
        // 若本地没有用户信息则发送一次请求让后端检索cookie是否有效，有效则返回用户信息
        if (!userId) {
            handleUserUpdate()
        }
        else {
            dispatch(setUserId(userId) || "");
            dispatch(setUserName(userName || ""));
            dispatch(setUserAvatar(avatar || ""));
        }

        const callback = (data: string) => {
            setModalText(data)
            setOpen(true);
        };

        // 订阅事件
        eventBus.subscribe("reLogin", callback);

        // 组件卸载时取消订阅
        return () => {
            eventBus.unsubscribe("reLogin", callback);
        };
    }, [])

    function handleSettings() {
        let { themeMode, language } = getLocalStorageData();
        if (!themeMode) {
            updataLocalStorageData(true, 'themeMode', 'light');
        }
        else {
            dispatch(setThemeMode(themeMode));
        }

        if (!language) {
            updataLocalStorageData(true, 'language', 'chinese');
        }
        else {
            dispatch(setLanguage(language));
        }
        
        // 将language的值转换为对应的语言，如果为system，则根据用户系统设置自动判断
        i18n.changeLanguage(getLanguageFromValue(language));
    }

    async function handleUserUpdate() {
        const response = await sendFetch('/api/user/get', {
            method: 'GET',
        })

        if (!response) {
            setOpen(true);
            return;
        }

        const { data } = await response?.json();
        const { userId, userName, avatar } = data;
        updataLocalStorageData(true, 'userInfo', data);
        dispatch(setUserId(userId));
        dispatch(setUserName(userName));
        dispatch(setUserAvatar(avatar));
    };

    // 提示弹层确认，清空用户信息，要求重新登录
    function handleOk() {
        setConfirmLoading(true);
        setTimeout(() => {
            updataLocalStorageData(false, 'userInfo');
            setOpen(false);
            setConfirmLoading(false);
            window.location.href = '/login';
        }, 2000);
    };

    return (
        <>
            <body className={`${themeMode}`}>
                <div className="h-full flex">
                    <Modal
                        zIndex={9998}
                        title={
                            <>
                                <ExclamationCircleOutlined style={{ marginRight: 8, color: '#ffb300' }} />
                                未知问题
                            </>
                        }
                        closable={false}
                        open={open}
                        confirmLoading={confirmLoading}
                        footer={[
                            <Button key="confirm" type="primary" loading={confirmLoading} onClick={handleOk}>
                                确认
                            </Button>
                        ]}
                    >
                        <p>{modalText}</p>
                    </Modal>
                    <Navigation />
                    {/* 隐藏左侧大导航栏且不是移动端时显示简单导航 */}
                    {(!isShowNav && !isMobile) && <SimpleNavigation />}
                    <Main />
                </div>
            </body>
        </>
    )
}
