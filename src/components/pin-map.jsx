"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Sükhbaatar Square — where the map sits until a real point is known.
export const UB_CENTER = [47.9184, 106.9177];

// A sugo-red pin drawn inline, so the map never depends on Leaflet's default
// marker images (which need extra bundler config to resolve under Next.js).
function pinIcon(L) {
  return L.divIcon({
    className: "",
    html: `<svg width="30" height="40" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 3px 3px rgba(0,0,0,.4))">
      <path d="M17 45C17 45 32 28.5 32 17C32 8.16 25.28 1 17 1C8.72 1 2 8.16 2 17C2 28.5 17 45 17 45Z" fill="#a81f1c" stroke="#fdf8ec" stroke-width="2"/>
      <circle cx="17" cy="17" r="6.5" fill="#fdf8ec"/>
    </svg>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
  });
}

// One pin on an OpenStreetMap tile layer. Passing `onMove` makes the pin
// draggable and the map clickable — the customer's address picker needs that,
// the kitchen's read-only view does not.
export function PinMap({ lat, lon, zoom = 16, onMove }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  const hasPoint = Number.isFinite(lat) && Number.isFinite(lon);

  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !elRef.current || mapRef.current) return;

      const start = hasPoint ? [lat, lon] : UB_CENTER;
      const map = L.map(elRef.current, { attributionControl: false }).setView(
        start,
        hasPoint ? zoom : 12,
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(
        map,
      );
      L.control.attribution({ prefix: false }).addAttribution("© OpenStreetMap").addTo(map);

      const draggable = Boolean(onMoveRef.current);
      const marker = L.marker(start, { icon: pinIcon(L), draggable }).addTo(map);

      if (draggable) {
        marker.on("dragend", () => {
          const { lat: dLat, lng } = marker.getLatLng();
          onMoveRef.current(dLat, lng);
        });
        map.on("click", (event) => {
          marker.setLatLng(event.latlng);
          onMoveRef.current(event.latlng.lat, event.latlng.lng);
        });
      }

      mapRef.current = map;
      markerRef.current = marker;
      requestAnimationFrame(() => map.invalidateSize());
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // Built once per mount; the effect below follows later point changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasPoint || !mapRef.current || !markerRef.current) return;
    const latlng = [lat, lon];
    markerRef.current.setLatLng(latlng);
    mapRef.current.setView(latlng, Math.max(mapRef.current.getZoom(), zoom));
  }, [lat, lon, zoom, hasPoint]);

  return <div ref={elRef} className="h-full w-full" />;
}
