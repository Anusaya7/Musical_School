import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const instrumentSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  status: z.enum(['Active', 'Upcoming']),
  icon: z.string().optional().nullable()
})

export async function GET() {
  try {
    const list = await prisma.instrument.findMany({
      orderBy: { name: 'asc' }
    })
    const formatted = list.map(i => ({
      id: i.id,
      name: i.name,
      status: i.status === 'ACTIVE' ? 'Active' : 'Upcoming',
      icon: i.icon || undefined
    }))

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
    formatted.sort((a, b) => {
      const idxA = categoryOrder.indexOf(cleanCategory(a.id))
      const idxB = categoryOrder.indexOf(cleanCategory(b.id))
      const orderA = idxA === -1 ? 999 : idxA
      const orderB = idxB === -1 ? 999 : idxB
      return orderA - orderB
    })

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching instruments:', error)
    return NextResponse.json({ error: 'Failed to fetch instruments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, instrument } = body

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 })
    }

    if (action === 'create') {
      const parsed = instrumentSchema.safeParse(instrument)
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.message }, { status: 400 })
      }
      
      const created = await prisma.$transaction(async (tx) => {
        const inst = await tx.instrument.create({
          data: {
            id: parsed.data.id,
            name: parsed.data.name,
            slug: parsed.data.id.toLowerCase().replace(/\s+/g, '-'),
            icon: parsed.data.icon || null,
            status: parsed.data.status === 'Active' ? 'ACTIVE' : 'COMING_SOON',
            isUpcoming: parsed.data.status === 'Upcoming',
            isVisible: true,
            coursesCount: 0,
            startingPrice: 4999,
            levels: ['Beginner', 'Intermediate', 'Advanced']
          }
        })
        await tx.auditLog.create({
          data: {
            userEmail: 'admin@2ndinversion.com',
            action: 'Instrument Added',
            details: `Created new instrument registry: ${parsed.data.name}`
          }
        })
        return inst
      })
      
      return NextResponse.json({ success: true, instrument: created })
    }

    if (action === 'update') {
      const parsed = instrumentSchema.safeParse(instrument)
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.message }, { status: 400 })
      }

      const updated = await prisma.$transaction(async (tx) => {
        const inst = await tx.instrument.update({
          where: { id: parsed.data.id },
          data: {
            name: parsed.data.name,
            icon: parsed.data.icon || null,
            status: parsed.data.status === 'Active' ? 'ACTIVE' : 'COMING_SOON',
            isUpcoming: parsed.data.status === 'Upcoming'
          }
        })
        await tx.auditLog.create({
          data: {
            userEmail: 'admin@2ndinversion.com',
            action: 'Instrument Updated',
            details: `Updated details for instrument registry: ${parsed.data.name}`
          }
        })
        return inst
      })

      return NextResponse.json({ success: true, instrument: updated })
    }

    if (action === 'delete') {
      if (!instrument?.id) {
        return NextResponse.json({ error: 'Missing instrument ID' }, { status: 400 })
      }

      await prisma.$transaction(async (tx) => {
        await tx.instrument.delete({
          where: { id: instrument.id }
        })
        await tx.auditLog.create({
          data: {
            userEmail: 'admin@2ndinversion.com',
            action: 'Instrument Deleted',
            details: `Deleted instrument registry ID: ${instrument.id}`
          }
        })
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error handling instrument action:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
