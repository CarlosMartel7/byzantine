import type { City } from '@/types/byzantine'

// ─── Seed Data ────────────────────────────────────────────────────────────────
// This file is consumed by:
//   1. /scripts/seed.ts  → populates MongoDB
//   2. The Zustand store  → fallback if DB is unavailable in dev

export const CITIES: City[] = [
  {
    id: 'constantinople',
    name: 'Constantinople',
    latinName: 'Κωνσταντινούπολις',
    coordinates: { lat: 41.01, lng: 28.97 },
    size: 'capital',
    populationEstimate: 500000,
    populationNote: 'Largest city in the Christian world',
    controlHistory: [
      { faction: 'eastern_roman', label: 'Eastern Roman Empire', from: 330, to: 565 },
    ],
    events: [
      { year: 527, title: 'Justinian I Crowned', description: 'Justinian ascends to the throne of the Eastern Roman Empire, beginning one of the most ambitious reigns in Byzantine history.', tags: ['politics', 'imperial'] },
      { year: 529, title: "Justinian's Code Published", description: 'The Corpus Juris Civilis is completed — a codification of Roman law that would shape European legal systems for a millennium.', tags: ['law', 'culture'] },
      { year: 532, title: 'Nika Riots', description: 'The deadliest urban riot in Byzantine history. Thirty thousand die. Justinian nearly flees — Theodora famously convinces him to stay.', tags: ['revolt', 'crisis'] },
      { year: 537, title: 'Hagia Sophia Consecrated', description: 'The rebuilt cathedral is dedicated, its enormous dome defying engineering expectations of the era. Justinian reportedly exclaims: "Solomon, I have surpassed thee!"', tags: ['architecture', 'religion'] },
      { year: 542, title: 'Plague of Justinian Arrives', description: 'The first pandemic of bubonic plague reaches Constantinople from Egypt. Tens of thousands die weekly at its peak; the empire never fully recovers demographically.', tags: ['plague', 'crisis'] },
      { year: 558, title: 'Dome of Hagia Sophia Collapses', description: 'An earthquake causes the central dome to partially collapse. Justinian orders immediate reconstruction with a higher, reinforced dome.', tags: ['architecture', 'disaster'] },
    ],
    figures: [
      { name: 'Justinian I', role: 'Emperor', livedFrom: 482, livedTo: 565 },
      { name: 'Empress Theodora', role: 'Empress Consort', livedFrom: 500, livedTo: 548 },
      { name: 'Tribonian', role: 'Chief Legal Advisor', livedFrom: 500, livedTo: 545 },
      { name: 'John of Cappadocia', role: 'Praetorian Prefect', livedFrom: 490, livedTo: 548 },
      { name: 'Procopius', role: 'Historian', livedFrom: 500, livedTo: 565 },
    ],
    monuments: [
      { name: 'Hagia Sophia', built: 537, description: 'Cathedral of Holy Wisdom — the largest building in the world for nearly a thousand years.' },
      { name: 'Hippodrome', built: 203, description: 'The civic and political heart of the city; site of chariot races and the Nika Riots.' },
      { name: 'Great Palace', description: 'Sprawling imperial palace complex overlooking the Sea of Marmara.' },
      { name: 'Chalke Gate', description: 'The ceremonial bronze gate at the entrance to the Imperial Palace.' },
    ],
  },
  {
    id: 'antioch',
    name: 'Antioch',
    latinName: 'Ἀντιόχεια',
    coordinates: { lat: 36.2, lng: 36.16 },
    size: 'major',
    populationEstimate: 200000,
    populationNote: 'Third largest city in the empire',
    controlHistory: [
      { faction: 'eastern_roman', label: 'Eastern Roman Empire', from: 527, to: 540 },
      { faction: 'sassanid', label: 'Sassanid Persia (occupied)', from: 540, to: 541 },
      { faction: 'eastern_roman', label: 'Eastern Roman Empire (restored)', from: 541, to: 565 },
    ],
    events: [
      { year: 526, title: 'Catastrophic Earthquake', description: 'A devastating earthquake kills an estimated 250,000 people and destroys much of the city — just before Justinian\'s reign begins.', tags: ['disaster'] },
      { year: 528, title: 'Second Earthquake', description: 'A second major earthquake strikes the still-rebuilding city, causing further devastation.', tags: ['disaster'] },
      { year: 540, title: 'Sacked by Khosrow I', description: 'The Sassanid king Khosrow I breaks the Eternal Peace, invades Syria, and burns Antioch to the ground. Survivors are resettled in a new Persian city near Ctesiphon.', tags: ['war', 'sack'] },
      { year: 541, title: 'Reconstruction Ordered', description: 'Justinian orders the complete reconstruction of Antioch, renaming it Theopolis — City of God.', tags: ['reconstruction', 'imperial'] },
    ],
    figures: [
      { name: 'John Malalas', role: 'Chronicler', livedFrom: 491, livedTo: 578 },
      { name: 'Khosrow I', role: 'Sassanid King (attacker)', livedFrom: 501, livedTo: 579 },
    ],
    monuments: [
      { name: 'Great Church of Antioch', description: 'One of the most magnificent churches in the Christian world before its destruction.' },
      { name: 'Colonnaded Main Street', description: 'A grand colonnaded avenue running through the heart of the city.' },
    ],
  },
  {
    id: 'alexandria',
    name: 'Alexandria',
    latinName: 'Ἀλεξάνδρεια',
    coordinates: { lat: 31.2, lng: 29.92 },
    size: 'major',
    populationEstimate: 300000,
    populationNote: 'Second city of the empire — granary of the East',
    controlHistory: [
      { faction: 'eastern_roman', label: 'Eastern Roman Empire', from: 527, to: 565 },
    ],
    events: [
      { year: 529, title: "Platonic Academy Closed", description: "Justinian's closure of the Athenian Academy sends scholars eastward; some settle in Alexandria, intensifying its intellectual life briefly.", tags: ['culture', 'religion'] },
      { year: 535, title: 'Imperial Grain Taxes Intensified', description: 'Justinian increases demands on Egyptian grain production to fund his western campaigns, creating tension with the local population.', tags: ['economics', 'politics'] },
      { year: 542, title: 'Plague Arrives via Egypt', description: 'The Plague of Justinian originates in Egypt and reaches Constantinople via Alexandrian grain ships, devastating the population.', tags: ['plague', 'crisis'] },
    ],
    figures: [
      { name: 'John Philoponus', role: 'Philosopher & Theologian', livedFrom: 490, livedTo: 570 },
      { name: 'Cyril of Alexandria', role: 'Patriarch', livedFrom: 376, livedTo: 444 },
    ],
    monuments: [
      { name: 'Pharos Lighthouse', description: 'One of the Seven Wonders — still standing and operational in Justinian\'s era.' },
      { name: 'Caesareum', description: 'Imperial cult temple converted to a Christian church.' },
    ],
  },
  {
    id: 'ravenna',
    name: 'Ravenna',
    latinName: 'Ravenna',
    coordinates: { lat: 44.42, lng: 12.2 },
    size: 'major',
    populationEstimate: 50000,
    populationNote: 'Imperial capital of the West',
    controlHistory: [
      { faction: 'ostrogothic', label: 'Ostrogothic Kingdom', from: 493, to: 540 },
      { faction: 'eastern_roman', label: 'Eastern Roman Empire', from: 540, to: 565 },
    ],
    events: [
      { year: 535, title: 'Gothic War Begins', description: 'Belisarius launches Justinian\'s campaign to reconquer Italy from the Ostrogoths, landing in Sicily.', tags: ['war', 'reconquest'] },
      { year: 540, title: 'Belisarius Captures Ravenna', description: 'Belisarius takes the Ostrogothic capital through a ruse, capturing King Vitiges. Italy seems won — briefly.', tags: ['war', 'victory'] },
      { year: 547, title: 'Totila Sacks Rome', description: 'The Ostrogothic king Totila reconquers much of Italy, demonstrating the fragility of Byzantine gains.', tags: ['war', 'setback'] },
      { year: 554, title: 'Pragmatic Sanction', description: 'Justinian formally reorganizes Italy as a Byzantine province, though Gothic resistance continues sporadically.', tags: ['politics', 'law'] },
    ],
    figures: [
      { name: 'Belisarius', role: 'General', livedFrom: 505, livedTo: 565 },
      { name: 'Vitiges', role: 'Ostrogothic King', livedFrom: 480, livedTo: 542 },
      { name: 'Maximianus', role: 'Archbishop of Ravenna', livedFrom: 499, livedTo: 556 },
    ],
    monuments: [
      { name: 'Basilica of San Vitale', built: 547, description: 'Justinian\'s masterpiece in the West — contains the famous mosaic portrait of Justinian and Theodora.' },
      { name: "Mausoleum of Galla Placidia", description: 'Stunning early Byzantine mausoleum with breathtaking mosaic ceilings.' },
      { name: "Theodoric's Palace", description: 'Former palace of the Ostrogothic king, repurposed by the Byzantines.' },
    ],
  },
  {
    id: 'carthage',
    name: 'Carthage',
    latinName: 'Carthago',
    coordinates: { lat: 36.86, lng: 10.32 },
    size: 'major',
    populationEstimate: 100000,
    populationNote: 'Key port of North Africa',
    controlHistory: [
      { faction: 'vandal', label: 'Vandal Kingdom', from: 439, to: 533 },
      { faction: 'eastern_roman', label: 'Eastern Roman Empire', from: 533, to: 565 },
    ],
    events: [
      { year: 533, title: 'Battle of Ad Decimum', description: 'Belisarius defeats the Vandal king Gelimer just ten miles from Carthage. The Vandal Kingdom, which had held North Africa for a century, collapses within months.', tags: ['war', 'victory', 'reconquest'] },
      { year: 534, title: 'Gelimer Surrenders', description: 'The last Vandal king surrenders after a siege. Africa is restored to Roman rule after 95 years.', tags: ['war', 'victory'] },
      { year: 535, title: 'Prefecture of Africa Established', description: 'Justinian creates the Praetorian Prefecture of Africa, formally integrating North Africa into the empire.', tags: ['politics', 'administration'] },
    ],
    figures: [
      { name: 'Belisarius', role: 'General', livedFrom: 505, livedTo: 565 },
      { name: 'Gelimer', role: 'Last Vandal King', livedFrom: 480, livedTo: 553 },
      { name: 'Solomon', role: 'Praetorian Prefect of Africa', livedTo: 544 },
    ],
    monuments: [
      { name: 'Vandal Royal Palace', description: 'Former Vandal palace repurposed as Byzantine administrative center.' },
      { name: 'Circus of Carthage', description: 'One of the largest circuses in the Roman world, still in use.' },
    ],
  },
  {
    id: 'rome',
    name: 'Rome',
    latinName: 'Roma',
    coordinates: { lat: 41.9, lng: 12.49 },
    size: 'major',
    populationEstimate: 100000,
    populationNote: 'Declining rapidly — from ~800,000 in its prime',
    controlHistory: [
      { faction: 'ostrogothic', label: 'Ostrogothic Kingdom', from: 493, to: 536 },
      { faction: 'contested', label: 'Contested — Gothic War', from: 536, to: 552 },
      { faction: 'eastern_roman', label: 'Eastern Roman Empire', from: 552, to: 565 },
    ],
    events: [
      { year: 536, title: 'Belisarius Enters Rome', description: 'Belisarius marches into Rome unopposed as the Ostrogothic garrison retreats. The city changes hands five times over the next decade.', tags: ['war', 'reconquest'] },
      { year: 537, title: 'Siege of Rome', description: 'Vitiges surrounds Rome with 150,000 troops. Belisarius holds the city for over a year with a tiny garrison.', tags: ['war', 'siege'] },
      { year: 546, title: 'Totila Sacks Rome', description: 'The Ostrogothic king Totila captures and partly demolishes Rome. The population, once hundreds of thousands, flees — the city is briefly almost empty.', tags: ['war', 'sack', 'crisis'] },
      { year: 552, title: 'Battle of Busta Gallorum', description: 'Narses defeats and kills Totila. The Gothic War effectively ends; Italy is secured for Byzantium — at enormous cost.', tags: ['war', 'victory'] },
    ],
    figures: [
      { name: 'Belisarius', role: 'General', livedFrom: 505, livedTo: 565 },
      { name: 'Totila', role: 'Ostrogothic King', livedTo: 552 },
      { name: 'Pope Vigilius', role: 'Bishop of Rome', livedFrom: 500, livedTo: 555 },
      { name: 'Narses', role: 'General', livedFrom: 478, livedTo: 573 },
    ],
    monuments: [
      { name: 'Pantheon', description: 'Converted to a Christian church — one of the best-preserved ancient buildings.' },
      { name: "St. Peter's Basilica", description: 'The old basilica built by Constantine — still the centre of Western Christendom.' },
      { name: 'Colosseum', description: 'Still standing, though gladiatorial games have ended.' },
    ],
  },
  {
    id: 'thessaloniki',
    name: 'Thessaloniki',
    latinName: 'Θεσσαλονίκη',
    coordinates: { lat: 40.64, lng: 22.94 },
    size: 'medium',
    populationEstimate: 50000,
    populationNote: 'Second city of the Balkans',
    controlHistory: [
      { faction: 'eastern_roman', label: 'Eastern Roman Empire', from: 527, to: 565 },
    ],
    events: [
      { year: 540, title: 'Hunnic and Slavic Raids', description: 'Hunnic and early Slavic groups raid deep into the Balkans, threatening Thessaloniki and devastating the surrounding countryside.', tags: ['war', 'raid'] },
      { year: 550, title: 'Balkan Fortifications Reinforced', description: 'Justinian undertakes a massive program of fortress-building across the Balkans to protect cities like Thessaloniki from raids.', tags: ['architecture', 'defense'] },
    ],
    figures: [
      { name: 'Demetrius of Thessaloniki', role: 'Patron Saint', livedTo: 306 },
    ],
    monuments: [
      { name: 'Rotunda of Galerius', description: 'Ancient mausoleum converted to a church — later a mosque, now a museum.' },
      { name: 'Church of the Acheiropoietos', description: 'One of the oldest surviving churches in the world.' },
    ],
  },
  {
    id: 'athens',
    name: 'Athens',
    latinName: 'Ἀθῆναι',
    coordinates: { lat: 37.98, lng: 23.73 },
    size: 'medium',
    populationEstimate: 20000,
    populationNote: 'A shadow of ancient glory',
    controlHistory: [
      { faction: 'eastern_roman', label: 'Eastern Roman Empire', from: 527, to: 565 },
    ],
    events: [
      { year: 529, title: 'Platonic Academy Closed', description: "Justinian's edict closes the Academy of Athens — the last institution of classical pagan philosophy, operating for over 900 years since Plato founded it.", tags: ['culture', 'religion', 'law'] },
    ],
    figures: [
      { name: 'Damascius', role: 'Last head of the Platonic Academy', livedFrom: 458, livedTo: 538 },
    ],
    monuments: [
      { name: 'Parthenon', description: 'Converted to a Christian church dedicated to the Virgin Mary.' },
      { name: "Hadrian's Library", description: 'Still in use as an administrative building.' },
    ],
  },
  {
    id: 'jerusalem',
    name: 'Jerusalem',
    latinName: 'Ἱερουσαλήμ',
    coordinates: { lat: 31.78, lng: 35.22 },
    size: 'medium',
    populationEstimate: 30000,
    populationNote: 'Holiest city in Christendom',
    controlHistory: [
      { faction: 'eastern_roman', label: 'Eastern Roman Empire', from: 527, to: 565 },
    ],
    events: [
      { year: 527, title: 'Church Building Programme Begins', description: 'Justinian launches a major programme of church construction in Palestine, affirming Jerusalem\'s spiritual centrality.', tags: ['architecture', 'religion'] },
      { year: 543, title: 'Nea Ekklesia Dedicated', description: 'The New Church of the Theotokos — the largest church Justinian built in Palestine — is dedicated with great ceremony.', tags: ['architecture', 'religion'] },
    ],
    figures: [
      { name: 'Cyril of Scythopolis', role: 'Monk and Hagiographer', livedFrom: 525, livedTo: 559 },
    ],
    monuments: [
      { name: 'Church of the Holy Sepulchre', description: 'The holiest site in Christendom — rebuilt and expanded under Justinian.' },
      { name: 'Nea Ekklesia', built: 543, description: "Justinian's New Church — one of the grandest buildings of the reign." },
    ],
  },
  {
    id: 'ctesiphon',
    name: 'Ctesiphon',
    latinName: 'Κτησιφῶν',
    coordinates: { lat: 33.09, lng: 44.58 },
    size: 'major',
    populationEstimate: 200000,
    populationNote: 'Sassanid imperial capital — great rival of Constantinople',
    controlHistory: [
      { faction: 'sassanid', label: 'Sassanid Persian Empire', from: 527, to: 565 },
    ],
    events: [
      { year: 531, title: 'Khosrow I Ascends', description: "Khosrow I 'Anushiravan' (the Immortal Soul) becomes king of Persia — the greatest Sassanid ruler and Justinian's most formidable adversary.", tags: ['politics'] },
      { year: 532, title: 'Eternal Peace Signed', description: 'Justinian pays Khosrow I 11,000 pounds of gold for a permanent peace — freeing his armies for the western reconquests.', tags: ['diplomacy', 'peace'] },
      { year: 540, title: 'Khosrow Breaks the Peace', description: 'Khosrow invades Syria, sacks Antioch, and deports its population — using Justinian\'s distraction in the West.', tags: ['war', 'betrayal'] },
      { year: 562, title: 'Fifty Years Peace', description: 'After decades of costly war, Justinian agrees to pay annual tribute to Persia in exchange for peace in the East.', tags: ['diplomacy', 'peace'] },
    ],
    figures: [
      { name: 'Khosrow I (Anushiravan)', role: 'Sassanid Shah', livedFrom: 501, livedTo: 579 },
    ],
    monuments: [
      { name: 'Taq Kasra', description: "The Arch of Ctesiphon — the largest single-span brick arch ever built; the Sassanid throne room." },
      { name: 'Sassanid Royal Palace', description: 'The heart of Sassanid imperial power.' },
    ],
  },
]

// ─── Global Timeline Events ───────────────────────────────────────────────────

export interface TimelineEvent {
  year: number
  label: string
  category: 'military' | 'law' | 'religion' | 'disaster' | 'diplomacy' | 'culture'
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { year: 527, label: 'Justinian Crowned', category: 'law' },
  { year: 529, label: "Justinian's Code", category: 'law' },
  { year: 532, label: 'Nika Riots', category: 'disaster' },
  { year: 532, label: 'Eternal Peace', category: 'diplomacy' },
  { year: 533, label: 'Vandal War', category: 'military' },
  { year: 535, label: 'Gothic War', category: 'military' },
  { year: 537, label: 'Hagia Sophia', category: 'religion' },
  { year: 540, label: 'Persia Attacks', category: 'military' },
  { year: 542, label: 'Great Plague', category: 'disaster' },
  { year: 548, label: 'Theodora Dies', category: 'culture' },
  { year: 552, label: 'Italy Secured', category: 'military' },
  { year: 562, label: 'Persian Peace', category: 'diplomacy' },
  { year: 565, label: 'Justinian Dies', category: 'culture' },
]

// ─── Map Constants ────────────────────────────────────────────────────────────

export const MAP_BOUNDS = {
  latMin: 20, latMax: 58,
  lngMin: -5, lngMax: 65,
  width: 20, height: 12,
} as const

export const FACTION_COLORS: Record<string, string> = {
  eastern_roman: '#c9a84c',
  ostrogothic: '#7a9a6a',
  vandal: '#8a6a9a',
  sassanid: '#9a4a4a',
  contested: '#8a7a5a',
}

export const REIGN_START = 527
export const REIGN_END = 565
