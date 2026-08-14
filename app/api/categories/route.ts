import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { DEFAULT_CATEGORIES } from '@/lib/fallback-data'

export const dynamic = 'force-dynamic'

const categorySchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  status: z.enum(['Active', 'Upcoming', 'Inactive']),
  isVisible: z.boolean().optional().default(true),
  startingPrice: z.number().optional().default(3500),
  levels: z.array(z.string()).optional().default(['Beginner', 'Intermediate', 'Advanced'])
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const statusFilter = searchParams.get('status') || 'all' // all, Active, Upcoming, Inactive
    const sort = searchParams.get('sort') || 'name-asc'
    const paginated = searchParams.get('paginated') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    let total = 0
    let list: any[] = []
    let dbError = false

    try {
      const where: any = {}
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }
      if (statusFilter !== 'all') {
        if (statusFilter === 'Active') where.status = 'ACTIVE'
        else if (statusFilter === 'Upcoming') where.status = 'COMING_SOON'
        else if (statusFilter === 'Inactive') where.status = 'INACTIVE'
      }

      let orderBy: any = { name: 'asc' }
      if (sort === 'name-desc') orderBy = { name: 'desc' }
      else if (sort === 'newest') orderBy = { createdAt: 'desc' }
      else if (sort === 'oldest') orderBy = { createdAt: 'asc' }
      else if (sort === 'price-asc') orderBy = { startingPrice: 'asc' }
      else if (sort === 'price-desc') orderBy = { startingPrice: 'desc' }
      else if (sort === 'courses-desc') orderBy = { coursesCount: 'desc' }

      total = await prisma.instrument.count({ where })
      list = await prisma.instrument.findMany({
        where,
        skip: paginated ? skip : undefined,
        take: paginated ? limit : undefined,
        orderBy
      })
    } catch (err) {
      console.warn('Prisma categories fetch failed. Using fallback data.', err)
      dbError = true
    }

    let categories: any[] = []

    if (dbError || list.length === 0) {
      categories = DEFAULT_CATEGORIES.filter(i => {
        if (search) {
          const s = search.toLowerCase()
          if (!i.name.toLowerCase().includes(s) && !i.description.toLowerCase().includes(s)) {
            return false
          }
        }
        if (statusFilter !== 'all') {
          if (statusFilter !== i.status) return false
        }
        return true
      })
      total = categories.length

      if (sort === 'name-desc') {
        categories.sort((a, b) => b.name.localeCompare(a.name))
      } else if (sort === 'price-asc') {
        categories.sort((a, b) => a.startingPrice - b.startingPrice)
      } else if (sort === 'price-desc') {
        categories.sort((a, b) => b.startingPrice - a.startingPrice)
      } else if (sort === 'courses-desc') {
        categories.sort((a, b) => b.coursesCount - a.coursesCount)
      } else {
        categories.sort((a, b) => a.name.localeCompare(b.name))
      }

      if (paginated) {
        categories = categories.slice(skip, skip + limit)
      }
    } else {
      categories = list.map(i => ({
        id: i.id,
        name: i.name,
        slug: i.slug,
        icon: i.icon,
        description: i.description,
        image: i.image,
        status: i.status === 'ACTIVE' ? 'Active' : (i.status === 'COMING_SOON' ? 'Upcoming' : 'Inactive'),
        isFeatured: i.isFeatured,
        isUpcoming: i.isUpcoming,
        isVisible: i.isVisible,
        coursesCount: i.coursesCount,
        startingPrice: i.startingPrice,
        levels: i.levels,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt
      }))
    }

    if (sort === 'name-asc' || sort === 'default' || !sort) {
      const cleanCategory = (id: string) => id.toLowerCase().replace(/[^a-z0-9]/g, '')
      const categoryOrder = [
        'piano',
        'guitar',
        'drums',
        'vocals',
        'violin',
        'musictheory',
        'bassguitar',
        'saxophone'
      ]
      categories.sort((a, b) => {
        const idxA = categoryOrder.indexOf(cleanCategory(a.id))
        const idxB = categoryOrder.indexOf(cleanCategory(b.id))
        const orderA = idxA === -1 ? 999 : idxA
        const orderB = idxB === -1 ? 999 : idxB
        return orderA - orderB
      })
    }

    if (paginated) {
      return NextResponse.json({
        categories,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      })
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 550 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = categorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { id, name, description, image, icon, status, isVisible, startingPrice, levels } = parsed.data

    const created = await prisma.$transaction(async (tx) => {
      const cat = await tx.instrument.create({
        data: {
          id,
          name,
          slug: id.toLowerCase().replace(/\s+/g, '-'),
          description: description || null,
          image: image || null,
          icon: icon || null,
          status: status === 'Active' ? 'ACTIVE' : (status === 'Upcoming' ? 'COMING_SOON' : 'INACTIVE'),
          isUpcoming: status === 'Upcoming',
          isVisible,
          startingPrice,
          levels,
          coursesCount: 0
        }
      })

      await tx.auditLog.create({
        data: {
          userEmail: 'admin@2ndinversion.com',
          action: 'Category Added',
          details: `Created new course category: ${name}`
        }
      })
      return cat
    })

    return NextResponse.json({ success: true, category: created })
  } catch (error: any) {
    console.error('Error creating category:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A category with this ID or Name already exists.' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = categorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { id, name, description, image, icon, status, isVisible, startingPrice, levels } = parsed.data

    const updated = await prisma.$transaction(async (tx) => {
      const cat = await tx.instrument.update({
        where: { id },
        data: {
          name,
          description: description || null,
          image: image || null,
          icon: icon || null,
          status: status === 'Active' ? 'ACTIVE' : (status === 'Upcoming' ? 'COMING_SOON' : 'INACTIVE'),
          isUpcoming: status === 'Upcoming',
          isVisible,
          startingPrice,
          levels
        }
      })

      await tx.auditLog.create({
        data: {
          userEmail: 'admin@2ndinversion.com',
          action: 'Category Updated',
          details: `Updated course category details: ${name}`
        }
      })
      return cat
    })

    return NextResponse.json({ success: true, category: updated })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing category ID' }, { status: 400 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.instrument.delete({
        where: { id }
      })
      await tx.auditLog.create({
        data: {
          userEmail: 'admin@2ndinversion.com',
          action: 'Category Deleted',
          details: `Deleted course category: ${id}`
        }
      })
    })

    return NextResponse.json({ success: true, message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
