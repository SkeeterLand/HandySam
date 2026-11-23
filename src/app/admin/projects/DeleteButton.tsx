'use client';

import { removeProject } from '@/app/admin/projects/actions';

export function DeleteProjectButton({
    slug,
    subject,
}: {
    slug: string;
    subject: string;
}) {
    return (
        <form action={removeProject} className="inline">
            <input type="hidden" name="slug" defaultValue={slug} />
            <button
                type="submit"
                className="text-red-400 hover:text-red-300 no-underline text-[14px] font-semibold"
                onClick={(e) => {
                    if (!window.confirm(`Delete "${subject}"?`)) {
                        e.preventDefault();
                    }
                }}
            >
                Delete
            </button>
        </form>
    );
}
