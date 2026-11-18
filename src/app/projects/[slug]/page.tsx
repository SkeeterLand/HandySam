import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { projects } from '@/lib/data';
import { listProjectImages } from '@/lib/images';
import ProjectPageClient from '@/app/projects/ProjectPageClient';

export async function generateStaticParams() {
    return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    const folder = project.imageFolder;
    const galleryImages = folder ? listProjectImages(folder) : [];

    return (
        <section className="py-[60px]_0_[100px] max-w-1100 mx-auto px-[24px]">
            <div className="relative aspect-[16/9] rounded-[20px] overflow-hidden bg-bg-secondary mb-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
                <Image
                    src={project.src}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 1200px"
                    style={{ objectFit: 'cover' }}
                    priority
                />
                <div className="absolute inset-0 flex flex-col justify-end p-[40px] text-white bg-[linear-gradient(to_top,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.35)_40%,transparent_100%)]">
                    <p className="m-0 mb-[10px] text-[12px] font-bold tracking-[0.14em] uppercase text-accent">
                        {project.location} · {project.year}
                    </p>
                    <h1 className="m-0 text-[clamp(32px,5vw,48px)] font-black tracking-[-1px] leading-1.15 mb-[14px] text-fg">
                        {project.subject}
                    </h1>
                    <p className="m-0 text-[17px] leading-1.7 text-[rgba(232,232,240,0.9)] max-w-[600px]">
                        {project.description}
                    </p>
                    <div className="mt-[16px] flex flex-wrap gap-[8px]">
                        {project.services.map((s) => (
                            <span key={s} className="text-[11px] font-semibold tracking-[0.5px] uppercase text-accent border border-accent/30 px-[10px] py-[3px] rounded-[4px]">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-[48px]">
                <div>
                    <h2 className="text-[28px] font-black tracking-[-0.5px] mb-[16px] text-fg">About this project</h2>
                    <p className="text-[16px] text-muted leading-1.8 mb-[16px]">{project.description}</p>
                    <p className="text-[16px] text-muted leading-1.8 mb-[16px]">
                        Services performed: {project.services.join(', ')}.
                    </p>
                </div>

                <ProjectPageClient project={project} galleryImages={galleryImages} />
            </div>
        </section>
    );
}
