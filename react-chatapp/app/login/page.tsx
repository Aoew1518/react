'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';
import { userLogin } from '@/types/user';

export default function LoginRegisterPage() {
    const [messageApi, contextHolder] = message.useMessage();
    // 控制当前是登录还是注册页面
    const [formType, setFormType] = useState<'login' | 'register'>('login');
    const [loading, setLoading] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    function loginInfo() {
        formType === 'login' ? setFormType('register') : setFormType('login');
        // 清空输入框中的信息
        setUsername('');
        setPassword('');
    }

    useEffect(() => {
        if (loginMessage) {
            messageApi.info(loginMessage);
        }
    }, [loginMessage]);

    // 登陆注册表单提交
    async function onFinish(values: userLogin) {
        setLoading(true);
        try {
            // 根据 formType 决定请求的 API
            const url = formType === 'login' ? '/api/user/login' : '/api/user/register';

            const response = await axios.post(url, values);
            console.log(response.data);
            if (response.data.code === 0) {
                message.success(`${formType === 'login' ? '登录' : '注册'}成功！`);
                // 登录或注册成功后跳转到首页
                router.push('/');
            }
            else {
                setLoginMessage(response.data.message);
            }
        }
        catch (error) {
            setLoginMessage(`${formType === 'login' ? '登录' : '注册'}失败，请稍后再试！`);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center">{formType === 'login' ? '登录' : '注册'}</h2>
                    <Form name={formType} onFinish={onFinish} layout="vertical">
                        <Form.Item
                            name="username"
                            label="用户名"
                            rules={[{ required: true, message: '请输入用户名' }]}
                        >
                            <Input
                                placeholder="请输入用户名"
                                value={username}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="密码"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input.Password
                                placeholder="请输入密码"
                                value={password}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={loading}
                                // onClick={() => {loginInfo()}}
                            >
                                {formType === 'login' ? '登录' : '注册'}
                            </Button>
                        </Form.Item>
                    </Form>
                    <div className="mt-4 text-center">
                        {formType === 'login' ? (
                            <>
                                <span>没有账号? </span>
                                <Button
                                    type="link"
                                    onClick={() => loginInfo()} // 切换到注册
                                >
                                    注册
                                </Button>
                            </>
                        ) : (
                            <>
                                <span>已有账号? </span>
                                <Button
                                    type="link"
                                    onClick={() => loginInfo()} // 切换到登录
                                >
                                    登录
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};