import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div className="space-y-[32px]">
            <h1 className="text-[32px] font-black tracking-[-1px] text-fg">
                Admin Dashboard
            </h1>
            <p className="text-muted text-[16px]">
                Manage service content, projects, and images for Handy Sam.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
                <AdminCard
                    href="/admin/services"
                    title="Services"
                    description="Edit service pages, hero text, benefits, scope, FAQ"
                    icon="🔧"
                />
                <AdminCard
                    href="/admin/projects"
                    title="Projects"
                    description="Add, edit, or delete gallery projects"
                    icon="📸"
                />
                <AdminCard
                    href="/admin/images"
                    title="Images"
                    description="Upload and manage gallery images"
                    icon="🖼️"
                />
            </div>
        </div>
    );
}

function AdminCard({
    href,
    title,
    description,
    icon,
}: {
    href: string;
    title: string;
    description: string;
    icon: string;
}) {
    return (
        <Link href={href} className="block">
            <div className="border border-[var(--border)] rounded-[16px] p-[24px] bg-card hover:border-accent/50 transition-colors duration-200 group">
                <div className="text-[24px] mb-[12px]">{icon}</div>
                <h3 className="text-[18px] font-black mb-[8px] text-fg">{title}</h3>
                <p className="text-muted text-[14px]">{description}</p>
            </div>
        </Link>
    );
}
