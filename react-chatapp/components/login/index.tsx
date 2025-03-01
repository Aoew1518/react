import { useState } from 'react';
import CheckAgreement from '@/components/login/CheckAgreement'
import SwitchMode from '@/components/login/SwitchMode'
import FormSubmit from './FormSubmit';

export default function Login({setIsRedirecting} : {setIsRedirecting: Function}) {
    // 控制当前是登录还是注册页面
    const [formType, setFormType] = useState<'login' | 'register'>('login');
    // 同意用户协议
    const [agree, setAgree] = useState(false);

    // 控制登录注册页面切换，并清空表单内容
    function switchMode() {
        setFormType(formType === 'login' ? 'register' : 'login');
    }

    return (
        <>
            <p className={`${formType === 'login' ? 'text-[#1677ff]' : 'text-[#13c2c2]'} text-3xl text-center font-bold mb-8`}>欢迎使用 AI 聊天助手</p>
            <h2 className={`${formType === 'login' ? 'text-[#1677ff]' : 'text-[#13c2c2]'} text-2xl text-center font-bold mb-6 `}>{formType === 'login' ? '登录' : '注册'}</h2>
            {/* 表单提交 */}
            <FormSubmit 
                formType={formType}
                agree={agree}
                setAgree={setAgree}
                setIsRedirecting={setIsRedirecting}
            />
            {/* 切换登录注册 */}
            <SwitchMode
                formType={formType}
                switchMode={switchMode}
            />
            {/* 用户协议和隐私政策 */}
            <CheckAgreement
                agree={agree}
                setAgree={setAgree}
            />
        </>
    )
}