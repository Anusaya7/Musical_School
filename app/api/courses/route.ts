import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { mapCourseToFrontend, mapCourseToDb } from '@/lib/db'
import { z } from 'zod'
import { DEFAULT_COURSES, DEFAULT_CATEGORIES } from '@/lib/fallback-data'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

// Zod validation schema for Courses
const courseInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  level: z.string().min(1, 'Level is required'),
  price: z.number().min(0, 'Price must be positive'),
  discountPrice: z.number().optional().nullable(),
  duration: z.string().optional(),
  instructorId: z.string().optional(),
  description: z.string().optional(),
  aboutCourse: z.string().optional(),
  isDisabled: z.boolean().optional(),
  featured: z.boolean().optional(),
  upcoming: z.boolean().optional(),
  demoVideo: z.string().optional().nullable(),
  hasCertificate: z.boolean().optional(),
  curriculum: z.array(z.string()).optional(),
  learningOutcomes: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  faqs: z.array(z.string()).optional(),
  maxStudents: z.number().optional(),
  language: z.string().optional(),
  difficulty: z.string().optional(),
  thumbnail: z.string().optional().nullable(),
  status: z.string().optional(),
  instructor: z.string().optional()
})

const priceUpdateSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  price: z.number().min(0, 'Price must be positive')
})

const statusUpdateSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  isDisabled: z.boolean()
})

async function generateUniqueSlug(instrumentId: string, baseSlug: string, excludeCourseId?: string) {
  let slug = baseSlug
  let counter = 1
  let exists = true

  while (exists) {
    const course = await prisma.course.findFirst({
      where: {
        instrumentId,
        slug,
        ...(excludeCourseId ? { id: { not: excludeCourseId } } : {})
      }
    })
    if (!course) {
      exists = false
    } else {
      slug = `${baseSlug}-${counter}`
      counter++
    }
  }

  return slug
}

async function updateCategoryStats(categoryId: string, tx: any) {
  const activeCourses = await tx.course.findMany({
    where: {
      instrumentId: categoryId,
      isDisabled: false
    },
    select: {
      price: true
    }
  })

  const coursesCount = activeCourses.length
  const startingPrice = coursesCount > 0 ? Math.min(...activeCourses.map((c: any) => c.price)) : 3500

  await tx.instrument.update({
    where: { id: categoryId },
    data: {
      coursesCount,
      startingPrice
    }
  })
}

export async function GET(request: Request) {
  try {
    let instructors: any[] = []
    let instructorMap = new Map<string, string>()
    let dbError = false

    try {
      instructors = await prisma.instructor.findMany()
      instructorMap = new Map(instructors.map(i => [i.id, i.name]))
    } catch (err) {
      console.warn('Prisma instructors fetch failed. Using empty map.', err)
      dbError = true
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      let course: any = null
      if (!dbError) {
        try {
          course = await prisma.course.findUnique({
            where: { id },
            include: {
              Instrument: true
            }
          })
        } catch (err) {
          console.warn('Prisma course findUnique failed. Using fallback search.', err)
          dbError = true
        }
      }
      
      if (!dbError) {
        if (!course) {
          return NextResponse.json({ error: 'Course not found' }, { status: 404 })
        }
        return NextResponse.json(mapCourseToFrontend(course, instructorMap))
      }

      // Fallback search only when DB connection failed
      const fallbackCourse = DEFAULT_COURSES.find(c => c.id === id)
      if (!fallbackCourse) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 })
      }
      return NextResponse.json(fallbackCourse)
    }

    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const level = searchParams.get('level') || ''
    const includeDrafts = searchParams.get('includeDrafts') === 'true'
    const paginated = searchParams.get('paginated') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const skip = (page - 1) * limit

    let total = 0
    let list: any[] = []

    if (!dbError) {
      try {
        const where: any = {}

        if (!includeDrafts) {
          where.isDisabled = false
          where.status = 'PUBLISHED'
        }

        if (search) {
          where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { Instrument: { name: { contains: search, mode: 'insensitive' } } },
            { instrumentId: { contains: search, mode: 'insensitive' } }
          ]
        }
        if (category) {
          where.instrumentId = category
        }
        if (level) {
          const lvl = level.toUpperCase()
          if (['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(lvl)) {
            where.level = lvl as any
          }
        }

        total = await prisma.course.count({ where })
        list = await prisma.course.findMany({
          where,
          include: {
            Instrument: true
          },
          skip: paginated ? skip : undefined,
          take: paginated ? limit : undefined,
          orderBy: [
            {
              Instrument: {
                name: 'asc'
              }
            },
            {
              title: 'asc'
            },
            {
              level: 'asc'
            }
          ]
        })
      } catch (err) {
        console.warn('Prisma courses fetch failed. Using fallback data.', err)
        dbError = true
      }
    }

    let courses: any[] = []

    if (!dbError) {
      courses = list.map(c => {
        const mapped = mapCourseToFrontend(c, instructorMap)
        return {
          ...mapped,
          instrumentName: c.Instrument?.name === 'Vocals' ? 'Vocal Training' : (c.Instrument?.name || c.instrumentId)
        }
      })
    } else {
      // Only fallback to static data if database connection threw an error
      courses = DEFAULT_COURSES.filter(c => {
        if (!includeDrafts) {
          if (c.isDisabled || (c.status && c.status.toLowerCase() !== 'published')) {
            return false
          }
        }
        if (search) {
          const s = search.toLowerCase()
          const matchTitle = (c.title || '').toLowerCase().includes(s)
          const matchDesc = (c.description || '').toLowerCase().includes(s)
          const matchCategory = (c.category || '').toLowerCase().includes(s)
          if (!matchTitle && !matchDesc && !matchCategory) {
            return false
          }
        }
        if (category) {
          if (c.category.toLowerCase() !== category.toLowerCase()) return false
        }
        if (level) {
          if (c.level.toLowerCase() !== level.toLowerCase()) return false
        }
        return true
      }).map(c => {
        const cat = DEFAULT_CATEGORIES.find(i => i.id === c.category)
        const name = cat ? cat.name : c.category
        return {
          ...c,
          instrumentName: name === 'Vocals' ? 'Vocal Training' : name
        }
      })
      
      total = courses.length
      courses.sort((a, b) => {
        const instA = a.instrumentName || ''
        const instB = b.instrumentName || ''
        const instCompare = instA.localeCompare(instB)
        if (instCompare !== 0) return instCompare
        
        const titleCompare = (a.title || '').localeCompare(b.title || '')
        if (titleCompare !== 0) return titleCompare
        
        const lvlA = a.level || ''
        const lvlB = b.level || ''
        return lvlA.localeCompare(lvlB)
      })
      
      if (paginated) {
        courses = courses.slice(skip, skip + limit)
      }
    }

    if (paginated) {
      return NextResponse.json({
        courses,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      })
    }

    return NextResponse.json(courses)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }
    const role = (session.user as any).role?.toUpperCase()
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 })
    }

    const body = await request.json()
    
    // Check if it's a price-only update for backwards compatibility
    if (body.id && body.price !== undefined && !body.title) {
      const parsed = priceUpdateSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.message }, { status: 400 })
      }
      
      const updated = await prisma.$transaction(async (tx) => {
        const course = await tx.course.update({
          where: { id: parsed.data.id },
          data: { price: Number(parsed.data.price) }
        })
        await tx.auditLog.create({
          data: {
            userEmail: session.user?.email || 'admin@2ndinversion.com',
            action: 'Course Price Updated',
            details: `Updated price of course ${course.title} to ₹${parsed.data.price}`
          }
        })
        await tx.notification.create({
          data: {
            title: '💰 Course Price Updated',
            message: `Course "${course.title}" price changed to ₹${parsed.data.price}`
          }
        })
        await updateCategoryStats(course.instrumentId, tx)
        return course
      })
      
      const instructors = await prisma.instructor.findMany()
      const instructorMap = new Map(instructors.map(i => [i.id, i.name]))
      revalidatePath('/')
      revalidatePath('/courses')
      revalidatePath('/admin/courses')
      return NextResponse.json({ success: true, course: mapCourseToFrontend(updated, instructorMap) })
    }

    // Validate full course input
    const parsed = courseInputSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    }

    const data = parsed.data
    const courseId = data.id || `${data.category}-${data.level.toLowerCase()}-${Date.now()}`
    
    // Resolve instructorId by name
    let instructorId = data.instructorId || 'instructor-1'
    if (data.instructor) {
      let instructorObj = await prisma.instructor.findFirst({
        where: { name: { equals: data.instructor, mode: 'insensitive' } }
      })
      if (!instructorObj) {
        instructorObj = await prisma.instructor.create({
          data: {
            name: data.instructor,
            email: `${data.instructor.toLowerCase().replace(/\s+/g, '')}@2ndinversion.com`,
            expertise: data.category
          }
        })
      }
      instructorId = instructorObj.id
    }
    
    // Check if course with same title and level exists for this instrument
    const existingCourse = await prisma.course.findFirst({
      where: {
        instrumentId: data.category,
        title: { equals: data.title, mode: 'insensitive' },
        level: data.level.toUpperCase() as any
      }
    })
    if (existingCourse) {
      return NextResponse.json({ error: "This course already exists for the selected instrument." }, { status: 400 })
    }

    const rawSlug = body.slug || data.title
    const baseSlug = String(rawSlug).toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'course'

    const uniqueSlug = await generateUniqueSlug(data.category, baseSlug)
    let warningMessage = undefined
    if (uniqueSlug !== baseSlug) {
      warningMessage = "A similar URL already exists. A new unique URL has been generated."
    }

    // Map to DB structure
    const dbPayload = mapCourseToDb({ ...data, id: courseId, instructorId, slug: uniqueSlug })

    const newCourse = await prisma.$transaction(async (tx) => {
      const course = await tx.course.create({
        data: {
          id: courseId,
          instrumentId: data.category,
          ...dbPayload
        }
      })

      // Create related content models to keep relations intact
      await tx.courseContent.create({
        data: {
          courseId: courseId,
          about: data.aboutCourse || data.description || ''
        }
      })

      if (data.learningOutcomes && data.learningOutcomes.length > 0) {
        await tx.learningOutcome.createMany({
          data: data.learningOutcomes.map((outcome: string) => ({
            courseId: courseId,
            outcome
          }))
        })
      }

      const defaultPrereqs = ['Basic understanding of the instrument', 'Interest in music']
      await tx.prerequisite.createMany({
        data: (data.prerequisites || defaultPrereqs).map((req: string) => ({
          courseId: courseId,
          requirement: req
        }))
      })

      const defaultTopics = data.curriculum || ['Introduction and Fundamentals', 'Basic Techniques', 'Repertoire Practice']
      await tx.topicsCovered.createMany({
        data: defaultTopics.map((topic: string) => ({
          courseId: courseId,
          topic
        }))
      })

      await tx.curriculum.create({
        data: {
          courseId: courseId,
          modules: {
            create: [
              {
                moduleName: 'Module 1: Introduction',
                topics: defaultTopics
              }
            ]
          }
        }
      })

      await tx.auditLog.create({
        data: {
          userEmail: session.user?.email || 'admin@2ndinversion.com',
          action: 'Course Added',
          details: `Added new course: ${data.title} (${data.level})`
        }
      })
      await tx.notification.create({
        data: {
          title: '🎹 New Course Created',
          message: `Course "${data.title}" (${data.level}) created for category "${data.category}"`
        }
      })
      await updateCategoryStats(data.category, tx)
      return course
    })

    const instructors = await prisma.instructor.findMany()
    const instructorMap = new Map(instructors.map(i => [i.id, i.name]))
    revalidatePath('/')
    revalidatePath('/courses')
    revalidatePath('/admin/courses')
    return NextResponse.json({ 
      success: true, 
      course: mapCourseToFrontend(newCourse, instructorMap),
      message: warningMessage 
    })
  } catch (error: any) {
    console.error('[POST /api/courses] SERVER ERROR:', error)
    let userMessage = 'Failed to process course request'
    if (error.code?.startsWith('P') || error.message?.includes('Prisma')) {
      userMessage = 'A database constraint error occurred. Please verify that details are unique.'
    }
    return NextResponse.json({ error: userMessage }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }
    const role = (session.user as any).role?.toUpperCase()
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 })
    }

    const body = await request.json()
    console.log('[PUT /api/courses] Incoming payload:', JSON.stringify(body, null, 2))

    if (!body.id) {
      console.warn('[PUT /api/courses] Missing course ID in request body')
      return NextResponse.json({ error: 'Missing course ID' }, { status: 400 })
    }

    // Check if it's a status-only update (enable/disable)
    if (body.isDisabled !== undefined && !body.title) {
      const parsed = statusUpdateSchema.safeParse(body)
      if (!parsed.success) {
        console.warn('[PUT /api/courses] Status validation failed:', parsed.error.message)
        return NextResponse.json({ error: parsed.error.message }, { status: 400 })
      }

      console.log('[PUT /api/courses] Processing status-only update for ID:', parsed.data.id)
      const updated = await prisma.$transaction(async (tx) => {
        const course = await tx.course.update({
          where: { id: parsed.data.id },
          data: { isDisabled: parsed.data.isDisabled }
        })
        await tx.auditLog.create({
          data: {
            userEmail: session.user?.email || 'admin@2ndinversion.com',
            action: 'Course Status Changed',
            details: `${parsed.data.isDisabled ? 'Disabled' : 'Enabled'} course ID: ${parsed.data.id}`
          }
        })
        await tx.notification.create({
          data: {
            title: '✏️ Course Status Changed',
            message: `Course "${course.title}" status updated to ${parsed.data.isDisabled ? 'Disabled' : 'Enabled'}`
          }
        })
        await updateCategoryStats(course.instrumentId, tx)
        return course
      })

      const instructors = await prisma.instructor.findMany()
      const instructorMap = new Map(instructors.map(i => [i.id, i.name]))
      revalidatePath('/')
      revalidatePath('/courses')
      revalidatePath('/admin/courses')
      return NextResponse.json({ success: true, course: mapCourseToFrontend(updated, instructorMap) })
    }

    // Full course update validation
    const parsed = courseInputSchema.safeParse(body)
    if (!parsed.success) {
      console.warn('[PUT /api/courses] Zod Validation Failed details:', JSON.stringify(parsed.error.format(), null, 2))
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: parsed.error.format(),
        errors: parsed.error.issues 
      }, { status: 400 })
    }

    const data = parsed.data
    console.log('[PUT /api/courses] Course update validation passed for ID:', data.id)

    // Resolve instructorId by name
    let instructorId = data.instructorId || 'instructor-1'
    if (data.instructor) {
      let instructorObj = await prisma.instructor.findFirst({
        where: { name: { equals: data.instructor, mode: 'insensitive' } }
      })
      if (!instructorObj) {
        instructorObj = await prisma.instructor.create({
          data: {
            name: data.instructor,
            email: `${data.instructor.toLowerCase().replace(/\s+/g, '')}@2ndinversion.com`,
            expertise: data.category
          }
        })
      }
      instructorId = instructorObj.id
    }

    // Check if another course with same title and level exists for this instrument
    const existingCourse = await prisma.course.findFirst({
      where: {
        instrumentId: data.category,
        title: { equals: data.title, mode: 'insensitive' },
        level: data.level.toUpperCase() as any,
        id: { not: data.id }
      }
    })
    if (existingCourse) {
      return NextResponse.json({ error: "This course already exists for the selected instrument." }, { status: 400 })
    }

    const rawSlug = body.slug || data.title
    const baseSlug = String(rawSlug).toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'course'

    const uniqueSlug = await generateUniqueSlug(data.category, baseSlug, data.id)
    let warningMessage = undefined
    if (uniqueSlug !== baseSlug) {
      warningMessage = "A similar URL already exists. A new unique URL has been generated."
    }

    const dbPayload = mapCourseToDb({ ...data, instructorId, slug: uniqueSlug })

    const updated = await prisma.$transaction(async (tx) => {
      const original = await tx.course.findUnique({ where: { id: data.id } })
      if (!original) {
        throw new Error(`Course not found in database with ID: ${data.id}`)
      }
      const course = await tx.course.update({
        where: { id: data.id },
        data: {
          instrumentId: data.category,
          ...dbPayload
        }
      })

      // Upsert CourseContent
      await tx.courseContent.upsert({
        where: { courseId: data.id },
        update: { about: data.aboutCourse || data.description || '' },
        create: { courseId: data.id, about: data.aboutCourse || data.description || '' }
      })

      // Update LearningOutcomes
      if (data.learningOutcomes) {
        await tx.learningOutcome.deleteMany({ where: { courseId: data.id } })
        if (data.learningOutcomes.length > 0) {
          await tx.learningOutcome.createMany({
            data: data.learningOutcomes.map((outcome: string) => ({
              courseId: data.id,
              outcome
            }))
          })
        }
      }

      // Update Prerequisites
      if (data.prerequisites) {
        await tx.prerequisite.deleteMany({ where: { courseId: data.id } })
        if (data.prerequisites.length > 0) {
          await tx.prerequisite.createMany({
            data: data.prerequisites.map((req: string) => ({
              courseId: data.id,
              requirement: req
            }))
          })
        }
      }

      // Update Topics Covered
      if (data.curriculum) {
        await tx.topicsCovered.deleteMany({ where: { courseId: data.id } })
        if (data.curriculum.length > 0) {
          await tx.topicsCovered.createMany({
            data: data.curriculum.map((topic: string) => ({
              courseId: data.id,
              topic
            }))
          })
        }
      }

      await tx.auditLog.create({
        data: {
          userEmail: session.user?.email || 'admin@2ndinversion.com',
          action: 'Course Updated',
          details: `Updated details for course: ${course.title}`
        }
      })
      await tx.notification.create({
        data: {
          title: '✏️ Course Updated',
          message: `Course "${course.title}" details updated by Admin.`
        }
      })
      await updateCategoryStats(data.category, tx)
      if (original && original.instrumentId !== data.category) {
        await updateCategoryStats(original.instrumentId, tx)
      }
      return course
    })

    const instructors = await prisma.instructor.findMany()
    const instructorMap = new Map(instructors.map(i => [i.id, i.name]))
    revalidatePath('/')
    revalidatePath('/courses')
    revalidatePath('/admin/courses')
    return NextResponse.json({ 
      success: true, 
      course: mapCourseToFrontend(updated, instructorMap),
      message: warningMessage 
    })
  } catch (error: any) {
    console.error('[PUT /api/courses] SERVER ERROR:', error)
    let userMessage = 'Failed to update course'
    if (error.code?.startsWith('P') || error.message?.includes('Prisma')) {
      userMessage = 'A database constraint error occurred. Please verify that details are unique.'
    }
    return NextResponse.json({ error: userMessage }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }
    const role = (session.user as any).role?.toUpperCase()
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing course ID' }, { status: 400 })
    }

    await prisma.$transaction(async (tx) => {
      const original = await tx.course.findUnique({ 
        where: { id },
        include: { Curriculum: true }
      })
      if (!original) {
        throw new Error('NOT_FOUND')
      }

      // Explicitly delete all dependent child records to ensure integrity
      if (original.Curriculum) {
        await tx.curriculumModule.deleteMany({ where: { curriculumId: original.Curriculum.id } })
        await tx.curriculum.delete({ where: { id: original.Curriculum.id } })
      }
      await tx.courseContent.deleteMany({ where: { courseId: id } })
      await tx.learningOutcome.deleteMany({ where: { courseId: id } })
      await tx.prerequisite.deleteMany({ where: { courseId: id } })
      await tx.topicsCovered.deleteMany({ where: { courseId: id } })
      await tx.review.deleteMany({ where: { courseId: id } })

      await tx.course.delete({
        where: { id }
      })
      await tx.auditLog.create({
        data: {
          userEmail: session.user?.email || 'admin@2ndinversion.com',
          action: 'Course Deleted',
          details: `Deleted course: ${original.title} (ID: ${id})`
        }
      })
      await tx.notification.create({
        data: {
          title: '🗑️ Course Deleted',
          message: `Course "${original.title}" was deleted by Admin.`
        }
      })
      await updateCategoryStats(original.instrumentId, tx)
    })

    revalidatePath('/')
    revalidatePath('/courses')
    revalidatePath('/admin/courses')
    return NextResponse.json({ success: true, message: 'Course deleted successfully' })
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    console.error('[DELETE /api/courses] SERVER ERROR:', error)
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
