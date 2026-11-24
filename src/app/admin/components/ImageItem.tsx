'use client';

import { useCallback, useState } from 'react';

interface ImageItemProps {
    folder: string;
    fileName: string;
    url: string;
}

export function ImageItem({ folder, fileName, url }: ImageItemProps) {
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
            <div className="absolute inset-0 bg-black/20 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {copied ? (
                    <span className="text-[10px] font-bold text-white bg-black/60 px-[4px] py-[2px] rounded-[4px]">
                        Copied!
                    </span>
                ) : (
                    <span className="text-[10px] font-bold text-white bg-black/40 px-[4px] py-[2px] rounded-[4px]">
                        Copy URL
                    </span>
                )}
            </div>
        </div>
    );
}
