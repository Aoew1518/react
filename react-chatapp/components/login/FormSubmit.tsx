import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { userLogin } from '@/types/user';
import { useDispatch } from 'react-redux';
import { setUserId, setUserName, setUserAvatar } from '@/store/modules/userStore';
import httpInstance from '@/util/http';
import VerificationCode from '@/components/login/VerificationCode'
import { updataLocalStorageData, getUserInfo } from "@/util/settings"

export default function FormSubmit({
    formType,
    agree,
    setIsRedirecting,
    setAgree
}: {
    formType: string,
    agree: boolean,
    setIsRedirecting: Function,
    setAgree: Function
}) {
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    // 用户输入的验证码
    const [verify, setVerify] = useState('');
    // 验证码返回的数据
    const [code, setCode] = useState('');
    const router = useRouter();
    // 创建表单实例
    const [form] = Form.useForm();

    // 初始化本地登录信息数据
    useEffect(() => {
        const { userName } = getUserInfo();
        if (userName) {
            setAgree(true);
            // 设置表单字段的值
            form.setFieldsValue({
                username: userName || '',
                password: '',
            });
        }
    }, []);

    // 监测formType的变化，清空表单的账号密码数据
    useEffect(() => {
        if (formType !== 'login') {
            form.setFieldsValue({
                username: '',
                password: '',
                code: '',
            });
        }
    }, [formType]);

    // 登陆注册表单提交
    async function onFinish(values: userLogin) {
        if (!agree) {
            messageApi.info('请同意用户协议和隐私政策！');
            return;
        }

        if (formType !== 'login' && verify !== code) {
            messageApi.info('验证码错误！');
            return;
        }

        setLoading(true);
        try {
            // 根据 formType 决定请求的 API
            const url = formType === 'login' ? '/api/user/login' : '/api/user/register';
            const response = await httpInstance.post(url, values);
            if (response.data.code === 0) {
                message.success(`${formType === 'login' ? '登录' : '注册'}成功！`);
                const { userId, userName, avatar } = response.data?.data;
                dispatch(setUserId(userId));
                dispatch(setUserName(userName));
                dispatch(setUserAvatar(avatar));
                updataLocalStorageData(false, 'userInfo')
                updataLocalStorageData(true, 'userInfo', response.data?.data);
                setIsRedirecting(true);
                router.push('/');
            }
            else {
                messageApi.info(response.data.message);
            }
        }
        catch (error) {
            messageApi.info('网络错误，请稍后重试！');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <>
            {contextHolder}
            <Form
                name={formType}
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="请输入用户名"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        { required: true, message: '请输入密码' },
                        { min: 6, message: '密码至少需要 6 位字符！' }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="请输入密码"
                    />
                </Form.Item>

                {formType !== 'login' && (
                    <div className="flex justify-between items-center">
                        <Form.Item
                            name="code"
                            label="验证码"
                            rules={[{ required: true, message: '请输入验证码' }]}
                        >
                            <Input
                                placeholder="请输入验证码"
                                maxLength={4}
                                allowClear={true}
                                value={code}
                                onChange={(e) => setVerify(e.target.value)}
                            />
                        </Form.Item>

                        <VerificationCode
                            setCode={setCode}
                            formType={formType}
                        />
                    </div>
                )}

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        color={formType === 'login' ? 'primary' : 'cyan'}
                        variant="solid"
                    >
                        {formType === 'login' ? '登录' : '注册'}
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}