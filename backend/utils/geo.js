/** Convert lat/lng to % position on a 2:1 equirectangular map (viewBox 1000×500). */
function latLngToMapPercent(lat, lng) {
  const mapX = ((Number(lng) + 180) / 360) * 100;
  const mapY = ((90 - Number(lat)) / 180) * 100;
  return {
    mapX: Math.min(98, Math.max(2, Math.round(mapX * 10) / 10)),
    mapY: Math.min(96, Math.max(4, Math.round(mapY * 10) / 10)),
  };
}

module.exports = { latLngToMapPercent };
