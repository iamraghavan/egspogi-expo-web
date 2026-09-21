'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MediaField } from './MediaField';
export function MediaLibrary({
  media,
  csrf,
}: {
  media: { id: string; name: string; size: number; created_at: string }[];
  csrf: string;
}) {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Shared assets</p>
          <h1>Media library</h1>
          <p>Upload once, then use the image in projects and gallery entries.</p>
        </div>
      </div>
      <div className="admin-panel">
        <label htmlFor="library-upload">Add an image</label>
        <MediaField
          id="library-upload"
          value={value}
          onChange={(v) => {
            setValue(v);
            router.refresh();
          }}
          csrf={csrf}
        />
      </div>
      <p role="status" className="admin-field-help">
        {message ||
          `${media.length} uploaded images. Uploads use durable Supabase storage in the CMS database.`}
      </p>
      <div className="admin-media-grid">
        {media.map((item) => (
          <article className="admin-panel" key={item.id}>
            <Image
              src={`/api/media/${item.id}`}
              alt={item.name}
              width={400}
              height={260}
              unoptimized
            />
            <h2>{item.name}</h2>
            <p>{Math.ceil(item.size / 1024)} KB · WebP</p>
            <button
              className="admin-secondary"
              onClick={async () => {
                const url = `/api/media/${item.id}`;
                try {
                  await navigator.clipboard.writeText(url);
                  setMessage('Image URL copied. Paste it into a project or gallery image field.');
                } catch {
                  setMessage(`Image URL: ${url}`);
                }
              }}
            >
              Copy image URL
            </button>
          </article>
        ))}
      </div>
      {!media.length && (
        <div className="admin-empty">
          <h2>No uploaded media yet</h2>
          <p>Bundled illustrations remain available in the project and gallery editors.</p>
        </div>
      )}
    </>
  );
}
