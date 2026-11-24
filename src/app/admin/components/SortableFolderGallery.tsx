'use client';

import { useCallback, useEffect, useState } from 'react';
import { listImagesInFolder, saveSortOrder } from '@/app/admin/images/actions';
import { ImageItem } from './ImageItem';
import { Button } from '@/components/ui/Button';

interface SortableFolderGalleryProps {
    folder: string;
    baseUrl: string;
}

export function SortableFolderGallery({ folder, baseUrl }: SortableFolderGalleryProps) {
    const [images, setImages] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    useEffect(() => {
        listImagesInFolder(folder).then(setImages);
    }, [folder]);

    const COLS = 4; // conceptual columns for up/down movement

    const moveItem = useCallback(
        (from: number, to: number) => {
            setImages((prev) => {
                if (from < 0 || from >= prev.length || to < 0 || to >= prev.length || from === to)
                    return prev;
                const next = [...prev];
                const removed = next.splice(from, 1)[0];
                next.splice(to, 0, removed);
                return next;
            });
        },
        []
    );

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('saving');
        try {
            const result = await saveSortOrder(folder, images);
            if (result.ok) {
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 1500);
            } else {
                setSaveStatus('error');
                setTimeout(() => setSaveStatus('idle'), 3000);
            }
        } catch {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-[12px]">
            <h4 className="text-[13px] font-bold text-accent uppercase tracking-[0.5px]">
                {folder} ({images.length})
            </h4>
            {images.length === 0 ? (
                <p className="text-muted text-sm">No images</p>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[8px]">
                        {images.map((fileName, index) => (
                            <div
                                key={fileName}
                                className="relative aspect-[1/1] rounded-[8px] overflow-hidden border border-[var(--border)] bg-bg-secondary group"
                            >
                                <ImageItem
                                    fileName={fileName}
                                    url={`${baseUrl}/${folder}/${fileName}`}
                                />

                                {/* Movement arrows — appear on hover, positioned at edges */}
                                <div
                                    className="absolute inset-0 flex items-center justify-between px-[2px] py-[2px] pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    {/* Left */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (index > 0) moveItem(index, index - 1);
                                        }}
                                        disabled={index === 0}
                                        className="w-[20px] h-[20px] rounded-full bg-white/95 text-accent text-[10px] font-bold flex items-center justify-center border border-accent/30 shadow-sm hover:bg-accent hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        title="Move left"
                                    >
                                        ←
                                    </button>
                                    {/* Right */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (index < images.length - 1) moveItem(index, index + 1);
                                        }}
                                        disabled={index === images.length - 1}
                                        className="w-[20px] h-[20px] rounded-full bg-white/95 text-accent text-[10px] font-bold flex items-center justify-center border border-accent/30 shadow-sm hover:bg-accent hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        title="Move right"
                                    >
                                        →
                                    </button>
                                </div>

                                {/* Vertical arrows — centered top/bottom */}
                                <div className="absolute top-[1px] left-[50%] -translate-x-[50%] z-[10] flex flex-col gap-[1px] pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const target = index - COLS;
                                            if (target >= 0) moveItem(index, target);
                                        }}
                                        disabled={index < COLS}
                                        className="w-[20px] h-[20px] rounded-full bg-white/95 text-accent text-[10px] font-bold flex items-center justify-center border border-accent/30 shadow-sm hover:bg-accent hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        title="Move up"
                                    >
                                        ↑
                                    </button>
                                </div>
                                <div className="absolute bottom-[1px] left-[50%] -translate-x-[50%] z-[10] flex flex-col gap-[1px] pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const target = index + COLS;
                                            if (target < images.length) moveItem(index, target);
                                        }}
                                        disabled={index + COLS >= images.length}
                                        className="w-[20px] h-[20px] rounded-full bg-white/95 text-accent text-[10px] font-bold flex items-center justify-center border border-accent/30 shadow-sm hover:bg-accent hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                        title="Move down"
                                    >
                                        ↓
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {images.length > 0 && (
                        <div className="flex items-center gap-[8px] pt-[8px]">
                            <Button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving || saveStatus === 'saved'}
                                variant="accent"
                                size="sm"
                            >
                                {saveStatus === 'saved' ? 'Order saved!' : isSaving ? 'Saving...' : 'Save order'}
                            </Button>
                            {saveStatus === 'error' && (
                                <span className="text-[10px] text-red-400 font-medium flex items-center gap-[2px]">
                                    Failed to save
                                </span>
                            )}
                            {saveStatus === 'saved' && (
                                <span className="text-[10px] text-accent font-medium">
                                    Order saved
                                </span>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
