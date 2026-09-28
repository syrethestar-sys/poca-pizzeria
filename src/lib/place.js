// Where Poca is. Used by the Visit map and its directions link.
// The door, as pinned on Google Maps: on J. Sambuu Street, just west of the
// Flora flower shop, facing the Government Palace garden.
export const POCA_PLACE = {
  lat: 47.922228,
  lon: 106.916247,
};

export const directionsUrl = ({ lat, lon }) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
