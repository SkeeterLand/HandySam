# HandySam Administration Plan

Secure admin area for editing MongoDB service/project data and managing
image uploads. Intended for HandySam's Next.js App Router site hosted on
Cloudflare Pages (OpenNext adapter).

---

## Goals

| Goal | How |
|------|-----|
| Edit service content (hero text, benefits, scope, FAQ, CTA) | Server-side form writing to MongoDB `services` collection |
| Add / edit / delete projects | Server-side form writing to MongoDB `project` collection |
| Upload and replace gallery images | `POST` to a protected route, store WebP in `public/images/`, regenerate manifest |
| Restrict access to authorized users only | Cloudflare Access (Zero Trust) at the edge + optional app-level gate |
| Never leak credentials | All secrets in environment variables, never in git |

---

## Recommended security model

### Primary: Cloudflare Access (Zero Trust)

Protect the entire `/admin/*` path at the Cloudflare edge before a request
ever reaches your Next.js code.

1. In the Cloudflare dashboard, go to **Zero Trust → Access → Applications**.
2. Add an application with a policy that allows only your email (or a
   Google/GitHub group you control).
3. Set the application's session duration (e.g. 12 hours).
4. Visitors who aren't authenticated see Cloudflare's login screen, not your
   admin UI.

**Why this first:** No session code to maintain, no cookies to steal from
your app, works even if your Next.js build has a bug. It's also the pattern
you already use for Cloudflare access to the site.

### Secondary: App-level gate (defense in depth)

Inside Next.js, add a lightweight check so that even if Cloudflare Access
is misconfigured, the admin UI won't render for random visitors:

```ts
// src/lib/admin.ts
export function isAdminRequest(req: Request): boolean {
    // Cloudflare Access injects a header you can verify, or you can check
    // a signed cookie. Keep it simple: require a secret header that only
    // your Cloudflare Access policy can set (via a transform rule), or a
    // session cookie you set after successful login.
    return true; // placeholder — wire to your chosen mechanism
}
```

If you don't want to manage Cloudflare Access rules, skip to the
**Next.js middleware** option below.

### Alternative: Next.js middleware + simple session

If Cloudflare Access isn't an option, protect `/admin` with middleware that
checks for a signed cookie set by a `/admin/login` route. The cookie value
is compared against `ADMIN_PASSWORD_HASH` from an environment variable.
This is simpler to code but requires you to manage session rotation and
CSRF yourself.

---

## Route structure

```
src/app/admin/
  page.tsx              → Admin dashboard (links to sections)
  layout.tsx            → Admin shell: sidebar, requires auth
  services/
    page.tsx            → List all services, link to edit
    [value]/
      page.tsx          → Edit one service (full ServiceContent form)
  projects/
    page.tsx            → List all projects
    [slug]/
      page.tsx          → Edit one project
    new/
      page.tsx          → Create a new project
  images/
    page.tsx            → Image upload / replace / delete
  login/
    page.tsx            → Only needed if you skip Cloudflare Access
```

All admin routes are **Server Components** except small interactive islands
(forms with `useActionState`, image drop zones). Data mutations happen
through **Server Actions** so there's no public API surface.

---

## Data layer (reuse `src/lib/mongodb.ts`)

Your existing file already has the primitives you need:

| Function | Use in admin |
|----------|--------------|
| `findAllServices()` | List services on `/admin/services` |
| `findServiceByValue(value)` | Pre-fill edit form |
| `serviceUpsert(value, content)` | Create/update a service |
| `getHomepageProjects()` | List projects on `/admin/projects` |
| `getProjectBySlug(slug)` | Pre-fill project edit form |
| `getCollection('project')` | Insert/delete projects directly |

**Missing:** a delete helper. Add one to `src/lib/mongodb.ts`:

```ts
export async function serviceDelete(value: string) {
    const collection = await getServicesCollection();
    if (!collection) return { success: false };
    const result = await collection.deleteOne({ value });
    return { success: true, deletedCount: result.deletedCount };
}

export async function projectDelete(slug: string) {
    const collection = await getCollection('project');
    if (!collection) return { success: false };
    const result = await collection.deleteOne({ slug });
    return { success: true, deletedCount: result.deletedCount };
}
```

---

## Server Action example (service edit)

```ts
// src/app/admin/services/[value]/actions.ts
'use server';

import { serviceUpsert, serviceDelete, findServiceByValue } from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';

export async function saveService(value: string, formData: FormData) {
    // 1. Authorization check
    if (!(await isAdmin())) {
        return { error: 'Unauthorized' };
    }

    // 2. Parse + validate
    const raw = Object.fromEntries(formData.entries());
    // ... validate raw against ServiceContent shape ...

    // 3. Write to MongoDB
    await serviceUpsert(value, raw as ServiceContent);

    // 4. Bust the unstable_cache so the public site sees changes
    revalidatePath('/');
    revalidatePath(`/services/${value}`);

    return { success: true };
}

export async function removeService(value: string) {
    if (!(await isAdmin())) return { error: 'Unauthorized' };
    await serviceDelete(value);
    revalidatePath('/');
    revalidatePath('/admin/services');
    return { success: true };
}
```

Call it from a Client Component form:

```tsx
import { saveService } from './actions';

export default function ServiceEditForm({ value }: { value: string }) {
    const [state, formAction] = useActionState(saveService, {});

    return (
        <form action={formAction.bind(null, value)}>
            {/* fields … */}
            <button type="submit">Save</button>
        </form>
    );
}
```

---

## Image upload flow

Your site already uses `scripts/generate-image-manifest.mjs` to build
`src/lib/image-manifest.json` from `public/images/`. The admin flow:

1. **Upload** — `POST /api/admin/images` (protected route) receives
   `multipart/form-data`, saves the file to `public/images/<folder>/<name>.webp`.
2. **Regenerate manifest** — run `node scripts/generate-image-manifest.mjs`
   after upload so `listProjectImages()` picks up the new file.
3. **Cache bust** — `revalidatePath('/projects')` so gallery pages refresh.

**Image constraints:**
- Accept only `image/webp` or `image/jpeg` + convert to WebP server-side
  (use `sharp` if available, or your existing `scripts/optimize-images.mjs`).
- Enforce max file size (e.g. 2 MB) and dimensions.
- Sanitize filenames: strip `../`, allow `[a-z0-9-_]` only.

```ts
// src/app/api/admin/images/route.ts (protected)
export async function POST(req: Request) {
    if (!(await isAdmin())) return new Response('Unauthorized', { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string; // e.g. 'bathroom'

    // validate, sanitize, write to public/images/<folder>/
    // then execSync('node scripts/generate-image-manifest.mjs')

    return Response.json({ success: true });
}
```

---

## Security checklist

| Item | Status |
|------|--------|
| `/admin/*` behind Cloudflare Access (or middleware) | ☐ |
| All admin mutations via Server Actions, not public API routes | ☐ |
| `MONGODB_URI` / `MONGODB_DB` only in `.env` (gitignored) + Cloudflare encrypted vars | ☐ |
| No secrets committed to git | ☐ |
| `revalidatePath` after writes so cache doesn't serve stale data | ☐ |
| File upload: type/size/name sanitization | ☐ |
| CSRF protection on form submissions (Next.js `useActionState` handles this) | ☐ |
| HTTPS only (Cloudflare handles this automatically) | ☐ |
| Error messages don't leak stack traces or DB details | ☐ |

---

## Step-by-step implementation

### 1. Turn on Cloudflare Access for `/admin`

Dashboard → Zero Trust → Access → Applications → Add application.
Policy: include only your email. Session: 8–12 hours.

### 2. Create the admin shell

`src/app/admin/layout.tsx` — a simple sidebar layout that all admin pages
nest under. Add a link from the site footer (hidden unless you have the
admin cookie) or just bookmark `yoursite.com/admin`.

### 3. Add the delete helpers

Append `serviceDelete` and `projectDelete` to `src/lib/mongodb.ts`.

### 4. Build one section at a time

- **Services first** — edit form for `ServiceContent` fields. This is the
  most valuable (it drives your service pages).
- **Projects** — list + edit slug, title, location, year, services, image
  folder.
- **Images** — upload + manifest regeneration.

### 5. Test locally

You need `MONGODB_URI` and `MONGODB_DB` in a local `.env` (gitignored).
Cloudflare Access won't run locally, so bypass the auth gate in dev:

```ts
// src/lib/admin.ts
export async function isAdmin() {
    if (process.env.NODE_ENV === 'development') return true;
    // production: check cookie/header
}
```

### 6. Deploy to Cloudflare

Set `MONGODB_URI` and `MONGODB_DB` as encrypted environment variables in
the Cloudflare Pages dashboard. Deploy. Visit `yoursite.com/admin` and
complete the Cloudflare Access login.

---

## Suggested file layout (new files)

```
src/app/admin/layout.tsx
src/app/admin/page.tsx
src/app/admin/services/page.tsx
src/app/admin/services/[value]/page.tsx
src/app/admin/services/[value]/actions.ts
src/app/admin/projects/page.tsx
src/app/admin/projects/[slug]/page.tsx
src/app/admin/projects/new/page.tsx
src/app/admin/images/page.tsx
src/app/api/admin/images/route.ts
src/lib/admin.ts            → isAdmin() helper
ADMIN_PLAN.md              → this document
```

---

## What to avoid

- ❌ Don't create a public `/api/admin` route without auth.
- ❌ Don't store passwords or tokens in the repo.
- ❌ Don't let the admin upload arbitrary file types (only images).
- ❌ Don't bypass `revalidatePath` — the homepage/services cache is 60s
  (`unstable_cache`), so edits won't show until you bust it.
- ❌ Don't hardcode `MONGODB_URI` anywhere.

---

## Next step

Pick your auth method (Cloudflare Access recommended), create
`src/app/admin/layout.tsx` + `page.tsx`, and build the services edit form
first. Once that works, replicate the pattern for projects and images.
