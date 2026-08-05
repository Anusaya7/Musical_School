import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const STUDY_MATERIALS = [
  {
    id: 'mat-1',
    courseId: 'piano-masterclass',
    title: 'Trinity Grade 1 Piano Sheet Music & Exercise Manual',
    fileType: 'PDF',
    size: '4.2 MB',
    downloadUrl: '/materials/piano-grade1-manual.pdf',
    category: 'Sheet Music'
  },
  {
    id: 'mat-2',
    courseId: 'guitar-shred-pro',
    title: 'Modern Guitar Scales & Arpeggio Chart',
    fileType: 'PDF',
    size: '2.8 MB',
    downloadUrl: '/materials/guitar-scales-chart.pdf',
    category: 'Scale Chart'
  },
  {
    id: 'mat-3',
    courseId: 'vocal-range-expansion',
    title: 'Daily Vocal Warmup Audio Guide & Sheet',
    fileType: 'ZIP',
    size: '18.5 MB',
    downloadUrl: '/materials/vocal-warmups.zip',
    category: 'Audio & PDF'
  },
  {
    id: 'mat-4',
    courseId: 'drum-grooves-fundamentals',
    title: 'Funk & Rock Drum Patterns Backing Tracks',
    fileType: 'MP3',
    size: '12.1 MB',
    downloadUrl: '/materials/drum-backing-tracks.mp3',
    category: 'Backing Track'
  }
]

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')

    if (courseId) {
      const filtered = STUDY_MATERIALS.filter(m => m.courseId === courseId)
      return NextResponse.json({ success: true, materials: filtered.length > 0 ? filtered : STUDY_MATERIALS })
    }

    return NextResponse.json({ success: true, materials: STUDY_MATERIALS })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
