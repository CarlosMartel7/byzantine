'use client'

import dynamic from 'next/dynamic'
import { useByzantineStore, selectYear, selectIsLoaded } from '@/store/useByzantineStore'
import { Timeline } from '@/components/map/Timeline'
import { CityPanel } from '@/components/map/CityPanel'

// Three.js must be client-only — no SSR
const MapCanvas = dynamic(
  () => import('@/components/map/MapCanvas').then((m) => m.MapCanvas),
  { ssr: false }
)

export default function ByzantiumMapPage() {
  const year = useByzantineStore(selectYear)
  const isLoaded = useByzantineStore(selectIsLoaded)

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050608]">
      {/* ── Loading screen ── */}
      <div
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050608] transition-opacity duration-700 ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <h2 className="font-display-deco text-3xl text-amber-400 tracking-widest mb-2">
          Βυζάντιον
        </h2>
        <p className="font-body italic text-amber-700 text-sm">
          Assembling the empire of Justinian the Great…
        </p>
        <div className="w-48 h-px bg-amber-900/60 mt-6 overflow-hidden relative">
          <div
            className="absolute inset-y-0 w-full"
            style={{
              background: 'linear-gradient(to right, transparent, #f0d080, transparent)',
              animation: 'shimmer 1.2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* ── Three.js canvas (full bleed) ── */}
      <MapCanvas />

      {/* ── Decorative corners ── */}
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />

      {/* ── Header ── */}
      <header
        className="absolute top-0 left-0 right-0 z-10 flex items-start justify-between px-10 pt-6 pb-4 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(5,6,8,0.95) 60%, transparent)' }}
      >
        <div>
          <h1 className="font-display-deco text-[clamp(13px,1.8vw,20px)] text-amber-100 tracking-widest leading-tight">
            Imperium Romanum Orientale
          </h1>
          <p className="font-display text-[10px] tracking-[0.3em] text-amber-700/80 uppercase mt-1">
            Under Justinian I · 527–565 AD
          </p>
        </div>

        <div className="text-right">
          <div
            className="font-display text-[clamp(28px,4vw,52px)] font-black text-amber-100 leading-none"
            style={{ textShadow: '0 0 30px rgba(201,168,76,0.5)' }}
          >
            {year}
          </div>
          <div className="font-display text-[9px] tracking-[0.3em] text-amber-700/70 uppercase mt-0.5">
            Anno Domini
          </div>
        </div>
      </header>

      {/* ── Controls hint ── */}
      <div className="absolute left-8 bottom-32 z-10 pointer-events-none space-y-1">
        {['⟳ Drag to rotate', '◎ Scroll to zoom', '● Click city to explore'].map((hint) => (
          <p key={hint} className="font-display text-[9px] tracking-[0.25em] text-amber-800/60 uppercase">
            {hint}
          </p>
        ))}
      </div>

      {/* ── City detail panel ── */}
      <CityPanel />

      {/* ── Timeline ── */}
      <Timeline />

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
        .scrollbar-none { scrollbar-width: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  )
}

// ─── Corner decoration ────────────────────────────────────────────────────────

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const posClass = {
    tl: 'top-2 left-2',
    tr: 'top-2 right-2 scale-x-[-1]',
    bl: 'bottom-2 left-2 scale-y-[-1]',
    br: 'bottom-2 right-2 scale-[-1]',
  }[pos]

  return (
    <div className={`absolute w-10 h-10 pointer-events-none z-10 opacity-25 ${posClass}`}>
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        <path d="M2 38 L2 2 L38 2" stroke="#c9a84c" strokeWidth="1.5" />
        <path d="M2 2 L10 10" stroke="#c9a84c" strokeWidth="1" />
      </svg>
    </div>
  )
}
