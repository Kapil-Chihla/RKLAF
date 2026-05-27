# Task: CFJ-inspired Where We Work / Impact Map

## Objective
Match RKLAF "Where We Work" UI to CFJ references (cfj.org homepage + /our-work/where-we-work/).

## Current State
- **Homepage** (`WhereWeWorkSection.jsx`): Full-width `map.webp` edge-to-edge; copy absolutely overlaid left (CFJ-style); no fixed-height crop.
- **Map display**: `map.webp` shown at natural aspect ratio (`width: 100%; height: auto`) — no `object-fit: cover` crop on top/bottom.
- **Impact page** (`ImpactMapPage.jsx`): `world.webp` hero, centered white title, torn-edge transition, two-column intro, interactive map with white filter bar on cream, cyan glowing pins, popups.
- **Components**: `TornEdge.jsx`, `ImpactMap.jsx` (preview | interactive), CSS split (`WhereWeWorkHome.css`, `ImpactMap.css`, `ImpactMapPage.css`).

## Decisions Made
- `world.webp` for impact page hero only; `map.webp` for all map frames
- Preview pins: wine/maroon; interactive pins: cyan glow (matches map.webp art)
- Map height contained via clamp (not full viewport) to avoid awkward crop
- Filters: Region, Country, Type of work + Clear all (CFJ-style white dropdowns on cream)

## Constraints
- Heritage Legal palette from `index.css`
- Map locations from API + admin `/admin/map`

## Progress
- CFJ layout structure implemented
- Torn paper hero edge added
- Homepage + impact page restyled

## Next Steps
- User review in browser; tune pin mapX/mapY in admin if misaligned
- Optional: program cards row below intro (TrialWatch / WJFW style from CFJ)
- Optional: full-bleed homepage map with text overlay (closer to cfj.org homepage if desired)

## Notes
- Assets: `frontend/src/assets/map.webp`, `world.webp`
- Reference: https://cfj.org/our-work/where-we-work/ , https://cfj.org/
