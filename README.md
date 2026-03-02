# Βυζάντιον — Interactive Byzantine Empire Map

An interactive 3D wireframe map of Justinian's empire (527–565 AD), built with Next.js, Three.js, tRPC, MongoDB, and Zustand.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| 3D Graphics | Three.js |
| State | Zustand + subscribeWithSelector |
| Data Fetching | TanStack Query v5 + tRPC |
| Styling | TailwindCSS + custom fonts (Cinzel, EB Garamond) |
| UI Components | shadcn/ui + Radix primitives |
| Icons | Lucide React |
| Database | MongoDB + Mongoose |
| Caching | Redis (ioredis) |
| Validation | Zod (shared between tRPC + forms) |
| Forms | React Hook Form + @hookform/resolvers |
| Config | @t3-oss/env-nextjs |
| Logging | Pino |
| Testing | Jest + Cypress |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, font imports
│   ├── globals.css         # Tailwind + CSS variables
│   └── page.tsx            # Main map page
│
├── components/
│   └── map/
│       ├── ByzantineScene.ts   # Three.js engine (pure class, no React)
│       ├── MapCanvas.tsx       # React wrapper — mounts scene, bridges to Zustand
│       ├── CityPanel.tsx       # Slide-in city detail panel
│       └── Timeline.tsx        # Year slider + event chips
│
├── data/
│   └── cities.ts           # Seed data (10 cities, all events/figures/monuments)
│
├── store/
│   └── useByzantineStore.ts    # Zustand store — year, selection, camera, UI
│
├── types/
│   └── byzantine.ts        # TypeScript domain types
│
└── lib/
    └── validators.ts       # Zod schemas (mirrors types, used by tRPC)

scripts/
└── seed.ts                 # MongoDB population script
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local
# → Set MONGODB_URI and REDIS_URL

# 3. Seed the database
npm run db:seed

# 4. Run the dev server
npm run dev
```

---

## Architecture Decisions

### Why `ByzantineScene` is a plain class, not a hook
Three.js state is mutable and lives entirely outside React's rendering cycle. Keeping it as a class with a clean `destroy()` method makes the lifecycle explicit and avoids the complexity of managing Three.js objects inside React state.

### Why Zustand uses `subscribeWithSelector`
The `ByzantineScene` needs to react to year changes without re-rendering React. `subscribeWithSelector` lets us subscribe directly to slices of state (e.g., `year`) and call `scene.updateYear()` without involving React at all — keeping Three.js updates at 60fps without React overhead.

### Why `dynamic(() => ..., { ssr: false })` for MapCanvas
Three.js accesses `window` and `document` during initialization. SSR would throw. The dynamic import with `ssr: false` is the idiomatic Next.js solution.

### Data flow
```
MongoDB → tRPC router → TanStack Query → Zustand → ByzantineScene
                                       ↘ React components
```

---

## Next Steps

- [ ] Add tRPC router for `/api/trpc/cities` (replace hardcoded data)
- [ ] Add Redis caching layer for city queries
- [ ] Improve terrain with actual Mediterranean coastline geometry
- [ ] Add animated conquest waves (territory colors shift over time)
- [ ] Add city label sprites (Three.js Sprite with canvas texture)
- [ ] Add NextAuth when user features are needed
