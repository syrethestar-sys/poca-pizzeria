// OpenStreetMap Nominatim. Free, no key, but rate-limited to roughly one
// request a second — every caller here is debounced or user-initiated.
// Results are biased to Mongolia since that is where the restaurant delivers.
const BASE = "https://nominatim.openstreetmap.org";

const shorten = (result) => {
  const a = result.address ?? {};
  // Only a minority of Ulaanbaatar buildings carry addr:housenumber in OSM,
  // but when one does it is the most useful part of the address — keep it.
  const street = [a.road, a.house_number].filter(Boolean).join(" ");
  const parts = [
    street,
    a.neighbourhood ?? a.suburb ?? a.quarter,
    a.city ?? a.town ?? a.village ?? a.district,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : result.display_name;
};

export async function searchPlaces(query, { signal } = {}) {
  if (!query || query.trim().length < 3) return [];

  const url = new URL(`${BASE}/search`);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "6");
  url.searchParams.set("countrycodes", "mn");
  url.searchParams.set("accept-language", "mn,en");

  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Address search is unavailable right now");

  const data = await response.json();
  return data.map((result) => ({
    id: `${result.osm_type}-${result.osm_id}`,
    label: shorten(result),
    full: result.display_name,
    lat: Number(result.lat),
    lon: Number(result.lon),
  }));
}

export async function reverseGeocode(lat, lon) {
  const url = new URL(`${BASE}/reverse`);
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "mn,en");

  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not read that position");

  const result = await response.json();
  return {
    id: `point-${lat},${lon}`,
    label: shorten(result),
    full: result.display_name,
    lat: Number(lat),
    lon: Number(lon),
  };
}
