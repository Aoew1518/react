import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = [
    'https://react-chatapp-alpha.vercel.app',
    'http://localhost:3000'
];

// 检查请求源是否被允许
function isOriginAllowed(origin: string | null): boolean {
    if (!origin) return false;
    return allowedOrigins.includes(origin);
}

// 处理跨域请求
export function corsHeaders(request: NextRequest): Record<string, string> {
    const origin = request.headers.get('origin');

    // 如果请求头中没有 origin，可能是同源请求，直接返回空对象
    if (!origin) return {};

    // 检查源是否被允许
    if (!isOriginAllowed(origin)) {
        // 对于不允许的源，不返回任何 CORS 头，防止 CSRF 攻击
        return {};
    }

    // 只对允许的源返回 CORS 头
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
    };
}

// 处理预检请求
export function handleCors(request: NextRequest) {
    const origin = request.headers.get('origin');

    // 对于所有请求都检查源
    if (origin && !isOriginAllowed(origin)) {
        return new NextResponse(JSON.stringify({
            code: 403,
            message: 'Forbidden: Origin not allowed'
        }), {
            status: 403,
            statusText: 'Forbidden: Origin not allowed',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // 只处理 OPTIONS 请求
    if (request.method === 'OPTIONS') {
        const headers = {
            'Access-Control-Allow-Origin': origin!,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
        };

        return new NextResponse(null, {
            status: 204,
            headers
        });
    }

    return null;
}