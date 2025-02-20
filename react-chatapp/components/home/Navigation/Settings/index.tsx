import GeneralSettings from "./GeneralSettings"
import AccountInfo from "./AccountInfo"
import { message, Drawer, Radio, Button, Form, Row, Col, Input, Upload, Modal, Image } from 'antd';
import type { GetProp, UploadFile, UploadProps, TourProps } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { setUserId } from '@/store/modules/userStore';
import { setShowRightDrawer } from "@/store/modules/navStore"
import { useState, useEffect } from "react";
import ImgCrop from 'antd-img-crop';
import sendFetch from "@/util/fetch";
import { updatePassWord } from "@/types/user"
import { defaultUserAvatar } from "@/util/avatar"
import eventBus from '@/store/eventBus'
import { useTranslation } from 'react-i18next';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default function RightDrawer() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { showRightDrawer } = useSelector((state: any) => state.navStore);
    const { userId, userName, userAvatar } = useSelector((state: any) => state.userStore);
    const [selectRadio, setSelectRadio] = useState<'generalSettings' | 'accountInfo'>('generalSettings');
    const [openChildrenDrawer, setOpenChildrenDrawer] = useState(false);
    const [childrenDrawerTitle, setChildrenDrawerTitle] = useState('设置');
    const [selectKey, setSelectKey] = useState('');
    const [contentText, setContentText] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);
    // modal确认框
    const [openModal, setOpenModal] = useState<boolean>(false);
    // 是否出现modal组件的取消按钮和右上角的叉号
    const [showCancel, setShowCancel] = useState(true);
    // 创建表单实例
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [functionType, setFunctionType] = useState<'deleteAccount' | 'updatePassword' | 'default'>('default');
    const options: CheckboxGroupProps<string>['options'] = [
        { label: t('generalSettings'), value: 'generalSettings' },
        { label: t('accountInfo'), value: 'accountInfo' },
    ]
    // 头像预览是否打开
    const [previewOpen, setPreviewOpen] = useState(false);
    // 预览图片地址
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: '-1',
            name: 'avatar.png',
            status: 'done',
            url: defaultUserAvatar,
        },
    ]);

    useEffect(() => {
        if (userAvatar) {
            setFileList([
                {
                    uid: '-1',
                    name: 'avatar.png',
                    status: 'done',
                    url: userAvatar,
                },
            ]);
        }
    }, [userAvatar])

    // 上传头像前base64格式转化处理
    const getBase64 = (img: FileType, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    // 上传头像前的校验
    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isJpgOrPng) {
            messageApi.error('只支持 JPG 或 PNG 格式!');
        }
        const isLt4M = file.size / 1024 / 1024 < 4;
        if (!isLt4M) {
            messageApi.error('文件大小不能超过 4MB!');
        }
        return isJpgOrPng && isLt4M;
    };

    // 上传头像
    const customRequest: UploadProps['customRequest'] = async ({ file }) => {
        // 获取头像的 base64 数据
        getBase64(file as FileType, async (url) => {
            try {
                // 调用更新头像的接口
                const response = await fetch('/api/user/avatar/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        // 获取当前用户的 ID
                        userId: userId,
                        // 传递头像的 base64 数据
                        avatar: url,
                    }),
                });

                const data = await response.json();
                if (data.code === 0) {
                    const avatarUrl = data.data?.avatar || "";
                    // 发布事件，通知其他组件更新用户数据
                    eventBus.publish('userUpdated', { avatar: avatarUrl });
                    messageApi.success(t('AvatarUpdatedSuccessfully'));
                }
                else {
                    messageApi.error(data.error || t('networkMalfunction'));
                }
            }
            catch (error) {
                console.error('更新头像时发生错误:', error);
                messageApi.error(t('networkMalfunction'));
            }
        });
    };

    // 头像预览
    const onPreview = async (file: UploadFile) => {
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
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
        if (selectKey === '0') {

        }
        else if (selectKey === '1') {
            updatePassword(values)
        }
    }

    // 账号管理
    function userInfoManagementClick() {
        if (!userId) {
            messageApi.info(t('pleaseLogin'));
            return;
        }
        setChildrenDrawerTitle(t('accountSettings'))
        setSelectKey('0');
        setOpenChildrenDrawer(true);

    };

    // 密码管理选项
    function passwordManagementClick() {
        if (!userId) {
            messageApi.info(t('pleaseLogin'));
            return;
        }
        setChildrenDrawerTitle(t('changePassword'))
        setSelectKey('1');
        setOpenChildrenDrawer(true);
    }

    // 注销账户选项
    function unsubscribeUserInfo() {
        setFunctionType('deleteAccount');
        setContentText(t('isCancelAccount'));
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
            messageApi.info(t('networkMalfunction'));
            return;
        }
        return response;
    }

    // 修改密码
    async function updatePassword(values: updatePassWord) {
        setFunctionType('updatePassword');
        const { password, confirmPassword } = values
        if (password !== confirmPassword) {
            messageApi.info(t('inconsistentPasswords'));
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
            messageApi.info(t('networkMalfunction'));
            return;
        }

        setContentText(t('PasswordChangedSuccessfully'));
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
                messageApi.info(t('cancelAccountSuccessfully'));
                setOpenModal(false);
                setConfirmLoading(false);
                window.location.href = '/login';
            }).catch(() => {
                setConfirmLoading(false);
                messageApi.info(t('cancelAccountFailed'));
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
                okText={t('confirm')}
                cancelText={t('cancel')}
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
                                {t('cancel')}
                            </Button>
                        )}
                        <Button
                            key="submit"
                            variant="solid"
                            color={functionType === 'deleteAccount' ? 'danger' : 'primary'}
                            loading={confirmLoading}
                            onClick={handleOk}
                        > {t('confirm')}
                        </Button>
                    </>
                }
            >
                <p>{`${contentText}`}</p>
            </Modal>
            <Drawer
                title={t('systemSettings')}
                open={showRightDrawer}
                onClose={handleCancel}
                className="dark:!bg-gray-800 dark:text-white"
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
                    className="dark:!bg-gray-800 dark:text-white"
                >
                    {selectKey == '0' && (
                        <>
                            <Row
                                align="middle"
                                justify="space-between"
                            >
                                <Col>{t('avatar')}</Col>
                                <Col>
                                    <ImgCrop
                                        rotationSlider
                                        showReset={true}
                                        cropShape="round"
                                        modalTitle={t('editAvatar')}
                                    >
                                        <Upload
                                            name="avatar"
                                            listType="picture-circle"
                                            className="avatar-uploader"
                                            showUploadList={{
                                                // 控制是否显示预览图标
                                                showPreviewIcon: true,
                                                // 控制是否显示下载图标
                                                showDownloadIcon: false,
                                                // 控制是否显示删除图标
                                                showRemoveIcon: false,
                                            }}
                                            beforeUpload={beforeUpload}
                                            fileList={fileList}
                                            customRequest={customRequest}
                                            onPreview={onPreview}
                                        >
                                            <span className="dark:text-white">{t('changeAvatar')}</span>
                                        </Upload>
                                    </ImgCrop>
                                    {/* 预览头像 */}
                                    {previewImage && (
                                        <Image
                                            wrapperStyle={{ display: 'none' }}
                                            preview={{
                                                visible: previewOpen,
                                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                            }}
                                            src={previewImage}
                                        />
                                    )}
                                </Col>
                            </Row>
                            <hr className='my-4 opacity-50' />
                            <Row
                                align="middle"
                                justify="space-between"
                            >
                                <Col>{t('accountNickname')}</Col>
                                <Col>
                                    <span className="dark:text-white">{userName}</span>
                                </Col>
                            </Row>
                            <hr className='my-4 opacity-50' />
                            <Row
                                align="middle"
                                justify="space-between"
                            >
                                <Col>{t('cancelAccount')}</Col>
                                <Col>
                                    <Button
                                        color="danger"
                                        variant="solid"
                                        onClick={() => unsubscribeUserInfo()}
                                    >
                                        {t('confirm')}
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
                                label={t('enterNewPassword')}
                                rules={[{ required: true, message: t('enterNewPassword') }]}
                            >
                                <Input.Password
                                    id="password"
                                    placeholder={t('enterNewPassword')}
                                    className="dark:!bg-gray-300 dark:border-gray-900"
                                />
                            </Form.Item>
                            <Form.Item
                                name="confirmPassword"
                                label={t('enterNewPasswordAgain')}
                                rules={[{ required: true, message: t('enterNewPasswordAgain') }]}
                            >
                                <Input.Password
                                    id="confirmPassword"
                                    placeholder={t('enterNewPasswordAgain')}
                                    className="dark:!bg-gray-300 dark:border-gray-900"
                                />
                            </Form.Item>
                            <Button htmlType="submit" type="primary">
                                {t('confirm')}
                            </Button>
                        </Form>
                    )}
                </Drawer>
            </Drawer>
        </>
    )
}