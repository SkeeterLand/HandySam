'use client';

import { removeService } from '@/app/admin/services/actions';

export function DeleteServiceButton({
    value,
    title,
}: {
    value: string;
    title: string;
}) {
    return (
        <form action={removeService} className="inline">
            <input type="hidden" name="value" defaultValue={value} />
            <button
                type="submit"
                className="text-red-400 hover:text-red-300 no-underline text-[14px] font-semibold"
                onClick={(e) => {
                    if (!window.confirm(`Delete "${title}"?`)) {
                        e.preventDefault();
                    }
                }}
            >
                Delete
            </button>
        </form>
    );
}
