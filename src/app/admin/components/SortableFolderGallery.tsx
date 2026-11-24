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

    // dragIndex: index of the item being dragged
    // dropIndex: where it would be inserted (0 to images.length)
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dropIndex, setDropIndex] = useState<number | null>(null);

    useEffect(() => {
        listImagesInFolder(folder).then(setImages);
    }, [folder]);

    const onDragStart = useCallback((e: React.DragEvent, index: number) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(index));
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        setDragIndex(index);
        setDropIndex(index);
    }, []);

    const onDragOver = useCallback(
        (e: React.DragEvent, index: number) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const rect = e.currentTarget.getBoundingClientRect();
            const isBelow = e.clientY > rect.top + rect.height / 2;
            setDropIndex(isBelow ? index + 1 : index);
        },
        []
    );

    const onDrop = useCallback(
        (e: React.DragEvent, index: number) => {
            e.preventDefault();
            const draggedIndex = Number(e.dataTransfer.getData('text/plain'));
            // Compute target synchronously from the element that received the drop
            const rect = e.currentTarget.getBoundingClientRect();
            const isBelow = e.clientY > rect.top + rect.height / 2;
            const targetIndex = isBelow ? index + 1 : index;
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
                        <div
                            key={fileName}
                            className="relative aspect-[1/1] rounded-[8px] overflow-hidden border border-[var(--border)] bg-bg-secondary transition-all duration-150"
                            style={{
                                opacity: isDragging(index) ? 0.45 : 1,
                                border:
                                    isDropTarget(index) && !isDragging(index)
                                        ? '3px dashed #f59e0b'
                                        : '1px solid var(--border)',
                                borderRadius: '8px',
                            }}
                            draggable
                            onDragStart={(e) => onDragStart(e, index)}
                            onDragOver={(e) => onDragOver(e, index)}
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
                            {isDropTarget(index) && !isDragging(index) && (
                                <span className="absolute top-[4px] left-[4px] z-[10] text-[10px] font-bold text-accent bg-white/90 px-[4px] py-[1px] rounded-[3px] border border-accent/30">
                                    Drop
                                </span>
                            )}
                        </div>
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
        </div>
    );
}
