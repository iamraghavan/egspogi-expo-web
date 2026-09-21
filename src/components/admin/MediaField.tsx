'use client';
import Image from 'next/image';
import { useState } from 'react';
export function MediaField({
  id,
  value,
  onChange,
  csrf,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  csrf: string;
  invalid?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  return (
    <div className="media-field">
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/art/satellite.svg or an uploaded image URL"
        aria-invalid={invalid}
      />
      <div className="media-field-options">
        <label className="upload-label">
          {busy ? 'Uploading…' : 'Upload an image'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setMessage('');
              if (file.size > 2 * 1024 * 1024) {
                setMessage('Choose an image no larger than 2 MB.');
                return;
              }
              setBusy(true);
              try {
                const form = new FormData();
                form.set('file', file);
                const response = await fetch('/api/admin/media', {
                  method: 'POST',
                  headers: { 'x-csrf-token': csrf },
                  body: form,
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error);
                onChange(result.url);
                setMessage('Image uploaded. Save or publish the entry to use it.');
              } catch (error) {
                setMessage(error instanceof Error ? error.message : 'Upload failed.');
              } finally {
                setBusy(false);
                e.target.value = '';
              }
            }}
          />
        </label>
        <select
          aria-label="Choose a bundled illustration"
          value={value.startsWith('/art/') ? value : ''}
          onChange={(e) => {
            if (e.target.value) onChange(e.target.value);
          }}
        >
          <option value="">Bundled illustrations</option>
          {['satellite', 'racing', 'robotics', 'aero', 'physics', 'engineering'].map((name) => (
            <option key={name} value={`/art/${name}.svg`}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <p className="admin-field-help">
        JPG, PNG or WebP · maximum 2 MB · images are resized and metadata removed.
      </p>
      {message && (
        <p className="admin-field-help" role="status">
          {message}
        </p>
      )}
      {/^\/(art\/|api\/media\/)/.test(value) && (
        <Image
          className="media-field-preview"
          src={value}
          alt="Selected image preview"
          width={320}
          height={200}
          unoptimized
        />
      )}
    </div>
  );
}
