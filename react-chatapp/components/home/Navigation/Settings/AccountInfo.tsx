import { Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, setThemeMode } from '@/store/modules/navStore';
import Button from '@/components/common/Button';

export default function LanguageAndThemeSettings({
    userInfoManagementClick,
    passwordManagementClick
}: {
    userInfoManagementClick: Function,
    passwordManagementClick: Function,
}) {
    const dispatch = useDispatch();
    const { userName } = useSelector((state: any) => state.userStore);

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
                <Col>账号设置</Col>
                <Col>
                    <Button variant='text' onClick={() => userInfoManagementClick()}>{userName}</Button>
                </Col>
            </Row>
            <hr className='my-4 opacity-50' />
            <Row
                align="middle"
                justify="space-between"
            >
                <Col>修改密码</Col>
                <Col>
                    <Button variant='text' onClick={() => passwordManagementClick()}>查看</Button>
                </Col>
            </Row>
            <hr className='my-4 opacity-50' />
            <Row
                align="middle"
                justify="space-between"
            >
                <Col>用户协议</Col>
                <Col>
                    <Button
                        variant='text'
                        onClick={() => {
                            window.open('/policy?itemKey=1');
                        }}
                    >查看</Button>
                </Col>
            </Row>
            <hr className='my-4 opacity-50' />
            <Row
                align="middle"
                justify="space-between"
            >
                <Col>隐私政策</Col>
                <Col>
                    <Button
                        variant='text'
                        onClick={() => {
                            window.open('/policy?itemKey=2');
                        }}
                    >查看</Button>
                </Col>
            </Row>
        </div>
    );
};