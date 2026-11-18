# Project Styling Rules

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS is the primary styling system (v3)
- `@emotion/react` + `@emotion/styled` for component-scoped styles that need nested selectors, pseudo-elements, or complex transitions Tailwind can't express
- `cn()` utility (clsx + tailwind-merge) for conditional/merged classes — from `@/lib/utils`
- CVA (class-variance-authority) for component variants
- shadcn/ui components live in `components/ui/` and are owned in-repo

## Critical: Tailwind Import Location
- NEVER put `@import "tailwindcss"` or `@tailwind` directives inside any non-CSS file.
- Tailwind must be imported in `app/globals.css` only.
- SCSS/Sass is **not used** in this project. No `.scss` files may exist anywhere.
- Import order in `app/layout.tsx`: `globals.css` FIRST.

## Emotion Rules

### File Organization
- Emotion styled components live alongside their component in the same directory (e.g., `components/Button/Button.styles.ts`)
- Never create `.scss` or `.css` files inside component directories
- Never put Emotion style files inside `src/styles/`

### Import Rules
- Import Emotion `styled` from `@emotion/styled` and `css` from `@emotion/react`
- Use `styled` for reusable component primitives with variants
- Use `css` prop or `css` utility for one-off styles

### Allowed Emotion Use Cases
- Nested selectors (`&:hover`, `&::before`, child combinators)
- Pseudo-elements (`::before`, `::after`) with complex content
- Keyframe animations via `keyframes` from `@emotion/react`
- Complex transitions that are awkward in Tailwind
- Component variants that need dynamic CSS based on props

### Forbidden Emotion Use Cases
- Daily component styling — use Tailwind utilities instead
- Creating custom utility classes that duplicate Tailwind's job
- Any styling that could be expressed with Tailwind classes
- Hardcoding hex values — use design tokens from `globals.css`

### Before Creating Any Emotion Style File
Ask: "Can this be done with Tailwind?" If yes, don't create the file. If no, confirm it matches one of the allowed use cases above.

## Tailwind Rules
- Do not use template literals for conditional classes; use `cn()` from `@/lib/utils`
- Do not use `@apply` to build custom classes; extract a React component instead
- Class order is enforced by `prettier-plugin-tailwindcss` (do not sort manually)
- Design tokens live in `globals.css` under Tailwind config — do not hardcode hex values in components
- If a `className` exceeds ~2 lines or is repeated in 2+ places, extract a component. Do not add more utilities to the same element.
- Do not mix Tailwind utilities and Emotion `styled` classes on the same element unless the Emotion style is explicitly for third-party overrides or animations. Use `cn()` to merge conditionally.

## Component Rules
- Reusable UI primitives go in `components/ui/` (shadcn-style, copied not installed)
- Feature-specific components go in `components/<feature>/`
- Every component with variants uses CVA, not conditional class strings
- Keep component + its Emotion style file (if any) in the same folder
- Do not mix Tailwind utilities and Emotion styled classes on the same element unless the Emotion style is explicitly for third-party overrides or animations

## Fonts and Images
- Fonts via `next/font` only (no <link> to Google Fonts)
- Images via `next/image` with explicit width/height or `fill`

## Debugging Style Conflicts
When styles look broken:
1. Check the compiled CSS order in DevTools. Tailwind Preflight must come before custom styles.
2. Search for `@tailwind` or `@apply` inside non-CSS files — this is a bug, move it to `.css`.
3. No `.scss` files should exist anywhere in the project.
4. Do not rewrite component styles to fix a global conflict. Fix the layer/order issue instead.

## When Reorganizing Existing Files
If asked to reorganize style files, list every file created or moved and explain why each one couldn't be replaced by Tailwind.
