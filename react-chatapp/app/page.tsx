// 使用交互特性需要使用客户端组件
"use client"
import Navigation from "@/components/home/Navigation"
import Main from "@/components/home/Main"
import SimpleNavigation from "@/components/home/SimpleNavigation"
import { useSelector, useDispatch } from 'react-redux'
import { setUserId, setUserName, setUserAvatar } from '@/store/modules/userStore';
import { useEffect, useState } from 'react'
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import eventBus from '@/store/eventBus';
import sendFetch from "@/util/fetch";

export default function Home() {
    const dispatch = useDispatch();
    const { themeMode } = useSelector((state: any) => state.navStore);
    const { isShowNav, isShowMaskNav } = useSelector((state: any) => state.navStore)
    const { userId } = useSelector((state: any) => state.userStore);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('用户信息失效，请重新登录！');
    // 追踪组件挂载状态
    const [isMounted, setIsMounted] = useState(false);

    // 初始化或更新用户信息
    useEffect(() => {
        const handleUserUpdate = async() => {
            const response = await sendFetch('/api/user/get', {
                method: 'GET',
            })
            if (!response) {
                // 清空用户信息，要求重新登录
                dispatch(setUserId(''));
                return
            }

            const {data} = await response?.json()
            dispatch(setUserAvatar(data?.avatar || ''));
        };

        // 初始化用户信息
        handleUserUpdate()
        // 订阅事件
        eventBus.subscribe('userUpdated', handleUserUpdate);

        // 清理订阅
        return () => {
            eventBus.unsubscribe('userUpdated', handleUserUpdate);
        };
    }, []);

    // 全局监听storage变化，storage处理静态的数据，用户id和账户是不会变化的
    useEffect(() => {
        const handleStorageChange = () => {
            const {userId, userName} = getUserInfo();
            if (!userId) {
                setOpen(true);
            }
            else {
                dispatch(setUserId(userId) || "");
                dispatch(setUserName(userName || ""));
            }
        };
        handleStorageChange();

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        // 组件挂载完成
        setIsMounted(true);
        // 销毁阶段，取消监听
        return () => {
            setIsMounted(false);
        };
    }, []);

    // 全局监听 userId 变化
    useEffect(() => {
        if (isMounted && !userId) {
            // 只有在组件已挂载后，userId 为空时才打开模态框
            setOpen(true);
        }
    }, [userId, isMounted]);

    // 得到用户信息
    function getUserInfo() {
        const userInfo = localStorage.getItem("userInfo");
        const userId = userInfo ? JSON.parse(userInfo).userId : "";
        const userName = userInfo ? JSON.parse(userInfo).userName : "";
        return {userId, userName};
    }

    // 提示弹层确认
    function handleOk() {
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
            <body className={`${themeMode}`}>
                <div className="h-full flex">
                    <Modal
                        zIndex={9998}
                        title={
                            <>
                                <ExclamationCircleOutlined style={{ marginRight: 8, color: '#ffb300' }} />
                                登录失效
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
                    {/* 隐藏导航栏且没有遮罩或者显示遮罩时显示简单导航 */}
                    {(!isShowNav && !isShowMaskNav) && <SimpleNavigation />}
                    <Main />
                </div>
            </body>
        </>
    )
}
