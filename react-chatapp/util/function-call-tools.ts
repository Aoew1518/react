// 工具函数定义
export const tools = [
    // 获取当前时间
    {
        type: "function" as const,
        function: {
            name: "get_current_time",
            description: "获取当前的日期和时间",
            parameters: {
                type: "object",
                properties: {}
            }
        }
    },
    // 查找附近的地点
    {
        type: "function" as const,
        function: {
            name: "find_nearby_places",
            description: "查找附近的兴趣点（POI），如医院、学校、超市等",
            parameters: {
                type: "object",
                properties: {
                    location: {
                        type: "string",
                        description: "当前位置，格式：经度,纬度"
                    },
                    keyword: {
                        type: "string",
                        description: "搜索关键词，如：医院、学校、超市、餐厅等"
                    },
                    radius: {
                        type: "number",
                        description: "搜索半径（米），默认1000"
                    },
                    city: {
                        type: "string",
                        description: "城市名称或城市编码，用于优化搜索结果"
                    }
                },
                required: ["location", "keyword"]
            }
        }
    },
    // 获取路线规划
    {
        type: "function" as const,
        function: {
            name: "get_route",
            description: "获取从起点到终点的路线",
            parameters: {
                type: "object",
                properties: {
                    origin: {
                        type: "string",
                        description: "起点坐标，格式：经度,纬度"
                    },
                    destination: {
                        type: "string",
                        description: "终点坐标，格式：经度,纬度"
                    },
                    mode: {
                        type: "string",
                        enum: ["walking", "driving", "transit", "bicycling"],
                        description: "交通方式，可选值：walking(步行), driving(驾车), transit(公交), bicycling(骑行)，默认为driving"
                    }
                },
                required: ["origin", "destination"]
            }
        }
    }
];

// 获取当前时间
function getCurrentDateTime() {
    const now = new Date();
    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1, // 月份从0开始，所以要加1
        day: now.getDate(),
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds(),
        weekDay: ['日', '一', '二', '三', '四', '五', '六'][now.getDay()] // 星期几
    };
}

// 搜索附近的POI
async function findNearbyPlaces(location: string, keyword: string, radius: number = 1000, city?: string) {
    try {
        // 构建请求URL
        let url = `https://restapi.amap.com/v3/place/around?key=${process.env.NEXT_PUBLIC_GAODE_MAP_API_KEY}&location=${location}&keywords=${encodeURIComponent(keyword)}&radius=${radius}`;

        // 添加城市参数（可选）
        if (city) {
            url += `&city=${encodeURIComponent(city)}`;
        }

        // 发送请求
        const response = await fetch(url);
        const data = await response.json();

        // 处理返回结果
        if (data.status === '1' && data.pois) {
            return data.pois.map((poi: any) => ({
                name: poi.name,
                address: poi.address,
                location: poi.location, // 经纬度
                distance: poi.distance, // 距离（米）
                tel: poi.tel, // 电话
                type: poi.type // 类型
            }));
        }
        else {
            throw new Error(data.info || '搜索失败');
        }
    } catch (error) {
        console.error('搜索附近地点出错:', error);
        throw new Error('搜索附近地点时出错');
    }
}

// 实现工具函数
export async function callTool(functionName: string, args: any) {
    switch (functionName) {
        case 'get_current_time':
            return getCurrentDateTime();

        case 'find_nearby_places': {
            const { location, keyword, radius, city } = args;
            return await findNearbyPlaces(location, keyword, radius, city);
        }

        case 'get_route': {
            const { origin, destination, mode = 'driving' } = args;
            // 使用高德地图API获取路线
            const url = `https://restapi.amap.com/v3/direction/${mode}/json?key=${process.env.NEXT_PUBLIC_GAODE_MAP_API_KEY}&origin=${origin}&destination=${destination}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.route || {};
        }

        default:
            throw new Error(`未知的工具调用: ${functionName}`);
    }
}