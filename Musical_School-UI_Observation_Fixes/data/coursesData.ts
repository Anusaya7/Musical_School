export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface CourseDetails {
  about: string
  prerequisites: string[]
  topics: string[]
  outcomes: string[]
  curriculum: string[]
}

export interface Course {
  id: string
  title: string
  category: string
  level: CourseLevel
  price: number
  instructor: string
  duration: string
  rating: number
  students: number
  image: string
  description: string
  details: CourseDetails
}

const INSTRUCTOR_NAME = 'Ajinkya Amrule'

export const COURSE_COUNTS: Record<string, number> = {
  piano: 3,
  guitar: 3,
  drums: 3,
  vocals: 3,
  violin: 3,
  'music-theory': 3,
  'bass-guitar': 3,
  saxophone: 3
}

const categoryDisplayNames: Record<string, string> = {
  piano: 'Piano',
  guitar: 'Guitar',
  drums: 'Drums',
  vocals: 'Vocals',
  violin: 'Violin',
  'music-theory': 'Music Theory',
  'bass-guitar': 'Bass Guitar',
  saxophone: 'Saxophone'
}

const levelMeta: Record<CourseLevel, { price: number; duration: string; rating: number; students: number }> = {
  Beginner: { price: 4999, duration: '3 Months', rating: 4.9, students: 1425 },
  Intermediate: { price: 6499, duration: '4 Months', rating: 4.95, students: 980 },
  Advanced: { price: 7999, duration: '5 Months', rating: 4.98, students: 620 }
}

const createCourseDetails = (category: string, level: CourseLevel): CourseDetails => {
  const label = categoryDisplayNames[category] || category
  if (level === 'Beginner') {
    return {
      about: `Has your child been learning ${label.toLowerCase()} for the past six months? The 2nd Inversion Method Book 1 course is designed to strengthen their musical foundation while introducing more advanced concepts in a structured and engaging way.`,
      prerequisites: [
        'Understanding of basic fundamentals',
        'Completion of foundation-level concepts or equivalent experience'
      ],
      topics: [
        `${label} techniques and hand coordination`,
        'Major scales and scale practice',
        'Primary chords and chord inversions',
        'Introduction to voice training and ear development',
        'Key signatures and syncopation',
        'Playing in the keys of C, G, and F Major',
        'Minor keys and transposition',
        'Swing rhythm and rhythmic interpretation',
        'Repertoire and song development'
      ],
      outcomes: [
        'Demonstrate proper techniques for expressive and efficient playing',
        'Perform confidently in multiple major and minor keys',
        'Understand and apply chords, voicings, progressions, and inversions',
        'Apply musical concepts such as syncopation and swing rhythm',
        'Read and perform rhythms involving 16th notes accurately',
        'Develop left-hand accompaniment patterns',
        'Build a strong repertoire of performance-ready pieces'
      ],
      curriculum: [
        'Foundation exercises and posture',
        'Scale introduction and practice routines',
        'Chord structures and inversions',
        'Rhythm and syncopation workshops',
        'Key signatures and transposition drills',
        'Song learning and performance preparation'
      ]
    }
  }

  if (level === 'Intermediate') {
    return {
      about: `Take your child’s ${label.toLowerCase()} journey to the next level with the Spardha Method Book 2 course. Designed for students with over 18 months of learning experience, this course develops stronger technical skills, musical understanding, and performance confidence.`,
      prerequisites: [
        'Beginner to intermediate-level playing skills',
        'Understanding of basic techniques and music fundamentals'
      ],
      topics: [
        'Intermediate-level major and minor scales',
        'Keys of D Major, A Major, and B♭ Major',
        'Repertoire playing in multiple keys',
        'Triads and 12-bar blues progressions',
        'Chromatic and pentatonic scales',
        'Advanced rhythm techniques and subdivisions',
        'Introduction to arpeggios and their musical applications'
      ],
      outcomes: [
        'Perform major and minor scales confidently with both hands',
        'Play songs in various keys with improved technical control',
        'Understand rhythmic subdivisions accurately',
        'Perform songs using triad chords',
        'Apply arpeggio patterns in exercises and repertoire',
        'Develop stronger coordination and improvisational awareness',
        'Build a versatile repertoire suitable for performance'
      ],
      curriculum: [
        'Intermediate scale mastery',
        'Triads, blues progressions, and harmony',
        'Rhythmic subdivision and groove',
        'Arpeggio development',
        'Key transposition and repertoire expansion',
        'Intermediate performance skills'
      ]
    }
  }

  return {
    about: `Step into the world of advanced ${label.toLowerCase()} performance with the 2nd Inversion Music Method Book 3 course. This course focuses on refining technical mastery, musical expression, improvisation, and advanced harmonic understanding.`,
    prerequisites: [
      'Successful completion of intermediate-level training',
      'Strong understanding of scales, chords, and rhythm concepts'
    ],
    topics: [
      'Advanced major and minor scales',
      'Harmonic and melodic minor scales',
      'Extended chords including Add9, Add13, and Suspended chords',
      'Advanced chord progressions',
      'Advanced hand positions and voicings',
      'Improvisation techniques',
      'Advanced arpeggios and accompaniment patterns'
    ],
    outcomes: [
      'Perform scales fluently with both hands',
      'Apply scales creatively in improvisation',
      'Build and perform extended chords confidently',
      'Use advanced chords across multiple genres',
      'Understand advanced chord families and substitutions',
      'Develop arpeggio-based improvisation skills',
      'Perform with enhanced technical control and musical expression'
    ],
    curriculum: [
      'Advanced scale and mode studies',
      'Extended harmony and voicings',
      'Improvisation and creative expression',
      'Advanced accompaniment patterns',
      'Performance techniques for advanced players',
      'Masterclass repertoire and assessment'
    ]
  }
}

const courseCategories = [
  { category: 'piano', label: 'Piano Mastery', image: '/api/placeholder/400/280' },
  { category: 'guitar', label: 'Guitar Mastery', image: '/api/placeholder/400/280' },
  { category: 'drums', label: 'Drum Mastery', image: '/api/placeholder/400/280' },
  { category: 'vocals', label: 'Vocal Mastery', image: '/api/placeholder/400/280' },
  { category: 'violin', label: 'Violin Mastery', image: '/api/placeholder/400/280' },
  { category: 'music-theory', label: 'Music Theory Mastery', image: '/api/placeholder/400/280' },
  { category: 'bass-guitar', label: 'Bass Guitar Mastery', image: '/api/placeholder/400/280' },
  { category: 'saxophone', label: 'Saxophone Mastery', image: '/api/placeholder/400/280' }
]

const levels: CourseLevel[] = ['Beginner', 'Intermediate', 'Advanced']

export const generateCourses = (): Course[] => {
  return courseCategories.flatMap((category) =>
    levels.map((level) => {
      const meta = levelMeta[level]
      return {
        id: `${category.category}-${level.toLowerCase()}`,
        title: `${category.label} - ${level}`,
        category: category.category,
        level,
        price: meta.price,
        instructor: INSTRUCTOR_NAME,
        duration: meta.duration,
        rating: meta.rating,
        students: meta.students,
        image: category.image,
        description: `A premium ${level.toLowerCase()} ${categoryDisplayNames[category.category]} course designed to build confident musicianship.`,
        details: createCourseDetails(category.category, level)
      }
    })
  )
}

export const getAllCourses = (): Course[] => {
  return generateCourses()
}

export const getCourseById = (id: string): Course | undefined => {
  return getAllCourses().find((course) => course.id === id)
}

export const getCoursesByCategory = (category: string): Course[] => {
  const allCourses = getAllCourses()
  return allCourses.filter(course => course.category === category)
}

export const getCategoryDisplayName = (category: string): string => {
  return categoryDisplayNames[category] || category
}
