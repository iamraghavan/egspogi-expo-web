'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Plus, Search, ArrowUpRight } from 'lucide-react';
import { definitions, type Collection, type CmsDocument } from '@/lib/cms/schema';
export function ContentList({
  collection,
  documents,
}: {
  collection: Collection;
  documents: CmsDocument[];
}) {
  const [query, setQuery] = useState('');
  const [state, setState] = useState('all');
  const filtered = documents.filter(
    (doc) =>
      (state === 'all' || doc.state === state) &&
      JSON.stringify(doc.data).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Content management</p>
          <h1>{definitions[collection].label}</h1>
          <p>{definitions[collection].description}</p>
        </div>
        {collection !== 'event' && (
          <Link className="button button-primary" href={`/admin/content/${collection}/new`}>
            <Plus size={18} />
            Add {collection === 'faqs' ? 'question' : 'entry'}
          </Link>
        )}
      </div>
      <div className="admin-filter-bar">
        <label>
          <span>Search content</span>
          <div className="admin-search">
            <Search size={18} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles, teams or text"
            />
          </div>
        </label>
        <label>
          <span>Publication status</span>
          <select value={state} onChange={(e) => setState(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="changes">Unpublished changes</option>
            <option value="archived">Archived</option>
          </select>
        </label>
      </div>
      <p role="status" className="results-count">
        {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
      </p>
      <div className="admin-list">
        {filtered.map((doc) => (
          <article key={doc.id}>
            <div>
              <span className={`status-badge status-${doc.state}`}>
                {doc.state === 'changes' ? 'Unpublished changes' : doc.state}
              </span>
              <h2>
                <Link href={`/admin/content/${collection}/${doc.id}`}>
                  {String(doc.data.title || doc.data.question || 'Event settings')}
                </Link>
              </h2>
              <p>
                {String(
                  doc.data.category ||
                    doc.data.description ||
                    doc.data.excerpt ||
                    doc.data.date ||
                    'Shared website content',
                ).slice(0, 140)}
              </p>
            </div>
            <div className="admin-list-meta">
              <span>Revision {doc.version}</span>
              <time dateTime={doc.updatedAt}>
                {new Date(doc.updatedAt).toLocaleDateString('en-GB', { timeZone: 'UTC' })}
              </time>
              <Link className="text-link" href={`/admin/content/${collection}/${doc.id}`}>
                Edit entry <ArrowUpRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="admin-empty">
          <h2>No matching content</h2>
          <p>Try another search, change the status filter, or add an entry.</p>
        </div>
      )}
    </>
  );
}
