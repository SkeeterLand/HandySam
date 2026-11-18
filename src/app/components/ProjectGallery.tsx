'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
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
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [loaded, setLoaded] = useState<Record<number, boolean>>({});

    const thumbStripRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);

    const prefersReducedMotion = useMemo(() => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);

    // What the main viewer shows — hover preview overrides current index.
    const shownIndex = hoverIndex ?? lightboxIndex;

    const openLightbox = useCallback(() => {
      setLightboxOpen(true);
      requestAnimationFrame(() => setModalVisible(true));
    }, []);

    const closeLightbox = useCallback(() => {
      setModalVisible(false);
      setHoverIndex(null);
      setTimeout(() => {
        setLightboxOpen(false);
        setLightboxIndex(0);
      }, 200);
    }, []);

    const goTo = useCallback((index: number) => {
      setLightboxIndex(index);
      setHoverIndex(null);
    }, []);

    const next = useCallback(() => {
      setLightboxIndex((i) => (i + 1) % images.length);
      setHoverIndex(null);
    }, [images.length]);

    const prev = useCallback(() => {
      setLightboxIndex((i) => (i - 1 + images.length) % images.length);
      setHoverIndex(null);
    }, [images.length]);

    useImperativeHandle(ref, () => ({ openLightbox, closeLightbox }));

    // Body scroll lock
    useEffect(() => {
      if (!lightboxOpen) return;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }, [lightboxOpen]);

    // Keyboard navigation
    useEffect(() => {
      if (!lightboxOpen) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'Home') goTo(0);
        if (e.key === 'End') goTo(images.length - 1);
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [lightboxOpen, closeLightbox, next, prev, goTo, images.length]);

    // Preload adjacent images for snappy navigation
    useEffect(() => {
      if (!lightboxOpen) return;
      const toPreload = [
        images[(lightboxIndex + 1) % images.length],
        images[(lightboxIndex - 1 + images.length) % images.length],
      ];
      toPreload.forEach((src) => {
        if (!src) return;
        const img = new window.Image();
        img.src = src;
      });
    }, [lightboxIndex, lightboxOpen, images]);

    // Auto-scroll active thumbnail into view
    useEffect(() => {
      if (!lightboxOpen) return;
      const strip = thumbStripRef.current;
      if (!strip) return;
      const active = strip.querySelector<HTMLElement>(
        `[data-thumb-index="${lightboxIndex}"]`
      );
      if (active) {
        active.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }, [lightboxIndex, lightboxOpen, prefersReducedMotion]);

    // Focus trap
    useEffect(() => {
      if (!lightboxOpen) return;
      const el = dialogRef.current;
      if (!el) return;
      const focusable = el.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) focusable[0].focus();

      const onKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };
      el.addEventListener('keydown', onKey);
      return () => el.removeEventListener('keydown', onKey);
    }, [lightboxOpen]);

    // Swipe gestures
    const onTouchStart = (e: React.TouchEvent) => {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    };

    const onTouchEnd = (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      const dt = Date.now() - touchStart.current.t;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && dt < 600) {
        dx < 0 ? next() : prev();
      }
      touchStart.current = null;
    };

    const progress = images.length > 1 ? ((lightboxIndex + 1) / images.length) * 100 : 100;

    return (
      <section className="relative overflow-hidden bg-bg-secondary">
        <div className="relative z-10 max-w-[1100px] mx-auto px-[24px]">
          {lightboxOpen && (
            <div
  ref={dialogRef}
  className={cn(
    'fixed inset-0 z-[100] flex items-center justify-center p-[24px] sm:p-[48px]',
    'bg-black/70 backdrop-blur-xl',
    'opacity-100 transition-opacity duration-300'
  )}
  role="dialog"
  aria-modal="true"
  aria-label="Image lightbox"
  onClick={closeLightbox}
>
              {/* ── 1. Cinematic backdrop (blurred current image) ───────── */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Image
                  key={`bg-${images[lightboxIndex]}`}
                  src={images[lightboxIndex]}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover scale-110 blur-[80px] opacity-30 saturate-150 transition-opacity duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-[var(--bg)]/85" />
                <div className="absolute top-[-10%] left-[-10%] w-[200%] h-[200%] rounded-full bg-accent/5 blur-[120px]" />
              </div>

              {/* Top progress bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-fg/5 z-30">
                <div
                  className="h-full bg-accent transition-all duration-300 ease-out shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div
                className={cn(
                  'relative z-10 flex flex-col items-center gap-[20px] max-h-[calc(100vh_-_96px)] w-full',
                  modalVisible
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 translate-y-[4px]',
                  'transition-all duration-300 ease-out'
                )}
              >
                <div
                  className="relative aspect-[4/3] w-full max-w-[860px] rounded-[16px] overflow-visible group"
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Image frame (separate so nav buttons can overhang) */}
                  <div className="relative w-full h-full rounded-[16px] overflow-hidden bg-[var(--bg)] shadow-2xl border border-accent/20">
                    {/* Shimmer while loading */}
                    {!loaded[shownIndex] && (
                      <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary via-bg to-bg-secondary animate-pulse" />
                    )}

                    {/* ── 3. Motion on transition ──────────────────────── */}
                    <Image
                      key={images[shownIndex]}
                      src={images[shownIndex]}
                      alt={`${projectTitle} — photo ${shownIndex + 1}`}
                      fill
                      sizes="90vw"
                      style={{ objectFit: 'contain', background: 'var(--bg)' }}
                      className={cn(
                        'animate-[fadeScale_400ms_ease-out]',
                        loaded[shownIndex] ? 'opacity-100' : 'opacity-0'
                      )}
                      onLoad={() =>
                        setLoaded((p) => ({ ...p, [shownIndex]: true }))
                      }
                      priority
                    />

                    {/* Index badge — accent ring */}
                    <div className="absolute left-[16px] top-[16px] z-20 flex items-center gap-[6px] px-[9px] py-[4px] rounded-full bg-[var(--bg)]/80 backdrop-blur border border-accent/40 text-accent text-[10px] font-bold tracking-[0.06em] uppercase shadow-[0_0_12px_rgba(245,158,11,0.15)] pointer-events-none">
                      <span>{shownIndex + 1}</span>
                      <span className="text-accent/50">/</span>
                      <span>{images.length}</span>
                    </div>

                    <div className="absolute left-[16px] bottom-[16px] z-20 text-fg text-[12px] font-semibold tracking-tight shadow-lg pointer-events-none">
                      {projectTitle}
                    </div>

                    <button
                      onClick={closeLightbox}
                      className="absolute right-[16px] top-[16px] z-30 w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[var(--bg)]/60 backdrop-blur border border-accent/20 text-fg/70 hover:text-accent hover:border-accent/60 hover:shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-all duration-200"
                      aria-label="Close gallery"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  {/* ── 5. Edge-anchored nav buttons ─────────────────── */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prev();
                    }}
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 -left-[24px] z-30',
                      'w-[48px] h-[48px] rounded-full flex items-center justify-center',
                      'bg-[var(--bg)]/90 backdrop-blur-md border border-accent/30 text-fg',
                      'shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]',
                      'transition-all duration-200',
                      'hover:bg-accent hover:text-accent-text-bg hover:border-accent hover:scale-110',
                      'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 max-sm:opacity-100'
                    )}
                    aria-label="Previous image"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      next();
                    }}
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 -right-[24px] z-30',
                      'w-[48px] h-[48px] rounded-full flex items-center justify-center',
                      'bg-[var(--bg)]/90 backdrop-blur-md border border-accent/30 text-fg',
                      'shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]',
                      'transition-all duration-200',
                      'hover:bg-accent hover:text-accent-text-bg hover:border-accent hover:scale-110',
                      'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 max-sm:opacity-100'
                    )}
                    aria-label="Next image"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>

                {/* ── 2. Premium filmstrip + 7. hover preview ─────────── */}
                <div
                  ref={thumbStripRef}
                  className="flex gap-[8px] max-h-[120px] overflow-x-auto overflow-y-visible pt-[4px] pb-[12px] px-[4px] scroll-smooth snap-x snap-mandatory w-full justify-start sm:justify-center scrollbar-none"
                >
                  {images.map((src, i) => {
                    const isActive = i === lightboxIndex;
                    const isHovered = i === hoverIndex;
                    return (
                      <button
                        key={i}
                        data-thumb-index={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          goTo(i);
                        }}
                        onMouseEnter={() => setHoverIndex(i)}
                        onMouseLeave={() => setHoverIndex(null)}
                        onFocus={() => setHoverIndex(i)}
                        onBlur={() => setHoverIndex(null)}
                        className={cn(
                          'relative aspect-square w-[52px] h-[52px] rounded-[10px] overflow-hidden shrink-0 snap-center',
                          'transition-all duration-300 ease-out',
                          isActive
                            ? 'border-2 border-accent scale-110 z-10 shadow-[0_0_24px_-4px_rgba(245,158,11,0.6)]'
                            : isHovered
                            ? 'border border-accent/60 scale-105 opacity-100 grayscale-0'
                            : 'border border-border/20 opacity-50 grayscale-[40%] hover:opacity-100 hover:grayscale-0 hover:scale-105'
                        )}
                        aria-label={`Photo ${i + 1}`}
                        aria-current={isActive}
                      >
                        <Image
                          src={src}
                          alt={`Lightbox thumb ${i + 1}`}
                          fill
                          sizes="52px"
                          style={{ objectFit: 'cover' }}
                          priority={isActive}
                          loading={isActive ? 'eager' : 'lazy'}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Keyframes for image fade-scale ───────────────────────────── */}
        <style jsx global>{`
          @keyframes fadeScale {
            from {
              opacity: 0;
              transform: scale(0.98);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .scrollbar-none {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </section>
    );
  }
);