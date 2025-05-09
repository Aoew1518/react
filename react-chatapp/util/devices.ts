import { useMediaQuery } from 'react-responsive';

// 服务器端设备检测
export const isMobileServer = (ua?: string): boolean => {
    const userAgent = ua || typeof window !== 'undefined' ? window.navigator.userAgent : '';
    const mobileRegex = /iPhone|iPod|iPad|Android|BlackBerry|IEMobile|Opera Mini|Mobile|webOS|Phone|Tablet/i;
    return mobileRegex.test(userAgent);
};

// 获取用户代理
export const getUserAgent = (req?: { headers: { [key: string]: string } }): string => {
    if (req?.headers) {
        return req.headers['user-agent'] || '';
    }
    return typeof window !== 'undefined' ? window.navigator.userAgent : '';
};

// 客户端设备检测
export const useIsMobile = () => {
    return useMediaQuery({ query: '(max-width: 768px)' });
};

// 宽度大于1200px时，为大屏pc，返回true
export const useIsLargePc = () => {
    return useMediaQuery({ query: '(min-width: 1200px)' });
};
