'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
    const [saveError, setSaveError] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const itemRects = useRef<Map<string, DOMRect>>(new Map());

    // Drag-and-drop state
    // dragIndex: index of the item being dragged
    // dropIndex: where the item would be inserted (0 to images.length)
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dropIndex, setDropIndex] = useState<number | null>(null);

    useEffect(() => {
        listImagesInFolder(folder).then(setImages);
    }, [folder]);

    // Keep rects updated for drop-target hit testing
    useEffect(() => {
        itemRects.current.clear();
        if (!containerRef.current) return;
        containerRef.current.querySelectorAll<HTMLElement>('[data-drop-item]').forEach((el) => {
            itemRects.current.set(el.dataset.dropItem!, el.getBoundingClientRect());
        });
    }, [images]);

    // Window-level drag tracking so drop target is accurate even in grid gaps
    useEffect(() => {
        if (dragIndex === null) return;

        const handleDrag = (e: DragEvent) => {
            const x = e.clientX;
            const y = e.clientY;
            const list = Array.from(itemRects.current.entries());

            // Find which item rect the cursor is over
            let targetIndex: number | null = null;
            for (const [key, rect] of list) {
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    targetIndex = Number(key);
                    break;
                }
            }

            // If not over any item, figure out if cursor is above/below the whole list
            if (targetIndex === null && list.length > 0) {
                const first = list[0][1];
                const last = list[list.length - 1][1];
                if (y < first.top) {
                    targetIndex = 0;
                } else if (y > last.bottom) {
                    targetIndex = images.length;
                }
            }

            if (targetIndex !== null && targetIndex !== dropIndex) {
                setDropIndex(targetIndex);
            }
        };

        const handleDragEnd = () => {
            setDragIndex(null);
            setDropIndex(null);
        };

        window.addEventListener('dragover', handleDrag);
        window.addEventListener('dragend', handleDragEnd);
        return () => {
            window.removeEventListener('dragover', handleDrag);
            window.removeEventListener('dragend', handleDragEnd);
        };
    }, [dragIndex, images.length, dropIndex]);

    const onDragStart = useCallback((e: React.DragEvent, index: number) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(index));
        // Use a tiny transparent drag image so native ghost still shows
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        setDragIndex(index);
        setDropIndex(index);
    }, []);

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

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('saving');
        setSaveError(null);
        try {
            const result = await saveSortOrder(folder, images);
            if (result.ok) {
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 1500);
            } else {
                setSaveStatus('error');
                setSaveError(result.error ?? 'Unknown error');
                setTimeout(() => setSaveStatus('idle'), 3000);
            }
        } catch (err) {
            setSaveStatus('error');
            setSaveError(err instanceof Error ? err.message : 'Unknown error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } finally {
            setIsSaving(false);
        }
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
                <div
                    ref={containerRef}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[8px]"
                >
                    {images.map((fileName, index) => (
                        <>
                            {/* Drop slot before this item */}
                            {isDropTarget(index) && (
                                <div
                                    data-drop-slot={String(index)}
                                    className="aspect-[1/1] rounded-[8px] border-[3px] border-dashed border-accent bg-accent/20"
                                    style={{ visibility: dragIndex === index ? 'hidden' : 'visible' }}
                                />
                            )}
                            <div
                                key={fileName}
                                data-drop-item={String(index)}
                                className="relative aspect-[1/1] rounded-[8px] overflow-hidden border border-[var(--border)] bg-bg-secondary transition-all duration-100"
                                style={{
                                    transform:
                                        dragIndex !== null &&
                                        index > dragIndex &&
                                        index < (dropIndex ?? index)
                                            ? 'translateX(-3px)'
                                            : dragIndex !== null &&
                                              index < dragIndex &&
                                              index > (dropIndex ?? index)
                                            ? 'translateX(3px)'
                                            : 'none',
                                    scale: isDropTarget(index) && !isDragging(index) ? 1.05 : 1,
                                    zIndex: isDropTarget(index) && !isDragging(index) ? 5 : 1,
                                    opacity: isDragging(index) ? 0.5 : 1,
                                }}
                                draggable
                                onDragStart={(e) => onDragStart(e, index)}
                                onDrop={(e) => onDrop(e, index)}
                            >
                                <ImageItem
                                    fileName={fileName}
                                    url={`${baseUrl}/${folder}/${fileName}`}
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
                                    data-drop-slot={String(images.length)}
                                    className="aspect-[1/1] rounded-[8px] border-[3px] border-dashed border-accent bg-accent/20"
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
                        disabled={isSaving || saveStatus === 'saved'}
                        variant="accent"
                        size="sm"
                    >
                        {saveStatus === 'saved' ? 'Order saved!' : isSaving ? 'Saving...' : 'Save order'}
                    </Button>
                    {saveStatus === 'error' && (
                        <span className="text-[10px] text-red-400 font-medium flex items-center gap-[2px]">
                            Failed to save: {saveError}
                        </span>
                    )}
                    {saveStatus === 'saved' && (
                        <span className="text-[10px] text-accent font-medium">
                            Order saved
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
