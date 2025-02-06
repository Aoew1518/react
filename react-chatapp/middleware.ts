import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return new Response(JSON.stringify({ error: 'UnAuthorized, please login!', code: -1 }), { status: 401 });
    }

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET));
        return NextResponse.next();
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Token expired or invalid!', code: -1 }), { status: 401 });
    }
}

export const config = {
    matcher: ['/api/chat/:path*', '/api/message/:path*'], 
};