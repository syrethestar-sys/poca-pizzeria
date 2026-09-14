"use client";

import { useEffect, useRef, useState } from "react";
import { Crosshair, MapPin, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { reverseGeocode, searchPlaces } from "@/lib/geocode";
import { useLanguage } from "@/providers/language-provider";
import { useLocation } from "@/providers/location-provider";

// OpenStreetMap's own embed. A small bbox around the point gives a street-level
// view, and `marker` drops the pin.
function MapPreview({ place, height = 150 }) {
  const d = 0.004;
  const bbox = [place.lon - d, place.lat - d / 2, place.lon + d, place.lat + d / 2].join("%2C");

  return (
    <iframe
      title={place.label}
      height={height}
      className="w-full rounded-md border border-border"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${place.lat}%2C${place.lon}`}
    />
  );
}

export function LocationPicker() {
  const { location, setLocation } = useLocation();
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef(null);

  // Nominatim asks for at most one request a second, so wait for a pause in
  // typing before asking.
  useEffect(() => {
    if (!open || query.trim().length < 3) {
      setResults([]);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setBusy(true);
      setError("");
      try {
        setResults(await searchPlaces(query, { signal: controller.signal }));
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setBusy(false);
      }
    }, 450);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, open]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const confirm = (place) => {
    setLocation(place);
    setOpen(false);
    setQuery("");
    setResults([]);
    setPreview(null);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError(t("location.noGeolocation"));
      return;
    }
    setBusy(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          confirm(await reverseGeocode(position.coords.latitude, position.coords.longitude));
        } catch (err) {
          setError(err.message);
        } finally {
          setBusy(false);
        }
      },
      () => {
        setBusy(false);
        setError(t("location.denied"));
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex h-9 w-[190px] shrink-0 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-left hover:border-foreground"
      >
        <MapPin className="size-4 shrink-0 text-sugo" />
        <span className="truncate text-[12px]">
          {location ? (
            location.label
          ) : (
            <span className="text-muted-foreground">{t("location.set")}</span>
          )}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[min(92vw,360px)] rounded-md border border-border bg-card p-3 shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-muted-foreground">
              {t("location.title")}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("action.close")}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4 spin-on-hover" />
            </button>
          </div>

          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("location.placeholder")}
            className="mt-2.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />

          <button
            type="button"
            onClick={useMyLocation}
            className="mt-2 flex w-full items-center gap-2 rounded-md px-2 py-2 text-[13px] text-sugo hover:bg-muted"
          >
            <Crosshair className="size-4" />
            {t("location.useMine")}
          </button>

          {busy && (
            <p className="mt-2 px-2 text-[12px] text-muted-foreground">{t("location.searching")}</p>
          )}
          {error && <p className="mt-2 px-2 text-[12px] text-destructive">{error}</p>}

          {results.length > 0 && (
            <ul className="mt-2 max-h-64 overflow-y-auto border-t border-border pt-2">
              {results.map((place) => (
                <li key={place.id}>
                  <button
                    type="button"
                    onClick={() => setPreview(place)}
                    className="w-full rounded-md px-2 py-2 text-left hover:bg-muted"
                  >
                    <span className="block text-[13px]">{place.label}</span>
                    <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                      {place.full}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {(preview ?? location) && (
            <div className="mt-3 border-t border-border pt-3">
              <MapPreview place={preview ?? location} />
              <p className="mt-2 text-[12px] leading-snug text-muted-foreground">
                {(preview ?? location).full}
              </p>
              {preview && (
                <div className="mt-2 flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => confirm(preview)}>
                    {t("location.confirm")}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setPreview(null)}>
                    {t("location.back")}
                  </Button>
                </div>
              )}
            </div>
          )}

          {location && (
            <button
              type="button"
              onClick={() => {
                setLocation(null);
                setOpen(false);
              }}
              className="mt-2 w-full rounded-md border border-border px-2 py-2 text-[12px] text-muted-foreground hover:text-destructive"
            >
              {t("location.clear")}
            </button>
          )}

          <p className="mt-3 px-2 text-[10px] text-muted-foreground/70">{t("location.credit")}</p>
        </div>
      )}
    </div>
  );
}
