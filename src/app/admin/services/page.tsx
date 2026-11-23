import Link from 'next/link';
import { removeService } from './actions';
import { Button } from '@/components/ui/Button';
import { findAllServices } from '@/lib/mongodb';

export default async function AdminServicesList() {
    const services = await findAllServices();

    return (
        <div className="space-y-[32px]">
            <div className="flex items-center justify-between">
                <h1 className="text-[32px] font-black tracking-[-1px] text-fg">
                    Services
                </h1>
                <Link href="/admin/services/new">
                    <Button variant="accent" size="sm">
                        Add Service
                    </Button>
                </Link>
            </div>

            {services.length === 0 && (
                <p className="text-muted">No services found in MongoDB.</p>
            )}

            <table className="w-full border-collapse border border-[var(--border)] rounded-[12px] overflow-hidden">
                <thead>
                    <tr className="bg-[var(--bg-secondary)]">
                        <th className="text-left px-[16px] py-[14px] text-[13px] font-bold uppercase tracking-[0.5px] text-muted border-b border-[var(--border)]">
                            Title
                        </th>
                        <th className="text-left px-[16px] py-[14px] text-[13px] font-bold uppercase tracking-[0.5px] text-muted border-b border-[var(--border)]">
                            Value
                        </th>
                        <th className="text-left px-[16px] py-[14px] text-[13px] font-bold uppercase tracking-[0.5px] text-muted border-b border-[var(--border)]">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((s) => (
                        <tr key={s.value} className="border-b border-[var(--border)] last:border-0">
                            <td className="px-[16px] py-[14px] text-fg">
                                {s.title}
                            </td>
                            <td className="px-[16px] py-[14px] text-muted font-[monospace] text-[13px]">
                                {s.value}
                            </td>
                            <td className="px-[16px] py-[14px]">
                                <div className="flex gap-[10px]">
                                    <Link
                                        href={`/admin/services/${s.value}`}
                                        className="text-accent hover:text-accent-hover no-underline text-[14px] font-semibold"
                                    >
                                        Edit
                                    </Link>
                                    <form
                                        action={removeService}
                                        className="inline"
                                    >
                                        <input
                                            type="hidden"
                                            name="value"
                                            defaultValue={s.value}
                                        />
                                        <button
                                            type="submit"
                                            className="text-red-400 hover:text-red-300 no-underline text-[14px] font-semibold"
                                            onClick={(e) => {
                                                if (
                                                    !window.confirm(
                                                        `Delete "${s.title}"?`
                                                    )
                                                ) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
