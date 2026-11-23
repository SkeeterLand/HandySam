import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { uploadImage, listImageFolders, listImagesInFolder } from '@/app/admin/images/actions';

export default async function AdminImagesPage() {
    const folders = await listImageFolders();

    return (
        <div className="space-y-[32px]">
            <h1 className="text-[32px] font-black tracking-[-1px] text-fg">
                Images
            </h1>
            <p className="text-muted text-[16px]">
                Upload images to <code className="font-mono text-sm">public/images/</code>.
                The manifest is regenerated automatically after each upload.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[32px]">
                <ImageUploadForm folders={folders} />
                <ImageGallery folders={folders} />
            </div>

            <Link href="/admin" className="text-muted no-underline hover:text-fg">
                ← Back to dashboard
            </Link>
        </div>
    );
}

function ImageUploadForm({ folders }: { folders: string[] }) {
    return (
        <div className="border border-[var(--border)] rounded-[12px] p-[24px] bg-card space-y-[24px]">
            <h3 className="text-[16px] font-bold mb-[8px] text-fg uppercase tracking-[0.5px]">
                Upload Image
            </h3>
            <form action={uploadImage} className="space-y-[12px] max-w-[480px]">
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
                <Button type="submit" variant="accent">
                    Upload Image
                </Button>
            </form>
        </div>
    );
}

function ImageGallery({ folders }: { folders: string[] }) {
    return (
        <div className="border border-[var(--border)] rounded-[12px] p-[24px] bg-card space-y-[16px]">
            <h3 className="text-[16px] font-bold mb-[8px] text-fg uppercase tracking-[0.5px]">
                Existing Images
            </h3>
            {folders.length === 0 && (
                <p className="text-muted">No image folders found.</p>
            )}
            {folders.map((folder) => (
                <FolderGallery key={folder} folder={folder} />
            ))}
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
