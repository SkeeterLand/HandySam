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
    const [hoveredTargetIndex, setHoveredTargetIndex] = useState<number | null>(null);

    useEffect(() => {
        listImagesInFolder(folder).then(setImages);
    }, [folder]);

    const COLS = 4; // conceptual columns for up/down/diagonal movement

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

    const canLeft = (index: number) => index > 0 && index % COLS !== 0;
    const canRight = (index: number) => index < images.length - 1 && index % COLS !== COLS - 1;
    const canUp = (index: number) => index >= COLS;
    const canDown = (index: number) => index + COLS < images.length;

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

    const arrowBtn = (
        disabled: boolean,
        onClick: () => void,
        label: string,
        targetIndex: number | null,
    ) => (
        <button
            onMouseEnter={() => setHoveredTargetIndex(targetIndex)}
            onMouseLeave={() => setHoveredTargetIndex(null)}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            }}
            disabled={disabled}
            className={`w-[20px] h-[20px] rounded-full bg-white/95 text-accent text-[10px] font-bold flex items-center justify-center border border-accent/30 shadow-sm hover:bg-accent hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                disabled ? '' : ''
            }`}
            title={label}
        >
            {label}
        </button>
    );

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
                                className="relative aspect-[1/1] rounded-[8px] overflow-hidden bg-bg-secondary group"
                                style={{
                                    border:
                                        hoveredTargetIndex === index
                                            ? '3px dashed #f59e0b'
                                            : '1px solid var(--border)',
                                    borderRadius: '8px',
                                }}
                            >
                                <ImageItem
                                    fileName={fileName}
                                    url={`${baseUrl}/${folder}/${fileName}`}
                                />

                                {/* Left edge arrow */}
                                <div className="absolute left-[1px] top-[50%] -translate-y-[50%] z-[10] pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {arrowBtn(
                                        !canLeft(index),
                                        () => moveItem(index, index - 1),
                                        '←',
                                        index - 1
                                    )}
                                </div>
                                {/* Right edge arrow */}
                                <div className="absolute right-[1px] top-[50%] -translate-y-[50%] z-[10] pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {arrowBtn(
                                        !canRight(index),
                                        () => moveItem(index, index + 1),
                                        '→',
                                        index + 1
                                    )}
                                </div>
                                {/* Top center arrow */}
                                <div className="absolute top-[1px] left-[50%] -translate-x-[50%] z-[10] pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {arrowBtn(
                                        !canUp(index),
                                        () => moveItem(index, index - COLS),
                                        '↑',
                                        index - COLS
                                    )}
                                </div>
                                {/* Bottom center arrow */}
                                <div className="absolute bottom-[1px] left-[50%] -translate-x-[50%] z-[10] pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {arrowBtn(
                                        !canDown(index),
                                        () => moveItem(index, index + COLS),
                                        '↓',
                                        index + COLS
                                    )}
                                </div>
                                {/* Top-left corner arrow */}
                                <div className="absolute top-[2px] left-[2px] z-[10] pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {arrowBtn(
                                        !canLeft(index) || !canUp(index),
                                        () => moveItem(index, index - COLS - 1),
                                        '↖',
                                        index - COLS - 1
                                    )}
                                </div>
                                {/* Top-right corner arrow */}
                                <div className="absolute top-[2px] right-[2px] z-[10] pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {arrowBtn(
                                        !canRight(index) || !canUp(index),
                                        () => moveItem(index, index - COLS + 1),
                                        '↗',
                                        index - COLS + 1
                                    )}
                                </div>
                                {/* Bottom-left corner arrow */}
                                <div className="absolute bottom-[2px] left-[2px] z-[10] pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {arrowBtn(
                                        !canLeft(index) || !canDown(index),
                                        () => moveItem(index, index + COLS - 1),
                                        '↙',
                                        index + COLS - 1
                                    )}
                                </div>
                                {/* Bottom-right corner arrow */}
                                <div className="absolute bottom-[2px] right-[2px] z-[10] pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {arrowBtn(
                                        !canRight(index) || !canDown(index),
                                        () => moveItem(index, index + COLS + 1),
                                        '↘',
                                        index + COLS + 1
                                    )}
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
