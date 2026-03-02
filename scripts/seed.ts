/**
 * MongoDB seed script
 * Usage: npm run db:seed
 * Requires: MONGODB_URI in .env.local
 */

import mongoose from 'mongoose'
import { CITIES } from '../src/data/cities'

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/byzantium'

// ─── Mongoose Schema ──────────────────────────────────────────────────────────

const CitySchema = new mongoose.Schema({
  id:                  { type: String, required: true, unique: true },
  name:                { type: String, required: true },
  latinName:           { type: String, required: true },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  size:                { type: String, enum: ['capital', 'major', 'medium', 'minor'] },
  populationEstimate:  Number,
  populationNote:      String,
  controlHistory: [{
    faction: String,
    label:   String,
    from:    Number,
    to:      Number,
  }],
  events: [{
    year:        Number,
    title:       String,
    description: String,
    tags:        [String],
  }],
  figures: [{
    name:      String,
    role:      String,
    livedFrom: Number,
    livedTo:   Number,
  }],
  monuments: [{
    name:        String,
    built:       Number,
    description: String,
  }],
})

const CityModel = mongoose.models.City ?? mongoose.model('City', CitySchema)

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🏛️  Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected')

  console.log('🗑️  Clearing existing cities...')
  await CityModel.deleteMany({})

  console.log(`📍 Seeding ${CITIES.length} cities...`)
  for (const city of CITIES) {
    await CityModel.create(city)
    console.log(`   ✓ ${city.name}`)
  }

  console.log('\n🌟 Seed complete!')
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
