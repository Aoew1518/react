export default async function sendFetch(url: string, options?: RequestInit) {
    // 添加默认的请求头和其他选项
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        // 携带cookie
        credentials: 'include',
        ...options
    });

    // 状态码是否正常
    if (!response.ok) {
        console.warn(response.statusText)
        return
    }
    
    // 获取返回的消息是否存在
    if (!response.body) {
        console.warn("body error")
        return
    }

    // 检查响应状态
    if (response.status === 401) {
        // 如果未授权，重定向到登录页面
        return
    }

    // 返回完整的响应对象
    return response;
}