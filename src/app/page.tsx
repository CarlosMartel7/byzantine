'use client'

import dynamic from 'next/dynamic'
import { useByzantineStore, selectYear, selectIsLoaded } from '@/store/useByzantineStore'
import { Timeline } from '@/components/map/Timeline'
import { CityPanel } from '@/components/map/CityPanel'
import { FloatingWindows } from '@/components/map/FloatingWindows'

// Three.js must be client-only — no SSR
const MapCanvas = dynamic(
  () => import('@/components/map/MapCanvas').then((m) => m.MapCanvas),
  { ssr: false }
)

export default function ByzantiumMapPage() {
  const year = useByzantineStore(selectYear)
  const isLoaded = useByzantineStore(selectIsLoaded)

  return (
    <main
      className="relative overflow-hidden bg-[#050608]"
      style={{ width: '100vw', height: '100vh' }}
    >
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

      {/* ── Control bar ── */}
      <FloatingWindows />

      {/* ── Three.js canvas — must fill the entire viewport ── */}
      <div className="absolute inset-0">
        <MapCanvas />
      </div>

      {/* ── Decorative corners — fixed size, pointer-events-none ── */}
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />

      {/* ── Header ── */}
      <header
        className="absolute left-0 right-0 z-10 flex items-start justify-between px-10 pt-4 pb-4 pointer-events-none" 
        style={{ background: 'linear-gradient(to bottom, rgba(5,6,8,0.95) 60%, transparent)'}}
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
  const style: React.CSSProperties = {
    position: 'absolute',
    width: 40,
    height: 40,
    opacity: 0.3,
    pointerEvents: 'none',
    zIndex: 10,
    ...(pos === 'tl' && { top: 8, left: 8 }),
    ...(pos === 'tr' && { top: 8, right: 8, transform: 'scaleX(-1)' }),
    ...(pos === 'bl' && { bottom: 8, left: 8, transform: 'scaleY(-1)' }),
    ...(pos === 'br' && { bottom: 8, right: 8, transform: 'scale(-1)' }),
  }

  return (
    <div style={style}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        width={40}
        height={40}
        style={{ display: 'block' }}
      >
        <path d="M2 38 L2 2 L38 2" stroke="#c9a84c" strokeWidth="1.5" />
        <path d="M2 2 L10 10" stroke="#c9a84c" strokeWidth="1" />
      </svg>
    </div>
  )
}
