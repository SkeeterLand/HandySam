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

    // Drag-and-drop state
    // dragIndex: index of the item being dragged
    // dropIndex: where the item would be inserted (0 to images.length)
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dropIndex, setDropIndex] = useState<number | null>(null);

    const onDragStart = useCallback((e: React.DragEvent, index: number) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(index));
        // No custom drag image — keep native ghost image under cursor
        setDragIndex(index);
        setDropIndex(index);
    }, []);

    const onDragEnter = useCallback((e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDropIndex(index);
    }, []);

    const onDragOver = useCallback(
        (e: React.DragEvent, index: number) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            setDropIndex(index);
        },
        []
    );

    const onDrop = useCallback(
        (e: React.DragEvent, targetIndex: number) => {
            e.preventDefault();
            const draggedIndex = Number(e.dataTransfer.getData('text/plain'));
            if (draggedIndex === null || draggedIndex === targetIndex) {
                setDragIndex(null);
                setDropIndex(null);
                return;
            }

            setImages((current) => {
                const next = [...current];
                const removed = next.splice(draggedIndex, 1)[0];
                const adjusted = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
                next.splice(adjusted, 0, removed);
                return next;
            });

            setDragIndex(null);
            setDropIndex(null);
        },
        []
    );

    const onDragEnd = useCallback(() => {
        setDragIndex(null);
        setDropIndex(null);
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

    const isDragging = (index: number) => dragIndex !== null && index === dragIndex;
    const isDropTarget = (index: number) => dropIndex !== null && index === dropIndex;

    return (
        <div className="space-y-[12px]">
            <h4 className="text-[13px] font-bold text-accent uppercase tracking-[0.5px]">
                {folder} ({images.length})
            </h4>
            {images.length === 0 ? (
                <p className="text-muted text-sm">No images</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[8px]">
                    {images.map((fileName, index) => (
                        <>
                            {/* Drop slot before this item */}
                            {isDropTarget(index) && (
                                <div
                                    className="aspect-[1/1] rounded-[8px] border-[2px] border-dashed border-accent bg-accent/10"
                                    style={{ visibility: dragIndex === index ? 'hidden' : 'visible' }}
                                />
                            )}
                            <div
                                key={fileName}
                                className="relative aspect-[1/1] rounded-[8px] overflow-hidden border border-[var(--border)] bg-bg-secondary transition-transform duration-100"
                                style={{
                                    transform: dragIndex !== null && index > dragIndex && index < (dropIndex ?? index)
                                        ? 'translateX(-4px)'
                                        : dragIndex !== null && index < dragIndex && index > (dropIndex ?? index)
                                        ? 'translateX(4px)'
                                        : 'none',
                                }}
                                draggable
                                onDragStart={(e) => onDragStart(e, index)}
                                onDragEnter={(e) => onDragEnter(e, index)}
                                onDragOver={(e) => onDragOver(e, index)}
                                onDrop={(e) => onDrop(e, index)}
                                onDragEnd={onDragEnd}
                            >
                                <ImageItem
                                    fileName={fileName}
                                    url={`${baseUrl}/${folder}/${fileName}`}
                                    dragIndex={dragIndex}
                                    hoverIndex={dropIndex}
                                    currentIndex={index}
                                />
                                {isDragging(index) && (
                                    <span className="absolute -top-[2px] -right-[2px] z-[10] text-[10px] font-bold text-white bg-accent/90 px-[4px] py-[1px] rounded-[3px]">
                                        Moving
                                    </span>
                                )}
                            </div>
                            {/* Drop slot after the last item */}
                            {index === images.length - 1 && isDropTarget(images.length) && (
                                <div
                                    className="aspect-[1/1] rounded-[8px] border-[2px] border-dashed border-accent bg-accent/10"
                                />
                            )}
                        </>
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
