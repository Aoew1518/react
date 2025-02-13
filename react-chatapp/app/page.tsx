// 使用交互特性需要使用客户端组件
"use client"
import Navigation from "@/components/home/Navigation"
import Main from "@/components/home/Main"
import SimpleNavigation from "@/components/home/SimpleNavigation"
import { useSelector, useDispatch } from 'react-redux'
import { setUserId } from '@/store/modules/userStore';
import { useEffect, useState } from 'react'
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function Home() {
    const dispatch = useDispatch();
    const { themeMode } = useSelector((state: any) => state.navStore);
    const { isShowNav } = useSelector((state: any) => state.navStore);
    const { userId } = useSelector((state: any) => state.userStore);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('用户信息失效，请重新登录！');
    // 初始化并从localStorage中获取用户信息
    const [currentUserId, setCurrentUserId] = useState('');
    // 追踪组件挂载状态
    const [isMounted, setIsMounted] = useState(false);

    // 全局监听storage变化
    useEffect(() => {
        const handleStorageChange = () => {
            const userId = getUserId();
            if (!userId) {
                setOpen(true);
            }
            else {
                setCurrentUserId(userId);
                dispatch(setUserId(userId));
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
            setOpen(true); // 只有在组件已挂载后，userId 为空时才打开模态框
        }
    }, [userId, isMounted]);

    // 得到用户id
    function getUserId() {
        const userInfo = localStorage.getItem("userInfo");
        const userId = userInfo ? JSON.parse(userInfo).userId : "";
        return userId;
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
            <div className={`${themeMode} h-full flex`}>
                <Navigation />
                {!isShowNav && <SimpleNavigation />}
                <Main />
            </div>
        </>
    )
}
