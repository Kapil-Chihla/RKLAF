# Task: CFJ-inspired Where We Work / Impact Map

## Objective
Match RKLAF "Where We Work" UI to CFJ references; location details open as full-page overlay on pin click.

## Current State
- **Homepage** (`WhereWeWorkSection.jsx`): Full-width map preview; click pin opens full-page modal overlay with location summary.
- **Impact page** (`ImpactMapPage.jsx`): Interactive map with filters; click pin opens same full-page modal (not dot-anchored hover tooltip).
- **Components**: `ImpactMap.jsx`, `MapLocationModal.jsx`, `MapLocationDetails.jsx`, `ImpactMap.css`.

## Decisions Made
- Pin click (not hover) opens location details
- Modal uses `createPortal` to `document.body` — fixed overlay over entire viewport with backdrop blur
- Close via backdrop click, × button, or Escape; body scroll locked while open
- Interactive map syncs `?location=` URL param when modal opens/closes
- Preview homepage: click pin → modal; click map background → navigate to full impact page

## Constraints
- Heritage Legal palette from `index.css`
- Map locations from API + admin `/admin/map`

## Progress
- CFJ layout structure implemented
- Hover tooltips removed; replaced with full-page modal overlay
- URL param sync for shareable location links on impact page

## Next Steps
- User review in browser
- Tune pin mapX/mapY in admin if misaligned

## Notes
- Assets: `frontend/src/assets/map.webp`, `world.webp`
- Removed unused `MapLocationTooltip.jsx`
