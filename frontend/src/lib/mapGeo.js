/** Match backend/utils/geo.js — equirectangular 2:1 world map */
export function latLngToMapPercent(lat, lng) {
  const mapX = ((Number(lng) + 180) / 360) * 100;
  const mapY = ((90 - Number(lat)) / 180) * 100;
  return {
    mapX: Math.min(98, Math.max(2, Math.round(mapX * 10) / 10)),
    mapY: Math.min(96, Math.max(4, Math.round(mapY * 10) / 10)),
  };
}

export function mapPercentToLatLng(mapX, mapY) {
  const lng = (Number(mapX) / 100) * 360 - 180;
  const lat = 90 - (Number(mapY) / 100) * 180;
  return {
    lat: Math.round(lat * 10000) / 10000,
    lng: Math.round(lng * 10000) / 10000,
  };
}
