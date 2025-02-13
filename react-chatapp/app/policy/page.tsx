// 用户协议和隐私政策页面
"use client"
import { useEffect, useState } from 'react';
import { Collapse } from 'antd';
import type { CollapseProps } from 'antd';
import Markdown from "@/components/common/Markdown"

export default function PolicyPage() {
    const [activeKey, setActiveKey] = useState('');
    const [termsOfService, setTermsOfService] = useState('加载中，请稍后...');
    const [privacyPolicy, setPrivacyPolicy] = useState('加载中，请稍后...');

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: '用户协议',
            children: <Markdown>{termsOfService}</Markdown>,
        },
        {
            key: '2',
            label: '隐私政策',
            children: <Markdown>{privacyPolicy}</Markdown>,
        },
    ];

    useEffect(() => {
        // 获取url上的activeKey
        const urlParams = new URLSearchParams(window.location.search);
        const activeKey = urlParams.get('itemKey');
        if (activeKey) {
            setActiveKey(activeKey);
        }
    }, [])

    // 加载隐私政策和用户协议内容
    // 放在public目录下，静态文件可以通过fetch直接加载
    useEffect(() => {
        // 加载用户协议
        fetch('/policy/terms-of-service.md')
            .then((response) => response.text())
            .then((text) => setTermsOfService(text))
            .catch((error) => console.error('加载用户协议失败:', error));

        // 加载隐私政策
        fetch('/policy/privacy-policy.md')
            .then((response) => response.text())
            .then((text) => setPrivacyPolicy(text))
            .catch((error) => console.error('加载隐私政策失败:', error));
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <Collapse
                items={items}
                activeKey={activeKey}
                onChange={(key) => setActiveKey(key as unknown as string)}
            />
        </div>
    );
}