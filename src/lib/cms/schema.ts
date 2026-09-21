export const collections = [
  'projects',
  'updates',
  'schedule',
  'gallery',
  'teams',
  'faqs',
  'notices',
  'event',
] as const;
export type Collection = (typeof collections)[number];
export type ContentData = Record<string, string | string[] | boolean | number>;
export type Field = {
  key: string;
  label: string;
  type?:
    | 'text'
    | 'textarea'
    | 'lines'
    | 'checkbox'
    | 'select'
    | 'date'
    | 'time'
    | 'email'
    | 'image'
    | 'number';
  required?: boolean;
  options?: string[];
  help?: string;
  max?: number;
};
const categories = [
  'Space',
  'Satellite',
  'Racing',
  'Aero',
  'Robotics',
  'Physics',
  'Mathematics',
  'Engineering',
];
const title: Field = { key: 'title', label: 'Title', required: true, max: 160 };
const slug: Field = {
  key: 'slug',
  label: 'Page address',
  required: true,
  help: 'Lowercase words separated by hyphens. Keep published addresses stable.',
  max: 100,
};
const description: Field = {
  key: 'description',
  label: 'Description',
  type: 'textarea',
  required: true,
  max: 2000,
};
const order: Field = {
  key: 'order',
  label: 'Display order',
  type: 'number',
  help: 'Lower numbers appear first.',
};
export const definitions: Record<
  Collection,
  { label: string; description: string; fields: Field[] }
> = {
  projects: {
    label: 'Projects',
    description: 'Manage exhibits entered by the organising team after offline registration.',
    fields: [
      title,
      slug,
      { key: 'team', label: 'Team name', required: true },
      { key: 'institution', label: 'Institution', required: true },
      { key: 'members', label: 'Team members', type: 'lines', required: true },
      {
        key: 'category',
        label: 'Science track',
        type: 'select',
        options: categories,
        required: true,
      },
      description,
      { key: 'image', label: 'Project image', type: 'image', required: true },
      { key: 'featured', label: 'Feature on the home page', type: 'checkbox' },
      { key: 'sample', label: 'Sample / concept exhibit', type: 'checkbox' },
      ...['problem', 'solution', 'outcomes'].map((key) => ({
        key,
        label: key[0].toUpperCase() + key.slice(1),
        type: 'textarea' as const,
        required: true,
      })),
      { key: 'technologies', label: 'Technologies', type: 'lines', required: true },
      order,
    ],
  },
  updates: {
    label: 'Updates',
    description: 'Publish news, visitor guidance and event announcements.',
    fields: [
      title,
      slug,
      { key: 'date', label: 'Publication date', type: 'date', required: true },
      { key: 'category', label: 'Category', required: true },
      { key: 'excerpt', label: 'Short introduction', type: 'textarea', required: true },
      {
        key: 'content',
        label: 'Article paragraphs',
        type: 'lines',
        required: true,
        help: 'One paragraph per line. Plain text only.',
      },
      order,
    ],
  },
  schedule: {
    label: 'Schedule',
    description:
      'Set day, time, location and session status. Changes appear in the public programme.',
    fields: [
      title,
      { key: 'date', label: 'Day', type: 'date', required: true },
      { key: 'time', label: 'Start time (IST)', type: 'time', required: true },
      { key: 'end', label: 'End time (IST)', type: 'time', required: true },
      { key: 'location', label: 'Location', required: true },
      description,
      {
        key: 'sessionStatus',
        label: 'Session status',
        type: 'select',
        options: ['Scheduled', 'Delayed', 'Cancelled'],
        required: true,
      },
      order,
    ],
  },
  gallery: {
    label: 'Gallery',
    description: 'Upload images, write accessible descriptions and organise the gallery.',
    fields: [
      title,
      { key: 'src', label: 'Image', type: 'image', required: true },
      { key: 'alt', label: 'Image description (alt text)', required: true },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: ['Projects', 'Events', 'Behind the scenes', 'Awards'],
        required: true,
      },
      {
        key: 'illustration',
        label: 'Concept illustration (not an event photograph)',
        type: 'checkbox',
      },
      order,
    ],
  },
  teams: {
    label: 'Help-desk teams',
    description: 'Give each service its own page, coordinator, desk and working hours.',
    fields: [
      title,
      slug,
      description,
      { key: 'person', label: 'Contact person', required: true },
      { key: 'email', label: 'Email address', type: 'email', required: true },
      { key: 'phone', label: 'Phone number', required: true },
      { key: 'desk', label: 'Desk location', required: true },
      { key: 'hours', label: 'Working hours', required: true },
      { key: 'responsibilities', label: 'How this team can help', type: 'lines', required: true },
      { key: 'bring', label: 'What visitors should bring / prepare', type: 'lines' },
      {
        key: 'confirmed',
        label: 'Contact details verified — enable call and email links',
        type: 'checkbox',
      },
      order,
    ],
  },
  faqs: {
    label: 'FAQs',
    description: 'Keep answers aligned with offline registration and current arrangements.',
    fields: [
      { key: 'question', label: 'Question', required: true },
      { key: 'answer', label: 'Answer', type: 'textarea', required: true },
      order,
    ],
  },
  notices: {
    label: 'Live notices',
    description: 'Time-limited site-wide notices for desk changes and visitor information.',
    fields: [
      title,
      { key: 'message', label: 'Message', type: 'textarea', required: true, max: 400 },
      {
        key: 'level',
        label: 'Priority',
        type: 'select',
        options: ['Information', 'Important'],
        required: true,
      },
      {
        key: 'href',
        label: 'Internal destination',
        help: 'Optional site path, for example /help-desk/registration',
      },
      {
        key: 'starts',
        label: 'Show from (UTC)',
        help: 'Optional ISO timestamp, e.g. 2026-10-24T03:00:00Z',
      },
      { key: 'expires', label: 'Hide after (UTC)', help: 'Optional ISO timestamp.' },
      order,
    ],
  },
  event: {
    label: 'Event settings',
    description:
      'Shared event details and offline desk instructions. Online registration is not supported.',
    fields: [
      { key: 'date', label: 'Display date', required: true },
      { key: 'dateISO', label: 'Event date', type: 'date', required: true },
      { key: 'time', label: 'Display hours', required: true },
      { key: 'venue', label: 'Venue', required: true },
      { key: 'location', label: 'City / state', required: true },
      { key: 'address', label: 'Campus address', type: 'textarea', required: true },
      { key: 'email', label: 'General contact email', type: 'email', required: true },
      { key: 'phone', label: 'General contact phone', required: true },
      { key: 'offlineDesk', label: 'Offline registration desk', required: true },
      { key: 'offlineHours', label: 'Offline registration hours', required: true },
      {
        key: 'offlineRequirements',
        label: 'What to bring for registration',
        type: 'lines',
        required: true,
      },
      {
        key: 'dates',
        label: 'Important dates',
        type: 'lines',
        help: 'One per line: Label | Date',
        required: true,
      },
      {
        key: 'previewMode',
        label: 'Show sample-content notices across the site',
        type: 'checkbox',
      },
    ],
  },
};
export function isCollection(value: string): value is Collection {
  return collections.includes(value as Collection);
}
export function defaultData(collection: Collection): ContentData {
  return Object.fromEntries(
    definitions[collection].fields.map((field) => [
      field.key,
      field.type === 'checkbox'
        ? false
        : field.type === 'number'
          ? 0
          : field.type === 'lines'
            ? []
            : field.options?.[0] || '',
    ]),
  );
}
export function validateData(
  collection: Collection,
  input: unknown,
): { data: ContentData; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const data = defaultData(collection);
  if (!input || typeof input !== 'object' || Array.isArray(input))
    return { data, errors: { form: 'A content object is required.' } };
  const source = input as Record<string, unknown>;
  for (const field of definitions[collection].fields) {
    const value = source[field.key];
    if (field.type === 'checkbox') {
      if (value !== undefined && typeof value !== 'boolean')
        errors[field.key] = 'Use true or false.';
      data[field.key] = value === true;
      continue;
    }
    if (field.type === 'number') {
      const n = value ?? 0;
      if (typeof n !== 'number' || !Number.isInteger(n) || n < 0 || n > 10000)
        errors[field.key] = 'Use a whole number between 0 and 10000.';
      else data[field.key] = n;
      continue;
    }
    if (field.type === 'lines') {
      if (!Array.isArray(value) || value.some((v) => typeof v !== 'string') || value.length > 80) {
        errors[field.key] = 'Use a list of up to 80 text entries.';
        continue;
      }
      const lines = value.map((v) => v.trim()).filter(Boolean);
      if (lines.some((v) => v.length > 5000) || (field.required && !lines.length))
        errors[field.key] = 'Add text entries of no more than 5000 characters.';
      data[field.key] = lines;
      continue;
    }
    const text = typeof value === 'string' ? value.trim() : '';
    data[field.key] = text;
    if (
      (field.required && !text) ||
      text.length > (field.max ?? (field.type === 'textarea' ? 12000 : 500))
    )
      errors[field.key] = `Enter ${field.label.toLowerCase()} within the allowed length.`;
    if (!text) continue;
    if (field.key === 'slug' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text))
      errors[field.key] = 'Use lowercase letters, digits and single hyphens.';
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text))
      errors[field.key] = 'Enter a valid email address.';
    if (field.options && !field.options.includes(text))
      errors[field.key] = 'Choose one of the listed options.';
    if (
      field.type === 'date' &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(text) ||
        !Number.isFinite(Date.parse(text)) ||
        new Date(text).toISOString().slice(0, 10) !== text)
    )
      errors[field.key] = 'Enter a valid date.';
    if (field.type === 'time' && !/^([01]\d|2[0-3]):[0-5]\d$/.test(text))
      errors[field.key] = 'Enter a valid 24-hour time.';
    if (field.type === 'image' && !/^\/(?:art\/[a-z0-9-]+\.svg|api\/media\/[a-f0-9-]+)$/.test(text))
      errors[field.key] = 'Upload an image or select a bundled /art/ illustration.';
    if (field.key === 'phone' && !/^[+\d][\d\s()-]{6,24}$/.test(text))
      errors[field.key] = 'Enter a phone number using digits, spaces, +, parentheses or hyphens.';
    if (field.key === 'href' && !/^\/[a-z0-9/#?=&_-]*$/i.test(text))
      errors[field.key] = 'Use an internal site path beginning with a single slash.';
    if (
      ['starts', 'expires'].includes(field.key) &&
      (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(text) || !Number.isFinite(Date.parse(text)))
    )
      errors[field.key] = 'Use a UTC timestamp ending in Z.';
  }
  if (collection === 'schedule' && String(data.end) <= String(data.time))
    errors.end = 'End time must follow start time on the same day.';
  if (
    collection === 'teams' &&
    data.confirmed &&
    (String(data.email).endsWith('@example.org') ||
      /^0[\s0]*\d?$/.test(String(data.phone)) ||
      String(data.person).includes('(sample)'))
  )
    errors.confirmed = 'Replace all dummy contact details before marking this team verified.';
  if (collection === 'event' && (data.dates as string[]).some((line) => !/^.+\s\|\s.+$/.test(line)))
    errors.dates = 'Use Label | Date for each entry.';
  if (
    collection === 'notices' &&
    data.starts &&
    data.expires &&
    String(data.expires) <= String(data.starts)
  )
    errors.expires = 'The expiry must be after the start.';
  return { data, errors };
}
export interface CmsDocument {
  id: string;
  collection: Collection;
  data: ContentData;
  version: number;
  publishedVersion: number | null;
  archived: boolean;
  updatedAt: string;
  state: 'draft' | 'published' | 'changes' | 'archived';
}
export type Intent = 'draft' | 'publish' | 'archive' | 'unarchive';
