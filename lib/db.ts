import { prisma } from './prisma'
import { CourseLevel, CourseDifficulty, CourseStatus } from '@/lib/generated/prisma'
import bcrypt from 'bcryptjs'
import { DEFAULT_CATEGORIES, DEFAULT_COURSES } from './fallback-data'

// Database interfaces
export interface Course {
  id: string
  title: string
  category: string
  level: string
  price: number
  discountPrice?: number
  lessons?: number
  projects?: number
  assignments?: number
  hasCertificate?: boolean
  instructor: string
  duration: string
  rating: number
  students: number
  image: string
  bannerImage?: string
  description: string
  aboutCourse: string
  curriculum: string[]
  learningOutcomes: string[]
  prerequisites: string[]
  topicsCovered: string[]
  highlights: string[]
  isDisabled?: boolean
  featured?: boolean
  upcoming?: boolean
  demoVideo?: string
  galleryImages?: string[]
  faq?: { q: string, a: string }[]
  seoTitle?: string
  seoDescription?: string
}

export interface Instrument {
  id: string
  name: string
  status: 'Active' | 'Upcoming' | 'Inactive'
  icon?: string
  image?: string
  description?: string
  isVisible?: boolean
  coursesCount?: number
  startingPrice?: number
  levels?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Instructor {
  id: string
  name: string
  email: string
  expertise: string
  rating: number
  students: number
  avatar: string
  isActive?: boolean
  photo?: string
  resume?: string
  certificates?: string[]
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
  studentId?: string
  paymentId?: string
  orderId?: string
  paymentStatus?: string
}

export interface Workshop {
  id: string
  title: string
  instructor: string
  date: string
  time: string
  price: number
  description: string
  capacity?: number
  images?: string[]
}

export interface RecordedSession {
  id: string
  title: string
  description: string
  url: string // YouTube or video URL
  instrument: string
  courseId?: string // restricted by purchased course id
}

export interface Payment {
  id: string
  studentEmail: string
  studentName: string
  courseId: string
  courseName: string
  amount: number
  paymentId: string
  orderId: string
  status: 'Success' | 'Failed'
  createdAt: string
  invoiceNumber?: string
}

export interface AuditLog {
  id: string
  userEmail: string
  action: string
  details: string
  createdAt: string
}

export interface DbUser {
  id: string
  name: string
  email: string
  passwordHash?: string
  role: 'SUPER_ADMIN' | 'INSTRUCTOR' | 'STUDENT'
  createdAt: string
  googleId?: string
  isVerified?: boolean
  status?: 'Active' | 'Suspended' | 'Pending'
  enrolledCourses?: string[]
}

export interface ContactInquiry {
  id: string
  fullName: string
  email: string
  phone: string
  purpose: string
  message: string
  createdAt: string
  ipAddress?: string
  status: 'New' | 'Read'
}

export interface AdminNotification {
  id: string
  title: string
  message: string
  createdAt: string
  isRead: boolean
}

// Mapper functions to handle mapping between Frontend Capitalized properties and DB Enums
export function mapCourseToFrontend(c: any, instructorMap?: Map<string, string>) {
  if (!c) return null
  
  let levelStr = 'Beginner'
  if (c.level === 'BEGINNER') levelStr = 'Beginner'
  else if (c.level === 'INTERMEDIATE') levelStr = 'Intermediate'
  else if (c.level === 'ADVANCED') levelStr = 'Advanced'

  let diffStr = 'Medium'
  if (c.difficulty === 'EASY') diffStr = 'Easy'
  else if (c.difficulty === 'MEDIUM') diffStr = 'Medium'
  else if (c.difficulty === 'HARD') diffStr = 'Hard'

  let statusStr = 'Draft'
  if (c.status === 'PUBLISHED') statusStr = 'Published'
  else if (c.status === 'ARCHIVED') statusStr = 'Archived'

  let curriculumArr: string[] = []
  if (c.curriculum) {
    try {
      curriculumArr = JSON.parse(c.curriculum)
    } catch {
      curriculumArr = [c.curriculum]
    }
  }

  const faqArr = (c.faqs || []).map((f: string) => {
    const match = f.match(/^Q:\s*(.*?)\s*A:\s*(.*)$/)
    if (match) {
      return { q: match[1], a: match[2] }
    }
    return { q: f, a: '' }
  })

  const instructorName = 'Ajinkya Amrule'

  return {
    id: c.id,
    title: c.title,
    category: c.instrumentId,
    level: levelStr,
    price: c.price,
    discountPrice: c.discountPrice || 0,
    instructor: instructorName,
    instructorId: c.instructorId || 'instructor-1',
    duration: c.duration,
    rating: 4.8,
    students: c.enrolledStudents || 0,
    image: c.thumbnail || `/courses/${c.id}.jpg`,
    bannerImage: c.banner || null,
    description: c.description || '',
    aboutCourse: c.aboutCourse || '',
    curriculum: curriculumArr,
    learningOutcomes: c.learningOutcomes || [],
    prerequisites: c.learningOutcomes || [],
    topicsCovered: curriculumArr,
    highlights: c.learningOutcomes || [],
    isDisabled: c.isDisabled || false,
    featured: c.featured || false,
    upcoming: c.upcoming || false,
    demoVideo: c.demoVideo || '',
    galleryImages: c.galleryImages || [],
    faq: faqArr,
    lessons: c.lessons || 24,
    projects: c.projects || 3,
    assignments: c.assignments || 5,
    hasCertificate: c.certificateAvailable || false,
    maxStudents: c.maxStudents || 30,
    difficulty: diffStr,
    language: c.language || 'English',
    status: statusStr,
    thumbnail: c.thumbnail || null
  }
}

export function mapCourseToDb(c: any) {
  let levelEnum: CourseLevel = CourseLevel.BEGINNER
  const lvl = String(c.level).toUpperCase()
  if (lvl === 'BEGINNER' || lvl === 'EASY') levelEnum = CourseLevel.BEGINNER
  else if (lvl === 'INTERMEDIATE' || lvl === 'MEDIUM') levelEnum = CourseLevel.INTERMEDIATE
  else if (lvl === 'ADVANCED' || lvl === 'HARD') levelEnum = CourseLevel.ADVANCED

  let diffEnum: CourseDifficulty = CourseDifficulty.MEDIUM
  const diff = String(c.difficulty).toUpperCase()
  if (diff === 'EASY' || diff === 'BEGINNER') diffEnum = CourseDifficulty.EASY
  else if (diff === 'MEDIUM' || diff === 'INTERMEDIATE') diffEnum = CourseDifficulty.MEDIUM
  else if (diff === 'HARD' || diff === 'ADVANCED') diffEnum = CourseDifficulty.HARD

  let statusEnum: CourseStatus = CourseStatus.DRAFT
  let isDisabled = c.isDisabled !== undefined ? c.isDisabled : true

  const status = String(c.status || '').toUpperCase()
  if (status === 'PUBLISHED') {
    statusEnum = CourseStatus.PUBLISHED
    isDisabled = false
  } else if (status === 'ARCHIVED') {
    statusEnum = CourseStatus.ARCHIVED
    isDisabled = true
  } else if (status === 'DRAFT') {
    statusEnum = CourseStatus.DRAFT
    isDisabled = true
  }

  return {
    title: c.title,
    slug: c.slug || c.title.toLowerCase().replace(/\s+/g, '-'),
    level: levelEnum,
    description: c.description || '',
    duration: c.duration || '3 Months',
    price: Number(c.price),
    discountPrice: c.discountPrice ? Number(c.discountPrice) : null,
    instructorId: c.instructorId || 'instructor-1',
    thumbnail: c.thumbnail || c.image || null,
    banner: c.banner || c.bannerImage || null,
    maxStudents: c.maxStudents ? Number(c.maxStudents) : 30,
    language: c.language || 'English',
    difficulty: diffEnum,
    certificateAvailable: c.certificateAvailable !== false,
    status: statusEnum,
    aboutCourse: c.aboutCourse || c.description || '',
    curriculum: Array.isArray(c.curriculum) ? JSON.stringify(c.curriculum) : String(c.curriculum),
    learningOutcomes: c.learningOutcomes || [],
    faqs: Array.isArray(c.faq) 
      ? c.faq.map((item: any) => `Q: ${item.q || item.question} A: ${item.a || item.answer}`) 
      : Array.isArray(c.faqs) ? c.faqs : [],
    isDisabled,
    featured: c.featured || false,
    upcoming: c.upcoming || false,
    demoVideo: c.demoVideo || null,
    galleryImages: c.galleryImages || []
  }
}

// Database helper functions

export async function getInstruments(): Promise<Instrument[]> {
  try {
    const list = await prisma.instrument.findMany({
      orderBy: { name: 'asc' }
    })
    if (list.length === 0) {
      return DEFAULT_CATEGORIES as any
    }
    return list.map(i => ({
      id: i.id,
      name: i.name,
      status: (i.status === 'Active' || i.status === 'ACTIVE') ? 'Active' : (i.status === 'Upcoming' || i.status === 'COMING_SOON' ? 'Upcoming' : 'Inactive'),
      icon: i.icon || undefined,
      image: i.image || undefined,
      description: i.description || undefined,
      isVisible: i.isVisible,
      coursesCount: i.coursesCount,
      startingPrice: i.startingPrice,
      levels: i.levels,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt
    }))
  } catch (err) {
    console.warn('getInstruments failed, returning fallback.', err)
    return DEFAULT_CATEGORIES as any
  }
}

export async function addInstrument(instrument: Instrument): Promise<boolean> {
  try {
    await prisma.instrument.create({
      data: {
        id: instrument.id,
        name: instrument.name,
        slug: instrument.id.toLowerCase().replace(/\s+/g, '-'),
        icon: instrument.icon || null,
        description: instrument.description || null,
        image: instrument.image || null,
        status: instrument.status === 'Active' ? 'ACTIVE' : (instrument.status === 'Upcoming' ? 'COMING_SOON' : 'INACTIVE'),
        isFeatured: false,
        isUpcoming: instrument.status === 'Upcoming',
        isVisible: instrument.isVisible ?? true,
        coursesCount: instrument.coursesCount || 0,
        startingPrice: instrument.startingPrice || 4999,
        levels: instrument.levels || ["Beginner", "Intermediate", "Advanced"]
      }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function deleteInstrument(id: string): Promise<boolean> {
  try {
    await prisma.instrument.delete({
      where: { id }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function updateInstrument(instrument: Instrument): Promise<boolean> {
  try {
    await prisma.instrument.update({
      where: { id: instrument.id },
      data: {
        name: instrument.name,
        status: instrument.status === 'Active' ? 'ACTIVE' : (instrument.status === 'Upcoming' ? 'COMING_SOON' : 'INACTIVE'),
        icon: instrument.icon || null,
        description: instrument.description || null,
        image: instrument.image || null,
        isUpcoming: instrument.status === 'Upcoming',
        isVisible: instrument.isVisible ?? true,
        coursesCount: instrument.coursesCount || 0,
        startingPrice: instrument.startingPrice || 4999,
        levels: instrument.levels || ["Beginner", "Intermediate", "Advanced"]
      }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function getCourses(): Promise<Course[]> {
  try {
    const list = await prisma.course.findMany()
    const instructors = await prisma.instructor.findMany()
    const instructorMap = new Map(instructors.map(i => [i.id, i.name]))
    if (list.length === 0) {
      return DEFAULT_COURSES as any
    }
    return list.map(c => mapCourseToFrontend(c, instructorMap)) as Course[]
  } catch (err) {
    console.warn('getCourses failed, returning fallback.', err)
    return DEFAULT_COURSES as any
  }
}

export async function getCourseByInstrumentAndLevel(instrumentSlug: string, levelStr: string) {
  const levelUpper = levelStr.toUpperCase() as CourseLevel
  let instrument: any = null
  let course: any = null
  let dbError = false

  try {
    instrument = await prisma.instrument.findUnique({
      where: { slug: instrumentSlug }
    })
    if (instrument) {
      course = await prisma.course.findFirst({
        where: {
          instrumentId: instrument.id,
          level: levelUpper
        },
        include: {
          CourseContent: true,
          Curriculum: {
            include: {
              modules: true
            }
          },
          LearningOutcomes: true,
          Prerequisites: true,
          TopicsCovered: true
        }
      })
    }
  } catch (err) {
    console.warn('getCourseByInstrumentAndLevel DB query failed. Using fallbacks.', err)
    dbError = true
  }

  // Fallback if DB error, or not found in DB
  if (dbError || !instrument || !course) {
    const fallbackCategory = DEFAULT_CATEGORIES.find(i => i.slug === instrumentSlug)
    if (!fallbackCategory) return null

    const fallbackCourse = DEFAULT_COURSES.find(c => 
      c.category.toLowerCase() === fallbackCategory.id.toLowerCase() && 
      c.level.toLowerCase() === levelStr.toLowerCase()
    )
    if (!fallbackCourse) return null

    return {
      ...fallbackCourse,
      instrumentName: fallbackCategory.name,
      instrumentSlug: fallbackCategory.slug,
      instructorName: 'Ajinkya Amrule',
      instructorBio: 'Professional music educator dedicated to Trinity, Guildhall and modern performance training.',
      instructorImage: '/images/instructor_portrait.jpg',
      about: fallbackCourse.aboutCourse || fallbackCourse.description,
      prerequisites: fallbackCourse.prerequisites,
      topicsCovered: fallbackCourse.topicsCovered,
      learningOutcomesList: fallbackCourse.learningOutcomes,
      curriculumList: fallbackCourse.curriculum.map((c, index) => ({
        moduleName: `Module ${index + 1}: ${c}`,
        topics: [c]
      }))
    }
  }

  const mapped = mapCourseToFrontend(course)

  return {
    ...mapped,
    instrumentName: instrument.name,
    instrumentSlug: instrument.slug,
    instructorName: 'Ajinkya Amrule',
    instructorBio: '',
    instructorImage: '/images/instructor_portrait.jpg',
    about: course.CourseContent?.about || course.description || '',
    prerequisites: course.Prerequisites.map(p => p.requirement),
    topicsCovered: course.TopicsCovered.map(t => t.topic),
    learningOutcomesList: course.LearningOutcomes.map(l => l.outcome),
    curriculumList: course.Curriculum?.modules.map(c => ({
      moduleName: c.moduleName,
      topics: c.topics
    })) || []
  }
}

export async function updateCoursePrice(id: string, price: number): Promise<boolean> {
  try {
    await prisma.course.update({
      where: { id },
      data: { price }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function getInstructors(): Promise<Instructor[]> {
  try {
    const list = await prisma.instructor.findMany()
    if (list.length === 0) {
      return [{
        id: 'instructor-1',
        name: 'Ajinkya Amrule',
        email: 'instructor@2ndinversion.com',
        expertise: 'Piano, Guitar, Vocals, Music Theory, Bass Guitar',
        rating: 4.9,
        students: 500,
        avatar: 'AA',
        isActive: true,
        photo: '/images/instructor_portrait.jpg',
        certificates: ['Trinity College London Certified', 'Associated Board of the Royal Schools of Music (ABRSM)']
      }]
    }
    return list.map(i => ({
      id: i.id,
      name: i.name,
      email: i.email,
      expertise: i.expertise || '',
      rating: i.rating,
      students: i.students,
      avatar: i.avatar || 'AA',
      isActive: i.isActive,
      photo: i.photo || undefined,
      resume: i.resume || undefined,
      certificates: i.certificates
    }))
  } catch (err) {
    console.warn('getInstructors failed, returning fallback.', err)
    return [{
      id: 'instructor-1',
      name: 'Ajinkya Amrule',
      email: 'instructor@2ndinversion.com',
      expertise: 'Piano, Guitar, Vocals, Music Theory, Bass Guitar',
      rating: 4.9,
      students: 500,
      avatar: 'AA',
      isActive: true,
      photo: '/images/instructor_portrait.jpg',
      certificates: ['Trinity College London Certified', 'Associated Board of the Royal Schools of Music (ABRSM)']
    }]
  }
}

export async function getSchedules(): Promise<BatchSchedule[]> {
  try {
    const list = await prisma.batchSchedule.findMany()
    return list.map(s => ({
      id: s.id,
      name: s.name,
      startTime: s.startTime,
      endTime: s.endTime,
      timeSlots: s.timeSlots
    }))
  } catch (err) {
    console.warn('getSchedules failed, returning empty list.', err)
    return []
  }
}

export async function updateSchedules(schedules: BatchSchedule[]): Promise<boolean> {
  try {
    await prisma.$transaction([
      prisma.batchSchedule.deleteMany(),
      prisma.batchSchedule.createMany({
        data: schedules.map(s => ({
          id: s.id,
          name: s.name,
          startTime: s.startTime,
          endTime: s.endTime,
          timeSlots: s.timeSlots
        }))
      })
    ])
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function getHolidays(): Promise<Holiday[]> {
  try {
    const list = await prisma.holiday.findMany()
    return list.map(h => ({
      id: h.id,
      date: h.date,
      reason: h.reason,
      isRecurringWeekly: h.isRecurringWeekly,
      dayOfWeek: h.dayOfWeek || undefined
    }))
  } catch (err) {
    console.warn('getHolidays failed, returning empty list.', err)
    return []
  }
}

export async function addHoliday(holiday: Holiday): Promise<boolean> {
  try {
    await prisma.holiday.create({
      data: {
        id: holiday.id,
        date: holiday.date,
        reason: holiday.reason,
        isRecurringWeekly: holiday.isRecurringWeekly,
        dayOfWeek: holiday.dayOfWeek ?? null
      }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function deleteHoliday(id: string): Promise<boolean> {
  try {
    await prisma.holiday.delete({ where: { id } })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function getBookings(): Promise<Booking[]> {
  try {
    const list = await prisma.booking.findMany()
    return list.map(b => ({
      id: b.id,
      courseId: b.courseId,
      courseName: b.courseName,
      instructor: b.instructor,
      date: b.date,
      timeSlot: b.timeSlot,
      batchTiming: b.batchTiming,
      studentName: b.studentName,
      studentEmail: b.studentEmail,
      status: b.status as any,
      createdAt: b.createdAt.toISOString(),
      paymentMethod: b.paymentMethod || undefined,
      amount: b.amount || undefined,
      studentId: b.studentId || undefined,
      paymentId: b.paymentId || undefined,
      orderId: b.orderId || undefined,
      paymentStatus: b.paymentStatus || undefined
    }))
  } catch (err) {
    console.warn('getBookings failed, returning empty list.', err)
    return []
  }
}

export async function addBooking(booking: Booking): Promise<boolean> {
  try {
    await prisma.booking.create({
      data: {
        id: booking.id,
        courseId: booking.courseId,
        courseName: booking.courseName,
        instructor: booking.instructor,
        date: booking.date,
        timeSlot: booking.timeSlot,
        batchTiming: booking.batchTiming,
        studentName: booking.studentName,
        studentEmail: booking.studentEmail,
        status: booking.status,
        amount: booking.amount ?? null,
        paymentMethod: booking.paymentMethod ?? null,
        studentId: booking.studentId ?? null,
        paymentId: booking.paymentId ?? null,
        orderId: booking.orderId ?? null,
        paymentStatus: booking.paymentStatus ?? null
      }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function updateBookingStatus(id: string, status: 'Booked' | 'Pending' | 'Cancelled'): Promise<boolean> {
  try {
    await prisma.booking.update({
      where: { id },
      data: { status }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function deleteBooking(id: string): Promise<boolean> {
  try {
    await prisma.booking.delete({ where: { id } })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function getWorkshops(): Promise<Workshop[]> {
  try {
    const list = await prisma.workshop.findMany()
    return list.map(w => ({
      id: w.id,
      title: w.title,
      instructor: w.instructor,
      date: w.date,
      time: w.time,
      price: w.price,
      description: w.description,
      capacity: w.capacity,
      images: w.images
    }))
  } catch (err) {
    console.warn('getWorkshops failed, returning empty list.', err)
    return []
  }
}

export async function addWorkshop(workshop: Workshop): Promise<boolean> {
  try {
    await prisma.workshop.create({
      data: {
        id: workshop.id,
        title: workshop.title,
        instructor: workshop.instructor,
        date: workshop.date,
        time: workshop.time,
        price: workshop.price,
        description: workshop.description,
        capacity: workshop.capacity ?? 30,
        images: workshop.images ?? []
      }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function getRecordedSessions(): Promise<RecordedSession[]> {
  try {
    const list = await prisma.recordedSession.findMany()
    return list.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      url: r.url,
      instrument: r.instrument,
      courseId: r.courseId || undefined
    }))
  } catch (err) {
    console.warn('getRecordedSessions failed, returning empty list.', err)
    return []
  }
}

export async function addRecordedSession(session: RecordedSession): Promise<boolean> {
  try {
    await prisma.recordedSession.create({
      data: {
        id: session.id,
        title: session.title,
        description: session.description,
        url: session.url,
        instrument: session.instrument,
        courseId: session.courseId ?? null
      }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const u = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  })
  if (!u) return null
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    passwordHash: u.passwordHash || undefined,
    role: u.role as any,
    createdAt: u.createdAt.toISOString(),
    googleId: u.googleId || undefined,
    isVerified: u.isVerified,
    status: u.status as any,
    enrolledCourses: u.enrolledCourses
  }
}

export async function createUser(user: DbUser): Promise<boolean> {
  try {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email.toLowerCase(),
        passwordHash: user.passwordHash ?? null,
        role: user.role,
        googleId: user.googleId ?? null,
        isVerified: user.isVerified || false,
        status: user.status || 'Active',
        enrolledCourses: user.enrolledCourses ?? []
      }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function updateUserPassword(email: string, passwordHash: string): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { passwordHash }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function verifyUserEmail(email: string): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { isVerified: true }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function getInquiries(): Promise<ContactInquiry[]> {
  const list = await prisma.contactInquiry.findMany()
  return list.map(i => ({
    id: i.id,
    fullName: i.fullName,
    email: i.email,
    phone: i.phone,
    purpose: i.purpose,
    message: i.message,
    createdAt: i.createdAt.toISOString(),
    ipAddress: i.ipAddress || undefined,
    status: i.status as any
  }))
}

export async function addInquiry(inquiry: ContactInquiry): Promise<boolean> {
  try {
    await prisma.contactInquiry.create({
      data: {
        id: inquiry.id,
        fullName: inquiry.fullName,
        email: inquiry.email,
        phone: inquiry.phone,
        purpose: inquiry.purpose,
        message: inquiry.message,
        ipAddress: inquiry.ipAddress ?? null,
        status: inquiry.status
      }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function updateInquiryStatus(id: string, status: 'New' | 'Read'): Promise<boolean> {
  try {
    await prisma.contactInquiry.update({
      where: { id },
      data: { status }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function deleteInquiry(id: string): Promise<boolean> {
  try {
    await prisma.contactInquiry.delete({ where: { id } })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function getNotifications(): Promise<AdminNotification[]> {
  const list = await prisma.notification.findMany()
  return list.map(n => ({
    id: n.id,
    title: n.title,
    message: n.message,
    createdAt: n.createdAt.toISOString(),
    isRead: n.isRead
  }))
}

export async function addNotification(notification: AdminNotification): Promise<boolean> {
  try {
    await prisma.notification.create({
      data: {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead
      }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function markNotificationsAsRead(ids?: string[]): Promise<boolean> {
  try {
    if (ids && ids.length > 0) {
      await prisma.notification.updateMany({
        where: { id: { in: ids } },
        data: { isRead: true }
      })
    } else {
      await prisma.notification.updateMany({
        data: { isRead: true }
      })
    }
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function deleteNotification(id: string): Promise<boolean> {
  try {
    await prisma.notification.delete({ where: { id } })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function addCourse(course: Course): Promise<boolean> {
  try {
    const dbPayload = mapCourseToDb(course)
    await prisma.course.create({
      data: {
        id: course.id,
        instrumentId: course.category,
        ...dbPayload
      }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function updateCourse(course: Course): Promise<boolean> {
  try {
    const dbPayload = mapCourseToDb(course)
    await prisma.course.update({
      where: { id: course.id },
      data: {
        instrumentId: course.category,
        ...dbPayload
      }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function deleteCourse(id: string): Promise<boolean> {
  try {
    await prisma.course.delete({ where: { id } })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function toggleCourseStatus(id: string, isDisabled: boolean): Promise<boolean> {
  try {
    await prisma.course.update({
      where: { id },
      data: { isDisabled }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function addInstructor(inst: Instructor): Promise<boolean> {
  try {
    await prisma.instructor.create({
      data: {
        id: inst.id,
        name: inst.name,
        email: inst.email,
        expertise: inst.expertise,
        rating: inst.rating,
        students: inst.students,
        avatar: inst.avatar,
        isActive: inst.isActive || true,
        photo: inst.photo ?? null,
        resume: inst.resume ?? null,
        certificates: inst.certificates ?? []
      }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function updateInstructor(inst: Instructor): Promise<boolean> {
  try {
    await prisma.instructor.update({
      where: { id: inst.id },
      data: {
        name: inst.name,
        email: inst.email,
        expertise: inst.expertise,
        avatar: inst.avatar,
        isActive: inst.isActive !== false,
        photo: inst.photo ?? null,
        resume: inst.resume ?? null,
        certificates: inst.certificates ?? []
      }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function deleteInstructor(id: string): Promise<boolean> {
  try {
    await prisma.instructor.delete({ where: { id } })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function getUsers(): Promise<DbUser[]> {
  const list = await prisma.user.findMany()
  return list.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    passwordHash: u.passwordHash || undefined,
    role: u.role as any,
    createdAt: u.createdAt.toISOString(),
    googleId: u.googleId || undefined,
    isVerified: u.isVerified,
    status: u.status as any,
    enrolledCourses: u.enrolledCourses
  }))
}

export async function updateUserStatus(email: string, status: 'Active' | 'Suspended' | 'Pending'): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { status }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function deleteUser(email: string): Promise<boolean> {
  try {
    await prisma.user.delete({ where: { email: email.toLowerCase() } })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function addEnrolledCourse(email: string, courseId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) return false
    const enrolled = [...user.enrolledCourses]
    if (!enrolled.includes(courseId)) {
      enrolled.push(courseId)
      await prisma.user.update({
        where: { email: email.toLowerCase() },
        data: { enrolledCourses: enrolled }
      })
    }
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function getPayments(): Promise<Payment[]> {
  const list = await prisma.payment.findMany()
  return list.map(p => ({
    id: p.id,
    studentEmail: p.studentEmail,
    studentName: p.studentName,
    courseId: p.courseId,
    courseName: p.courseName,
    amount: p.amount,
    paymentId: p.paymentId,
    orderId: p.orderId,
    status: p.status as any,
    createdAt: p.createdAt.toISOString(),
    invoiceNumber: p.invoiceNumber || undefined
  }))
}

export async function addPayment(payment: Payment): Promise<boolean> {
  try {
    await prisma.payment.create({
      data: {
        id: payment.id,
        studentEmail: payment.studentEmail,
        studentName: payment.studentName,
        courseId: payment.courseId,
        courseName: payment.courseName,
        amount: payment.amount,
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        status: payment.status,
        invoiceNumber: payment.invoiceNumber ?? null
      }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function updateWorkshop(workshop: Workshop): Promise<boolean> {
  try {
    await prisma.workshop.update({
      where: { id: workshop.id },
      data: {
        title: workshop.title,
        instructor: workshop.instructor,
        date: workshop.date,
        time: workshop.time,
        price: workshop.price,
        description: workshop.description,
        capacity: workshop.capacity ?? 30,
        images: workshop.images ?? []
      }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function deleteWorkshop(id: string): Promise<boolean> {
  try {
    await prisma.workshop.delete({ where: { id } })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function deleteRecordedSession(id: string): Promise<boolean> {
  try {
    await prisma.recordedSession.delete({ where: { id } })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const list = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return list.map(a => ({
    id: a.id,
    userEmail: a.userEmail,
    action: a.action,
    details: a.details,
    createdAt: a.createdAt.toISOString()
  }))
}

export async function addAuditLog(log: AuditLog): Promise<boolean> {
  try {
    await prisma.auditLog.create({
      data: {
        id: log.id || undefined,
        userEmail: log.userEmail,
        action: log.action,
        details: log.details
      }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function rescheduleBooking(id: string, date: string, timeSlot: string): Promise<boolean> {
  try {
    await prisma.booking.update({
      where: { id },
      data: { date, timeSlot }
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}
