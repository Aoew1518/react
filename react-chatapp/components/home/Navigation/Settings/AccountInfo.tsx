import { Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import Button from '@/components/common/Button';
import { useTranslation } from 'react-i18next';

export default function LanguageAndThemeSettings({
    userInfoManagementClick,
    passwordManagementClick
}: {
    userInfoManagementClick: Function,
    passwordManagementClick: Function,
}) {
    const { userName } = useSelector((state: any) => state.userStore);
    const { t } = useTranslation();

    return (
        <div className='mt-4'>
            <Row
                align="middle"
                justify="space-between"
            >
                <Col>{t('accountSettings')}</Col>
                <Col>
                    <Button variant='text' onClick={() => userInfoManagementClick()}>{userName}</Button>
                </Col>
            </Row>
            <hr className='my-4 opacity-50' />
            <Row
                align="middle"
                justify="space-between"
            >
                <Col>{t('changePassword')}</Col>
                <Col>
                    <Button variant='text' onClick={() => passwordManagementClick()}>{t('view')}</Button>
                </Col>
            </Row>
            <hr className='my-4 opacity-50' />
            <Row
                align="middle"
                justify="space-between"
            >
                <Col>{t('userAgreement')}</Col>
                <Col>
                    <Button
                        variant='text'
                        onClick={() => {
                            window.open('/policy?itemKey=1');
                        }}
                    >{t('view')}</Button>
                </Col>
            </Row>
            <hr className='my-4 opacity-50' />
            <Row
                align="middle"
                justify="space-between"
            >
                <Col>{t('privacyPolicy')}</Col>
                <Col>
                    <Button
                        variant='text'
                        onClick={() => {
                            window.open('/policy?itemKey=2');
                        }}
                    >{t('view')}</Button>
                </Col>
            </Row>
        </div>
    );
};