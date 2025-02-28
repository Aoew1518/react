import { LocalStorageData } from '@/types/common'

// 得到 localStorage 中消息
export function getLocalStorageData(): LocalStorageData {
    const { userInfo, themeMode, language } = localStorage;
    return {
        userInfo: userInfo ? JSON.parse(userInfo) : null,
        themeMode: themeMode ? JSON.parse(themeMode) : null,
        language: language ? JSON.parse(language) : null
    };
}

// 更改或者删除 localStorage 中消息，默认更改
export function updataLocalStorageData(isUpdate: boolean, key: string, item?: any) {
    isUpdate ? localStorage.setItem(key, JSON.stringify(item))
        : localStorage.removeItem(key);
}

// 得到用户信息
export function getUserInfo() {
    const { userInfo } = getLocalStorageData();
    const userId = userInfo?.userId || "";
    const userName = userInfo?.userName || "";
    const avatar = userInfo?.avatar || "";
    return { userId, userName, avatar };
}

// 更改语言设置
export function changeLanguage(language?: string) {
    updataLocalStorageData(true, 'language', language || 'chinese');
}

// 更改主题设置
export function changeThemeMode(themeMode?: string) {
    updataLocalStorageData(true, 'themeMode', themeMode || 'light');
}