'use client'

import { useEffect, useRef } from 'react'
import { ByzantineScene } from './ByzantineScene'
import {
  useByzantineStore,
  selectYear,
  selectCamera,
  selectHoveredCityId,
} from '@/store/useByzantineStore'
import type { City } from '@/types/byzantine'

export function MapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<ByzantineScene | null>(null)

  const year = useByzantineStore(selectYear)
  const camera = useByzantineStore(selectCamera)
  const hoveredCityId = useByzantineStore(selectHoveredCityId)

  const selectCity = useByzantineStore((s) => s.selectCity)
  const hoverCity = useByzantineStore((s) => s.hoverCity)
  const setCamera = useByzantineStore((s) => s.setCamera)
  const setLoaded = useByzantineStore((s) => s.setLoaded)

  // ── Mount scene ────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scene = new ByzantineScene(canvas, {
      onCityClick: (city: City) => selectCity(city),
      onCityHover: (id: string | null) => hoverCity(id),
      onCameraChange: (theta, phi, radius) => setCamera({ theta, phi, radius }),
    })

    sceneRef.current = scene
    setLoaded(true)

    return () => {
      scene.destroy()
      sceneRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync year → scene ──────────────────────────────────────────────────────
  useEffect(() => {
    sceneRef.current?.updateYear(year)
  }, [year])

  // ── Sync hover → scene ─────────────────────────────────────────────────────
  useEffect(() => {
    sceneRef.current?.highlightCity(hoveredCityId)
  }, [hoveredCityId])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ cursor: hoveredCityId ? 'pointer' : 'grab' }}
    />
  )
}
