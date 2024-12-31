import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import store from './store/index.js'
import { Provider } from 'react-redux'
// Provider 负责为react注入store
// 内置Provider组件通过store参数把创建好的store实例注入到react中，即App组件
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // </StrictMode>,
)
