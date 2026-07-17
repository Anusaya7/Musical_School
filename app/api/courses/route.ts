import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mapCourseToFrontend, mapCourseToDb } from '@/lib/db'
import { z } from 'zod'
import { DEFAULT_COURSES } from '@/lib/fallback-data'

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
  lessons: z.number().optional(),
  projects: z.number().optional(),
  assignments: z.number().optional(),
  hasCertificate: z.boolean().optional(),
  curriculum: z.array(z.string()).optional(),
  learningOutcomes: z.array(z.string()).optional(),
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
  const startingPrice = coursesCount > 0 ? Math.min(...activeCourses.map((c: any) => c.price)) : 4999

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
            where: { id }
          })
        } catch (err) {
          console.warn('Prisma course findUnique failed. Using fallback search.', err)
          dbError = true
        }
      }
      
      if (dbError || !course) {
        const fallbackCourse = DEFAULT_COURSES.find(c => c.id === id)
        if (!fallbackCourse) {
          return NextResponse.json({ error: 'Course not found' }, { status: 404 })
        }
        return NextResponse.json(fallbackCourse)
      }
      return NextResponse.json(mapCourseToFrontend(course, instructorMap))
    }

    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const level = searchParams.get('level') || ''
    const paginated = searchParams.get('paginated') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const skip = (page - 1) * limit

    let total = 0
    let list: any[] = []

    if (!dbError) {
      try {
        const where: any = {}
        if (search) {
          where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
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
          skip: paginated ? skip : undefined,
          take: paginated ? limit : undefined,
          orderBy: { title: 'asc' }
        })
      } catch (err) {
        console.warn('Prisma courses fetch failed. Using fallback data.', err)
        dbError = true
      }
    }

    let courses: any[] = []

    if (dbError || list.length === 0) {
      courses = DEFAULT_COURSES.filter(c => {
        if (search) {
          const s = search.toLowerCase()
          if (!c.title.toLowerCase().includes(s) && !c.description.toLowerCase().includes(s)) {
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
      })
      
      total = courses.length
      courses.sort((a, b) => a.title.localeCompare(b.title))
      
      if (paginated) {
        courses = courses.slice(skip, skip + limit)
      }
    } else {
      courses = list.map(c => mapCourseToFrontend(c, instructorMap))
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
            userEmail: 'admin@2ndinversion.com',
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
    
    // Map to DB structure
    const dbPayload = mapCourseToDb({ ...data, id: courseId, instructorId })

    const newCourse = await prisma.$transaction(async (tx) => {
      const course = await tx.course.create({
        data: {
          id: courseId,
          instrumentId: data.category,
          ...dbPayload
        }
      })
      await tx.auditLog.create({
        data: {
          userEmail: 'admin@2ndinversion.com',
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
    return NextResponse.json({ success: true, course: mapCourseToFrontend(newCourse, instructorMap) })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to process course request' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: 'Missing course ID' }, { status: 400 })
    }

    // Check if it's a status-only update (enable/disable)
    if (body.isDisabled !== undefined && !body.title) {
      const parsed = statusUpdateSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.message }, { status: 400 })
      }

      const updated = await prisma.$transaction(async (tx) => {
        const course = await tx.course.update({
          where: { id: parsed.data.id },
          data: { isDisabled: parsed.data.isDisabled }
        })
        await tx.auditLog.create({
          data: {
            userEmail: 'admin@2ndinversion.com',
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
      return NextResponse.json({ success: true, course: mapCourseToFrontend(updated, instructorMap) })
    }

    // Full course update validation
    const parsed = courseInputSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    }

    const data = parsed.data

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

    const dbPayload = mapCourseToDb({ ...data, instructorId })

    const updated = await prisma.$transaction(async (tx) => {
      const original = await tx.course.findUnique({ where: { id: data.id } })
      const course = await tx.course.update({
        where: { id: data.id },
        data: {
          instrumentId: data.category,
          ...dbPayload
        }
      })
      await tx.auditLog.create({
        data: {
          userEmail: 'admin@2ndinversion.com',
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
    return NextResponse.json({ success: true, course: mapCourseToFrontend(updated, instructorMap) })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing course ID' }, { status: 400 })
    }

    await prisma.$transaction(async (tx) => {
      const original = await tx.course.findUnique({ where: { id } })
      await tx.course.delete({
        where: { id }
      })
      await tx.auditLog.create({
        data: {
          userEmail: 'admin@2ndinversion.com',
          action: 'Course Deleted',
          details: `Deleted course ID: ${id}`
        }
      })
      await tx.notification.create({
        data: {
          title: '🗑️ Course Deleted',
          message: `Course "${original?.title || id}" was deleted by Admin.`
        }
      })
      if (original) {
        await updateCategoryStats(original.instrumentId, tx)
      }
    })

    return NextResponse.json({ success: true, message: 'Course deleted successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 550 })
  }
}
