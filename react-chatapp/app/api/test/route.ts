import { NextRequest, NextResponse } from "next/server";

// route 是 Next 固定语法，用于定义 API 路由，Next 会将其识别为路由处理程序。
// route 和 page 文件不能在同一个目录下，因为同一个路径不能既是网页也是接口
// NextRequest 为 next 封装好的 hppt 请求
export async function GET(request: NextRequest) {
    const { url } = request
    // 封装成一个 json 对象返回给客户端
    return NextResponse.json({ url })
}