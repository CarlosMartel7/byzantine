'use client'

// Three.js / R3F must be client-only — no SSR
import dynamic from 'next/dynamic'

export const MapCanvas = dynamic(
  () => import('./ByzantineMap').then((m) => m.ByzantineMap),
  { ssr: false }
)
