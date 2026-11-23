import Link from 'next/link';
import { listImageFolders, listImagesInFolder } from '@/app/admin/images/actions';
import { ImageUploadForm } from '@/app/admin/components/ImageUploadForm';

export default async function AdminImagesPage() {
    const folders = await listImageFolders();

    return (
        <div className="space-y-[32px]">
            <h1 className="text-[32px] font-black tracking[-1px] text-fg">
                Images
            </h1>
            <p className="text-muted text-[16px]">
                Upload images to <code className="font-mono text-sm">public/images/</code>.
                The manifest is regenerated automatically after each upload.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[32px]">
                <ImageUploadForm folders={folders} />
            </div>

            <Link href="/admin" className="text-muted no-underline hover:text-fg">
                ← Back to dashboard
            </Link>
        </div>
    );
}

async function FolderGallery({ folder }: { folder: string }) {
    const images = await listImagesInFolder(folder);

    return (
        <div className="space-y-[12px]">
            <h4 className="text-[13px] font-bold text-accent uppercase tracking-[0.5px]">
                {folder} ({images.length})
            </h4>
            {images.length === 0 ? (
                <p className="text-muted text-sm">No images</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[8px]">
                    {images.map((file) => (
                        <div
                            key={file}
                            className="aspect-[1/1] rounded-[8px] overflow-hidden border border-[var(--border)] bg-bg-secondary"
                        >
                            <img
                                src={`/images/${folder}/${file}`}
                                alt={file}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
