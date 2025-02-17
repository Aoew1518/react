import { useMediaQuery } from 'react-responsive';

// 注：改方法只适用于SSR服务端渲染html，CSR渲染可能会返回false
// 宽度小于等于768px时，为移动端，返回true
export const useIsMobile = () => {
    return useMediaQuery({ query: '(max-width: 768px)' });
};

// 宽度大于1200px时，为大屏pc，返回true
export const useIsLargePc = () => {
    return useMediaQuery({ query: '(min-width: 1200px)' });
};
