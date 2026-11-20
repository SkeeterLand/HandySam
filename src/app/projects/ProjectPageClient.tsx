'use client';

import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import ProjectGallery from '@/app/components/ProjectGallery';
import type { ProjectGalleryHandle } from '@/app/components/ProjectGallery';
import ServiceNav from '@/app/components/ServiceNav';

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
            <ServiceNav />
            <div className="mt-[8px] flex gap-[12px] justify-center flex-wrap">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => galleryRef.current?.openLightbox()}
                    className="text-accent border-accent/40 hover:border-accent hover:text-fg"
                >
                    View gallery
                </Button>
                <Button asChild variant="gradient" size="sm">
                    <a href="/contact">Get a Free Quote</a>
                </Button>
                <Button asChild variant="outline" size="sm">
                    <a href={`tel:9016748876`}>Call Sam · 901-674-8876</a>
                </Button>
            </div>

            <ProjectGallery ref={galleryRef} images={galleryImages} projectTitle={project.subject} />

            <div className="mt-[24px]">
                <Link href="/" className="text-muted no-underline text-[15px] font-semibold hover:text-accent transition-color duration-200">
                    ← Back to all projects
                </Link>
            </div>
        </>
    );
}
