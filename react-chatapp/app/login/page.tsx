'use client';
import { useState } from 'react';
import { Spin } from 'antd';
import Login from '@/components/login';
import { useIsMobile } from "@/util/devices";

export default function LoginRegisterPage() {
    // 用来显示跳转的加载提示
    const [isRedirecting, setIsRedirecting] = useState(false);
    const isMobile  = useIsMobile();

    return (
        <>
            <div className="flex justify-center flex-col items-center h-screen bg-gray-50 bg-white">
                <div className={`${isMobile ? 'h-full' : ''} w-full max-w-sm p-8  rounded-lg`}>
                    <Spin tip="正在跳转首页..." spinning={isRedirecting}>
                        <Login
                            setIsRedirecting={setIsRedirecting}
                        />
                    </Spin>
                </div>
            </div>
        </>
    );
};