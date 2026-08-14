export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced'

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
  aboutCourse: string
  curriculum: string[]
  learningOutcomes: string[]
  prerequisites: string[]
  topicsCovered: string[]
  highlights: string[]
  
  discountPrice?: number | null
  lessons?: number
  projects?: number
  assignments?: number
  hasCertificate?: boolean
  featured?: boolean
  upcoming?: boolean
  demoVideo?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  isDisabled?: boolean
}

const LEVEL_DETAILS = {
  Beginner: {
    about: `Has your child been learning piano for the past six months?

The **2nd Inversion Method Book 1** course is designed to strengthen their musical foundation while introducing more advanced concepts in a structured and engaging way.

This course focuses on developing technical accuracy, musical expression, rhythmic understanding, and overall keyboard proficiency.

Students will explore **major and minor scales, chord inversions, syncopation, swing rhythm, key signatures, and repertoire development** while building confidence in performance and musicianship.`,
    prerequisites: [
      'Understanding of basic piano fundamentals',
      'Completion of foundation-level concepts or equivalent experience'
    ],
    topicsCovered: [
      'Piano techniques and hand coordination',
      'Major scales and scale practice',
      'Primary chords and chord inversions',
      'Voice training and ear development',
      'Key signatures and syncopation',
      'Minor keys and transposition',
      'Swing rhythm',
      'Repertoire development'
    ],
    learningOutcomes: [
      'Demonstrate proper piano techniques for expressive and efficient playing',
      'Perform confidently in multiple major and minor keys',
      'Understand and apply chords, voicings, chord progressions, and inversions',
      'Apply musical concepts such as syncopation and swing rhythm',
      'Read and perform rhythms involving 16th notes accurately',
      'Develop left-hand accompaniment patterns',
      'Build a strong repertoire of performance-ready pieces'
    ],
    curriculum: [
      {
        moduleName: 'Module 1: Piano anatomy, posture, and hand technique',
        topics: ['Piano parts & posture', 'Hand positioning', 'Finger numbering', 'Hand relaxation']
      },
      {
        moduleName: 'Module 2: Reading treble and bass clef notation',
        topics: ['Staff reading basics', 'Treble clef lines & spaces', 'Bass clef lines & spaces', 'Grand staff notation']
      },
      {
        moduleName: 'Module 3: Major scales and scale practice',
        topics: ['Scale construction', 'Finger patterns', 'C Major scale practice', 'G Major scale practice']
      },
      {
        moduleName: 'Module 4: Primary chords and chord inversions',
        topics: ['Triads overview', 'Root position chords', 'First & second inversions', 'Progression practice']
      },
      {
        moduleName: 'Module 5: Introduction to voice training and ear development',
        topics: ['Pitch matching', 'Interval recognition', 'Solfege singing', 'Ear training exercises']
      },
      {
        moduleName: 'Module 6: Key signatures and syncopation',
        topics: ['Sharps & flats', 'Key signatures overview', 'Syncopated rhythm patterns', 'Rhythm coordination']
      },
      {
        moduleName: 'Module 7: Playing in the keys of C, G, and F Major',
        topics: ['C Major pieces', 'G Major pieces', 'F Major scale & pieces', 'Transposing short melodies']
      },
      {
        moduleName: 'Module 8: Minor keys and transposition',
        topics: ['Natural minor scale construction', 'Relative minor keys', 'Transposing from major to minor', 'A minor repertoire']
      },
      {
        moduleName: 'Module 9: Swing rhythm and rhythmic interpretation',
        topics: ['Swing feel vs straight rhythm', 'Jazz-influenced phrasing', 'Rhythmic subdivisions', 'Swing exercises']
      },
      {
        moduleName: 'Module 10: Repertoire and song development',
        topics: ['Integrating skills into selected songs', 'Expression & dynamics practice', 'Polishing performance', 'Final showcase preparation']
      }
    ]
  },
  Intermediate: {
    about: `Take your child's piano journey to the next level with the Spardha Method Book 2 course. Designed for students with over 18 months of piano learning experience, this course develops stronger technical skills, musical understanding, and performance confidence.

Students will explore advanced scales, new major and minor keys, blues progressions, rhythm techniques, and arpeggios while learning to perform a wider variety of repertoire.`,
    prerequisites: [
      'Beginner to intermediate-level piano playing skills',
      'Understanding of basic piano techniques and music fundamentals'
    ],
    topicsCovered: [
      'Intermediate-level major and minor scales',
      'Keys of D Major, A Major, and B♭ Major',
      'Repertoire playing in multiple keys',
      'Triads and 12-bar blues progressions',
      'Chromatic and pentatonic scales',
      'Advanced rhythm techniques and subdivisions',
      'Introduction to arpeggios and their musical applications'
    ],
    learningOutcomes: [
      'Perform major and minor scales confidently with both hands',
      'Play songs in various keys with improved technical control',
      'Understand rhythmic subdivisions accurately',
      'Perform songs using triad chords',
      'Apply arpeggio patterns in exercises and repertoire',
      'Develop stronger coordination and improvisational awareness',
      'Build a versatile repertoire suitable for performance'
    ],
    curriculum: [
      {
        moduleName: 'Module 1: Advanced Scales',
        topics: ['D Major scale exercises', 'A Major scale techniques', 'B♭ Major scale practice', 'Scale transitions']
      },
      {
        moduleName: 'Module 2: Blues & Progressions',
        topics: ['12-bar blues structure', 'Triad chord applications', 'Blues improvisation basics', 'Progression variations']
      },
      {
        moduleName: 'Module 3: Chromatic & Pentatonic',
        topics: ['Chromatic scale exercises', 'Pentatonic scale patterns', 'Scale combinations', 'Musical applications']
      },
      {
        moduleName: 'Module 4: Arpeggios & Performance',
        topics: ['Arpeggio patterns', 'Advanced repertoire', 'Performance preparation', 'Stage presence techniques']
      },
      {
        moduleName: 'Module 5: Rhythmic Interpretation',
        topics: ['Rhythmic subdivisions', 'Compound time signatures', 'Syncopated accompaniment']
      },
      {
        moduleName: 'Module 6: Accompaniment Styles',
        topics: ['Alberti bass', 'Walking basslines', 'Pop ballad patterns']
      },
      {
        moduleName: 'Module 7: Dynamic Range & Control',
        topics: ['Fortissimo to pianissimo', 'Crescendo & decrescendo', 'Subtle phrasing']
      },
      {
        moduleName: 'Module 8: Sight Reading Mastery',
        topics: ['Sight reading exercises', 'Key signature recognition', 'Rhythm tapping']
      },
      {
        moduleName: 'Module 9: Collaborative Playing',
        topics: ['Piano duets', 'Accompanying vocalists', 'Playing in an ensemble']
      },
      {
        moduleName: 'Module 10: Performance Polish',
        topics: ['Repertoire polishing', 'Memorization techniques', 'Mock recital execution']
      }
    ]
  },
  Advanced: {
    about: `Step into the world of advanced piano performance with the 2nd Inversion Music Method Book 3 course.

This course focuses on refining technical mastery, musical expression, improvisation, and advanced harmonic understanding.

Students will explore advanced scales, extended chords, sophisticated rhythm patterns, and arpeggio-based accompaniment techniques.`,
    prerequisites: [
      'Successful completion of intermediate-level piano training',
      'Strong understanding of scales, chords, and rhythm concepts'
    ],
    topicsCovered: [
      'Advanced major and minor scales',
      'Harmonic and melodic minor scales',
      'Extended chords including Add9, Add13, and Suspended chords',
      'Advanced chord progressions',
      'Advanced piano hand positions and voicings',
      'Improvisation techniques',
      'Advanced arpeggios and accompaniment patterns'
    ],
    learningOutcomes: [
      'Perform scales fluently with both hands',
      'Apply scales creatively in improvisation',
      'Build and perform extended chords confidently',
      'Use advanced chords across multiple genres',
      'Understand advanced chord families and substitutions',
      'Develop arpeggio-based improvisation skills',
      'Perform with enhanced technical control and musical expression'
    ],
    curriculum: [
      {
        moduleName: 'Module 1: Advanced Scale Mastery',
        topics: ['Harmonic minor scales', 'Melodic minor scales', 'Advanced scale combinations', 'Scale improvisation']
      },
      {
        moduleName: 'Module 2: Extended Chords',
        topics: ['Add9 chord voicings', 'Add13 chord applications', 'Suspended chord techniques', 'Chord substitutions']
      },
      {
        moduleName: 'Module 3: Advanced Progressions',
        topics: ['Complex chord progressions', 'Voice leading techniques', 'Advanced harmonic analysis', 'Progression composition']
      },
      {
        moduleName: 'Module 4: Professional Performance',
        topics: ['Advanced arpeggio patterns', 'Improvisation mastery', 'Professional repertoire', 'Concert preparation']
      },
      {
        moduleName: 'Module 5: Modal Improvisation',
        topics: ['Dorian & Mixolydian modes', 'Improvising on modal jazz', 'Scale alterations']
      },
      {
        moduleName: 'Module 6: Orchestral Voicings',
        topics: ['Orchestrating pianistic patterns', 'Four-part harmony', 'Spread voicings']
      },
      {
        moduleName: 'Module 7: Complex Rhythms',
        topics: ['Polyrhythms (3 against 4)', 'Irregular meters (5/8, 7/8)', 'Rhythmic displacement']
      },
      {
        moduleName: 'Module 8: Classical Masterpieces',
        topics: ['Sonata form analysis', 'Classical interpretation', 'Pedaling nuances']
      },
      {
        moduleName: 'Module 9: Jazz Improvisation',
        topics: ['Be-bop phrasing', 'Tension & release', 'Solo transcriptions']
      },
      {
        moduleName: 'Module 10: Recital Showcase',
        topics: ['Recital preparation', 'Full repertoire run-through', 'Stage performance mastery']
      }
    ]
  }
}

export function getCategoryDisplayName(category: string): string {
  const names: Record<string, string> = {
    piano: 'Piano',
    guitar: 'Guitar',
    drums: 'Drums',
    vocals: 'Vocals',
    violin: 'Violin',
    'music-theory': 'Music Theory',
    'bass-guitar': 'Bass Guitar',
    saxophone: 'Saxophone',
  }
  if (names[category]) return names[category]
  return (category || '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const INSTRUCTOR_NAME = 'Ajinkya Amrule'

const COURSE_CATEGORIES = ['piano', 'guitar', 'drums', 'vocals', 'violin', 'music-theory', 'bass-guitar']

const ALL_COURSES: Course[] = []

COURSE_CATEGORIES.forEach(category => {
  ['Beginner', 'Intermediate', 'Advanced'].forEach(level => {
    const levelData = LEVEL_DETAILS[level as keyof typeof LEVEL_DETAILS]
    const basePrice = level === 'Beginner' ? 3500 : level === 'Intermediate' ? (category === 'piano' || category === 'guitar' ? 3999 : 4000) : 4500
    const duration = level === 'Beginner' ? '3 Months' : level === 'Intermediate' ? '4 Months' : '6 Months'
    const lessons = level === 'Beginner' ? 24 : level === 'Intermediate' ? 32 : 48
    const rating = level === 'Beginner' ? 4.8 : level === 'Intermediate' ? 4.85 : 4.9
    
    ALL_COURSES.push({
      id: `${category}-${level.toLowerCase()}`,
      title: `${getCategoryDisplayName(category)} - ${level}`,
      category: category,
      level: level as CourseLevel,
      price: basePrice,
      instructor: INSTRUCTOR_NAME,
      duration: duration,
      rating: rating,
      students: Math.floor(Math.random() * 100) + 50,
      image: `/courses/${category}-${level.toLowerCase()}.jpg`,
      description: `${level} level ${getCategoryDisplayName(category)} course designed for students to master ${category} with comprehensive training.`,
      aboutCourse: levelData.about,
      curriculum: levelData.curriculum.map(m => m.moduleName),
      learningOutcomes: levelData.learningOutcomes,
      prerequisites: levelData.prerequisites,
      topicsCovered: levelData.topicsCovered,
      highlights: [
        'Expert instructor guidance',
        'Personalized feedback',
        'Performance opportunities',
        'Certificate upon completion'
      ],
      lessons: lessons,
      projects: level === 'Beginner' ? 3 : level === 'Intermediate' ? 4 : 6,
      assignments: level === 'Beginner' ? 5 : level === 'Intermediate' ? 7 : 10,
      hasCertificate: true,
      featured: true,
      upcoming: false
    })
  })
})

export const COURSE_COUNTS: Record<string, number> = {
  piano: 3,
  guitar: 3,
  drums: 3,
  vocals: 3,
  violin: 3,
  'music-theory': 3,
  'bass-guitar': 3,
  saxophone: 0,
}

export const formatCoursePrice = (price: number): string =>
  `₹${price.toLocaleString('en-IN')}`

export const getLevelBadgeClass = (level: CourseLevel): string => {
  switch (level) {
    case 'Beginner':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
    case 'Intermediate':
      return 'bg-amber-500/20 text-amber-300 border-amber-400/30'
    case 'Advanced':
      return 'bg-rose-500/20 text-rose-300 border-rose-400/30'
    default:
      return 'bg-white/10 text-white border-white/20'
  }
}

export const getCategoryGradient = (category: string): string => {
  const gradients: Record<string, string> = {
    piano: 'from-violet-600 via-purple-600 to-indigo-700',
    guitar: 'from-amber-500 via-orange-600 to-red-600',
    drums: 'from-slate-700 via-gray-800 to-zinc-900',
    vocals: 'from-rose-500 via-pink-600 to-fuchsia-700',
    violin: 'from-emerald-600 via-teal-600 to-cyan-700',
    'music-theory': 'from-blue-600 via-indigo-600 to-violet-700',
    'bass-guitar': 'from-lime-600 via-green-600 to-emerald-700',
    saxophone: 'from-yellow-500 via-amber-600 to-orange-700',
  }
  return gradients[category?.toLowerCase()] ?? 'from-purple-600 via-violet-600 to-indigo-700'
}

export const getAllCourses = (): Course[] => ALL_COURSES

export const getCourseById = (id: string): Course | undefined =>
  ALL_COURSES.find((course) => course.id === id)

export const getCoursesByCategory = (category: string): Course[] =>
  ALL_COURSES.filter((course) => course.category === category)

export const getLevelDetails = (level: CourseLevel) => {
  return LEVEL_DETAILS[level]
}

export const getCurriculumList = (level: CourseLevel) => {
  return LEVEL_DETAILS[level]?.curriculum || []
}
