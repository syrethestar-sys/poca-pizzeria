"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Crosshair, MapPin, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PinMap } from "@/components/pin-map";
import { reverseGeocode, searchPlaces } from "@/lib/geocode";
import { useLanguage } from "@/providers/language-provider";
import { useLocation } from "@/providers/location-provider";

export function LocationPicker() {
  const { location, setLocation } = useLocation();
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) setPending(location ?? null);
  }, [open, location]);

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
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const pickResult = (place) => {
    setPending(place);
    setQuery("");
    setResults([]);
  };

  const moveTo = async (lat, lon) => {
    setError("");
    setBusy(true);
    try {
      setPending(await reverseGeocode(lat, lon));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
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
          setPending(await reverseGeocode(position.coords.latitude, position.coords.longitude));
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

  const confirm = () => {
    setLocation(pending);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
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

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-60 flex items-center justify-center bg-carbone/60 p-4"
            role="dialog"
            aria-modal="true"
            onClick={() => setOpen(false)}
          >
          <div
            className="flex max-h-[92vh] w-[min(94vw,860px)] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <MapPin className="size-4.5 text-sugo" />
                <h2 className="text-[15px] font-bold tracking-[0.01em]">{t("location.title")}</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("action.close")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 border-b border-border p-4 sm:flex-row">
              <div className="relative flex-1">
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("location.placeholder")}
                  className="h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                />
                {results.length > 0 && (
                  <ul className="absolute inset-x-0 top-full z-10 mt-1.5 max-h-56 overflow-y-auto rounded-md border border-border bg-card shadow-lg">
                    {results.map((place) => (
                      <li key={place.id}>
                        <button
                          type="button"
                          onClick={() => pickResult(place)}
                          className="w-full px-3 py-2.5 text-left hover:bg-muted"
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
              </div>

              <Button type="button" variant="outline" onClick={useMyLocation} className="sm:w-auto">
                <Crosshair className="size-4" />
                {t("location.useMine")}
              </Button>
            </div>

            <div className="h-[46vh] min-h-[280px] w-full bg-muted sm:h-[52vh]">
              <PinMap lat={pending?.lat} lon={pending?.lon} onMove={moveTo} />
            </div>

            <div className="flex flex-col gap-3 p-4">
              {error && <p className="text-[12px] text-destructive">{error}</p>}

              {pending ? (
                <p className="text-[12px] leading-snug text-muted-foreground">
                  {busy ? t("location.searching") : pending.full}
                </p>
              ) : (
                <p className="text-[12px] text-muted-foreground">{t("location.tapHint")}</p>
              )}

              <div className="flex items-center justify-between gap-3">
                {location ? (
                  <button
                    type="button"
                    onClick={() => {
                      setLocation(null);
                      setOpen(false);
                    }}
                    className="text-[12px] text-muted-foreground hover:text-destructive"
                  >
                    {t("location.clear")}
                  </button>
                ) : (
                  <span />
                )}
                <Button type="button" size="lg" disabled={!pending || busy} onClick={confirm}>
                  {t("location.confirm")}
                </Button>
              </div>

              <p className="text-[10px] text-muted-foreground/70">{t("location.credit")}</p>
            </div>
          </div>
          </div>,
          document.body,
        )}
    </>
  );
}
