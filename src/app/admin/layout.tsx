import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import { adminLogout } from './actions';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const authorized = await isAdmin();
    if (!authorized) {
        redirect('/admin/login');
    }

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
            <nav className="fixed inset-y-0 left-0 z-50 w-[240px] border-r border-[var(--border)] bg-[var(--bg-secondary)] p-[24px]">
                <h2 className="text-[20px] font-black mb-[32px] text-fg tracking[-0.5px]">
                    Handy Sam Admin
                </h2>
                <ul className="space-y-[12px]">
                    <li>
                        <a
                            href="/admin"
                            className="block px-[16px] py-[10px] rounded-[10px] border border-transparent text-fg hover:bg-white/5 hover:border-white/8 transition-colors"
                        >
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a
                            href="/admin/services"
                            className="block px-[16px] py-[10px] rounded-[10px] border border-transparent text-fg hover:bg-white/5 hover:border-white/8 transition-colors"
                        >
                            Services
                        </a>
                    </li>
                    <li>
                        <a
                            href="/admin/projects"
                            className="block px-[16px] py-[10px] rounded-[10px] border border-transparent text-fg hover:bg-white/5 hover:border-white/8 transition-colors"
                        >
                            Projects
                        </a>
                    </li>
                    <li>
                        <a
                            href="/admin/images"
                            className="block px-[16px] py-[10px] rounded-[10px] border border-transparent text-fg hover:bg-white/5 hover:border-white/8 transition-colors"
                        >
                            Images
                        </a>
                    </li>
                </ul>
                <div className="mt-[auto] pt-[24px] border-t border-[var(--border)]">
                    <form action={adminLogout} className="mt-[8px]">
                        <button
                            type="submit"
                            className="text-[13px] text-muted hover:text-fg no-underline flex items-center gap-[6px]"
                        >
                            <span>Logout</span>
                        </button>
                    </form>
                </div>
            </nav>

            <main className="ml-[240px] p-[40px]">
                {children}
            </main>
        </div>
    );
}
