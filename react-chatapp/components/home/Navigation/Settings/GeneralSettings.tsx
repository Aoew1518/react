import { Select, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { setLanguage, setThemeMode } from '@/store/modules/navStore';

export default function LanguageAndThemeSettings() {
    const dispatch = useDispatch();
    const { language, themeMode } = useSelector((state: any) => state.navStore);
    const { Option } = Select;

    function handleLanguageChange(value: string) {
        dispatch(setLanguage(value));
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
                <Col>语言</Col>
                <Col>
                    <Select
                        defaultValue={language}
                        onChange={(value) => handleLanguageChange(value)}
                        style={{ width: 110 }}
                    >
                        <Option value="chinese">中文</Option>
                        <Option value="english">English</Option>
                        <Option value="system">跟随系统</Option>
                    </Select>
                </Col>
            </Row>
            <hr className='my-4 opacity-50'/>
            <Row
                align="middle"
                justify="space-between"
            >
                <Col>主题</Col>
                <Col>
                    <Select
                        defaultValue={themeMode}
                        onChange={handleThemeChange}
                        style={{ width: 110 }}
                    >
                        <Option value="light">浅色</Option>
                        <Option value="dark">深色</Option>
                        <Option value="system">跟随系统</Option>
                    </Select>
                </Col>
            </Row>
        </div>
    );
};