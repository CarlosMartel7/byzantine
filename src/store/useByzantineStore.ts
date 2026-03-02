import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import type { City, CameraState } from '@/types/byzantine'
import { REIGN_START, REIGN_END } from '@/data/cities'

// ─── State Shape ──────────────────────────────────────────────────────────────

interface ByzantineMapStore {
  // Timeline
  currentYear: number
  isPlayingTimeline: boolean

  // Selection
  selectedCity: City | null
  hoveredCityId: string | null

  // Camera
  camera: CameraState

  // UI
  isPanelOpen: boolean
  isLoaded: boolean
  showRoutes: boolean
  showLabels: boolean
  routeLineWidth: number

  // ── Actions ──
  setYear: (year: number) => void
  playTimeline: () => void
  pauseTimeline: () => void

  selectCity: (city: City | null) => void
  hoverCity: (id: string | null) => void

  setCamera: (camera: Partial<CameraState>) => void
  setLoaded: (loaded: boolean) => void
  closePanel: () => void
  toggleRoutes: () => void
  toggleLabels: () => void
  setRouteLineWidth: (width: number) => void
  resetCamera: () => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useByzantineStore = create<ByzantineMapStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // ── Initial State ──
      currentYear: REIGN_START,
      isPlayingTimeline: false,
      selectedCity: null,
      hoveredCityId: null,
      camera: { theta: 0.3, phi: 0.65, radius: 14 },
      isPanelOpen: false,
      isLoaded: false,
      showRoutes: true,
      showLabels: false,
      routeLineWidth: 0.8,

      // ── Timeline Actions ──
      setYear: (year) =>
        set(
          { currentYear: Math.max(REIGN_START, Math.min(REIGN_END, Math.round(year))) },
          false,
          'setYear'
        ),

      playTimeline: () => {
        const { currentYear, setYear, pauseTimeline } = get()
        // Reset to start if at end
        if (currentYear >= REIGN_END) setYear(REIGN_START)

        set({ isPlayingTimeline: true }, false, 'playTimeline')

        const interval = setInterval(() => {
          const { currentYear, isPlayingTimeline } = get()
          if (!isPlayingTimeline || currentYear >= REIGN_END) {
            clearInterval(interval)
            set({ isPlayingTimeline: false }, false, 'pauseTimeline:auto')
            return
          }
          setYear(currentYear + 1)
        }, 180) // ~180ms per year → full reign in ~7 seconds
      },

      pauseTimeline: () => set({ isPlayingTimeline: false }, false, 'pauseTimeline'),

      // ── Selection Actions ──
      selectCity: (city) =>
        set(
          { selectedCity: city, isPanelOpen: city !== null },
          false,
          'selectCity'
        ),

      hoverCity: (id) => set({ hoveredCityId: id }, false, 'hoverCity'),

      // ── Camera Actions ──
      setCamera: (partial) =>
        set(
          (state) => ({ camera: { ...state.camera, ...partial } }),
          false,
          'setCamera'
        ),

      // ── UI Actions ──
      setLoaded: (loaded) => set({ isLoaded: loaded }, false, 'setLoaded'),

      closePanel: () =>
        set({ isPanelOpen: false, selectedCity: null }, false, 'closePanel'),

      toggleRoutes: () =>
        set((s) => ({ showRoutes: !s.showRoutes }), false, 'toggleRoutes'),

      toggleLabels: () =>
        set((s) => ({ showLabels: !s.showLabels }), false, 'toggleLabels'),

      setRouteLineWidth: (width) =>
        set(
          { routeLineWidth: Math.max(0.1, Number.isFinite(width) ? width : 0.8) },
          false,
          'setRouteLineWidth'
        ),

      resetCamera: () =>
        set({ camera: { theta: 0.3, phi: 0.65, radius: 14 } }, false, 'resetCamera'),
    })),
    { name: 'byzantine-map' }
  )
)

// ─── Derived Selectors ────────────────────────────────────────────────────────
// Use these in components to avoid unnecessary re-renders

export const selectYear = (s: ByzantineMapStore) => s.currentYear
export const selectSelectedCity = (s: ByzantineMapStore) => s.selectedCity
export const selectCamera = (s: ByzantineMapStore) => s.camera
export const selectIsLoaded = (s: ByzantineMapStore) => s.isLoaded
export const selectHoveredCityId = (s: ByzantineMapStore) => s.hoveredCityId
export const selectIsPanelOpen = (s: ByzantineMapStore) => s.isPanelOpen
export const selectIsPlaying = (s: ByzantineMapStore) => s.isPlayingTimeline
