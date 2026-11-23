import './globals.css';
import { validateEnv } from '@/lib/env';

// Validate required env vars at runtime. Skip during Next.js builds so
// deploys don't fail when MONGODB_URI is only available at runtime
// (Cloudflare injects encrypted vars at deploy time, not build time).
if (process.env.NEXT_PHASE !== 'phase-production-build') {
    validateEnv();
}

export const metadata = {
    metadataBase: new URL('https://handy-sam.example.com'),
    title: {
        template: '%s | Handy Sam',
        default: 'Handy Sam - Handyman Services',
    },
    description: 'Your reliable handyman for all your home improvement needs. Serving Franklin, TN and the surrounding area.',
    openGraph: {
        title: 'Handy Sam - Handyman Services',
        description: 'Quality repairs, upgrades, and honest work for the way you live. Serving Franklin, TN and the surrounding area.',
        type: 'website',
        locale: 'en_US',
        siteName: 'Handy Sam',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Handy Sam - Handyman Services',
        description: 'Your reliable handyman for all your home improvement needs.',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                <main>{children}</main>
                <footer>
                    <p>&copy; {new Date().getFullYear()} Handy Sam. All rights reserved.</p>
                </footer>
            </body>
        </html>
    );
}