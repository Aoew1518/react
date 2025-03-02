import eventBus from "@/store/eventBus";

export default async function sendFetch(url: string, options?: RequestInit) {

    // const token = Cookies.get('token');
    const response = await fetch(url, {
        method: "POST",
        headers: {
            // 'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        // 携带cookie
        credentials: 'include',
        ...options
    });

    // 状态码是否正常
    if (!response.ok) {
        if (response.status === 401) {
            eventBus.publish('reLogin', "登录已过期，请重新登录！")
        }
        else {
            eventBus.publish('networkError', "服务器错误，请稍后再试！")
        }
        console.error(response.statusText)
        return
    }
    
    // 获取返回的消息是否存在
    if (!response.body) {
        eventBus.publish('networkError', "服务器错误，请稍后再试！")
        console.error("body error")
        return
    }

    // 返回完整的响应对象
    return response;
}