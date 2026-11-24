'use client';

import { useCallback, useState } from 'react';

interface ImageItemProps {
    fileName: string;
    url: string;
}

export function ImageItem({ fileName, url }: ImageItemProps) {
    const [copied, setCopied] = useState(false);

    const copyUrl = useCallback(() => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, [url]);

    return (
        <div
            className="relative aspect-[1/1] rounded-[8px] overflow-hidden border border-[var(--border)] bg-bg-secondary group cursor-pointer"
            onClick={copyUrl}
            title={`Click to copy ImageKit URL: ${url}`}
        >
            <img
                src={url}
                alt={fileName}
                className="w-full h-full object-cover"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-[2px]">
                {copied ? (
                    <span className="text-[10px] font-bold text-white bg-black/60 px-[4px] py-[2px] rounded-[4px]">
                        Copied!
                    </span>
                ) : (
                    <span className="text-[10px] font-bold text-white bg-black/40 px-[4px] py-[2px] rounded-[4px]">
                        Copy URL
                    </span>
                )}
                <span className="text-[9px] font-medium text-white bg-black/60 px-[2px] py-[1px] rounded-[3px] truncate max-w-[80px]">
                    {fileName}
                </span>
            </div>
        </div>
    );
}
