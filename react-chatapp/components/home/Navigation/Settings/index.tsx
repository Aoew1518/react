import GeneralSettings from "./GeneralSettings"
import AccountInfo from "./AccountInfo"
import { message, Drawer, Radio, Button, Form, Row, Col, Input, Upload, Modal } from 'antd';
import type { GetProp, UploadFile, UploadProps, TourProps } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { setUserId } from '@/store/modules/userStore';
import { setShowRightDrawer } from "@/store/modules/navStore"
import { useState, useRef, useEffect } from "react";
import ImgCrop from 'antd-img-crop';
import sendFetch from "@/util/fetch";
import { updatePassWord } from "@/types/user"
import NativeButton from '@/components/common/Button';
import { FaS } from "react-icons/fa6";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default function RightDrawer() {
    const dispatch = useDispatch();
    const { showRightDrawer } = useSelector((state: any) => state.navStore);
    const { userId } = useSelector((state: any) => state.userStore);
    const [selectRadio, setSelectRadio] = useState<'generalSettings' | 'accountInfo'>('generalSettings');
    const [openChildrenDrawer, setOpenChildrenDrawer] = useState(false);
    const [childrenDrawerTitle, setChildrenDrawerTitle] = useState('设置');
    const [selectKey, setSelectKey] = useState('');
    const [contentText, setContentText] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);
    // 是否出现modal组件的取消按钮和右上角的叉号
    const [showCancel, setShowCancel] = useState(true);
    // 创建表单实例
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [functionType, setFunctionType] = useState<'deleteAccount' | 'updatePassword' | 'default'>('default');

    const options: CheckboxGroupProps<string>['options'] = [
        { label: '通用设置', value: 'generalSettings' },
        { label: '账户信息', value: 'accountInfo' },
    ]

    // 删除账户确认引导
    const [openModal, setOpenModal] = useState<boolean>(false);


    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
    ]);

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as FileType);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    // 夫抽屉关闭
    function handleCancel() {
        dispatch(setShowRightDrawer(false));
    };

    // 子抽屉关闭
    const onChildrenDrawerClose = () => {
        // 重置表单字段
        form.resetFields();
        setOpenChildrenDrawer(false);
    };

    // 提交子抽屉数据
    function onFinish(values: updatePassWord) {
        console.log('values', values)
        if (selectKey === '0') {

        }
        else if (selectKey === '1') {
            updatePassword(values)
        }
    }

    // 账号管理
    function userInfoManagementClick() {
        if (!userId) {
            messageApi.info('请先登录！');
            return;
        }
        setChildrenDrawerTitle('账号管理')
        setSelectKey('0');
        setOpenChildrenDrawer(true);

    };

    // 密码管理选项
    function passwordManagementClick() {
        if (!userId) {
            messageApi.info('请先登录！');
            return;
        }
        setChildrenDrawerTitle('修改密码')
        setSelectKey('1');
        setOpenChildrenDrawer(true);
    }

    // 注销账户选项
    function unsubscribeUserInfo() {
        setFunctionType('deleteAccount');
        setContentText('是否注销账户？');
        setShowCancel(true);
        setOpenModal(true);
    }

    // 删除该用户所有信息
    async function deleteAccount() {
        const optinion = {
            body: JSON.stringify({
                userId: userId,
            })
        }
        const response = await sendFetch('/api/user/delete', optinion)
        if (!response) {
            // 注销用户信息，要求重新登录
            messageApi.info('网络异常，请稍后再试');
            return;
        }
        return response;
    }

    // 修改密码
    async function updatePassword(values: updatePassWord) {
        setFunctionType('updatePassword');
        const { password, confirmPassword } = values
        if (password !== confirmPassword) {
            messageApi.info('俩次密码输入不一致，请重新输入密码！');
            return;
        }

        const optinion = {
            body: JSON.stringify({
                id: userId,
                newPassword: password,
            })
        }

        const response = await sendFetch('/api/user/update', optinion)
        if (!response) {
            // 清空用户信息，要求重新登录
            messageApi.info('网络异常，请稍后再试');
            return;
        }
        
        setContentText('修改密码成功，请重新登录！');
        setOpenModal(true);
        setShowCancel(false);
        // 清空用户信息，要求重新登录
        dispatch(setUserId(''));
        localStorage.removeItem('userInfo');
    }

    // modal 弹层确认
    function handleOk() {
        if (functionType === 'deleteAccount') {
            setConfirmLoading(true);
            deleteAccount().then(() => {
                messageApi.info('注销账户成功，即将跳转登录页');
                setOpenModal(false);
                setConfirmLoading(false);
                window.location.href = '/login';
            }).catch(() => {
                setConfirmLoading(false);
                messageApi.info('注销账户失败，请稍后再试');
            });
            return
        }
        else if (functionType === 'updatePassword') {
            setConfirmLoading(true);
            setTimeout(() => {
                setOpenModal(false);
                setConfirmLoading(false);
                window.location.href = '/login';
            }, 2000);
        }

        // 重置功能类型
        setFunctionType('default');
    }

    return (
        <>
            {contextHolder}
            <Modal
                zIndex={9999}
                title={
                    <>
                        <ExclamationCircleOutlined style={{ marginRight: 8, color: '#ffb300' }} />
                        {contentText}
                    </>
                }
                closable={showCancel}
                open={openModal}
                keyboard={showCancel}
                maskClosable={showCancel}
                confirmLoading={confirmLoading}
                okText={'确认'}
                cancelText={'取消'}
                onCancel={() => {
                    setOpenModal(false);
                }}
                // 根据 modalOptions 动态控制取消按钮
                footer={
                    <>
                        {showCancel && (
                            <Button
                                key="cancel"
                                variant="text"
                                onClick={() => {
                                    setOpenModal(false);
                                }}
                            >
                                取消
                            </Button>
                        )}
                        <Button
                            key="submit"
                            variant="solid"
                            color={functionType === 'deleteAccount' ? 'danger' : 'primary'}
                            loading={confirmLoading}
                            onClick={handleOk}
                        > 确认
                        </Button>
                    </>
                }
            >
                <p>{`${contentText}`}</p>
            </Modal>
            <Drawer
                title="系统设置"
                open={showRightDrawer}
                onClose={handleCancel}
            >
                <Radio.Group
                    block
                    options={options}
                    defaultValue="generalSettings"
                    optionType="button"
                    buttonStyle="solid"
                    onChange={(e) => setSelectRadio(e.target.value)}
                />
                {selectRadio === 'generalSettings' ? (
                    <GeneralSettings />
                ) : (
                    <AccountInfo
                        userInfoManagementClick={userInfoManagementClick}
                        passwordManagementClick={passwordManagementClick}
                    />
                )}
                <Drawer
                    title={childrenDrawerTitle}
                    width={400}
                    onClose={onChildrenDrawerClose}
                    open={openChildrenDrawer}
                >
                    {selectKey == '0' && (
                        <>
                            <Row>
                                <Col>头像</Col>
                                <Col>
                                    <ImgCrop rotationSlider>
                                        <Upload
                                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                            listType="picture-card"
                                            fileList={fileList}
                                            onChange={onChange}
                                            onPreview={onPreview}
                                        >
                                            {fileList.length < 5 && '+ Upload'}
                                        </Upload>
                                    </ImgCrop>
                                </Col>
                            </Row>
                            <hr className='my-4 opacity-50' />
                            <Row
                                align="middle"
                                justify="space-between"
                            >
                                <Col>账号昵称</Col>
                                <Col>
                                    <Button color="default" variant='text'>Aoew</Button>
                                </Col>
                            </Row>
                            <hr className='my-4 opacity-50' />
                            <Row
                                align="middle"
                                justify="space-between"
                            >
                                <Col>注销账号</Col>
                                <Col>
                                    <Button
                                        color="danger"
                                        variant="solid"
                                        onClick={() => unsubscribeUserInfo()}
                                    >
                                        确定
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    )}
                    {selectKey == '1' && (
                        <Form
                            layout="vertical"
                            onFinish={onFinish}
                            form={form}
                        >
                            <Form.Item
                                name="password"
                                label="输入新密码"
                                rules={[{ required: true, message: '请输入新密码' }]}
                            >
                                <Input.Password
                                    id="password"
                                    placeholder="请输入密码"
                                />
                            </Form.Item>
                            <Form.Item
                                name="confirmPassword"
                                label="再次输入密码"
                                rules={[{ required: true, message: '请再次输入新密码' }]}
                            >
                                <Input.Password
                                    id="confirmPassword"
                                    placeholder="请再次输入密码"
                                />
                            </Form.Item>
                            <Button htmlType="submit" type="primary">
                                确认
                            </Button>
                        </Form>
                    )}
                </Drawer>
            </Drawer>
        </>
    )
}