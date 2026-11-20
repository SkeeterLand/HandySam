import { NextResponse } from 'next/server';
import { findAllServices } from '@/lib/service-mongo';

export async function GET() {
    try {
        const services = await findAllServices();
        return NextResponse.json({
            success: true,
            count: services.length,
            services: services.map((s) => ({ value: s.value, title: s.title })),
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
