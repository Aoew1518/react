import { Select, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { setLanguage, setThemeMode } from '@/store/modules/navStore';
import Button from '@/components/common/Button';

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
                <Col>账号昵称</Col>
                <Col>
                    <Button variant='text'>Aoew</Button>
                </Col>
            </Row>
            <hr className='my-4 opacity-50' />
            <Row
                align="middle"
                justify="space-between"
            >
                <Col>用户协议</Col>
                <Col>
                    <Button variant='text'>查看</Button>
                </Col>
            </Row>
            <hr className='my-4 opacity-50' />
            <Row
                align="middle"
                justify="space-between"
            >
                <Col>隐私政策</Col>
                <Col>
                    <Button variant='text'>查看</Button>
                </Col>
            </Row>
            <hr className='my-4 opacity-50' />
            <Row
                align="middle"
                justify="space-between"
            >
                <Col>隐私政策</Col>
                <Col>
                    <Button variant='text'>查看</Button>
                </Col>
            </Row>
            <hr className='my-4 opacity-50' />
            <Row
                align="middle"
                justify="space-between"
            >
                <Col>密码管理</Col>
                <Col>
                    <Button variant='text'>查看</Button>
                </Col>
            </Row>
        </div>
    );
};