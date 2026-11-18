'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ProjectGalleryProps {
  images: string[];
  projectTitle: string;
}

export interface ProjectGalleryHandle {
  openLightbox: () => void;
  closeLightbox: () => void;
}

export default forwardRef<ProjectGalleryHandle, ProjectGalleryProps>(
  function ProjectGallery({ images, projectTitle }, ref) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    const openLightbox = useCallback(() => {
      setLightboxOpen(true);
      requestAnimationFrame(() => setModalVisible(true));
    }, []);

    const closeLightbox = useCallback(() => {
      setModalVisible(false);
      setTimeout(() => {
        setLightboxOpen(false);
        setLightboxIndex(0);
      }, 200);
    }, []);

    const goTo = useCallback((index: number) => {
      setLightboxIndex(index);
    }, []);

    const next = useCallback(() => {
      setLightboxIndex((i) => (i + 1) % images.length);
    }, [images.length]);

    const prev = useCallback(() => {
      setLightboxIndex((i) => (i - 1 + images.length) % images.length);
    }, [images.length]);

    useImperativeHandle(ref, () => ({
      openLightbox,
      closeLightbox,
    }));

    // Body scroll lock while modal is open.
    useEffect(() => {
      if (!lightboxOpen) return;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }, [lightboxOpen]);

    useEffect(() => {
      if (!lightboxOpen) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [lightboxOpen, closeLightbox, next, prev]);

    return (
      <section className="relative overflow-hidden bg-bg-secondary">
        <div className="relative z-10 max-w-[1100px] mx-auto px-[24px]">

          {/* True modal lightbox */}
          {lightboxOpen && (
            <div
              className="fixed inset-0 z-[100] bg-[var(--bg)]/95 flex items-center justify-center p-[24px] sm:p-[48px] opacity-100 transition-opacity duration-300 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-label="Image lightbox"
              onClick={closeLightbox}
            >
              <div
                className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg)]/95 to-[var(--bg)] pointer-events-none"
              />
              {/* Subtle accent glow behind modal content */}
              <div
                className="absolute top-[-10%] left-[-10%] w-[200%] h-[200%] rounded-full bg-accent/5 blur-[120px] -z-10 pointer-events-none"
              />
              <div
                className={cn(
                  'relative z-10 flex flex-col items-center gap-[20px] max-h-[calc(100vh_-_96px)] w-full',
                  modalVisible
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 translate-y-[4px]',
                  'transition-all duration-300 ease-out'
                )}
              >
                <div className="relative aspect-[4/3] w-full max-w-[860px] rounded-[16px] overflow-hidden bg-[var(--bg)] shadow-2xl border border-accent/20 group">
                  <Image
                    src={images[lightboxIndex]}
                    alt={`${projectTitle} — photo ${lightboxIndex + 1}`}
                    fill
                    sizes="90vw"
                    style={{ objectFit: 'contain', background: 'var(--bg)' }}
                    className="transition-opacity duration-200 ease-in-out"
                    priority
                  />
                  {/* Index badge — accent ring */}
                  <div className="absolute left-[16px] top-[16px] z-20 flex items-center gap-[6px] px-[9px] py-[4px] rounded-full bg-[var(--bg)]/80 backdrop-blur border border-accent/40 text-accent text-[10px] font-bold tracking-[0.06em] uppercase shadow-[0_0_12px_rgba(245,158,11,0.15)] pointer-events-none">
                    <span>{lightboxIndex + 1}</span>
                    <span className="text-accent/50">/</span>
                    <span>{images.length}</span>
                  </div>
                  <div className="absolute left-[16px] bottom-[16px] z-20 text-fg text-[12px] font-semibold tracking-tight shadow-lg pointer-events-none">
                    {projectTitle}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="absolute left-[12px] top-1/2 -translate-y-1/2 z-20 w-[40px] h-[40px] rounded-full bg-fg/10 backdrop-blur border border-accent/20 text-fg flex items-center justify-center hover:bg-accent hover:border-accent hover:text-accent-text-bg transition-all duration-200 backdrop-blur-sm shadow-lg"
                    aria-label="Previous image"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="absolute right-[12px] top-1/2 -translate-y-1/2 z-20 w-[40px] h-[40px] rounded-full bg-fg/10 backdrop-blur border border-accent/20 text-fg flex items-center justify-center hover:bg-accent hover:border-accent hover:text-accent-text-bg transition-all duration-200 backdrop-blur-sm shadow-lg"
                    aria-label="Next image"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                  <button
                    onClick={closeLightbox}
                    className="absolute right-[16px] top-[16px] z-30 w-[10] h-[10] text-fg/60 hover:text-accent hover:shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-all duration-200"
                    aria-label="Close gallery"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-wrap justify-center gap-[6px] max-h-[120px] overflow-y-auto pb-[16px]">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); goTo(i); }}
                      className={cn(
                        'relative aspect-[1/1] w-[48px] h-[48px] rounded-[8px] overflow-hidden border border-transparent bg-bg-secondary',
                        'transition-all duration-200',
                        i === lightboxIndex
                          ? 'border-accent ring-[2px] ring-accent ring-offset-1 shadow-[0_0_0_3px_rgba(245,158,11,0.25)] bg-accent/5'
                          : 'border-border/30 hover:border-accent/40 hover:bg-accent/5'
                    )}
                    aria-label={`Photo ${i + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`Lightbox thumb ${i + 1}`}
                      fill
                      sizes="48px"
                      style={{ objectFit: 'cover' }}
                      priority={i === lightboxIndex}
                      loading={i === lightboxIndex ? 'eager' : 'lazy'}
                    />
                  </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }
);
