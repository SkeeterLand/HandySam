'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/app/admin/images/actions';
import { Button } from '@/components/ui/Button';

interface ImageUploadFormProps {
    folders: string[];
}

export function ImageUploadForm({ folders }: ImageUploadFormProps) {
    const [state, formAction, isPending] = useActionState(uploadImage, null);
    const [showMessage, setShowMessage] = useState<{ ok: boolean; message: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (state?.ok) {
            setShowMessage({ ok: true, message: 'Image uploaded successfully.' });
            router.replace(window.location.pathname);
        } else if (state?.error) {
            setShowMessage({ ok: false, message: state.error });
        }
    }, [state, router]);

    return (
        <div className="border border-[var(--border)] rounded-[12px] p-[24px] bg-card space-y-[24px]">
            <h3 className="text-[16px] font-bold mb-[8px] text-fg uppercase tracking-[0.5px]">
                Upload Image
            </h3>

            {showMessage && (
                <div
                    className={`p-[10px] rounded-[10px] text-sm ${
                        showMessage.ok
                            ? 'border border-accent/30 bg-accent/10 text-accent'
                            : 'border border-red-500/30 bg-red-500/10 text-red-400'
                    }`}
                >
                    {showMessage.message}
                </div>
            )}

            <form action={formAction} className="space-y-[12px] max-w-[480px]">
                <div className="space-y-[6px]">
                    <label className="block text-[13px] font-semibold text-muted uppercase tracking-[0.5px]">
                        Image Folder
                    </label>
                    <select name="folder" className="w-full px-[14px] py-[14px] bg-card border border-[var(--border)] rounded-[10px] text-fg focus:outline-none focus:border-accent">
                        {folders.map((f) => (
                            <option key={f} value={f}>
                                {f}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-[6px]">
                    <label className="block text-[13px] font-semibold text-muted uppercase tracking-[0.5px]">
                        Image File
                    </label>
                    <input
                        type="file"
                        name="file"
                        accept="image/webp, image/jpeg"
                        className="w-full px-[14px] py-[14px] bg-card border border-[var(--border)] rounded-[10px] text-fg focus:outline-none focus:border-accent"
                        required
                    />
                </div>
                <Button type="submit" disabled={isPending} variant="accent">
                    {isPending ? 'Uploading...' : 'Upload Image'}
                </Button>
            </form>
        </div>
    );
}
