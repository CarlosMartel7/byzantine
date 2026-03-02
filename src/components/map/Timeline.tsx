'use client'

import { useCallback, useRef } from 'react'
import { Play, Pause } from 'lucide-react'
import {
  useByzantineStore,
  selectYear,
  selectIsPlaying,
} from '@/store/useByzantineStore'
import { TIMELINE_EVENTS, REIGN_START, REIGN_END } from '@/data/cities'

const CATEGORY_COLORS: Record<string, string> = {
  military:   'border-red-800/60 text-red-300/70',
  law:        'border-amber-600/60 text-amber-300/70',
  religion:   'border-sky-700/60 text-sky-300/70',
  disaster:   'border-orange-700/60 text-orange-300/70',
  diplomacy:  'border-emerald-700/60 text-emerald-300/70',
  culture:    'border-purple-700/60 text-purple-300/70',
}

const CATEGORY_COLORS_ACTIVE: Record<string, string> = {
  military:   'border-red-500 text-red-200 bg-red-950/40',
  law:        'border-amber-400 text-amber-200 bg-amber-950/40',
  religion:   'border-sky-400 text-sky-200 bg-sky-950/40',
  disaster:   'border-orange-400 text-orange-200 bg-orange-950/40',
  diplomacy:  'border-emerald-400 text-emerald-200 bg-emerald-950/40',
  culture:    'border-purple-400 text-purple-200 bg-purple-950/40',
}

export function Timeline() {
  const year = useByzantineStore(selectYear)
  const isPlaying = useByzantineStore(selectIsPlaying)
  const setYear = useByzantineStore((s) => s.setYear)
  const playTimeline = useByzantineStore((s) => s.playTimeline)
  const pauseTimeline = useByzantineStore((s) => s.pauseTimeline)

  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const pct = (year - REIGN_START) / (REIGN_END - REIGN_START)

  const yearFromEvent = useCallback((clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    setYear(REIGN_START + p * (REIGN_END - REIGN_START))
  }, [setYear])

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 px-10 pb-7 pt-16"
      style={{ background: 'linear-gradient(to top, rgba(5,6,8,0.97) 60%, transparent)' }}>

      {/* Labels */}
      <div className="flex justify-between mb-2.5">
        <span className="font-display text-[10px] tracking-[0.3em] text-amber-700/70 uppercase">
          {REIGN_START} AD
        </span>
        <span className="font-display text-[10px] tracking-[0.3em] text-amber-700/70 uppercase">
          Drag to travel through time
        </span>
        <span className="font-display text-[10px] tracking-[0.3em] text-amber-700/70 uppercase">
          {REIGN_END} AD
        </span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-[2px] bg-amber-900/50 cursor-pointer mb-3"
        onMouseDown={(e) => { isDragging.current = true; yearFromEvent(e.clientX) }}
        onMouseMove={(e) => { if (isDragging.current) yearFromEvent(e.clientX) }}
        onMouseUp={() => { isDragging.current = false }}
        onMouseLeave={() => { isDragging.current = false }}
      >
        {/* Fill */}
        <div
          className="absolute left-0 top-0 h-full pointer-events-none"
          style={{
            width: `${pct * 100}%`,
            background: 'linear-gradient(to right, #78560a, #f0d080)',
          }}
        />

        {/* Event ticks */}
        {TIMELINE_EVENTS.map((ev) => {
          const tickPct = (ev.year - REIGN_START) / (REIGN_END - REIGN_START)
          const isPast = ev.year <= year
          return (
            <div
              key={`${ev.year}-${ev.label}`}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[3px] h-[6px] cursor-pointer"
              style={{ left: `${tickPct * 100}%`, background: isPast ? '#c9a84c' : '#3a2c14' }}
              onClick={(e) => { e.stopPropagation(); setYear(ev.year) }}
            />
          )
        })}

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-amber-200 bg-[#050608] cursor-grab active:cursor-grabbing pointer-events-none"
          style={{
            left: `${pct * 100}%`,
            boxShadow: '0 0 12px rgba(201,168,76,0.7)',
          }}
        />
      </div>

      {/* Event chips + play */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={isPlaying ? pauseTimeline : playTimeline}
          className="flex-shrink-0 w-7 h-7 rounded-full border border-amber-700/60 flex items-center justify-center text-amber-400/80 hover:border-amber-400 hover:text-amber-200 transition-all"
        >
          {isPlaying
            ? <Pause className="w-3 h-3" />
            : <Play className="w-3 h-3 translate-x-px" />
          }
        </button>

        {/* Chips */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none flex-1">
          {TIMELINE_EVENTS.map((ev) => {
            const isActive = ev.year <= year
            const colorClass = isActive
              ? CATEGORY_COLORS_ACTIVE[ev.category]
              : CATEGORY_COLORS[ev.category]
            return (
              <button
                key={`chip-${ev.year}-${ev.label}`}
                onClick={() => setYear(ev.year)}
                className={`flex-shrink-0 font-display text-[9px] tracking-[0.12em] uppercase border px-2 py-1 rounded-sm transition-all duration-200 whitespace-nowrap ${colorClass} ${isActive ? 'opacity-100' : 'opacity-40'}`}
              >
                {ev.year} · {ev.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
