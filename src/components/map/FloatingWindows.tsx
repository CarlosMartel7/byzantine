'use client'

import { useState, useRef, useCallback } from 'react'
import { RotateCcw, Route, Tag, BookOpen, SlidersHorizontal, X, GripHorizontal, ChevronDown } from 'lucide-react'
import { useByzantineStore } from '@/store/useByzantineStore'
import { FACTION_COLORS } from '@/data/cities'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'

// ─── Data ─────────────────────────────────────────────────────────────────────

const FACTIONS = [
  { id: 'eastern_roman', label: 'Eastern Roman Empire',  description: 'The Byzantine state — direct continuation of Rome in the East' },
  { id: 'ostrogothic',   label: 'Ostrogothic Kingdom',   description: 'Germanic kingdom ruling Italy until Justinian\'s reconquest' },
  { id: 'vandal',        label: 'Vandal Kingdom',         description: 'Germanic kingdom in North Africa, conquered by Belisarius in 533' },
  { id: 'sassanid',      label: 'Sassanid Persia',        description: 'The great eastern rival — the other superpower of late antiquity' },
  { id: 'contested',     label: 'Contested Territory',    description: 'Cities changing hands during active military campaigns' },
]

const MARKER_TYPES = [
  {
    label: 'Capital',
    description: 'Imperial seat of power',
    shape: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <polygon points="8,1 15,8 8,15 1,8" stroke="#f0d080" strokeWidth="1.2" fill="none" />
        <line x1="1" y1="8" x2="15" y2="8" stroke="#f0d080" strokeWidth="0.8" opacity="0.5" />
        <line x1="8" y1="1" x2="8" y2="15" stroke="#f0d080" strokeWidth="0.8" opacity="0.5" />
      </svg>
    ),
  },
  {
    label: 'Major City',
    description: 'Population over 50,000 — key strategic or economic centre',
    shape: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <rect x="1.5" y="1.5" width="9" height="9" stroke="#c9a84c" strokeWidth="1.2" fill="none" />
      </svg>
    ),
  },
  {
    label: 'City',
    description: 'Smaller settlement of regional importance',
    shape: (
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
        <rect x="1" y="1" width="7" height="7" stroke="#8a7040" strokeWidth="1" fill="none" />
      </svg>
    ),
  },
]

// ─── Draggable Window ─────────────────────────────────────────────────────────

interface DraggableWindowProps {
  title: string
  subtitle?: string
  onClose: () => void
  defaultPos: { x: number; y: number }
  children: React.ReactNode
  width?: number
}

function DraggableWindow({ title, subtitle, onClose, defaultPos, children, width = 320 }: DraggableWindowProps) {
  const [pos, setPos] = useState(defaultPos)
  const dragging = useRef(false)
  const offset   = useRef({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return
      setPos({ x: ev.clientX - offset.current.x, y: ev.clientY - offset.current.y })
    }
    const onUp = () => {
      dragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [pos])

  return (
    <div
      ref={windowRef}
      className="fixed z-40 select-none"
      style={{
        left: pos.x,
        top: pos.y,
        width,
        background: 'rgba(6,7,10,0.97)',
        border: '1px solid rgba(201,168,76,0.22)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.05)',
      }}
    >
      {/* Gold top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, #c9a84c80, transparent)' }}
      />

      {/* Drag handle / header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-grab active:cursor-grabbing"
        style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}
        onMouseDown={onMouseDown}
      >
        <div className="flex items-center gap-2 pointer-events-none">
          <GripHorizontal className="w-3 h-3 text-amber-800/40" />
          <div>
            <p className="font-display-deco text-[11px] text-amber-200 tracking-widest leading-none">{title}</p>
            {subtitle && <p className="font-body italic text-[10px] text-amber-700/60 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onClose}
          className="text-amber-800/50 hover:text-amber-400 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
        {children}
      </div>
    </div>
  )
}

// ─── Controls Window Content ──────────────────────────────────────────────────

function ControlsContent() {
  const [routeWidthOpen, setRouteWidthOpen] = useState(true)

  const showRoutes   = useByzantineStore((s) => s.showRoutes)
  const showLabels   = useByzantineStore((s) => s.showLabels)
  const routeLineWidth = useByzantineStore((s) => s.routeLineWidth)
  const toggleRoutes = useByzantineStore((s) => s.toggleRoutes)
  const toggleLabels = useByzantineStore((s) => s.toggleLabels)
  const setRouteLineWidth = useByzantineStore((s) => s.setRouteLineWidth)
  const resetCamera  = useByzantineStore((s) => s.resetCamera)

  return (
    <div className="px-4 py-4 space-y-1">
      <Toggle
        active={showRoutes}
        onCheckedChange={toggleRoutes}
        icon={<Route className="w-3.5 h-3.5" />}
        label="Trade Routes"
        description="Show arcs connecting major cities"
      >
        <div className={`space-y-2 ${showRoutes ? 'opacity-100' : 'opacity-45'}`}>
          <button
            type="button"
            onClick={() => setRouteWidthOpen((v) => !v)}
            className="w-full flex items-center justify-between text-left"
            aria-expanded={routeWidthOpen}
            aria-label="Toggle route width options"
          >
            <p className="font-display text-[8px] tracking-[0.22em] uppercase text-amber-500/80">
              Route Width
            </p>
            <ChevronDown
              className={`w-3.5 h-3.5 text-amber-500/70 transition-transform duration-300 ${routeWidthOpen ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
              routeWidthOpen ? 'grid-rows-[1fr] opacity-100 pb-1' : 'grid-rows-[0fr] opacity-0'
            }`}
            aria-hidden={!routeWidthOpen}
          >
            <div className="min-h-0 space-y-1">
              <div className="flex items-center justify-end">
                <span className="font-body text-[11px] text-amber-300/80">
                  {routeLineWidth.toFixed(1)}
                </span>
              </div>
              <Slider
                min={0.1}
                max={3}
                step={0.1}
                value={[routeLineWidth]}
                disabled={!showRoutes}
                onValueChange={([value]) => setRouteLineWidth(value)}
                className="py-1 [&>span:first-child]:bg-amber-900/40 [&>span:first-child>span]:bg-amber-500 [&_[role=slider]]:border-amber-300/60 [&_[role=slider]]:bg-amber-200 [&_[role=slider]]:focus-visible:ring-amber-300/50"
                aria-label="Trade route line width"
              />
            </div>
          </div>
        </div>
      </Toggle>
      <Toggle
        active={showLabels}
        onCheckedChange={toggleLabels}
        icon={<Tag className="w-3.5 h-3.5" />}
        label="City Labels"
        description="Display city names above markers"
      />

      <div className="pt-2" style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
        <button
          onClick={resetCamera}
          className="w-full flex items-center justify-center gap-2 py-2 font-display text-[9px] tracking-[0.25em] uppercase text-amber-700/70 border border-amber-900/30 hover:border-amber-700/50 hover:text-amber-400 transition-all duration-200 mt-2"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Camera View
        </button>
      </div>

      <div className="pt-3 pb-1">
        <p className="font-display text-[8px] tracking-[0.3em] text-amber-800/40 uppercase mb-2">Navigation</p>
        {[
          ['⟳ Drag', 'Rotate the map'],
          ['◎ Scroll', 'Zoom in / out'],
          ['● Click city', 'Focus and open details'],
        ].map(([key, val]) => (
          <div key={key} className="flex justify-between items-center py-1">
            <span className="font-display text-[9px] tracking-[0.1em] text-amber-600/70">{key}</span>
            <span className="font-body text-[11px] text-amber-800/50">{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Toggle({ active, onCheckedChange, icon, label, description, children }: {
  active: boolean; onCheckedChange: () => void; icon: React.ReactNode; label: string; description: string; children?: React.ReactNode
}) {
  return (
    <div
      className="w-full px-3 py-2.5 rounded-sm transition-all duration-200"
      style={{
        background: active ? 'rgba(201,168,76,0.06)' : 'transparent',
        border: `1px solid ${active ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.08)'}`,
      }}
    >
      <div className="flex items-center gap-3">
        <span style={{ color: active ? '#f0d080' : '#7a6030' }}>{icon}</span>
        <div className="flex-1">
          <p className="font-display text-[9px] tracking-[0.2em] uppercase" style={{ color: active ? '#f0d080' : '#7a6030' }}>
            {label}
          </p>
          <p className="font-body text-[11px] text-amber-800/50 mt-0.5">{description}</p>
        </div>
        <Switch
          checked={active}
          onCheckedChange={onCheckedChange}
          className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-amber-900/40 border border-amber-200/20"
          aria-label={label}
        />
      </div>
      {children ? <div className="mt-3 pl-6">{children}</div> : null}
    </div>
  )
}

// ─── Legend Window Content ────────────────────────────────────────────────────

function LegendContent() {
  return (
    <div className="px-4 py-4 space-y-5">
      {/* Factions */}
      <div>
        <p className="font-display text-[8px] tracking-[0.35em] text-amber-800/50 uppercase mb-3">
          Factions &amp; Territories
        </p>
        <div className="space-y-3">
          {FACTIONS.map((f) => (
            <div key={f.id} className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1" style={{ background: FACTION_COLORS[f.id] }} />
              <div>
                <p className="font-display text-[9px] tracking-[0.12em] uppercase" style={{ color: FACTION_COLORS[f.id] }}>
                  {f.label}
                </p>
                <p className="font-body text-[11px] text-amber-800/60 mt-0.5 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }} />

      {/* Markers */}
      <div>
        <p className="font-display text-[8px] tracking-[0.35em] text-amber-800/50 uppercase mb-3">
          City Markers
        </p>
        <div className="space-y-3">
          {MARKER_TYPES.map((m) => (
            <div key={m.label} className="flex items-start gap-3">
              <div className="w-5 flex-shrink-0 flex items-center justify-center mt-0.5">{m.shape}</div>
              <div>
                <p className="font-display text-[9px] tracking-[0.12em] text-amber-300/80 uppercase">{m.label}</p>
                <p className="font-body text-[11px] text-amber-800/60 mt-0.5 leading-relaxed">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }} />

      {/* Routes */}
      <div className="flex items-start gap-3 pb-1">
        <div className="flex-shrink-0 mt-1.5">
          <svg width="28" height="8" viewBox="0 0 28 8" fill="none">
            <path d="M0 4 Q14 0 28 4" stroke="#4a3820" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
        <div>
          <p className="font-display text-[9px] tracking-[0.12em] text-amber-700/70 uppercase">Trade &amp; Military Routes</p>
          <p className="font-body text-[11px] text-amber-800/60 mt-0.5 leading-relaxed">
            Arcs show major road, sea, and trade connections active during Justinian's reign.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── FAB Button ───────────────────────────────────────────────────────────────

function FAB({ onClick, active, icon, label }: {
  onClick: () => void; active: boolean; icon: React.ReactNode; label: string
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 font-display text-[9px] tracking-[0.2em] uppercase transition-all duration-200"
      style={{
        background: active ? 'rgba(201,168,76,0.12)' : 'rgba(6,7,10,0.92)',
        border: `1px solid ${active ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.2)'}`,
        color: active ? '#f0d080' : '#7a6030',
        boxShadow: active ? '0 0 16px rgba(201,168,76,0.15)' : '0 4px 20px rgba(0,0,0,0.5)',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export function FloatingWindows() {
  const [controlsOpen, setControlsOpen] = useState(false)
  const [legendOpen,   setLegendOpen]   = useState(false)

  return (
    <>
      {/* Controls window */}
      {controlsOpen && (
        <DraggableWindow
          title="Controls"
          subtitle="Map display options"
          onClose={() => setControlsOpen(false)}
          defaultPos={{ x: window.innerWidth - 360, y: window.innerHeight - 420 }}
          width={300}
        >
          <ControlsContent />
        </DraggableWindow>
      )}

      {/* Legend window */}
      {legendOpen && (
        <DraggableWindow
          title="Legend"
          subtitle="Symbols &amp; faction colours"
          onClose={() => setLegendOpen(false)}
          defaultPos={{ x: window.innerWidth - 700, y: window.innerHeight - 520 }}
          width={340}
        >
          <LegendContent />
        </DraggableWindow>
      )}

      {/* FAB buttons — bottom right */}
      <div className="fixed bottom-28 right-6 z-30 flex flex-col gap-2 items-end">
        <FAB
          onClick={() => setLegendOpen((v) => !v)}
          active={legendOpen}
          icon={<BookOpen className="w-3.5 h-3.5" />}
          label="Legend"
        />
        <FAB
          onClick={() => setControlsOpen((v) => !v)}
          active={controlsOpen}
          icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
          label="Controls"
        />
      </div>
    </>
  )
}
