# CTS — Complete Tyre Solutions

A marketing/storefront single-page application for **CTS**, a tyre retailer.
Built with **React 19**, **TypeScript**, **Vite**, and **React Router 7**.

## Features

- Responsive marketing site: Home, Services, Tyres, About Us, Contact, and a 404 page.
- Shared, single-source-of-truth navigation and footer (no per-page duplication).
- Client-side routing with backwards-compatible redirects (`/tires` → `/tyres`, `/service` → `/services`).
- Scroll-restoration on navigation.
- Strict TypeScript + ESLint for a clean, type-safe codebase.

## Tech Stack

| Concern        | Choice                          |
| -------------- | ------------------------------- |
| Framework      | React 19                        |
| Language       | TypeScript (strict)             |
| Build tool     | Vite 8                          |
| Routing        | react-router-dom 7              |
| Styling        | Global CSS + Tailwind (v4)      |
| Linting        | ESLint 10 + typescript-eslint   |

## Getting Started

### Prerequisites

- Node.js **>= 20** (developed on Node 22)
- npm **>= 10**

### Install

```bash
npm install
```

### Develop

```bash
npm run dev
```

Then open the printed URL (default http://localhost:5173).

### Other Scripts

| Script              | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Start the Vite dev server with HMR.                  |
| `npm run build`     | Type-check (`tsc --noEmit`) then build for production.|
| `npm run typecheck` | Run the TypeScript compiler in check-only mode.      |
| `npm run lint`      | Lint all `.ts`/`.tsx` files.                         |
| `npm run preview`   | Preview the production build locally.                |

## Project Structure

```
.
├── index.html              # App entry HTML
├── src/
│   ├── main.tsx            # React/Router bootstrap
│   ├── App.tsx             # Route definitions (+ redirects, 404)
│   ├── index.css           # Global styles (design tokens, layout, responsive)
│   ├── config/
│   │   └── site.ts         # Single source of truth: routes, nav, contact, brands
│   ├── components/
│   │   ├── Layout.tsx      # Page shell: Navbar + <Outlet/> + Footer
│   │   ├── Navbar.tsx      # Responsive site navigation
│   │   ├── Footer.tsx      # Site footer
│   │   ├── Logo.tsx        # Brand wheel mark + word mark
│   │   ├── SocialIcons.tsx # Footer social links
│   │   └── ScrollToTop.tsx # Scroll to top on route change
│   └── pages/
│       ├── Home.tsx
│       ├── Services.tsx
│       ├── Tyres.tsx
│       ├── AboutUs.tsx
│       ├── ContactUs.tsx
│       └── NotFound.tsx
└── eslint.config.js / tsconfig.json / vite.config.js
```

## Routing

Canonical routes are defined once in `src/config/site.ts` (`ROUTES`) and consumed
everywhere (navbar, footer, page CTAs) so links can never drift out of sync.

| Path         | Page        |
| ------------ | ----------- |
| `/`          | Home        |
| `/services`  | Services    |
| `/tyres`     | Tyres       |
| `/aboutus`   | About Us    |
| `/contactus` | Contact     |
| `*`          | 404         |

Legacy paths `/tires` and `/service` permanently redirect to their canonical
equivalents.

## Notes / Next Steps

- The contact form currently acknowledges submissions client-side only; wire it
  to a backend/email service for production use.
- Product (tyre) data is mocked in `src/pages/Tyres.tsx`; replace with an API.
