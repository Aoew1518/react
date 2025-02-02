// axios基础的封装
import axios from 'axios'

const httpInstance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
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
    return res
}, (error) => {
    return Promise.reject(error)
})

export default httpInstance