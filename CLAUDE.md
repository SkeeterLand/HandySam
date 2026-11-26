# Project Styling Rules

## Stack
- Next.js (App Router) + TypeScript — Next.js 16.4.6, deployed on Cloudflare Pages via OpenNext
- Tailwind CSS is the primary styling system (v3)
- `cn()` utility (clsx + tailwind-merge) for conditional/merged classes — from `@/lib/utils`
- CVA (class-variation-authority) for component variants
- shadcn/ui components live in `components/ui/` and are owned in-repo
- `@emotion/react` + `@emotion/styled` are NOT currently used in this project (no Emotion style files exist). Keep it that way unless a style truly needs nested selectors/pseudo-elements/complex transitions that Tailwind cannot express.

## Critical: Tailwind Import Location
- NEVER put `@import "tailwindcss"` or `@tailwind` directives inside any non-CSS file.
- Tailwind must be imported in `app/globals.css` only.
- SCSS/Sass is **not used** in this project. No `.scss` files may exist anywhere.
- Import order in `app/layout.tsx`: `globals.css` FIRST.

## Image Storage Architecture (ImageKit + MongoDB)
- Images are stored in ImageKit REST API, NOT in the local project. No local `public/images/` images are used.
- ImageKit upload endpoint: `https://upload.imagekit.io/api/v1/files/upload`
- ImageKit list endpoint: `https://api.imagekit.io/v1/files?path=/<folder>&limit=100` — returns a TOP-LEVEL ARRAY, not `{ list: [...] }`. Use `Array.isArray(data) ? data : (data.list || [])`.
- ImageKit URLs include `?updatedAt=...` query params — always strip with `fileNameFromUrl()` (split on `?`) before matching filenames.
- ImageKit endpoint var: `IMAGEKIT_URL_ENDPOINT` (e.g. `https://ik.imagekit.io/rdojme0pvr`)
- MongoDB Atlas native driver v7.9.1 with `unstable_cache`. Collections: `services`, `project`, `images`, plus sessions.
- `scripts/` holds one-off migration/upload scripts (temporary, deleted after use). Never commit secrets — `.env.local` is gitignored.

## Admin Image Gallery (`src/app/admin/images/`)
- Single Image Folder dropdown in `ImageUploadForm.tsx` with `<None Selected>` default. `onChange` navigates to `/admin/images?folder=<val>`.
- `FolderSelector.tsx` was deleted — consolidated into ImageUploadForm.
- `page.tsx` passes `selectedFolder={selectedFolder ?? ''}` to both `ImageUploadForm` and `ImageGallery`.
- `ImageGallery` only renders `SortableFolderGallery` when a folder is selected; otherwise shows "Select a folder to view its images." (no images loaded).
- `SortableFolderGallery.tsx` — client component with arrow-based reorder (directional arrows gated on `canLeft`/`canRight`/`canUp`/`canDown`). Dashed accent outline on hovered target. Save order via `saveSortOrder` Server Action.
- `actions.ts`: `uploadImage` (sharp → WebP → ImageKit → MongoDB), `listImageFolders` (merges MongoDB + ImageKit folders), `listImagesInFolder`, `saveSortOrder`.
- `lib/images.ts`: `listProjectImages(folder, sortBy)` — ImageKit List API → MongoDB images collection → local manifest fallback. Respects custom sort order saved from admin.

## Admin Services (`src/app/admin/services/`)
- `ServiceContent` interface in `src/lib/mongodb.ts` includes `features: string[]` plus all hero/benefits/scope/ask/process/faq/cta fields.
- Edit form (`[value]/form.tsx`) has sections: Features (comma-separated textarea), Benefits, Scope Items, Process Steps, FAQs, plus top-level text fields.
- `saveService` Server Action parses comma-delimited features via `parseFeatures(raw)`.
- Frontend `Services.tsx` carousel reads `features`, `description`, `icon` (from `benefits[0]?.icon`), and uses `ICON_MAP` in `icons.tsx` for service icons: carpentry, painting, electrical, general-repairs, plumbing, hauling, tiling (`TilingIcon`).
- Homepage `getHomepageServices()` maps MongoDB docs to `HomepageService` shape.

## Admin Projects (`src/app/admin/projects/`)
- `HomepageProject` interface in `src/lib/mongodb.ts`: slug, src, alt, subject, description, subDescription, services, location, year, imageFolder.
- Edit form (`[slug]/form.tsx`) has all fields including Sub Description textarea and Services (comma-separated).
- `saveProject` Server Action upserts to MongoDB `project` collection.
- Project page (`projects/[slug]/page.tsx`) displays subject, location/year, description, subDescription (conditional), services tags, and gallery via `listProjectImages(imageFolder)`.
- Gallery card (`components/Gallery.tsx`) shows subject, subDescription clamped to 6 lines with fixed 110px height, services tags, location · year.

## Component Rules
- Reusable UI primitives go in `components/ui/` (shadcn-style, copied not installed)
- Feature-specific components go in `components/<feature>/`
- Every component with variants uses CVA, not conditional class strings
- Do not mix Tailwind utilities and Emotion styled classes on the same element
- Do not use template literals for conditional classes; use `cn()` from `@/lib/utils`
- Do not use `@apply` to build custom classes; extract a React component instead
- Class order is enforced by `prettier-plugin-tailwindcss` (do not sort manually)
- If a `className` exceeds ~2 lines or is repeated in 2+ places, extract a component

## Fonts and Images
- Fonts via `next/font` only (no <link> to Google Fonts)
- Images via `next/image` with explicit width/height or `fill`

## Debugging Style Conflicts
When styles look broken:
1. Check the compiled CSS order in DevTools. Tailwind Preflight must come before custom styles.
2. Search for `@tailwind` or `@apply` inside non-CSS files — this is a bug, move it to `.css`.
3. No `.scss` files should exist anywhere in the project.
4. Do not rewrite component styles to fix a global conflict. Fix the layer/order issue instead.

## Deployment
- Cloudflare Pages via OpenNext adapter (serverless — no fs/child_process/sharp at runtime). Sharp is used only in Server Actions during upload.
- GitHub auto-deploys on push to `main`.
- Cloudflare Pages runtime env vars (set in dashboard, encrypted): MONGODB_URI, MONGODB_DB, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, SESSION_SECRET, ADMIN_PASSWORD_HASH, RESEND_API_KEY
- `wrangler.jsonc` has IMAGEKIT_PUBLIC_KEY and IMAGEKIT_URL_ENDPOINT as vars.

## When Reorganizing Existing Files
If asked to reorganize style files, list every file created or moved and explain why each one couldn't be replaced by Tailwind.
