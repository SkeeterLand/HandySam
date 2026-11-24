import Link from 'next/link';
import { listImageFolders } from '@/app/admin/images/actions';
import { ImageUploadForm } from '@/app/admin/components/ImageUploadForm';
import { SortableFolderGallery } from '@/app/admin/components/SortableFolderGallery';

const IK_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;

export default async function AdminImagesPage({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const sort = (params?.sort as 'name' | 'date-asc' | 'date-desc') ?? 'name';
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
                <ImageGallery folders={folders} sort={sort} />
            </div>

            <Link href="/admin" className="text-muted no-underline hover:text-fg">
                ← Back to dashboard
            </Link>
        </div>
    );
}

function ImageGallery({ folders, sort }: { folders: string[]; sort: string }) {
    const baseUrl = IK_URL_ENDPOINT?.replace(/\/$/, '') || '';
    return (
        <div className="border border-[var(--border)] rounded-[12px] p-[24px] bg-card space-y-[16px]">
            <div className="flex items-center justify-between mb-[8px]">
                <h3 className="text-[16px] font-bold text-fg uppercase tracking-[0.5px]">
                    Existing Images
                </h3>
                <form action="" method="GET" className="flex items-center gap-[4px]">
                    <label className="text-[11px] font-semibold text-muted uppercase tracking-[0.5px]">
                        Sort
                    </label>
                    <select
                        name="sort"
                        defaultValue={sort}
                        className="text-xs border border-[var(--border)] rounded-[6px] px-[6px] py-[2px] bg-card text-fg"
                    >
                        <option value="name">Name (A-Z)</option>
                        <option value="date-desc">Newest first</option>
                        <option value="date-asc">Oldest first</option>
                    </select>
                </form>
            </div>
            {folders.length === 0 && (
                <p className="text-muted">No image folders found.</p>
            )}
            {folders.map((folder) => (
                <SortableFolderGallery key={folder} folder={folder} baseUrl={baseUrl} />
            ))}
        </div>
    );
}
