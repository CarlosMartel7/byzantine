// ─── Byzantine Empire Domain Types ───────────────────────────────────────────
// These types mirror the MongoDB document schema.
// Zod schemas (for tRPC validation) are co-located in /lib/validators.ts

export type CitySize = 'capital' | 'major' | 'medium' | 'minor'

export type ControlFaction =
  | 'eastern_roman'
  | 'ostrogothic'
  | 'vandal'
  | 'sassanid'
  | 'contested'

export interface GeoCoordinates {
  lat: number
  lng: number
}

export interface CityEvent {
  year: number
  title: string
  description: string
  tags: string[]
}

export interface HistoricalControl {
  faction: ControlFaction
  label: string        // e.g. "Eastern Roman Empire"
  from: number         // year
  to: number           // year (565 = end of Justinian reign)
}

export interface Monument {
  name: string
  built?: number       // approximate year built/rebuilt
  description: string
}

export interface HistoricalFigure {
  name: string
  role: string
  livedFrom?: number
  livedTo?: number
}

export interface City {
  id: string
  name: string
  latinName: string
  coordinates: GeoCoordinates
  size: CitySize
  populationEstimate: number       // at peak under Justinian
  populationNote: string
  controlHistory: HistoricalControl[]
  events: CityEvent[]
  figures: HistoricalFigure[]
  monuments: Monument[]
}

// ─── Map / UI State Types ─────────────────────────────────────────────────────

export interface CameraState {
  theta: number
  phi: number
  radius: number
}

export interface ByzantineMapState {
  currentYear: number
  selectedCityId: string | null
  hoveredCityId: string | null
  camera: CameraState
  isAnimating: boolean
}
