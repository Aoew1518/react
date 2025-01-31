"use client"
import "@/styles/globals.css"
import "@/styles/markdown.css"
import store from '@/store/index.js'
import { Provider } from 'react-redux'
import { AntdRegistry } from '@ant-design/nextjs-registry';

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <Provider store={store}>
            <html lang='en'>
                <body>
                    <AntdRegistry>{children}</AntdRegistry>
                </body>
            </html>
        </Provider>
    )
}
