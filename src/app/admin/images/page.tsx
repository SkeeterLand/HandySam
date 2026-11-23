import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default async function AdminImagesPage() {
    return (
        <div className="space-y-[32px]">
            <h1 className="text-[32px] font-black tracking-[-1px] text-fg">
                Images
            </h1>
            <p className="text-muted text-[16px]">
                Upload and manage gallery images. Images are stored in
                <code className="font-mono text-sm">public/images/</code> and the
                manifest is regenerated automatically.
            </p>

            <div className="border border-[var(--border)] rounded-[12px] p-[24px] bg-card">
                <h3 className="text-[16px] font-bold mb-[16px] text-fg uppercase tracking-[0.5px]">
                    Upload Image
                </h3>
                <form className="space-y-[12px] max-w-[480px]">
                    <div className="space-y-[6px]">
                        <label className="block text-[13px] font-semibold text-muted uppercase tracking-[0.5px]">
                            Image Folder
                        </label>
                        <select
                            name="folder"
                            className="w-full px-[14px] py-[14px] bg-card border border-[var(--border)] rounded-[10px] text-fg focus:outline-none focus:border-accent"
                        >
                            <option>bathroom</option>
                            <option>ceiling/coffered</option>
                            <option>ceiling/tongueNgroove</option>
                            <option>office</option>
                            <option>other</option>
                            <option>porch/screened</option>
                            <option>stairs</option>
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
                        />
                    </div>
                    <Button type="submit" variant="accent">
                        Upload Image
                    </Button>
                </form>
                <p className="mt-[16px] text-[13px] text-muted">
                    Note: image upload endpoint is not yet wired up. Use{' '}
                    <code className="font-mono text-sm">
                        scripts/generate-image-manifest.mjs
                    </code>{' '}
                    after adding images manually to <code className="font-mono text-sm">
                        public/images/
                    </code>.
                </p>
            </div>

            <Link href="/admin" className="text-muted no-underline hover:text-fg">
                ← Back to dashboard
            </Link>
        </div>
    );
}
