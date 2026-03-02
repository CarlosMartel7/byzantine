import { z } from 'zod'

// ─── Shared Enums ─────────────────────────────────────────────────────────────

export const CitySizeSchema = z.enum(['capital', 'major', 'medium', 'minor'])

export const ControlFactionSchema = z.enum([
  'eastern_roman',
  'ostrogothic',
  'vandal',
  'sassanid',
  'contested',
])

// ─── Nested Document Schemas ──────────────────────────────────────────────────

export const GeoCoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export const CityEventSchema = z.object({
  year: z.number().int().min(527).max(565),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(1000),
  tags: z.array(z.string()),
})

export const HistoricalControlSchema = z.object({
  faction: ControlFactionSchema,
  label: z.string(),
  from: z.number().int(),
  to: z.number().int(),
})

export const MonumentSchema = z.object({
  name: z.string(),
  built: z.number().int().optional(),
  description: z.string(),
})

export const HistoricalFigureSchema = z.object({
  name: z.string(),
  role: z.string(),
  livedFrom: z.number().int().optional(),
  livedTo: z.number().int().optional(),
})

// ─── City Document Schema ─────────────────────────────────────────────────────

export const CitySchema = z.object({
  id: z.string(),
  name: z.string(),
  latinName: z.string(),
  coordinates: GeoCoordinatesSchema,
  size: CitySizeSchema,
  populationEstimate: z.number().int().positive(),
  populationNote: z.string(),
  controlHistory: z.array(HistoricalControlSchema),
  events: z.array(CityEventSchema),
  figures: z.array(HistoricalFigureSchema),
  monuments: z.array(MonumentSchema),
})

// ─── tRPC Input Schemas ───────────────────────────────────────────────────────

export const GetCityByYearInputSchema = z.object({
  cityId: z.string(),
  year: z.number().int().min(527).max(565),
})

export const GetCitiesInputSchema = z.object({
  year: z.number().int().min(527).max(565).optional(),
  faction: ControlFactionSchema.optional(),
})

// ─── Inferred Types (use these in components, not the manual types) ───────────

export type CityInput = z.infer<typeof CitySchema>
export type GetCityByYearInput = z.infer<typeof GetCityByYearInputSchema>
export type GetCitiesInput = z.infer<typeof GetCitiesInputSchema>
