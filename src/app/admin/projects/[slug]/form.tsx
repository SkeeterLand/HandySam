'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { saveProject } from '@/app/admin/projects/actions';

interface ProjectEditFormProps {
    project: {
        slug: string;
        src: string;
        alt: string;
        subject: string;
        description: string;
        services: string[];
        location: string;
        year: string;
        imageFolder: string;
    };
}

export default function ProjectEditForm({
    project,
}: ProjectEditFormProps) {
    const [state, formAction, isPending] = useActionState(saveProject, null);

    return (
        <div className="space-y-[32px]">
            <div className="flex items-center justify-between">
                <h1 className="text-[32px] font-black tracking-[-1px] text-fg">
                    Edit Project
                </h1>
                <Link href="/admin/projects" className="text-muted no-underline hover:text-fg">
                    ← Back to projects
                </Link>
            </div>

            {state?.error && (
                <div className="p-[12px] rounded-[10px] border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                    {state.error}
                </div>
            )}
            {state?.ok && (
                <div className="p-[12px] rounded-[10px] border border-accent/30 bg-accent/10 text-accent text-sm">
                    Project saved successfully.
                </div>
            )}

            <form
                action={formAction}
                className="space-y-[24px]"
            >
                <TextField
                    label="Slug (URL, e.g. tongue-and-groove-ceiling)"
                    name="slug"
                    defaultValue={project.slug}
                    required
                />
                <TextField
                    label="Image Source URL"
                    name="src"
                    defaultValue={project.src}
                    required
                />
                <TextField label="Alt Text" name="alt" defaultValue={project.alt} />
                <TextField
                    label="Subject (page title)"
                    name="subject"
                    defaultValue={project.subject}
                    required
                />
                <TextArea
                    label="Description"
                    name="description"
                    defaultValue={project.description}
                />
                <TextField
                    label="Services (comma-separated)"
                    name="services"
                    defaultValue={project.services.join(', ')}
                    placeholder="e.g. carpentry, painting, plumbing"
                />
                <TextField label="Location" name="location" defaultValue={project.location} />
                <TextField label="Year" name="year" defaultValue={project.year} />
                <TextField
                    label="Image Folder"
                    name="imageFolder"
                    defaultValue={project.imageFolder}
                    placeholder="e.g. bathroom, office"
                />

                <div className="flex gap-[12px]">
                    <Button
                        type="submit"
                        disabled={isPending}
                        variant="accent"
                    >
                        {isPending ? 'Saving...' : 'Save Project'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

function TextField({
    label,
    name,
    defaultValue,
    required,
    placeholder,
}: {
    label: string;
    name: string;
    defaultValue: string;
    required?: boolean;
    placeholder?: string;
}) {
    return (
        <div className="space-y-[6px]">
            <label className="block text-[13px] font-semibold text-muted uppercase tracking-[0.5px]">
                {label}
            </label>
            <input
                name={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
                required={required}
                className="w-full px-[14px] py-[14px] bg-card border border-[var(--border)] rounded-[10px] text-fg focus:outline-none focus:border-accent transition-[border-color] duration-200"
            />
        </div>
    );
}

function TextArea({
    label,
    name,
    defaultValue,
}: {
    label: string;
    name: string;
    defaultValue: string;
}) {
    return (
        <div className="space-y-[6px]">
            <label className="block text-[13px] font-semibold text-muted uppercase tracking-[0.5px]">
                {label}
            </label>
            <textarea
                name={name}
                defaultValue={defaultValue}
                rows={4}
                className="w-full px-[14px] py-[14px] bg-card border border-[var(--border)] rounded-[10px] text-fg focus:outline-none focus:border-accent transition-[border-color] duration-200"
            />
        </div>
    );
}
