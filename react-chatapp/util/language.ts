import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const getLanguageFromValue = (value: string): string => {
    if (value === 'system') {
        const userLanguage = navigator.language;
        return userLanguage.startsWith('zh') ? 'chinese' : 'english';
    }
    return value;
};

i18n
    .use(initReactI18next)
    .init({
        resources: {
            english: {
                translation: {
                    // 按钮文案
                    confirm: "Confirm",
                    cancel: "Cancel",
                    collapseBtn: "Collapse",
                    showAllBtn: "Show All",
                    newChat: "New Chat",
                    regenerateBtn: "Regenerate",
                    stopGenerating: "Stop Generating",
                    deepSeek: "Deep Seek",
                    deepSeekTooltip: "Think first, answer later, solve reasoning problems",

                    // 时间排序
                    today: "Today",
                    yesterday: "Yesterday",
                    last_7_days: "Last 7 Days",
                    lastMonth: "Last Month",
                    month: "Month",
                    unknownTime: "Unknown time",

                    // 抽屉设置组件
                    pleaseLogin: "Please login first!",
                    networkMalfunction: "Network malfunction, please try again later!",
                    generalSettings: "General Setup",
                    accountInfo: "Account information",
                    language: "Language",
                    chinese: "Chinese",
                    english: "English",
                    theme: "Theme",
                    light: "Light",
                    dark: "Dark",
                    system: "System",
                    view: "View",
                    accountSettings: "Account Settings",
                    changePassword: "Change Password",
                    userAgreement: "User Agreement",
                    privacyPolicy: "Privacy Policy",
                    avatar: "Avatar",
                    changeAvatar: "Change Avatar",
                    editAvatar: "Edit Uploaded Avatar",
                    AvatarUpdatedSuccessfully: "Avatar Updated Successfully!",
                    accountNickname: "Account Nickname",
                    cancelAccount: "Cancel Account",
                    enterNewPassword: "Enter New Password",
                    PasswordReqLeastSixCharS: "Password requires at least 6 characters",
                    enterNewPasswordAgain: "Enter New Password Again",
                    inconsistentPasswords: "The password entered twice is inconsistent, please re-enter the password!",
                    PasswordChangedSuccessfully: "Password Changed Successfully, Please Re-Login!",
                    isCancelAccount: "Do you want to cancel the account?",
                    cancelAccountSuccessfully: "Account cancellation successful, will now be redirected to the login page!",
                    cancelAccountFailed: "Account cancellation failed, please try again later!",

                    // 下拉菜单设置组件
                    personalInfo: "Personal Information",
                    systemSettings: "System Settings",
                    deleteAllChats: "Delete All Chats",
                    logOut: "Log Out",
                    modelSettings: "Model Settings",
                    shareApp: "Share App",

                    // 模型设置
                    replacementModel: "Replacement Model",
                    maximumOutputLength: "Maximum output length",
                    modelDegreesOfFreedom: "Model degrees of freedom",

                    // 首页展示内容
                    selfIntroduction: "Hi, nice to meet you!",
                    enterMessage: "Enter a message...",
                    expandMenu: "Expand Menu",
                    startNewChat: "Start a New Chat",
                    contentGeneratedByAI: "The content is generated by AI",

                    // 输入框功能等
                    reload: "Reload",
                    slideToBottom: "Slide To Bottom",
                    editMessage: "Edit Message",
                    copy: "Copy",
                }
            },
            chinese: {
                translation: {
                    // 按钮文案
                    confirm: "确认",
                    cancel: "取消",
                    collapseBtn: "收起",
                    showAllBtn: "展开全部",
                    newChat: "新对话",
                    regenerateBtn: "重新生成",
                    stopGenerating: "停止生成",
                    deepSeek: "深度思考",
                    deepSeekTooltip: "先思考后回答，解决推理问题",

                    // 时间排序
                    today: "今天",
                    yesterday: "昨天",
                    last_7_days: "最近7天",
                    lastMonth: "最近一个月",
                    month: "月",
                    unknownTime: "未知时间",

                    // 抽屉设置组件
                    pleaseLogin: "请先登录！",
                    networkMalfunction: "网络异常，请稍后再试！",
                    generalSettings: "通用设置",
                    accountInfo: "账户信息",
                    language: "语言",
                    chinese: "中文",
                    english: "English",
                    theme: "主题",
                    light: "浅色",
                    dark: "深色",
                    system: "跟随系统",
                    view: "查看",
                    accountSettings: "账号设置",
                    changePassword: "修改密码",
                    userAgreement: "用户协议",
                    privacyPolicy: "隐私政策",
                    avatar: "头像",
                    changeAvatar: "更换头像",
                    editAvatar: "编辑上传的头像图片",
                    AvatarUpdatedSuccessfully: "头像更新成功！",
                    accountNickname: "账号昵称",
                    cancelAccount: "注销账号",
                    enterNewPassword: "输入新密码",
                    PasswordReqLeastSixCharS: "密码需至少6个字符",
                    enterNewPasswordAgain: "再次输入新密码",
                    inconsistentPasswords: "俩次密码输入不一致，请重新输入密码！",
                    PasswordChangedSuccessfully: "密码修改成功，请重新登录！",
                    isCancelAccount: "是否注销账账户？",
                    cancelAccountSuccessfully: "注销账户成功，即将跳转登录页！",
                    cancelAccountFailed: "注销账户失败，请稍后再试！",

                    // 下拉菜单设置组件
                    personalInfo: "个人信息",
                    systemSettings: "系统设置",
                    deleteAllChats: "删除所有对话",
                    logOut: "退出登录",
                    modelSettings: "模型设置",
                    shareApp: "分享应用",

                    // 模型设置
                    replacementModel: "模型替换",
                    maximumOutputLength: "最大输出长度",
                    modelDegreesOfFreedom: "模型自由度",

                    // 首页展示内容
                    selfIntroduction: "我是AI聊天助手，很高兴见到你！",
                    enterMessage: "输入一条消息...",
                    expandMenu: "展开菜单",
                    startNewChat: "开始新对话",
                    contentGeneratedByAI: "内容由AI生成",

                    // 输入框功能等
                    reload: "重新生成最后一条消息",
                    slideToBottom: "滑动到底部",
                    editMessage: "编辑该消息",
                    copy: "复制",
                },
            }
        },
        // 默认语言为中文
        lng: "chinese",
        // 如果当前语言没有翻译，则使用备用语言
        fallbackLng: "chinese",
        // 对插值表达式的转译
        interpolation: {
            // React 已经安全处理了
            escapeValue: false
        }
    });

export default i18n;