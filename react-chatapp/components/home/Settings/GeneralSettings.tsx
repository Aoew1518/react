import { Select, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { setLanguage, setThemeMode } from '@/store/modules/navStore';
import { useTranslation } from 'react-i18next';
import i18n, { getLanguageFromValue } from "@/util/language";
import {
    changeLanguage,
    changeThemeMode,
} from "@/util/settings";

export default function LanguageAndThemeSettings() {
    const dispatch = useDispatch();
    const { language, themeMode } = useSelector((state: any) => state.navStore);
    const { Option } = Select;
    const { t } = useTranslation();

    function handleLanguageChange(value: string) {
        dispatch(setLanguage(value));
        const languageToSet = getLanguageFromValue(value);
        i18n.changeLanguage(languageToSet);
        changeLanguage(value);
    };

    function handleThemeChange(value: string) {
        dispatch(setThemeMode(value));
        changeThemeMode(value)
    };

    return (
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
        </div>
    );
};