'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Save, Send, History } from 'lucide-react';
import {
  definitions,
  defaultData,
  type Collection,
  type CmsDocument,
  type ContentData,
  type Intent,
} from '@/lib/cms/schema';
import { MediaField } from './MediaField';
export type Revision = {
  id: string;
  version: number;
  action: string;
  actor: string;
  created_at: string;
};
export function ContentEditor({
  collection,
  initial,
  csrf,
  history,
}: {
  collection: Collection;
  initial: CmsDocument | null;
  csrf: string;
  history: Revision[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [doc, setDoc] = useState(initial);
  const [data, setData] = useState<ContentData>(initial?.data || defaultData(collection));
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const [archiveConfirm, setArchiveConfirm] = useState(false);
  const [restoreConfirm, setRestoreConfirm] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  function change(key: string, value: ContentData[string]) {
    setData((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setMessage('');
    setErrors((current) => ({ ...current, [key]: '' }));
  }
  async function save(intent: Intent | 'restore', revision?: string) {
    setBusy(true);
    setMessage('');
    setFailed(false);
    setErrors({});
    try {
      const response = await fetch(`/api/admin/content/${collection}${doc ? `/${doc.id}` : ''}`, {
        method: doc ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf },
        body: JSON.stringify({ data, version: doc?.version || 0, intent, revision }),
      });
      const result = await response.json();
      if (!response.ok) {
        setErrors(result.fields || {});
        setTimeout(
          () => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
          0,
        );
        throw new Error(result.error);
      }
      setDoc(result.document);
      setData(result.document.data);
      setDirty(false);
      setArchiveConfirm(false);
      setRestoreConfirm(null);
      setMessage(
        intent === 'publish'
          ? 'Published. The public website now uses this version.'
          : intent === 'draft'
            ? 'Draft saved. The public version has not changed.'
            : intent === 'restore'
              ? 'Revision restored as a draft. Review it before publishing.'
              : intent === 'archive'
                ? 'Archived. This entry is no longer public.'
                : 'Entry restored. Its previous published version is visible again.',
      );
      if (!doc) router.replace(`/admin/content/${collection}/${result.document.id}`);
      router.refresh();
    } catch (e) {
      setFailed(true);
      setMessage(e instanceof Error ? e.message : 'The change could not be saved.');
    } finally {
      setBusy(false);
    }
  }
  const publicPath =
    collection === 'projects' || collection === 'updates'
      ? `/${collection}/${data.slug}`
      : collection === 'teams'
        ? `/help-desk/${data.slug}`
        : collection === 'event'
          ? '/'
          : collection === 'notices'
            ? '/'
            : `/${collection}`;
  return (
    <>
      <Link className="text-link" href={`/admin/content/${collection}`}>
        <ArrowLeft size={16} />
        Back to {definitions[collection].label.toLowerCase()}
      </Link>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">
            {definitions[collection].label} / {doc ? 'Edit entry' : 'New entry'}
          </p>
          <h1>
            {String(
              data.title ||
                data.question ||
                (collection === 'event' ? 'Event settings' : 'Create an entry'),
            )}
          </h1>
          <p>
            {dirty
              ? 'Unsaved changes'
              : doc
                ? `Revision ${doc.version} · ${doc.state === 'changes' ? 'Unpublished changes' : doc.state}`
                : 'Start with a draft. Publish when it is ready.'}
          </p>
        </div>
        <button
          className="admin-secondary"
          type="button"
          aria-pressed={preview}
          onClick={() => setPreview(!preview)}
        >
          <Eye size={17} />
          {preview ? 'Return to editing' : 'Preview draft'}
        </button>
      </div>
      {message && (
        <p role={failed ? 'alert' : 'status'} className={failed ? 'admin-error' : 'admin-success'}>
          {message}
        </p>
      )}
      {doc?.publishedVersion && (
        <p className="admin-field-help">
          <a href={publicPath} target="_blank" rel="noreferrer">
            View published page ↗
          </a>{' '}
          · Draft changes stay private until you publish.
        </p>
      )}
      <div className="admin-editor-grid">
        <div>
          {preview ? (
            <article className="admin-panel admin-draft-preview">
              <span className="status-badge status-draft">Private draft preview</span>
              <h2>{String(data.title || data.question || 'Event settings')}</h2>
              {definitions[collection].fields
                .filter((f) => !['title', 'question', 'slug', 'order'].includes(f.key))
                .map((field) => (
                  <section key={field.key}>
                    <h3>{field.label}</h3>
                    {field.type === 'image' && String(data[field.key]).startsWith('/') ? (
                      <Image
                        src={String(data[field.key])}
                        alt={String(data.alt || 'Draft illustration')}
                        width={640}
                        height={400}
                        unoptimized
                      />
                    ) : Array.isArray(data[field.key]) ? (
                      <ul>
                        {(data[field.key] as string[]).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>
                        {typeof data[field.key] === 'boolean'
                          ? data[field.key]
                            ? 'Yes'
                            : 'No'
                          : String(data[field.key] || 'Not provided')}
                      </p>
                    )}
                  </section>
                ))}
            </article>
          ) : (
            <form
              ref={formRef}
              className="admin-panel admin-editor-form"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                save('draft');
              }}
            >
              <fieldset disabled={busy || doc?.archived}>
                <legend className="sr-only">
                  Edit {definitions[collection].label.toLowerCase()}
                </legend>
                {definitions[collection].fields.map((field) => (
                  <div
                    className={`admin-field ${field.type === 'checkbox' ? 'admin-checkbox' : ''}`}
                    key={field.key}
                  >
                    <label htmlFor={`field-${field.key}`}>
                      {field.label}
                      {field.required && <span aria-hidden="true"> *</span>}
                    </label>
                    {field.type === 'checkbox' ? (
                      <input
                        id={`field-${field.key}`}
                        type="checkbox"
                        checked={Boolean(data[field.key])}
                        onChange={(e) => change(field.key, e.target.checked)}
                        aria-invalid={!!errors[field.key]}
                      />
                    ) : field.type === 'image' ? (
                      <MediaField
                        id={`field-${field.key}`}
                        value={String(data[field.key] || '')}
                        onChange={(value) => change(field.key, value)}
                        csrf={csrf}
                        invalid={!!errors[field.key]}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        id={`field-${field.key}`}
                        value={String(data[field.key] || '')}
                        onChange={(e) => change(field.key, e.target.value)}
                        required={field.required}
                        aria-invalid={!!errors[field.key]}
                      >
                        <option value="">Select…</option>
                        {field.options?.map((value) => (
                          <option key={value}>{value}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' || field.type === 'lines' ? (
                      <textarea
                        id={`field-${field.key}`}
                        value={
                          Array.isArray(data[field.key])
                            ? (data[field.key] as string[]).join('\n')
                            : String(data[field.key] || '')
                        }
                        onChange={(e) =>
                          change(
                            field.key,
                            field.type === 'lines' ? e.target.value.split('\n') : e.target.value,
                          )
                        }
                        rows={field.type === 'lines' ? 5 : 4}
                        required={field.required}
                        aria-invalid={!!errors[field.key]}
                        aria-describedby={errors[field.key] ? `error-${field.key}` : undefined}
                      />
                    ) : (
                      <input
                        id={`field-${field.key}`}
                        type={
                          ['date', 'time', 'email', 'number'].includes(field.type || '')
                            ? field.type
                            : 'text'
                        }
                        value={String(data[field.key] ?? '')}
                        onChange={(e) =>
                          change(
                            field.key,
                            field.type === 'number' ? Number(e.target.value) : e.target.value,
                          )
                        }
                        required={field.required}
                        maxLength={field.max || 500}
                        min={field.type === 'number' ? 0 : undefined}
                        max={field.type === 'number' ? 10000 : undefined}
                        readOnly={field.key === 'slug' && !!doc?.publishedVersion}
                        aria-invalid={!!errors[field.key]}
                        aria-describedby={errors[field.key] ? `error-${field.key}` : undefined}
                      />
                    )}
                    {field.help && <p className="admin-field-help">{field.help}</p>}
                    {field.type === 'lines' && !field.help && (
                      <p className="admin-field-help">One item per line.</p>
                    )}
                    {errors[field.key] && (
                      <p id={`error-${field.key}`} className="field-error">
                        {errors[field.key]}
                      </p>
                    )}
                  </div>
                ))}
              </fieldset>
            </form>
          )}
        </div>
        <aside>
          <div className="admin-panel admin-publish-panel">
            <h2>Publishing</h2>
            <p>Save work privately, then publish it to the public website.</p>
            {doc?.archived ? (
              <button
                className="button button-primary"
                disabled={busy}
                onClick={() => save('unarchive')}
              >
                Restore archived entry
              </button>
            ) : (
              <>
                <button className="admin-secondary" disabled={busy} onClick={() => save('draft')}>
                  <Save size={17} />
                  {busy ? 'Saving…' : 'Save draft'}
                </button>
                <button
                  className="button button-primary"
                  disabled={busy}
                  onClick={() => save('publish')}
                >
                  <Send size={17} />
                  Publish changes
                </button>
              </>
            )}
            {doc && collection !== 'event' && !doc.archived && (
              <>
                {archiveConfirm ? (
                  <div className="archive-confirm">
                    <p>Remove this entry from the public website? It can be restored later.</p>
                    <button
                      disabled={busy}
                      className="admin-danger"
                      onClick={() => save('archive')}
                    >
                      Confirm archive
                    </button>
                    <button className="admin-secondary" onClick={() => setArchiveConfirm(false)}>
                      Keep entry
                    </button>
                  </div>
                ) : (
                  <button className="admin-danger" onClick={() => setArchiveConfirm(true)}>
                    Archive entry
                  </button>
                )}
              </>
            )}
          </div>
          {doc && (
            <div className="admin-panel revision-panel">
              <h2>
                <History size={18} />
                Revision history
              </h2>
              {history.length ? (
                history.map((revision) => (
                  <div className="revision-row" key={revision.id}>
                    <strong>
                      Version {revision.version} · {revision.action}
                    </strong>
                    <span>
                      {new Date(revision.created_at).toLocaleString('en-GB', {
                        timeZone: 'Asia/Kolkata',
                      })}{' '}
                      IST
                    </span>
                    <span>{revision.actor}</span>
                    {revision.version !== doc.version &&
                      (restoreConfirm === revision.id ? (
                        <>
                          <p>Load this revision as a draft? Unsaved edits will be replaced.</p>
                          <button
                            className="admin-secondary"
                            disabled={busy}
                            onClick={() => save('restore', revision.id)}
                          >
                            Confirm restore
                          </button>
                          <button
                            className="admin-secondary"
                            onClick={() => setRestoreConfirm(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="text-link"
                          disabled={busy}
                          onClick={() => setRestoreConfirm(revision.id)}
                        >
                          Restore as draft
                        </button>
                      ))}
                  </div>
                ))
              ) : (
                <p>The first edit creates a revision.</p>
              )}
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
