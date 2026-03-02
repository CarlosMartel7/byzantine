'use client'

import { X, MapPin, Users, Building2, Sword, BookOpen } from 'lucide-react'
import { useByzantineStore, selectSelectedCity, selectYear, selectIsPanelOpen } from '@/store/useByzantineStore'
import { FACTION_COLORS } from '@/data/cities'
import type { HistoricalControl } from '@/types/byzantine'

function getCurrentControl(controls: HistoricalControl[], year: number) {
  return controls.find((c) => year >= c.from && year <= c.to) ?? controls[0]
}

export function CityPanel() {
  const city = useByzantineStore(selectSelectedCity)
  const year = useByzantineStore(selectYear)
  const isOpen = useByzantineStore(selectIsPanelOpen)
  const closePanel = useByzantineStore((s) => s.closePanel)

  const control = city ? getCurrentControl(city.controlHistory, year) : null
  const pastEvents = city?.events.filter((e) => e.year <= year) ?? []

  return (
    <div
      className={`absolute right-8 top-1/2 -translate-y-1/2 z-10 w-[300px] transition-all duration-500 ${
        isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'
      }`}
      style={{
        background: 'rgba(5,6,8,0.96)',
        border: '1px solid rgba(201,168,76,0.25)',
      }}
    >
      {/* Gold top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }}
      />

      {/* Close */}
      <button
        onClick={closePanel}
        className="absolute top-3 right-3 text-amber-700 hover:text-amber-300 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="p-6 overflow-y-auto max-h-[70vh] scrollbar-none">
        {/* City name */}
        <div className="mb-4 pb-4" style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
          <h2 className="font-display-deco text-xl text-amber-200 leading-tight mb-1">
            {city?.name}
          </h2>
          <p className="font-body italic text-amber-700/80 text-[13px]">{city?.latinName}</p>
        </div>

        {/* Control */}
        {control && (
          <Section icon={<MapPin className="w-3 h-3" />} title="Control">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: FACTION_COLORS[control.faction] ?? '#c9a84c' }}
              />
              <span className="text-[13px] leading-relaxed" style={{ color: '#e8d9b0cc' }}>
                {control.label}
              </span>
            </div>
          </Section>
        )}

        {/* Population */}
        <Section icon={<Users className="w-3 h-3" />} title="Population (est.)">
          <p className="text-[13px] leading-relaxed" style={{ color: '#e8d9b0cc' }}>
            {city?.populationEstimate.toLocaleString()} — {city?.populationNote}
          </p>
        </Section>

        {/* Events */}
        <Section icon={<Sword className="w-3 h-3" />} title={`Events · up to ${year} AD`}>
          {pastEvents.length === 0 ? (
            <p className="text-[12px] italic text-amber-800/60">No recorded events in this era</p>
          ) : (
            <div className="space-y-3">
              {pastEvents.map((ev) => (
                <div key={ev.year + ev.title}>
                  <div className="font-display text-[9px] tracking-[0.2em] text-amber-600/90 mb-0.5 uppercase">
                    {ev.year} AD
                  </div>
                  <div className="font-display text-[11px] text-amber-300/90 mb-0.5">{ev.title}</div>
                  <p className="text-[12px] leading-relaxed" style={{ color: '#e8d9b0aa' }}>
                    {ev.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Figures */}
        {city && city.figures.length > 0 && (
          <Section icon={<BookOpen className="w-3 h-3" />} title="Notable Figures">
            <div className="flex flex-wrap gap-1.5">
              {city.figures.map((f) => (
                <span
                  key={f.name}
                  className="font-display text-[9px] tracking-[0.1em] px-2 py-1 border rounded-sm"
                  style={{ color: '#c0a0d0', borderColor: 'rgba(192,160,208,0.4)' }}
                >
                  {f.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Monuments */}
        {city && city.monuments.length > 0 && (
          <Section icon={<Building2 className="w-3 h-3" />} title="Monuments">
            <div className="flex flex-wrap gap-1.5">
              {city.monuments.map((m) => (
                <span
                  key={m.name}
                  className="font-display text-[9px] tracking-[0.1em] px-2 py-1 border rounded-sm"
                  style={{ color: '#c9a84c', borderColor: 'rgba(201,168,76,0.35)' }}
                >
                  {m.name}
                </span>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 mb-2 text-amber-700/70">
        {icon}
        <span className="font-display text-[9px] tracking-[0.3em] uppercase">{title}</span>
      </div>
      {children}
    </div>
  )
}
