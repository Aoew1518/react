// import AppContextProvider from "@/components/AppContext"
// import EventBusContextProvider from "@/components/EventBusContext"
"use client"
import "@/styles/globals.css"
import "@/styles/markdown.css"
import store from '../store/index.js'
import { Provider } from 'react-redux'

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        // 不用 useContext 获取上下文，改用 redux 管理状态
        // 但仍然保留 useContext 的逻辑代码，以提供学习使用
        <Provider store={store}>
            <html lang='en'>
                {/* <body> */}
                    {/* <AppContextProvider>
                        <EventBusContextProvider>
                            {children}
                        </EventBusContextProvider>
                    </AppContextProvider> */}
                    {children}
                {/* </body> */}
            </html>
        </Provider>
    )
}
