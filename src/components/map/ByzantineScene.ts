'use client'

import * as THREE from 'three'
import type { City } from '@/types/byzantine'
import {
  CITIES,
  MAP_BOUNDS,
  FACTION_COLORS,
  REIGN_START,
} from '@/data/cities'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SceneCallbacks {
  onCityClick: (city: City) => void
  onCityHover: (cityId: string | null) => void
  onCameraChange: (theta: number, phi: number, radius: number) => void
}

export interface CameraState {
  theta: number
  phi: number
  radius: number
}

// ─── Coordinate Helpers ───────────────────────────────────────────────────────

function geoToXZ(lat: number, lng: number): { x: number; z: number } {
  const x =
    ((lng - MAP_BOUNDS.lngMin) / (MAP_BOUNDS.lngMax - MAP_BOUNDS.lngMin) - 0.5) *
    MAP_BOUNDS.width
  const z =
    (0.5 - (lat - MAP_BOUNDS.latMin) / (MAP_BOUNDS.latMax - MAP_BOUNDS.latMin)) *
    MAP_BOUNDS.height
  return { x, z }
}

// ─── ByzantineScene Class ─────────────────────────────────────────────────────

export class ByzantineScene {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private raycaster: THREE.Raycaster
  private mouse: THREE.Vector2

  // Scene objects
  private cityMarkers: Map<string, THREE.Mesh> = new Map()
  private cityRings: Map<string, THREE.Mesh> = new Map()
  private cityPillars: Map<string, THREE.Mesh> = new Map()
  private routeLines: THREE.Line[] = []

  // Interaction state
  private isDragging = false
  private lastMouseX = 0
  private lastMouseY = 0
  private spherical: CameraState = { theta: 0.3, phi: 0.65, radius: 14 }
  private clock = 0
  private animFrameId: number | null = null
  private autoRotate = true

  // Callbacks
  private callbacks: SceneCallbacks

  constructor(canvas: HTMLCanvasElement, callbacks: SceneCallbacks) {
    this.callbacks = callbacks
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight)

    // Scene
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x050608, 0.035)

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      200
    )
    this.updateCamera()

    this.buildScene()
    this.bindEvents(canvas)
    this.animate()

    // Auto-rotate fades after 5s
    setTimeout(() => { this.autoRotate = false }, 5000)
  }

  // ── Scene Construction ──────────────────────────────────────────────────────

  private buildScene() {
    this.buildTerrain()
    this.buildCities()
    this.buildRoutes()
  }

  private buildTerrain() {
    const { width, height } = MAP_BOUNDS

    // Main wireframe terrain
    const geo = new THREE.PlaneGeometry(width + 4, height + 4, 48, 28)
    geo.rotateX(-Math.PI / 2)
    const pos = geo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y =
        Math.sin(x * 0.38) * 0.2 +
        Math.cos(z * 0.52) * 0.14 +
        Math.sin(x * 0.9 + z * 0.6) * 0.09 +
        Math.cos(x * 0.2 - z * 0.3) * 0.07
      pos.setY(i, y)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()

    const mat = new THREE.MeshBasicMaterial({
      color: 0x1a1208,
      wireframe: true,
    })
    this.scene.add(new THREE.Mesh(geo, mat))

    // Sea plane (slightly lower, different grid density)
    const seaGeo = new THREE.PlaneGeometry(width + 4, height + 4, 22, 14)
    seaGeo.rotateX(-Math.PI / 2)
    const seaMat = new THREE.MeshBasicMaterial({
      color: 0x080e1a,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
    const sea = new THREE.Mesh(seaGeo, seaMat)
    sea.position.y = -0.08
    this.scene.add(sea)
  }

  private buildCities() {
    CITIES.forEach((city) => {
      const { x, z } = geoToXZ(city.coordinates.lat, city.coordinates.lng)
      const isCapital = city.size === 'capital'
      const isMajor = city.size === 'major'

      // Pillar height
      const height = isCapital ? 1.4 : isMajor ? 0.8 : 0.45

      // Pillar
      const pillarGeo = new THREE.CylinderGeometry(0.025, 0.025, height, 6)
      const pillarMat = new THREE.MeshBasicMaterial({
        color: isCapital ? 0xf0d080 : isMajor ? 0xc9a84c : 0x7a6030,
      })
      const pillar = new THREE.Mesh(pillarGeo, pillarMat)
      pillar.position.set(x, height / 2, z)
      this.scene.add(pillar)
      this.cityPillars.set(city.id, pillar)

      // Marker (octahedron for capital, box for others)
      const markerSize = isCapital ? 0.22 : isMajor ? 0.14 : 0.09
      const markerGeo = isCapital
        ? new THREE.OctahedronGeometry(markerSize)
        : new THREE.BoxGeometry(markerSize, markerSize, markerSize)
      const markerMat = new THREE.MeshBasicMaterial({
        color: isCapital ? 0xf0d080 : isMajor ? 0xc9a84c : 0x8a7040,
        wireframe: isCapital,
      })
      const marker = new THREE.Mesh(markerGeo, markerMat)
      marker.position.set(x, height + markerSize, z)
      marker.userData = { cityId: city.id, city }
      this.scene.add(marker)
      this.cityMarkers.set(city.id, marker)

      // Pulsing ring
      const ringGeo = new THREE.RingGeometry(0.18, 0.27, 20)
      const ringMat = new THREE.MeshBasicMaterial({
        color: isCapital ? 0xf0d080 : 0xc9a84c,
        transparent: true,
        opacity: isCapital ? 0.45 : 0.22,
        side: THREE.DoubleSide,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = -Math.PI / 2
      ring.position.set(x, 0.01, z)
      ring.userData = {
        baseOpacity: isCapital ? 0.45 : 0.22,
        pulseOffset: Math.random() * Math.PI * 2,
      }
      this.scene.add(ring)
      this.cityRings.set(city.id, ring)
    })
  }

  private buildRoutes() {
    const ROUTES: [string, string][] = [
      ['constantinople', 'antioch'],
      ['constantinople', 'thessaloniki'],
      ['constantinople', 'athens'],
      ['constantinople', 'ravenna'],
      ['antioch', 'jerusalem'],
      ['antioch', 'ctesiphon'],
      ['antioch', 'alexandria'],
      ['carthage', 'rome'],
      ['ravenna', 'rome'],
      ['rome', 'athens'],
    ]

    ROUTES.forEach(([aId, bId]) => {
      const cityA = CITIES.find((c) => c.id === aId)
      const cityB = CITIES.find((c) => c.id === bId)
      if (!cityA || !cityB) return

      const posA = geoToXZ(cityA.coordinates.lat, cityA.coordinates.lng)
      const posB = geoToXZ(cityB.coordinates.lat, cityB.coordinates.lng)

      // Quadratic bezier arc
      const points: THREE.Vector3[] = []
      const midHeight = 0.8 + Math.random() * 0.5
      for (let t = 0; t <= 1; t += 0.04) {
        const mt = 1 - t
        points.push(
          new THREE.Vector3(
            mt * mt * posA.x + 2 * mt * t * ((posA.x + posB.x) / 2) + t * t * posB.x,
            mt * mt * 0.1 + 2 * mt * t * midHeight + t * t * 0.1,
            mt * mt * posA.z + 2 * mt * t * ((posA.z + posB.z) / 2) + t * t * posB.z
          )
        )
      }

      const geo = new THREE.BufferGeometry().setFromPoints(points)
      const mat = new THREE.LineBasicMaterial({
        color: 0x3a2c14,
        transparent: true,
        opacity: 0.55,
      })
      const line = new THREE.Line(geo, mat)
      this.scene.add(line)
      this.routeLines.push(line)
    })
  }

  // ── Year Update ─────────────────────────────────────────────────────────────

  updateYear(year: number) {
    CITIES.forEach((city) => {
      const marker = this.cityMarkers.get(city.id)
      const ring = this.cityRings.get(city.id)
      const pillar = this.cityPillars.get(city.id)
      if (!marker || !ring || !pillar) return

      // Determine current controlling faction
      const control = city.controlHistory.find(
        (h) => year >= h.from && year <= h.to
      )
      const faction = control?.faction ?? 'eastern_roman'
      const colorHex = FACTION_COLORS[faction] ?? '#c9a84c'
      const color = new THREE.Color(colorHex)

      ;(marker.material as THREE.MeshBasicMaterial).color = color
      ;(pillar.material as THREE.MeshBasicMaterial).color = color
      ;(ring.material as THREE.MeshBasicMaterial).color = color

      // Opacity based on faction
      const isEnemy = faction === 'sassanid'
      ;(ring.material as THREE.MeshBasicMaterial).opacity = isEnemy ? 0.12 : ring.userData.baseOpacity
    })
  }

  // ── Hover / Selection ───────────────────────────────────────────────────────

  highlightCity(cityId: string | null) {
    this.cityMarkers.forEach((marker, id) => {
      const mat = marker.material as THREE.MeshBasicMaterial
      const scale = id === cityId ? 1.4 : 1.0
      marker.scale.setScalar(scale)
    })
  }

  // ── Camera ──────────────────────────────────────────────────────────────────

  private updateCamera() {
    const { theta, phi, radius } = this.spherical
    this.camera.position.set(
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.cos(theta)
    )
    this.camera.lookAt(0, 0, 0)
  }

  setCamera(state: CameraState) {
    this.spherical = state
    this.updateCamera()
  }

  // ── Event Binding ────────────────────────────────────────────────────────────

  private bindEvents(canvas: HTMLCanvasElement) {
    // Mouse drag
    canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true
      this.lastMouseX = e.clientX
      this.lastMouseY = e.clientY
      this.autoRotate = false
    })

    window.addEventListener('mouseup', () => { this.isDragging = false })

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.lastMouseX
        const dy = e.clientY - this.lastMouseY
        this.spherical.theta -= dx * 0.005
        this.spherical.phi = Math.max(0.18, Math.min(1.45, this.spherical.phi + dy * 0.005))
        this.lastMouseX = e.clientX
        this.lastMouseY = e.clientY
        this.updateCamera()
        this.callbacks.onCameraChange(this.spherical.theta, this.spherical.phi, this.spherical.radius)
      }

      // Hover detection
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    })

    // Scroll zoom
    canvas.addEventListener('wheel', (e) => {
      this.spherical.radius = Math.max(6, Math.min(28, this.spherical.radius + e.deltaY * 0.025))
      this.updateCamera()
      this.autoRotate = false
    })

    // Click
    canvas.addEventListener('click', (e) => {
      if (Math.abs(e.movementX) > 4 || Math.abs(e.movementY) > 4) return
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
      this.raycaster.setFromCamera(this.mouse, this.camera)
      const hits = this.raycaster.intersectObjects([...this.cityMarkers.values()])
      if (hits.length > 0) {
        const city = hits[0].object.userData.city as City
        this.callbacks.onCityClick(city)
      }
    })

    // Touch
    let lastTouchX = 0, lastTouchY = 0
    canvas.addEventListener('touchstart', (e) => {
      lastTouchX = e.touches[0].clientX
      lastTouchY = e.touches[0].clientY
      this.autoRotate = false
    })
    canvas.addEventListener('touchmove', (e) => {
      const dx = e.touches[0].clientX - lastTouchX
      const dy = e.touches[0].clientY - lastTouchY
      this.spherical.theta -= dx * 0.005
      this.spherical.phi = Math.max(0.18, Math.min(1.45, this.spherical.phi + dy * 0.005))
      lastTouchX = e.touches[0].clientX
      lastTouchY = e.touches[0].clientY
      this.updateCamera()
    })

    // Resize
    window.addEventListener('resize', () => this.handleResize())
  }

  // ── Resize ───────────────────────────────────────────────────────────────────

  handleResize() {
    const canvas = this.renderer.domElement
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  // ── Animation Loop ───────────────────────────────────────────────────────────

  private animate = () => {
    this.animFrameId = requestAnimationFrame(this.animate)
    this.clock += 0.016

    // Auto-rotate
    if (this.autoRotate) {
      this.spherical.theta += 0.003
      this.updateCamera()
    }

    // Pulse rings
    this.cityRings.forEach((ring) => {
      const mat = ring.material as THREE.MeshBasicMaterial
      const { baseOpacity, pulseOffset } = ring.userData
      mat.opacity = baseOpacity * (0.65 + 0.35 * Math.sin(this.clock * 1.8 + pulseOffset))
    })

    // Hover detection
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const hits = this.raycaster.intersectObjects([...this.cityMarkers.values()])
    const hoveredId = hits.length > 0 ? (hits[0].object.userData.cityId as string) : null
    this.callbacks.onCityHover(hoveredId)

    // Spin markers
    this.cityMarkers.forEach((marker) => {
      marker.rotation.y += marker.geometry.type === 'OctahedronGeometry' ? 0.012 : 0.006
    })

    this.renderer.render(this.scene, this.camera)
  }

  // ── Cleanup ──────────────────────────────────────────────────────────────────

  destroy() {
    if (this.animFrameId !== null) cancelAnimationFrame(this.animFrameId)
    this.renderer.dispose()
    this.scene.clear()
  }
}
