// axios基础的封装
import axios from 'axios'

const httpInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_LOGIN_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
})

// axios请求拦截器
httpInstance.interceptors.request.use(config => {
    // const token = userStore.userInfo.token
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
}, (error) => {
    return Promise.reject(error)
})

// axios响应式拦截器
httpInstance.interceptors.response.use(res => {
    console.log('res', res)
    return res
}, (error) => {
    console.log('error', error)
    if (error.response && error.response.status === 401) {
        // Token 过期或无效，重定向到登录页面
        window.location.href = '/login';
    }
    return Promise.reject(error);
})

export default httpInstance