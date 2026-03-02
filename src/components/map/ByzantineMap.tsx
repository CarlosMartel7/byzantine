'use client'

import { useEffect, useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CameraControls, Line, OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { GeoJSONLoader } from 'three-geojson'
import CameraControlsImpl from 'camera-controls'
import {
  useByzantineStore,
  selectYear,
  selectSelectedCity,
  selectHoveredCityId,
} from '@/store/useByzantineStore'

import { CITIES, MAP_BOUNDS, FACTION_COLORS } from '@/data/cities'
import type { City } from '@/types/byzantine'

// ─── Coordinate helper ────────────────────────────────────────────────────────

function geoToXZ(lat: number, lng: number) {
  // Keep all city/camera math on the same projection as the world GeoJSON overlay.
  return worldGeoToXZ(lat, lng)
}

// ─── Terrain ──────────────────────────────────────────────────────────────────

function Terrain() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(MAP_BOUNDS.width + 4, MAP_BOUNDS.height + 4, 48, 28)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i)
      pos.setY(i,
        Math.sin(x * 0.38) * 0.2 + Math.cos(z * 0.52) * 0.14 +
        Math.sin(x * 0.9 + z * 0.6) * 0.09 + Math.cos(x * 0.2 - z * 0.3) * 0.07
      )
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <>
      <mesh geometry={geo}>
        <meshBasicMaterial color={0x4a3820} wireframe />
      </mesh>
<mesh
  position={[0, -0.08, 0]}
  rotation={[-Math.PI / 2, 0, 0]}  
>
  <planeGeometry args={[MAP_BOUNDS.width + 4, MAP_BOUNDS.height + 4, 22, 14]} />
  <meshBasicMaterial
    color={0x1a2a3a}
    wireframe
    transparent
    opacity={0.5}
  />
</mesh>
    </>
  )
}

// ─── Trade Routes ─────────────────────────────────────────────────────────────

const ROUTES: [string, string][] = [
  ['constantinople', 'antioch'], ['constantinople', 'thessaloniki'],
  ['constantinople', 'athens'],  ['constantinople', 'ravenna'],
  ['antioch', 'jerusalem'],      ['antioch', 'ctesiphon'],
  ['antioch', 'alexandria'],     ['carthage', 'rome'],
  ['ravenna', 'rome'],           ['rome', 'athens'],
]

const WORLD_GEOJSON_URL =
  'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
const WORLD_OVERLAY_SCALE = 10

function worldGeoToXZ(lat: number, lng: number) {
  const width = (MAP_BOUNDS.width + 4) * WORLD_OVERLAY_SCALE
  const height = (MAP_BOUNDS.height + 4) * WORLD_OVERLAY_SCALE
  return {
    x: ((lng + 180) / 360 - 0.5) * width,
    z: (0.5 - (lat + 90) / 180) * height,
  }
}

function GeoJsonOverlay() {
  const [geoLines, setGeoLines] = useState<THREE.LineSegments | null>(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const loader = new GeoJSONLoader()
        const parsed = await loader.loadAsync(WORLD_GEOJSON_URL)
        const lineObject = GeoJSONLoader.getLineObject(
          [...parsed.lines, ...parsed.polygons],
          { flat: true }
        )

        // Convert lon/lat space produced by three-geojson to our XZ map plane.
        const geo = lineObject.geometry
        const pos = geo.getAttribute('position') as THREE.BufferAttribute
        const center = lineObject.position.clone()
        for (let i = 0; i < pos.count; i++) {
          const lon = pos.getX(i) + center.x
          const lat = pos.getY(i) + center.y
          const { x, z } = worldGeoToXZ(lat, lon)
          pos.setXYZ(i, x, 0, z)
        }
        pos.needsUpdate = true

        lineObject.position.set(0, 0.03, 0)
        lineObject.rotation.set(0, 0, 0)
        lineObject.material = new THREE.LineBasicMaterial({
          color: 0xf0d080,
          transparent: true,
          opacity: 0.3,
        })

        if (!cancelled) setGeoLines(lineObject)
      } catch (error) {
        console.error('Failed to load world GeoJSON overlay', error)
      }
    })()

    return () => {
      cancelled = true
      setGeoLines((prev) => {
        if (!prev) return prev
        prev.geometry.dispose()
        const mat = prev.material as THREE.Material
        mat.dispose()
        return null
      })
    }
  }, [])

  if (!geoLines) return null
  return <primitive object={geoLines} />
}

function TradeRoutes() {
  const showRoutes = useByzantineStore((s) => s.showRoutes)
  const routeLineWidth = useByzantineStore((s) => s.routeLineWidth)

  const routes = useMemo(() => {
    return ROUTES.flatMap(([aId, bId], i) => {
      const cityA = CITIES.find((c) => c.id === aId)
      const cityB = CITIES.find((c) => c.id === bId)
      if (!cityA || !cityB) return []
      const a = geoToXZ(cityA.coordinates.lat, cityA.coordinates.lng)
      const b = geoToXZ(cityB.coordinates.lat, cityB.coordinates.lng)
      const midH = 0.8 + (i % 3) * 0.2
      const points: [number, number, number][] = []
      for (let t = 0; t <= 1; t += 0.04) {
        const mt = 1 - t
        points.push([
          mt * mt * a.x + 2 * mt * t * ((a.x + b.x) / 2) + t * t * b.x,
          mt * mt * 0.1 + 2 * mt * t * midH + t * t * 0.1,
          mt * mt * a.z + 2 * mt * t * ((a.z + b.z) / 2) + t * t * b.z,
        ])
      }
      return [{ points, key: `${aId}-${bId}` }]
    })
  }, [])
  
  if (!showRoutes) return null

  return (
    <>
      {routes.map(({ points, key }) => (
        <Line
          key={key}
          points={points}
          color={0x85ad8c}
          transparent
          opacity={0.55}
          lineWidth={routeLineWidth}
        />
      ))}
    </>
  )
}

// ─── Selection Indicator ──────────────────────────────────────────────────────

function SelectionIndicator({ city }: { city: City }) {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const beamRef  = useRef<THREE.Mesh>(null)
  const { x, z } = geoToXZ(city.coordinates.lat, city.coordinates.lng)
  const height = city.size === 'capital' ? 1.4 : city.size === 'major' ? 0.8 : 0.45

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (outerRef.current) {
      outerRef.current.rotation.z += 0.008
      ;(outerRef.current.material as THREE.MeshBasicMaterial).opacity = 0.55 + 0.2 * Math.sin(t * 2.5)
    }
    if (innerRef.current) {
      innerRef.current.rotation.z -= 0.015
      ;(innerRef.current.material as THREE.MeshBasicMaterial).opacity = 0.4 + 0.2 * Math.sin(t * 2.5 + 1)
    }
    if (beamRef.current) {
      ;(beamRef.current.material as THREE.MeshBasicMaterial).opacity = 0.12 + 0.08 * Math.sin(t * 3)
    }
  })

  return (
    <group position={[x, 0, z]}>
      {/* Outer rotating ring */}
      <mesh ref={outerRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.5, 0.56, 32]} />
        <meshBasicMaterial color={0xf0d080} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner counter-rotating ring */}
      <mesh ref={innerRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.32, 0.36, 32]} />
        <meshBasicMaterial color={0xf0d080} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Vertical beam */}
      <mesh ref={beamRef} position={[0, height + 3, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 6, 8]} />
        <meshBasicMaterial color={0xf0d080} transparent opacity={0} />
      </mesh>
    </group>
  )
}

// ─── City Marker ──────────────────────────────────────────────────────────────

function CityMarker({ city }: { city: City }) {
  const markerRef = useRef<THREE.Mesh>(null)
  const ringRef   = useRef<THREE.Mesh>(null)

  const year          = useByzantineStore(selectYear)
  const selectedCity  = useByzantineStore(selectSelectedCity)
  const hoveredCityId = useByzantineStore(selectHoveredCityId)
  const selectCity    = useByzantineStore((s) => s.selectCity)
  const hoverCity     = useByzantineStore((s) => s.hoverCity)

  const showLabels = useByzantineStore((s) => s.showLabels)
  const showLabel  = showLabels

  const isCapital  = city.size === 'capital'
  const isMajor    = city.size === 'major'
  const isSelected = selectedCity?.id === city.id
  const isHovered  = hoveredCityId === city.id

  const { x, z }   = geoToXZ(city.coordinates.lat, city.coordinates.lng)
  const height      = isCapital ? 1.4 : isMajor ? 0.8 : 0.45
  const markerSize  = isCapital ? 0.22 : isMajor ? 0.14 : 0.09
  const baseOpacity = isCapital ? 0.45 : 0.22
  const pulseOffset = useMemo(() => Math.random() * Math.PI * 2, [])

  // Faction color for current year
  const factionColor = useMemo(() => {
    const control = city.controlHistory.find((h) => year >= h.from && year <= h.to)
    const faction = control?.faction ?? 'eastern_roman'
    return new THREE.Color(FACTION_COLORS[faction] ?? '#c9a84c')
  }, [city, year])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Spin marker
    if (markerRef.current) {
      markerRef.current.rotation.y += isCapital ? 0.012 : 0.006
      // Scale on hover/select
      const targetScale = isSelected ? 1.5 : isHovered ? 1.3 : 1.0
      markerRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12)
    }

    // Pulse ring
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = baseOpacity * (0.65 + 0.35 * Math.sin(t * 1.8 + pulseOffset))
    }
  })

  return (
    <group position={[x, 0, z]}>
      {/* Pillar */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.025, 0.025, height, 6]} />
        <meshBasicMaterial color={factionColor} />
      </mesh>

      {/* Marker — octahedron for capital, box for others */}
      <mesh
        ref={markerRef}
        position={[0, height + markerSize, 0]}
        onClick={(e) => { e.stopPropagation(); selectCity(city) }}
        onPointerEnter={() => hoverCity(city.id)}
        onPointerLeave={() => hoverCity(null)}
      >
        {isCapital
          ? <octahedronGeometry args={[markerSize]} />
          : <boxGeometry args={[markerSize, markerSize, markerSize]} />
        }
        <meshBasicMaterial color={factionColor} wireframe={isCapital} />
      </mesh>

      {/* Pulse ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.18, 0.27, 20]} />
        <meshBasicMaterial color={factionColor} transparent opacity={baseOpacity} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// ─── Camera Controller ────────────────────────────────────────────────────────
// Reads selected city from Zustand and calls CameraControls.setLookAt()

function CameraController({ controlsRef }: { controlsRef: React.RefObject<CameraControls> }) {
  const selectedCity = useByzantineStore(selectSelectedCity)
  const prevCityId   = useRef<string | null>(null)

  useFrame(() => {
    const controls = controlsRef.current
    if (!controls) return

    const cityId = selectedCity?.id ?? null
    if (cityId === prevCityId.current) return
    prevCityId.current = cityId

    if (!selectedCity) {
      // Return to default overview
      controls.setLookAt(0, 8, 12, 0, 0, 0, true)
      return
    }

    const { x, z } = geoToXZ(selectedCity.coordinates.lat, selectedCity.coordinates.lng)
    const height    = selectedCity.size === 'capital' ? 1.4 : selectedCity.size === 'major' ? 0.8 : 0.45

    // Position camera above and slightly in front of the city, looking at the marker
    controls.setLookAt(
      x + 3, height + 5, z + 5,  // camera position
      x, height + 0.5, z,         // look-at target
      true                         // animate
    )
  })

  return null
}


// ─── Scene Ready Signal ───────────────────────────────────────────────────────
// Fires setLoaded(true) once the R3F renderer has initialised

function SceneReadySignal() {
  const { gl } = useThree()
  const setLoaded = useByzantineStore((s) => s.setLoaded)

  useEffect(() => {
    if (gl) setLoaded(true)
  }, [gl, setLoaded])

  return null
}


// ─── Camera Reset Watcher ─────────────────────────────────────────────────────

function CameraResetWatcher({ controlsRef }: { controlsRef: React.RefObject<CameraControls> }) {
  const camera = useByzantineStore((s) => s.camera)

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    controls.setLookAt(0, 8, 12, 0, 0, 0, true)
  }, [camera]) // fires when resetCamera() sets camera back to default

  return null
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({ controlsRef }: { controlsRef: React.RefObject<CameraControls> }) {
  const selectedCity = useByzantineStore(selectSelectedCity)

  return (
    <>
      <SceneReadySignal />
      <color attach="background" args={['#0a0c10']} />
      <fog attach="fog" args={[0x0a0c10, 18, 55]} />
      <CameraControls
        ref={controlsRef}
        minDistance={0.5}
        maxDistance={180}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
        mouseButtons={{
          left: CameraControlsImpl.ACTION.TRUCK,
          middle: CameraControlsImpl.ACTION.DOLLY,
          right: CameraControlsImpl.ACTION.ROTATE,
          wheel: CameraControlsImpl.ACTION.DOLLY,
        }}
        touches={{
          one: CameraControlsImpl.ACTION.TOUCH_ROTATE,
          two: CameraControlsImpl.ACTION.TOUCH_DOLLY_TRUCK,
          three: CameraControlsImpl.ACTION.TOUCH_TRUCK,
        }}
        dampingFactor={0.08}
      />
      <CameraController controlsRef={controlsRef} />
      <CameraResetWatcher controlsRef={controlsRef} />

      <Terrain />
      <GeoJsonOverlay />
      <TradeRoutes />

      {CITIES.map((city) => (
        <CityMarker key={city.id} city={city} />
      ))}

      {selectedCity && <SelectionIndicator city={selectedCity} />}
    </>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function ByzantineMap() {
  const controlsRef   = useRef<CameraControls>(null)
  const hoveredCityId = useByzantineStore(selectHoveredCityId)

  return (
    <Canvas
      camera={{ position: [0, 8, 12], fov: 45, near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ cursor: hoveredCityId ? 'pointer' : 'grab' }}
    >
      <Scene controlsRef={controlsRef} />
    </Canvas>
  )
}
