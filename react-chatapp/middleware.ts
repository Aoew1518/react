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
    } catch (error: any) {
        const errorMessage = error.message.includes('expired')
            ? 'Token expired!'
            : 'Token invalid!';

        return new Response(JSON.stringify({ error: errorMessage, code: -1 }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export const config = {
    matcher: ['/api/chat/:path*', '/api/message/:path*'],
};