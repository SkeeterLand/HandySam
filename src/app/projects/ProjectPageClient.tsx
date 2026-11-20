'use client';

import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import ProjectGallery from '@/app/components/ProjectGallery';
import type { ProjectGalleryHandle } from '@/app/components/ProjectGallery'; 

interface ProjectPageClientProps {
  project: {
    slug: string;
    subject: string;
    description: string;
    location: string;
    year: string;
    services: string[];
    src: string;
    alt: string;
  };
  galleryImages: string[];
}

export default function ProjectPageClient({
  project,
  galleryImages,
}: ProjectPageClientProps) {
    const galleryRef = useRef<ProjectGalleryHandle>(null);

    return (
        <> 
            <div className="mt-[8px] flex gap-[12px] justify-end flex-wrap">
                <Button variant="accent" size="sm" className="text-center text-[12px] font-bold tracking-[0.6px] uppercase hover:text-white shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_16px_rgba(245,158,11,0.4)] transition-all duration-200" onClick={() => galleryRef.current?.openLightbox()}>
                    View gallery
                </Button>
                {/* <Button asChild variant="gradient" size="sm">
                    <a href="/contact">Get a Free Quote</a>
                </Button>
                <Button asChild variant="outline" size="sm">
                    <a href={`tel:9016748876`}>Call Sam · 901-674-8876</a>
                </Button> */}
            </div>

            <ProjectGallery ref={galleryRef} images={galleryImages} projectTitle={project.subject} />
{/* 
            <div className="mt-[24px]">
                <Link href="/" className="text-muted no-underline text-[15px] font-semibold hover:text-accent transition-color duration-200">
                    ← Back to all projects
                </Link>
            </div> */}
        </>
    );
}
