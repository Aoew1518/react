import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return new Response(JSON.stringify({ error: 'UnAuthorized, please login!', code: -1 }), { status: 401 });
    }

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET));
        
        const response = NextResponse.next();
        // 设置 CORS 头
        const allowedOrigins = ['https://react-chatapp-alpha.vercel.app', 'http://localhost:3000'];
        const origin = request.headers.get('origin') as string;

        if (allowedOrigins.includes(origin)) {
            response.headers.set('Access-Control-Allow-Origin', origin);
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        return response;
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Token expired or invalid!', code: -1 }), { status: 401 });
    }
}

export const config = {
    matcher: ['/api/chat/:path*', '/api/message/:path*'], 
};