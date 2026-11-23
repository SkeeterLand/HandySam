import Link from 'next/link';
import { useActionState, useState } from 'react';
import { adminLogin } from '@/app/admin/actions';

export default function AdminLoginPage() {
    const [state, formAction, isPending] = useActionState(adminLogin, null);
    const [error, setError] = useState<string | null>(null);

    if (state?.error) setError(state.error);
    if (state?.ok) setError(null);

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex items-center justify-center p-[24px]">
            <div className="w-full max-w-[360px]">
                <Link href="/admin" className="text-muted no-underline hover:text-fg mb-[24px] inline-block">
                    ← Back
                </Link>
                <h1 className="text-[32px] font-black tracking[-1px] text-fg mb-[24px]">Admin Login</h1>

                {error && (
                    <div className="p-[12px] rounded-[10px] border border-red-500/30 bg-red-500/10 text-red-400 text-sm mb-[16px]">
                        {error}
                    </div>
                )}

                <form action={formAction} className="space-y-[16px]">
                    <label className="block text-[13px] font-semibold text-muted uppercase tracking-[0.5px]">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        required
                        className="w-full px-[14px] py-[14px] bg-card border border-[var(--border)] rounded-[10px] text-fg focus:outline-none focus:border-accent"
                    />
                    <CustomButton
                        type="submit"
                        disabled={isPending}
                        variant="accent"
                        className="w-full"
                    >
                        {isPending ? 'Signing in...' : 'Sign in'}
                    </CustomButton>
                </form>
            </div>
        </div>
    );
}

function CustomButton({
    children,
    disabled,
    className,
    variant,
    type,
}: {
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    variant?: string;
    type?: 'button' | 'submit' | 'reset';
}) {
    return (
        <button
            type={type}
            disabled={disabled}
            className={`px-[16px] py-[12px] rounded-[6px] font-semibold uppercase tracking-[1] text-white bg-accent shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:bg-accent-hover focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${className ?? ''}`}
        >
            {children}
        </button>
    );
}
