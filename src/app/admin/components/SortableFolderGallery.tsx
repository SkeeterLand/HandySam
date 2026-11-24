'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { listImagesInFolder, saveSortOrder } from '@/app/admin/images/actions';
import { ImageItem } from './ImageItem';
import { Button } from '@/components/ui/Button';

interface SortableFolderGalleryProps {
    folder: string;
    baseUrl: string;
}

export function SortableFolderGallery({ folder, baseUrl }: SortableFolderGalleryProps) {
    const [images, setImages] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    useEffect(() => {
        listImagesInFolder(folder).then(setImages);
    }, [folder]);

    // HTML5 drag-and-drop state
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const onDragStart = useCallback((e: React.DragEvent, index: number) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(index));
        setDragIndex(index);
    }, []);

    const onDragOver = useCallback(
        (e: React.DragEvent, index: number) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            setHoverIndex(index);
        },
        []
    );

    const onDragLeave = useCallback(() => {
        setHoverIndex(null);
    }, []);

    const onDrop = useCallback(
        (e: React.DragEvent, index: number) => {
            e.preventDefault();
            const draggedIndex = Number(e.dataTransfer.getData('text/plain'));
            if (draggedIndex === index || draggedIndex === null) {
                setDragIndex(null);
                setHoverIndex(null);
                return;
            }

            setImages((current) => {
                const next = [...current];
                const removed = next.splice(draggedIndex, 1)[0];
                next.splice(index, 0, removed);
                return next;
            });

            setDragIndex(null);
            setHoverIndex(null);
        },
        []
    );

    const onDragEnd = useCallback(() => {
        setDragIndex(null);
        setHoverIndex(null);
    }, []);

    const handleSave = async () => {
        startTransition(async () => {
            setSaveStatus('saving');
            try {
                const result = await saveSortOrder(folder, images);
                if (result.ok) {
                    setSaveStatus('saved');
                    setTimeout(() => setSaveStatus('idle'), 1500);
                } else {
                    setSaveStatus('error');
                    setTimeout(() => setSaveStatus('idle'), 2000);
                }
            } catch {
                setSaveStatus('error');
                setTimeout(() => setSaveStatus('idle'), 2000);
            }
        });
    };

    return (
        <div className="space-y-[12px]">
            <h4 className="text-[13px] font-bold text-accent uppercase tracking-[0.5px]">
                {folder} ({images.length})
            </h4>
            {images.length === 0 ? (
                <p className="text-muted text-sm">No images</p>
            ) : (
                <div
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[8px]"
                >
                    {images.map((fileName, index) => (
                        <div
                            key={fileName}
                            className="relative aspect-[1/1] rounded-[8px] overflow-hidden border border-[var(--border)] bg-bg-secondary"
                            draggable
                            onDragStart={(e) => onDragStart(e, index)}
                            onDragOver={(e) => onDragOver(e, index)}
                            onDragLeave={onDragLeave}
                            onDrop={(e) => onDrop(e, index)}
                            onDragEnd={onDragEnd}
                        >
                            <ImageItem
                                fileName={fileName}
                                url={`${baseUrl}/${folder}/${fileName}`}
                                dragIndex={dragIndex}
                                hoverIndex={hoverIndex}
                                currentIndex={index}
                            />
                        </div>
                    ))}
                </div>
            )}

            {images.length > 0 && (
                <div className="flex items-center gap-[8px] pt-[8px]">
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isPending || saveStatus === 'saved'}
                        variant="accent"
                        size="sm"
                    >
                        {saveStatus === 'saved' ? 'Order saved!' : isPending ? 'Saving...' : 'Save order'}
                    </Button>
                    {saveStatus === 'error' && (
                        <span className="text-[11px] text-red-400 font-medium">
                            Failed to save
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

