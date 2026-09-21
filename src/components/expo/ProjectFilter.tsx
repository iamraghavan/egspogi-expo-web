'use client';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import type { Project } from '@/types';
import { themes } from '@/data/themes';
import { ProjectCard } from './content';
export function ProjectFilter({
  initialCategory = 'All',
  projects,
}: {
  initialCategory?: string;
  projects: Project[];
}) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState('');
  const filtered = projects.filter(
    (p) =>
      (category === 'All' || p.category === category) &&
      `${p.title} ${p.team} ${p.institution} ${p.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <div className="filter-bar">
        <div className="search-field">
          <label htmlFor="project-search">Search exhibits</label>
          <div>
            <Search size={18} aria-hidden="true" />
            <input
              id="project-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Project, team or idea…"
              type="search"
            />
          </div>
        </div>
        <div className="category-field">
          <label htmlFor="project-category">Science track</label>
          <select
            id="project-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All</option>
            {themes.map((t) => (
              <option key={t.category}>{t.category}</option>
            ))}
          </select>
        </div>
        <button
          className="clear-button"
          onClick={() => {
            setCategory('All');
            setQuery('');
          }}
          disabled={!query && category === 'All'}
        >
          <X size={16} aria-hidden="true" />
          Clear filters
        </button>
      </div>
      <p className="results-count" role="status">
        {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
        {category !== 'All' ? ` in ${category}` : ' across the expo'}
      </p>
      {filtered.length ? (
        <div className="project-grid">
          {filtered.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No exhibits found</h2>
          <p>Try another search or clear the filters to explore all sample projects.</p>
        </div>
      )}
    </>
  );
}
