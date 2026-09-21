'use client';
import { useState, useRef } from 'react';
import type { FormEvent } from 'react';
export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [valid, setValid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    const value = (key: string) => String(data.get(key) || '').trim();
    if (value('name').length < 2) next.name = 'Enter your name (at least 2 characters).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email')))
      next.email = 'Enter a valid email address.';
    if (value('phone') && !/^\+?[\d\s()-]{7,20}$/.test(value('phone')))
      next.phone = 'Enter a valid phone number or leave this blank.';
    if (!value('subject')) next.subject = 'Choose a subject.';
    if (value('message').length < 20)
      next.message = 'Please include at least 20 characters in your message.';
    setErrors(next);
    setValid(!Object.keys(next).length);
    if (Object.keys(next).length)
      setTimeout(
        () => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
        0,
      );
  }
  return (
    <form
      ref={formRef}
      className="contact-form"
      noValidate
      onSubmit={submit}
      onChange={() => setValid(false)}
    >
      <h2>Send an enquiry</h2>
      <p>This preview validates your message locally. Nothing is sent or stored.</p>
      <div className="form-grid">
        {[
          { name: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
          { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
          { name: 'phone', label: 'Phone (optional)', type: 'tel', autoComplete: 'tel' },
        ].map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              {...field}
              id={field.name}
              required={field.name !== 'phone'}
              maxLength={field.name === 'phone' ? 20 : 120}
              aria-invalid={!!errors[field.name]}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
            />
            {errors[field.name] && (
              <p className="field-error" id={`${field.name}-error`}>
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
        <div>
          <label htmlFor="subject">Subject</label>
          <select
            id="subject"
            name="subject"
            required
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
          >
            <option value="">Select a subject</option>
            {[
              'Project submission',
              'Visitor information',
              'Accessibility support',
              'Other enquiry',
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {errors.subject && (
            <p className="field-error" id="subject-error">
              {errors.subject}
            </p>
          )}
        </div>
      </div>
      <label htmlFor="message">Message</label>
      <textarea
        id="message"
        name="message"
        rows={6}
        minLength={20}
        maxLength={3000}
        required
        aria-invalid={!!errors.message}
        aria-describedby={errors.message ? 'message-error' : undefined}
      />
      {errors.message && (
        <p className="field-error" id="message-error">
          {errors.message}
        </p>
      )}
      <button className="button button-primary" type="submit">
        Check enquiry
      </button>
      <div role="status">
        {valid && (
          <p className="form-success">
            Your enquiry is ready, but has not been sent. Message delivery will become available
            when the organisers configure the official contact service.
          </p>
        )}
      </div>
    </form>
  );
}
