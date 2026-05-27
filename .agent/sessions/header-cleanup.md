# Task: header-cleanup

## Objective
Remove intrusive WhatsApp float, clean up header nav (remove Media/Join Us, single Donate button), improve header appearance.

## Current State
- WhatsAppFloat component deleted; removed from Layout
- whatsapp-float CSS removed from index.css
- navigation.js: removed Join Us, Media Coverage, Donate from navItems
- Header: single Donate in header-actions (desktop); mobile donate in slide-out menu footer
- Header CSS: 3-column grid (brand | centered nav | actions), refined typography, backdrop for mobile menu
- Build passes

## Decisions Made
- Keep WhatsApp link in footer only (WHATSAPP_URL in navigation.js)
- Donate only as action button, not nav link
- Media/Join Us pages still routed but not in header

## Constraints
- Heritage Legal palette (beige, blue, ivory, wine)
- Mobile responsive slide-out nav

## Progress
- Removed floating WhatsApp icon
- Header nav trimmed and restyled
- Fixed motionless JSX typos
- Fixed broken CSS from dropdown edit

## Next Steps
- User review of header on desktop/tablet
- Optional: smaller subtle WhatsApp in footer only
- Logo replacement when asset available

## Notes
- Footer still links to WhatsApp via WHATSAPP_URL
