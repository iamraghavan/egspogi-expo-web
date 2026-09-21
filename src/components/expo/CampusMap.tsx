'use client';
import dynamic from 'next/dynamic';
import { Component, type ReactNode } from 'react';
import { campus } from '@/data/venue';
const InteractiveMap = dynamic(() => import('./InteractiveCampusMap'), {
  ssr: false,
  loading: () => (
    <div className="map-loading" role="status">
      Loading the campus map…
    </div>
  ),
});
class MapBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="map-loading">
        <p>The interactive map is unavailable in this browser.</p>
        <a className="text-link" href={campus.directions} target="_blank" rel="noreferrer">
          Open campus directions ↗
        </a>
      </div>
    ) : (
      this.props.children
    );
  }
}
export function CampusMap() {
  return (
    <div className="campus-map-shell">
      <MapBoundary>
        <InteractiveMap />
      </MapBoundary>
      <p className="map-footnote">
        Confirmed campus pin · Desk and parking locations are not yet mapped. Map tiles provided by
        CARTO / OpenStreetMap.
      </p>
    </div>
  );
}
