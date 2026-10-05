# Little Umbrella — Cafe Website

A warm, cozy, premium-feeling site that drives online orders and in-person visits, with the menu front and center.

## Pages
- **Home** — big welcoming photo, "Order online" + "Visit us" buttons, 4.7 rating from 268 Google reviews, menu highlights (coffee, breakfast wraps, bakery), "Work & study friendly" strip (free Wi-Fi, outlets, indoor + outdoor seating), location teaser.
- **Menu** — grouped: Coffee & Espresso (Americano, Cappuccino), Lattes & More (Matcha, Chai, Turmeric, Smoothies), Breakfast & Savory (breakfast wraps, artichoke wrap, ham & avocado sandwich, grilled cheese, chia pudding), Bakery (croissants, mushroom Danish, chocolate chip cookies). No prices shown until you provide them.
- **Visit** — address, phone (tap to call), map, opening hours (placeholder until you share real hours), amenities.
- **About** — short story of a cozy neighbourhood cafe in West Point Grey (placeholder text to replace with your real story).

"Order online" buttons appear on every page header and link to your Google ordering link (need the exact URL).

## Look & feel
- Warm cream background, terracotta accent, deep espresso brown text, soft sage secondary.
- Elegant serif headings (Fraunces) with a clean body font (Karla); rounded corners, soft shadows, gentle fade-ins.
- Your real photos and logo will be used once uploaded; temporary warm cafe images until then.

## Still needed from you
- Photos and logo (you'll upload)
- Online ordering link
- Opening hours, prices (optional), short brand story

## Technical details
- Routes: `/`, `/menu`, `/visit`, `/about`, each with own head() metadata.
- Shared header/footer in `__root.tsx`; design tokens in `src/styles.css`; fonts via `<link>`.
- Map via Google Maps embed (iframe, no backend needed).
