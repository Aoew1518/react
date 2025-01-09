// import AppContextProvider from "@/components/AppContext"
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
        <Provider store={store}>
            <html lang='en'>
                <body>
                    {/* <AppContextProvider>{children}</AppContextProvider> */}
                    {children}
                </body>
            </html>
        </Provider>
    )
}
