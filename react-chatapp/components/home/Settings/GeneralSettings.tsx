import { Select, Row, Col, message } from 'antd';
import Button from '@/components/common/Button';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setLanguage, setThemeMode } from '@/store/modules/navStore';
import { useTranslation } from 'react-i18next';
import i18n, { getLanguageFromValue } from "@/util/language";
import {
    changeLanguage,
    changeThemeMode,
} from "@/util/settings";
import ModelSettings from "./ModelSettings";

export default function GeneralSettings() {
    const dispatch = useDispatch();
    const { language, themeMode } = useSelector((state: any) => state.navStore);
    const [messageApi, contextHolder] = message.useMessage();
    const { Option } = Select;
    const { t } = useTranslation();
    const [openChildrenDrawer, setOpenChildrenDrawer] = useState(false);

    // 更改语言
    function handleLanguageChange(value: string) {
        dispatch(setLanguage(value));
        const languageToSet = getLanguageFromValue(value);
        i18n.changeLanguage(languageToSet);
        changeLanguage(value);
    };

    // 更改主题
    function handleThemeChange(value: string) {
        dispatch(setThemeMode(value));
        changeThemeMode(value)
    };

    // 分享应用链接
    function handleShareApp() {
        messageApi.success("复制应用链接成功！");
        navigator.clipboard.writeText('https://react-chatapp-alpha.vercel.app/');
    }

    return (
        <>
            {contextHolder}
            <div className='mt-4'>
                <Row
                    align="middle"
                    justify="space-between"
                >
                    <Col>{t('language')}</Col>
                    <Col>
                        <Select
                            value={language}
                            onChange={(value) => handleLanguageChange(value)}
                            style={{ width: 110 }}
                        >
                            <Option value="chinese">{t('chinese')}</Option>
                            <Option value="english">{t('english')}</Option>
                            <Option value="system">{t('system')}</Option>
                        </Select>
                    </Col>
                </Row>
                <hr className='my-4 opacity-50 dark:opacity-30' />
                <Row
                    align="middle"
                    justify="space-between"
                >
                    <Col>{t('theme')}</Col>
                    <Col>
                        <Select
                            value={themeMode}
                            onChange={handleThemeChange}
                            style={{ width: 110 }}
                        >
                            <Option value="light">{t('light')}</Option>
                            <Option value="dark">{t('dark')}</Option>
                            {/* 因为有些antd组件样式不好设置tailwind，跟随系统模块暂时滞留 */}
                            {/* <Option value="system">{t('system')}</Option> */}
                        </Select>
                    </Col>
                </Row>
                <hr className='my-4 opacity-50 dark:opacity-30' />
                <Row
                    align="middle"
                    justify="space-between"
                >
                    <Col>模型设置</Col>
                    <Col>
                        <Button
                            variant='text'
                            onClick={() => setOpenChildrenDrawer(true)}
                        >{t('view')}</Button>
                    </Col>
                </Row>
                <ModelSettings 
                    open={openChildrenDrawer}
                    onClose={() => setOpenChildrenDrawer(false)}
                />
                <hr className='my-4 opacity-50 dark:opacity-30' />
                <Row
                    align="middle"
                    justify="space-between"
                >
                    <Col>分享应用</Col>
                    <Col>
                        <Button
                            variant='text'
                            onClick={handleShareApp}
                        >{t('copy')}</Button>
                    </Col>
                </Row>
            </div>
        </>
    );
};