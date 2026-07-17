import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const bulkActionSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one ID is required'),
  action: z.enum(['delete', 'publish', 'disable'])
})

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = bulkActionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { ids, action } = parsed.data

    await prisma.$transaction(async (tx) => {
      if (action === 'delete') {
        await tx.instrument.deleteMany({
          where: { id: { in: ids } }
        })
        await tx.auditLog.create({
          data: {
            userEmail: 'admin@2ndinversion.com',
            action: 'Bulk Categories Deleted',
            details: `Deleted categories: ${ids.join(', ')}`
          }
        })
      } else if (action === 'publish') {
        await tx.instrument.updateMany({
          where: { id: { in: ids } },
          data: {
            status: 'ACTIVE',
            isVisible: true
          }
        })
        await tx.auditLog.create({
          data: {
            userEmail: 'admin@2ndinversion.com',
            action: 'Bulk Categories Published',
            details: `Published categories: ${ids.join(', ')}`
          }
        })
      } else if (action === 'disable') {
        await tx.instrument.updateMany({
          where: { id: { in: ids } },
          data: {
            status: 'INACTIVE',
            isVisible: false
          }
        })
        await tx.auditLog.create({
          data: {
            userEmail: 'admin@2ndinversion.com',
            action: 'Bulk Categories Disabled',
            details: `Disabled categories: ${ids.join(', ')}`
          }
        })
      }
    })

    return NextResponse.json({ success: true, message: `Bulk action ${action} completed successfully.` })
  } catch (error) {
    console.error('Error handling bulk category action:', error)
    return NextResponse.json({ error: 'Failed to execute bulk action' }, { status: 500 })
  }
}
