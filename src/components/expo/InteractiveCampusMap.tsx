'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MapPin, LocateFixed, Copy, ArrowUpRight } from 'lucide-react';
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MarkerLabel,
  useMap,
  type MapRef,
} from '@/components/ui/map';
import { campus } from '@/data/venue';
import { useReducedMotion } from '@/components/motion/preferences';
function MapStatus({ onError }: { onError: (value: string) => void }) {
  const { map } = useMap();
  useEffect(() => {
    if (!map) return;
    const error = () =>
      onError('Some map tiles could not load. You can still open directions below.');
    map.on('error', error);
    return () => {
      map.off('error', error);
    };
  }, [map, onError]);
  return null;
}
export default function InteractiveCampusMap() {
  const map = useRef<MapRef>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState<{ longitude: number; latitude: number } | null>(null);
  const reduced = useReducedMotion();
  return (
    <>
      <div className="campus-map-toolbar">
        <span>
          <MapPin size={17} aria-hidden="true" />
          Campus location
        </span>
        <div>
          <button
            type="button"
            onClick={() =>
              map.current?.flyTo({
                center: [campus.longitude, campus.latitude],
                zoom: campus.zoom,
                bearing: 0,
                pitch: 0,
                duration: reduced ? 0 : 600,
              })
            }
            aria-label="Recenter on campus"
          >
            <LocateFixed size={18} />
          </button>
          <button
            type="button"
            aria-pressed={theme === 'dark'}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            Dark map
          </button>
        </div>
      </div>
      <div
        className="interactive-campus-map"
        role="region"
        aria-label="Interactive map of EGS Pillay Campus"
      >
        <Map
          ref={map}
          center={[campus.longitude, campus.latitude]}
          zoom={campus.zoom}
          minZoom={3}
          maxZoom={19}
          theme={theme}
          scrollZoom={false}
          cooperativeGestures
        >
          <MapStatus onError={setMessage} />
          <MapControls
            position="top-right"
            showZoom
            showCompass
            showLocate
            showFullscreen
            onLocate={(coords) => {
              setLocation(coords);
              setMessage(
                'Your location is shown on this device only. Use Recenter to return to campus.',
              );
            }}
            onLocateError={() =>
              setMessage(
                'Location permission was denied or unavailable. Use the campus pin or open directions instead.',
              )
            }
          />
          <MapMarker longitude={campus.longitude} latitude={campus.latitude}>
            <MarkerContent>
              <button className="campus-pin" aria-label="Show EGS Pillay Campus details">
                <MapPin size={27} aria-hidden="true" />
              </button>
            </MarkerContent>
            <MarkerLabel position="bottom">EGS Pillay Campus</MarkerLabel>
            <MarkerTooltip>Science Expo 2026 · Campus location</MarkerTooltip>
            <MarkerPopup closeButton className="campus-popup" maxWidth="290px">
              <p className="eyebrow">Science Expo 2026</p>
              <h3>{campus.name}</h3>
              <p>Nagapattinam, Tamil Nadu</p>
              <p>Registration is offline only. Check the team page for desk details.</p>
              <Link href="/help-desk/registration" className="text-link">
                Registration help desk →
              </Link>
              <a className="text-link" href={campus.directions} target="_blank" rel="noreferrer">
                Get directions <ArrowUpRight size={16} />
              </a>
            </MarkerPopup>
          </MapMarker>
          {location && (
            <MapMarker longitude={location.longitude} latitude={location.latitude}>
              <MarkerContent>
                <span className="your-location-dot" aria-label="Your approximate location" />
              </MarkerContent>
              <MarkerTooltip>Your approximate location</MarkerTooltip>
            </MapMarker>
          )}
        </Map>
      </div>
      <div className="campus-map-actions">
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(`${campus.latitude}, ${campus.longitude}`);
              setMessage('Campus coordinates copied.');
            } catch {
              setMessage(`Campus coordinates: ${campus.latitude}, ${campus.longitude}`);
            }
          }}
        >
          <Copy size={16} />
          Copy coordinates
        </button>
        <a href={campus.directions} target="_blank" rel="noreferrer">
          Get directions <ArrowUpRight size={16} />
        </a>
      </div>
      <p className="map-feedback" role="status">
        {message || 'Select the campus marker for details. Use + and − to zoom; drag to explore.'}
      </p>
    </>
  );
}
