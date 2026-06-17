import { MongoClient, Db } from 'mongodb'
import fs from 'fs'
import path from 'path'

// Database interfaces
export interface Course {
  id: string
  title: string
  category: string
  level: string
  price: number
  instructor: string
  duration: string
  rating: number
  students: number
  image: string
  description: string
  aboutCourse: string
  curriculum: string[]
  learningOutcomes: string[]
  prerequisites: string[]
  topicsCovered: string[]
  highlights: string[]
}

export interface Instructor {
  id: string
  name: string
  email: string
  expertise: string
  rating: number
  students: number
  avatar: string
}

export interface BatchSchedule {
  id: string
  name: string
  startTime: string
  endTime: string
  timeSlots: string[]
}

export interface Holiday {
  id: string
  date: string // YYYY-MM-DD
  reason: string
  isRecurringWeekly: boolean
  dayOfWeek?: number // 0 = Sunday, 1 = Monday, etc.
}

export interface Booking {
  id: string
  courseId: string
  courseName: string
  instructor: string
  date: string // YYYY-MM-DD
  timeSlot: string
  batchTiming: string // 'morning' | 'evening'
  studentName: string
  studentEmail: string
  status: 'Booked' | 'Pending' | 'Cancelled'
  createdAt: string
  paymentMethod?: string
  amount?: number
}

export interface Workshop {
  id: string
  title: string
  instructor: string
  date: string
  time: string
  price: number
  description: string
}

export interface RecordedSession {
  id: string
  title: string
  description: string
  url: string // YouTube or video URL
  instrument: string
}

// Database Connection URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/musical_school"
const MONGODB_DB = process.env.MONGODB_DB || "musical_school"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null
let useLocalFallback = false

async function getMongoClient(): Promise<Db | null> {
  if (useLocalFallback) return null
  if (cachedDb) return cachedDb

  try {
    const client = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 2000,
      serverSelectionTimeoutMS: 2000
    })
    await client.connect()
    const db = client.db(MONGODB_DB)
    cachedClient = client
    cachedDb = db
    console.log("Connected to MongoDB successfully.")
    return db
  } catch (error) {
    console.warn("MongoDB connection failed. Falling back to local JSON database.", error)
    useLocalFallback = true
    return null
  }
}

// Fallback JSON DB path
const FALLBACK_DB_PATH = path.join(process.cwd(), 'data', 'db_fallback.json')

// Helper to initialize fallback database
function initFallbackDB() {
  if (fs.existsSync(FALLBACK_DB_PATH)) return

  // Create data folder if not exist
  const dir = path.dirname(FALLBACK_DB_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // Prepopulate courses list from default data
  const defaultCourses: Course[] = [
    {
      id: "piano-beginner",
      title: "Piano Beginner",
      category: "piano",
      level: "Beginner",
      price: 4999,
      instructor: "Ajinkya Amrule",
      duration: "3 Months",
      rating: 4.8,
      students: 1240,
      image: "/courses/piano-beginner.jpg",
      description: "Build a strong piano foundation with posture, note reading, scales, and your first performance pieces.",
      aboutCourse: "Develop basic piano habits and start reading notes.",
      curriculum: ["Intro to Keys", "Posture", "Reading Sheets"],
      learningOutcomes: ["Play simple tunes", "Correct posture"],
      prerequisites: ["None"],
      topicsCovered: ["Scales", "Chords"],
      highlights: ["Practical exercises"]
    },
    {
      id: "guitar-beginner",
      title: "Guitar Beginner",
      category: "guitar",
      level: "Beginner",
      price: 4999,
      instructor: "Ajinkya Amrule",
      duration: "3 Months",
      rating: 4.7,
      students: 1100,
      image: "/courses/guitar-beginner.jpg",
      description: "Learn fundamental chords, tuning, basic strumming, and play your first songs.",
      aboutCourse: "Develop guitar playing skills from scratch.",
      curriculum: ["Tuning and Posture", "Open Chords", "Strumming Patterns"],
      learningOutcomes: ["Play basic chord progressions", "Tune your guitar"],
      prerequisites: ["None"],
      topicsCovered: ["Open Chords", "Strumming"],
      highlights: ["Fun practice tracks"]
    }
  ]

  const defaultInstructors: Instructor[] = [
    { id: "inst-1", name: "Sarah Johnson", email: "sarah@example.com", expertise: "Piano", rating: 4.8, students: 45, avatar: "SJ" },
    { id: "inst-2", name: "Alex Brown", email: "alex@example.com", expertise: "Guitar", rating: 4.9, students: 62, avatar: "AB" },
    { id: "inst-3", name: "Ajinkya Amrule", email: "ajinkya@2ndinversionmusic.com", expertise: "Piano, Guitar, Vocals", rating: 5.0, students: 120, avatar: "AA" }
  ]

  const defaultSchedules: BatchSchedule[] = [
    {
      id: "morning",
      name: "Morning Batch",
      startTime: "04:00 AM",
      endTime: "12:00 PM",
      timeSlots: ["04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"]
    },
    {
      id: "evening",
      name: "Evening Batch",
      startTime: "03:00 PM",
      endTime: "09:00 PM",
      timeSlots: ["03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"]
    }
  ]

  const defaultHolidays: Holiday[] = [
    { id: "h-monday", date: "", reason: "Weekly Holiday", isRecurringWeekly: true, dayOfWeek: 1 }
  ]

  const data = {
    courses: defaultCourses,
    instructors: defaultInstructors,
    schedules: defaultSchedules,
    holidays: defaultHolidays,
    bookings: [],
    workshops: [
      { id: "w1", title: "Classical Piano Masterclass", instructor: "Ajinkya Amrule", date: "2026-06-25", time: "10:00 AM - 12:00 PM", price: 499, description: "Master the art of classical piano performance." }
    ],
    recordedSessions: [
      { id: "v1", title: "Piano Posture and Hand Alignment", description: "An essential guide to correct physical approach to piano keys.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", instrument: "piano" }
    ]
  }

  fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(data, null, 2))
}

function readFallbackDB(): any {
  initFallbackDB()
  try {
    const content = fs.readFileSync(FALLBACK_DB_PATH, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error("Error reading fallback JSON DB", error)
    return { courses: [], instructors: [], schedules: [], holidays: [], bookings: [], workshops: [], recordedSessions: [] }
  }
}

function writeFallbackDB(data: any) {
  try {
    fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error("Error writing fallback JSON DB", error)
  }
}

// Database helper functions

export async function getCourses(): Promise<Course[]> {
  const db = await getMongoClient()
  if (db) {
    return db.collection<Course>('courses').find({}).toArray()
  }
  return readFallbackDB().courses
}

export async function updateCoursePrice(id: string, price: number): Promise<boolean> {
  const db = await getMongoClient()
  if (db) {
    const res = await db.collection('courses').updateOne({ id }, { $set: { price } })
    return res.modifiedCount > 0
  }
  const data = readFallbackDB()
  const index = data.courses.findIndex((c: Course) => c.id === id)
  if (index !== -1) {
    data.courses[index].price = price
    writeFallbackDB(data)
    return true
  }
  return false
}

export async function getInstructors(): Promise<Instructor[]> {
  const db = await getMongoClient()
  if (db) {
    return db.collection<Instructor>('instructors').find({}).toArray()
  }
  return readFallbackDB().instructors
}

export async function getSchedules(): Promise<BatchSchedule[]> {
  const db = await getMongoClient()
  if (db) {
    return db.collection<BatchSchedule>('schedules').find({}).toArray()
  }
  return readFallbackDB().schedules
}

export async function updateSchedules(schedules: BatchSchedule[]): Promise<boolean> {
  const db = await getMongoClient()
  if (db) {
    await db.collection('schedules').deleteMany({})
    const res = await db.collection('schedules').insertMany(schedules)
    return res.acknowledged
  }
  const data = readFallbackDB()
  data.schedules = schedules
  writeFallbackDB(data)
  return true
}

export async function getHolidays(): Promise<Holiday[]> {
  const db = await getMongoClient()
  if (db) {
    return db.collection<Holiday>('holidays').find({}).toArray()
  }
  return readFallbackDB().holidays
}

export async function addHoliday(holiday: Holiday): Promise<boolean> {
  const db = await getMongoClient()
  if (db) {
    const res = await db.collection('holidays').insertOne(holiday)
    return res.acknowledged
  }
  const data = readFallbackDB()
  data.holidays.push(holiday)
  writeFallbackDB(data)
  return true
}

export async function deleteHoliday(id: string): Promise<boolean> {
  const db = await getMongoClient()
  if (db) {
    const res = await db.collection('holidays').deleteOne({ id })
    return res.deletedCount > 0
  }
  const data = readFallbackDB()
  const filtered = data.holidays.filter((h: Holiday) => h.id !== id)
  if (filtered.length !== data.holidays.length) {
    data.holidays = filtered
    writeFallbackDB(data)
    return true
  }
  return false
}

export async function getBookings(): Promise<Booking[]> {
  const db = await getMongoClient()
  if (db) {
    return db.collection<Booking>('bookings').find({}).toArray()
  }
  return readFallbackDB().bookings
}

export async function addBooking(booking: Booking): Promise<boolean> {
  const db = await getMongoClient()
  if (db) {
    const res = await db.collection('bookings').insertOne(booking)
    return res.acknowledged
  }
  const data = readFallbackDB()
  data.bookings.push(booking)
  writeFallbackDB(data)
  return true
}

export async function updateBookingStatus(id: string, status: 'Booked' | 'Pending' | 'Cancelled'): Promise<boolean> {
  const db = await getMongoClient()
  if (db) {
    const res = await db.collection('bookings').updateOne({ id }, { $set: { status } })
    return res.modifiedCount > 0
  }
  const data = readFallbackDB()
  const index = data.bookings.findIndex((b: Booking) => b.id === id)
  if (index !== -1) {
    data.bookings[index].status = status
    writeFallbackDB(data)
    return true
  }
  return false
}

export async function getWorkshops(): Promise<Workshop[]> {
  const db = await getMongoClient()
  if (db) {
    return db.collection<Workshop>('workshops').find({}).toArray()
  }
  return readFallbackDB().workshops
}

export async function addWorkshop(workshop: Workshop): Promise<boolean> {
  const db = await getMongoClient()
  if (db) {
    const res = await db.collection('workshops').insertOne(workshop)
    return res.acknowledged
  }
  const data = readFallbackDB()
  data.workshops.push(workshop)
  writeFallbackDB(data)
  return true
}

export async function getRecordedSessions(): Promise<RecordedSession[]> {
  const db = await getMongoClient()
  if (db) {
    return db.collection<RecordedSession>('recordedSessions').find({}).toArray()
  }
  return readFallbackDB().recordedSessions
}

export async function addRecordedSession(session: RecordedSession): Promise<boolean> {
  const db = await getMongoClient()
  if (db) {
    const res = await db.collection('recordedSessions').insertOne(session)
    return res.acknowledged
  }
  const data = readFallbackDB()
  data.recordedSessions.push(session)
  writeFallbackDB(data)
  return true
}
