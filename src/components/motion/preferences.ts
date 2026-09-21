'use client';
import { useSyncExternalStore } from 'react';

const eventName = 'expo-motion-change';
function subscribe(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', callback);
  window.addEventListener(eventName, callback);
  window.addEventListener('storage', callback);
  return () => {
    query.removeEventListener('change', callback);
    window.removeEventListener(eventName, callback);
    window.removeEventListener('storage', callback);
  };
}
function snapshot() {
  let disabled = false;
  try {
    disabled = localStorage.getItem('expo-reduce-motion') === 'true';
  } catch {}
  return disabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, () => true);
}
export function toggleMotion() {
  try {
    localStorage.setItem('expo-reduce-motion', String(!snapshot()));
  } catch {}
  window.dispatchEvent(new Event(eventName));
}
