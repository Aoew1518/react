// import Layoout from '../page/Layout';
// import Year from '../page/Year';
// import Month from '../page/Month';
// import New from '../page/New';
// import { createBrowserRouter } from 'react-router-dom';

// const router = createBrowserRouter([
//     {
//         path: '/',
//         element: <Layoout />,
//         children: [
//             {
//                 path: '/year',
//                 element: <Year />,
//             },
//             {
//                 path: '/month',
//                 element: <Month />,
//             },
//         ],
//     },
//     {
//         path: '/new',
//         element: <New />,
//     }
// ]);

// export default router;


// 路由懒加载
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// 使用 React.lazy 懒加载组件
const Layout = lazy(() => import('../page/Layout'));
const Year = lazy(() => import('../page/Year'));
const Month = lazy(() => import('../page/Month'));
const New = lazy(() => import('../page/New'));
const Loading = lazy(() => import('../page/Loading'));

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <Suspense fallback={<Loading message="正在加载..." />}>
                <Layout />
            </Suspense>
        ),
        children: [
            {
                path: '/year',
                element: (
                    <Suspense fallback={<Loading message="正在加载..." />}>
                        <Year />
                    </Suspense>
                ),
            },
            {
                path: '/month',
                element: (
                    <Suspense fallback={<Loading message="正在加载..." />}>
                        <Month />
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: '/new',
        element: (
            <Suspense fallback={<Loading message="正在加载..." />}>
                <New />
            </Suspense>
        ),
    }
]);

export default router;