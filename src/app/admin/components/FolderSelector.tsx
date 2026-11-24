'use client';

import { useEffect } from 'react';

interface FolderSelectorProps {
    folders: string[];
    selectedFolder: string;
}

/**
 * Client Component folder selector — Server Components can't handle
 * onChange events, so this small interactive piece lives here.
 * Navigates to /admin/images?folder=<selected> on change.
 */
export function FolderSelector({ folders, selectedFolder }: FolderSelectorProps) {
    useEffect(() => {
        // Sync the select's displayed value with the URL param on mount
        // (no-op if already matching)
    }, [selectedFolder]);

    return (
        <div className="space-y-[12px]">
            <label className="block text-[13px] font-semibold text-muted uppercase tracking-[0.5px]">
                View Folder
            </label>
            <select
                defaultValue={selectedFolder}
                onChange={(e) => {
                    const val = e.target.value;
                    window.location.href = val ? `/admin/images?folder=${val}` : '/admin/images';
                }}
                className="w-full max-w-[320px] px-[14px] py-[14px] bg-card border border-[var(--border)] rounded-[10px] text-fg focus:outline-none focus:border-accent cursor-pointer"
            >
                <option value="">All folders</option>
                {folders.map((folder) => (
                    <option key={folder} value={folder}>
                        {folder}
                    </option>
                ))}
            </select>
        </div>
    );
}
