'use client';

import { useActionState, useEffect, useState, useCallback, createContext, useContext } from 'react';
import Link from 'next/link';
import { saveService } from '@/app/admin/services/actions';
import { SaveIcon } from './SaveIcon';
import type { ServiceContent } from '@/lib/mongodb';

// ---------- Dirty-state context (tracks which fields have changed) ----------
interface DirtyContextValue {
  dirty: Record<string, boolean>;
  markDirty: (name: string) => void;
  clearDirty: () => void;
  isPending: boolean;
}
const DirtyContext = createContext<DirtyContextValue | null>(null);

function DirtyContextProvider({
  children,
  isPending,
}: {
  children: React.ReactNode;
  isPending: boolean;
}) {
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const markDirty = useCallback(
    (name: string) => setDirty((d) => ({ ...d, [name]: true })),
    [],
  );
  const clearDirty = useCallback(() => setDirty({}), []);
  return (
    <DirtyContext.Provider value={{ dirty, markDirty, clearDirty, isPending }}>
      {children}
    </DirtyContext.Provider>
  );
}

function useDirty() {
  const ctx = useContext(DirtyContext);
  if (!ctx) {
    throw new Error('useDirty must be used inside DirtyContextProvider');
  }
  return ctx;
}

interface ServiceEditFormProps {
  service: ServiceContent | null;
  isNew?: boolean;
}

export default function ServiceEditForm({
  service,
  isNew = false,
}: ServiceEditFormProps) {
  const [state, formAction, isPending] = useActionState(saveService, null);

  return (
    <DirtyContextProvider isPending={isPending}>
      <InnerForm
        state={state}
        formAction={formAction}
        service={service}
        isNew={isNew}
        isPending={isPending}
      />
    </DirtyContextProvider>
  );
}

function InnerForm({
  state,
  formAction,
  service,
  isNew,
  isPending,
}: {
  state: { ok: boolean; error: string | null } | null;
  formAction: (formData: FormData) => void;
  service: ServiceContent | null;
  isNew: boolean;
  isPending: boolean;
}) {
  const { dirty } = useDirty();

  const rowIsDirty = useCallback(
    (prefix: string) =>
      Object.keys(dirty).some((key) => key.startsWith(prefix)),
    [dirty],
  );

  return (
    <div className="space-y-[32px]">
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] font-black tracking[-1px] text-fg">
            {isNew ? 'Add Service' : 'Edit Service'}
          </h1>
          <Link href="/admin/services" className="text-muted no-underline hover:text-fg">
            ← Back to services
          </Link>
        </div>

        {state?.error && (
          <div className="p-[12px] rounded-[10px] border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            {state.error}
          </div>
        )}
        {state?.ok && (
          <div className="p-[12px] rounded-[10px] border border-accent/30 bg-accent/10 text-accent text-sm">
            Service saved successfully.
          </div>
        )}

        <form action={formAction} className="space-y-[24px]">
          <input
            type="hidden"
            name="value"
            defaultValue={isNew ? '' : service?.value ?? ''}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
            <TextField
              label="Value (URL slug, e.g. carpentry)"
              name="value"
              defaultValue={service?.value ?? ''}
              required
            />
            <TextField
              label="Title"
              name="title"
              defaultValue={service?.title ?? ''}
              required
            />
            <TextField label="Tagline" name="tagline" defaultValue={service?.tagline ?? ''} />
            <TextField
              label="Hero Title"
              name="heroTitle"
              defaultValue={service?.heroTitle ?? ''}
              required
            />
            <TextField
              label="Hero Highlight"
              name="heroHighlight"
              defaultValue={service?.heroHighlight ?? ''}
            />
            <TextArea
              label="Hero Description"
              name="heroDescription"
              defaultValue={service?.heroDescription ?? ''}
            />
            <TextField
              label="Hero Footer"
              name="heroFooter"
              defaultValue={service?.heroFooter ?? ''}
            />
          </div>

          <BenefitsSection
            title="Benefits"
            section="benefits"
            fields={['icon', 'title', 'description']}
            items={service?.benefits ?? []}
            rowIsDirty={rowIsDirty}
            isPending={isPending}
          />
          <ScopeItemsSection
            title="Scope Items"
            section="scopeItems"
            items={service?.scopeItems ?? []}
            rowIsDirty={rowIsDirty}
            isPending={isPending}
          />
          <ProcessStepsSection
            title="Process Steps"
            section="processSteps"
            items={service?.processSteps ?? []}
            rowIsDirty={rowIsDirty}
            isPending={isPending}
          />
          <FaqsSection
            title="FAQs"
            section="faqs"
            items={service?.faqs ?? []}
            rowIsDirty={rowIsDirty}
            isPending={isPending}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
            <TextField
              label="Scope Title"
              name="scopeTitle"
              defaultValue={service?.scopeTitle ?? ''}
            />
            <TextField
              label="Scope Footer"
              name="scopeFooter"
              defaultValue={service?.scopeFooter ?? ''}
            />
            <TextField
              label="Ask Title"
              name="askTitle"
              defaultValue={service?.askTitle ?? ''}
            />
            <TextField
              label="Ask Subtitle"
              name="askSubtitle"
              defaultValue={service?.askSubtitle ?? ''}
            />
            <TextArea
              label="Ask Description"
              name="askDescription"
              defaultValue={service?.askDescription ?? ''}
            />
            <TextField
              label="Process Title"
              name="processTitle"
              defaultValue={service?.processTitle ?? ''}
            />
            <TextField
              label="FAQ Title"
              name="faqTitle"
              defaultValue={service?.faqTitle ?? ''}
            />
            <TextField
              label="CTA Title"
              name="ctaTitle"
              defaultValue={service?.ctaTitle ?? ''}
            />
            <TextArea
              label="CTA Description"
              name="ctaDescription"
              defaultValue={service?.ctaDescription ?? ''}
            />
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
  showSaveIcon = true,
}: {
  label: string;
  name: string;
  defaultValue: string;
  required?: boolean;
  placeholder?: string;
  showSaveIcon?: boolean;
}) {
  const { markDirty, dirty, isPending } = useDirty();
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
        onChange={() => markDirty(name)}
        className="w-full px-[14px] py-[14px] bg-card border border-[var(--border)] rounded-[10px] text-fg focus:outline-none focus:border-accent transition-[border-color] duration-200"
      />
      {showSaveIcon && (
        <div className="flex justify-end pt-[2px]">
          {dirty[name] && <SaveIcon disabled={isPending} />}
        </div>
      )}
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  showSaveIcon = true,
}: {
  label: string;
  name: string;
  defaultValue: string;
  showSaveIcon?: boolean;
}) {
  const { markDirty, dirty, isPending } = useDirty();
  return (
    <div className="space-y-[6px]">
      <label className="block text-[13px] font-semibold text-muted uppercase tracking-[0.5px]">
        {label}
      </label>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={4}
        onChange={() => markDirty(name)}
        className="w-full px-[14px] py-[14px] bg-card border border-[var(--border)] rounded-[10px] text-fg focus:outline-none focus:border-accent transition-[border-color] duration-200"
      />
      {showSaveIcon && (
        <div className="flex justify-end pt-[2px]">
          {dirty[name] && <SaveIcon disabled={isPending} />}
        </div>
      )}
    </div>
  );
}

function BenefitsSection({
  title,
  section,
  fields,
  items,
  rowIsDirty,
  isPending,
}: {
  title: string;
  section: string;
  fields: string[];
  items: Array<Record<string, string>>;
  rowIsDirty: (prefix: string) => boolean;
  isPending: boolean;
}) {
  const [count, setCount] = useState(items.length);

  return (
    <div className="border border-[var(--border)] rounded-[12px] p-[20px] bg-card">
      <div className="flex items-center justify-between mb-[16px]">
        <h3 className="text-[16px] font-bold uppercase tracking-[0.5px] text-fg">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="text-xs font-bold text-accent hover:text-accent-hover no-underline"
        >
          + Add
        </button>
      </div>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-[12px] mb-[12px] p-[12px] border border-[var(--border)] rounded-[10px] bg-white/3">
          {fields.map((field) => (
            <TextField
              key={field}
              label={`${field.charAt(0).toUpperCase() + field.slice(1)} ${i + 1}`}
              name={`${section}-${i}-${field}`}
              defaultValue={items[i]?.[field] ?? ''}
              showSaveIcon={false}
            />
          ))}
          <div className="col-span-full flex justify-end pt-[2px]">
            {rowIsDirty(`${section}-${i}-`) && <SaveIcon disabled={isPending} />}
          </div>
        </div>
      ))}
    </div>
  );
}

function ScopeItemsSection({
  title,
  section,
  items,
  rowIsDirty,
  isPending,
}: {
  title: string;
  section: string;
  items: Array<{ label: string; items: string }>;
  rowIsDirty: (prefix: string) => boolean;
  isPending: boolean;
}) {
  const [count, setCount] = useState(items.length);

  return (
    <div className="border border-[var(--border)] rounded-[12px] p-[20px] bg-card">
      <div className="flex items-center justify-between mb-[16px]">
        <h3 className="text-[16px] font-bold uppercase tracking-[0.5px] text-fg">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="text-xs font-bold text-accent hover:text-accent-hover no-underline"
        >
          + Add
        </button>
      </div>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px] p-[12px] border border-[var(--border)] rounded-[10px] bg-white/3">
          <TextField
            key="label"
            label={`Label ${i + 1}`}
            name={`${section}-${i}-label`}
            defaultValue={items[i]?.label ?? ''}
            showSaveIcon={false}
          />
          <TextField
            key="items"
            label={`Items ${i + 1}`}
            name={`${section}-${i}-items`}
            defaultValue={items[i]?.items ?? ''}
            showSaveIcon={false}
          />
          <div className="col-span-full flex justify-end pt-[2px]">
            {rowIsDirty(`${section}-${i}-`) && <SaveIcon disabled={isPending} />}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProcessStepsSection({
  title,
  section,
  items,
  rowIsDirty,
  isPending,
}: {
  title: string;
  section: string;
  items: Array<{ title: string; description: string }>;
  rowIsDirty: (prefix: string) => boolean;
  isPending: boolean;
}) {
  const [count, setCount] = useState(items.length);

  return (
    <div className="border border-[var(--border)] rounded-[12px] p-[20px] bg-card">
      <div className="flex items-center justify-between mb-[16px]">
        <h3 className="text-[16px] font-bold uppercase tracking-[0.5px] text-fg">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="text-xs font-bold text-accent hover:text-accent-hover no-underline"
        >
          + Add
        </button>
      </div>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px] p-[12px] border border-[var(--border)] rounded-[10px] bg-white/3">
          <TextField
            key="title"
            label={`Step Title ${i + 1}`}
            name={`${section}-${i}-title`}
            defaultValue={items[i]?.title ?? ''}
            showSaveIcon={false}
          />
          <TextArea
            key="description"
            label={`Step Description ${i + 1}`}
            name={`${section}-${i}-description`}
            defaultValue={items[i]?.description ?? ''}
            showSaveIcon={false}
          />
          <div className="col-span-full flex justify-end pt-[2px]">
            {rowIsDirty(`${section}-${i}-`) && <SaveIcon disabled={isPending} />}
          </div>
        </div>
      ))}
    </div>
  );
}

function FaqsSection({
  title,
  section,
  items,
  rowIsDirty,
  isPending,
}: {
  title: string;
  section: string;
  items: Array<{ question: string; answer: string }>;
  rowIsDirty: (prefix: string) => boolean;
  isPending: boolean;
}) {
  const [count, setCount] = useState(items.length);

  return (
    <div className="border border-[var(--border)] rounded-[12px] p-[20px] bg-card">
      <div className="flex items-center justify-between mb-[16px]">
        <h3 className="text-[16px] font-bold uppercase tracking-[0.5px] text-fg">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="text-xs font-bold text-accent hover:text-accent-hover no-underline"
        >
          + Add
        </button>
      </div>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px] p-[12px] border border-[var(--border)] rounded-[10px] bg-white/3">
          <TextField
            key="question"
            label={`Question ${i + 1}`}
            name={`${section}-${i}-question`}
            defaultValue={items[i]?.question ?? ''}
            showSaveIcon={false}
          />
          <TextArea
            key="answer"
            label={`Answer ${i + 1}`}
            name={`${section}-${i}-answer`}
            defaultValue={items[i]?.answer ?? ''}
            showSaveIcon={false}
          />
          <div className="col-span-full flex justify-end pt-[2px]">
            {rowIsDirty(`${section}-${i}-`) && <SaveIcon disabled={isPending} />}
          </div>
        </div>
      ))}
    </div>
  );
}
