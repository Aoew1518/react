import { Select, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { setLanguage, setThemeMode } from '@/store/modules/navStore';
import { useTranslation } from 'react-i18next';
import i18n from "@/util/language";

export default function LanguageAndThemeSettings() {
    const dispatch = useDispatch();
    const { language, themeMode } = useSelector((state: any) => state.navStore);
    const { Option } = Select;
    const { t } = useTranslation();

    function handleLanguageChange(value: string) {
        dispatch(setLanguage(value));
        // 切换语言
        i18n.changeLanguage(value);
    };

    function handleThemeChange(checked: string) {
        dispatch(setThemeMode(checked));
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
                        <Option value="system">{t('system')}</Option>
                    </Select>
                </Col>
            </Row>
        </div>
    );
};