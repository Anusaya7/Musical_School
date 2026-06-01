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
}

const INSTRUCTOR = 'Ajinkya Amrule'

const LEVELS: CourseLevel[] = ['Beginner', 'Intermediate', 'Advanced']

const LEVEL_CONFIG: Record<
  CourseLevel,
  { duration: string; price: number; rating: number; students: number }
> = {
  Beginner: { duration: '3 Months', price: 4999, rating: 4.8, students: 1240 },
  Intermediate: { duration: '4 Months', price: 6999, rating: 4.85, students: 890 },
  Advanced: { duration: '6 Months', price: 9999, rating: 4.9, students: 520 },
}

interface InstrumentConfig {
  slug: string
  name: string
  gradient: string
  descriptions: Record<CourseLevel, string>
  aboutCourse: Record<CourseLevel, string>
  curriculum: Record<CourseLevel, string[]>
  learningOutcomes: Record<CourseLevel, string[]>
  prerequisites: Record<CourseLevel, string[]>
  topicsCovered: Record<CourseLevel, string[]>
}

const INSTRUMENTS: InstrumentConfig[] = [
  {
    slug: 'piano',
    name: 'Piano',
    gradient: 'from-violet-600 via-purple-600 to-indigo-700',
    descriptions: {
      Beginner:
        'Build a strong piano foundation with posture, note reading, scales, and your first performance pieces.',
      Intermediate:
        'Develop expressive playing, chord voicings, sight-reading fluency, and stylistic versatility.',
      Advanced:
        'Master advanced repertoire, improvisation, performance technique, and professional-level musicianship.',
    },
    aboutCourse: {
      Beginner:
        "Has your child been learning piano for the past six months? The 2nd Inversion Method Book 1 course is designed to strengthen their musical foundation while introducing more advanced concepts in a structured and engaging way.\n\nThis course focuses on developing technical accuracy, musical expression, rhythmic understanding, and overall keyboard proficiency. Students will explore major and minor scales, chord inversions, syncopation, swing rhythm, key signatures, and repertoire development while building confidence in performance and musicianship.",
      Intermediate:
        "Take your child's piano journey to the next level with the Spardha Method Book 2 course. Designed for students with over 18 months of piano learning experience, this course develops stronger technical skills, musical understanding, and performance confidence.\n\nStudents will explore advanced scales, new major and minor keys, blues progressions, rhythm techniques, and arpeggios while learning to perform a wider variety of repertoire.",
      Advanced:
        "Step into the world of advanced piano performance with the 2nd Inversion Music Method Book 3 course.\n\nThis course focuses on refining technical mastery, musical expression, improvisation, and advanced harmonic understanding.\n\nStudents will explore advanced scales, extended chords, sophisticated rhythm patterns, and arpeggio-based accompaniment techniques.",
    },
    curriculum: {
      Beginner: [
        'Piano anatomy, posture, and hand technique',
        'Reading treble and bass clef notation',
        'Major scales and scale practice',
        'Primary chords and chord inversions',
        'Introduction to voice training and ear development',
        'Key signatures and syncopation',
        'Playing in the keys of C, G, and F Major',
        'Minor keys and transposition',
        'Swing rhythm and rhythmic interpretation',
        'Repertoire and song development',
      ],
      Intermediate: [
        'Intermediate-level major and minor scales',
        'Keys of D Major, A Major, and B♭ Major',
        'Repertoire playing in multiple keys',
        'Triads and 12-bar blues progressions',
        'Chromatic and pentatonic scales',
        'Advanced rhythm techniques and subdivisions',
        'Introduction to arpeggios and their musical applications',
      ],
      Advanced: [
        'Advanced major and minor scales',
        'Harmonic and melodic minor scales',
        'Extended chords including Add9, Add13, and Suspended chords',
        'Advanced chord progressions',
        'Advanced piano hand positions and voicings',
        'Improvisation techniques',
        'Advanced arpeggios and accompaniment patterns',
      ],
    },
    learningOutcomes: {
      Beginner: [
        'Demonstrate proper piano techniques for expressive and efficient playing',
        'Perform confidently in multiple major and minor keys',
        'Understand and apply chords, voicings, chord progressions, and inversions',
        'Apply musical concepts such as syncopation and swing rhythm',
        'Read and perform rhythms involving 16th notes accurately',
        'Develop left-hand accompaniment patterns',
        'Build a strong repertoire of performance-ready pieces',
      ],
      Intermediate: [
        'Perform major and minor scales confidently with both hands',
        'Play songs in various keys with improved technical control',
        'Understand rhythmic subdivisions accurately',
        'Perform songs using triad chords',
        'Apply arpeggio patterns in exercises and repertoire',
        'Develop stronger coordination and improvisational awareness',
        'Build a versatile repertoire suitable for performance',
      ],
      Advanced: [
        'Perform scales fluently with both hands',
        'Apply scales creatively in improvisation',
        'Build and perform extended chords confidently',
        'Use advanced chords across multiple genres',
        'Understand advanced chord families and substitutions',
        'Develop arpeggio-based improvisation skills',
        'Perform with enhanced technical control and musical expression',
      ],
    },
    prerequisites: {
      Beginner: [
        'Understanding of basic piano fundamentals',
        'Completion of foundation-level concepts or equivalent experience',
      ],
      Intermediate: [
        'Beginner to intermediate-level piano playing skills',
        'Understanding of basic piano techniques and music fundamentals',
      ],
      Advanced: [
        'Successful completion of intermediate-level piano training',
        'Strong understanding of scales, chords, and rhythm concepts',
      ],
    },
    topicsCovered: {
      Beginner: [
        'Piano techniques and hand coordination',
        'Major scales and scale practice',
        'Primary chords and chord inversions',
        'Voice training and ear development',
        'Key signatures and syncopation',
        'Minor keys and transposition',
        'Swing rhythm',
        'Repertoire development',
      ],
      Intermediate: [
        'Intermediate scales and arpeggios',
        'Advanced keys (D, A, B♭ Major)',
        'Blues progressions',
        'Rhythm techniques',
        'Pentatonic scales',
      ],
      Advanced: [
        'Advanced scales (Harmonic and Melodic minor)',
        'Extended chords',
        'Advanced progressions',
        'Hand voicings',
        'Improvisation',
      ],
    },
  },
  {
    slug: 'guitar',
    name: 'Guitar',
    gradient: 'from-amber-500 via-orange-600 to-red-600',
    descriptions: {
      Beginner:
        'Learn essential guitar skills including tuning, chords, strumming, and playing popular songs.',
      Intermediate:
        'Expand your fretboard knowledge, lead techniques, music theory, and band-ready playing.',
      Advanced:
        'Achieve mastery in soloing, advanced harmony, composition, and live performance skills.',
    },
    aboutCourse: {
      Beginner:
        'Begin your guitar journey with fundamental techniques and popular songs. This course covers guitar setup, tuning, open chords, strumming patterns, and teaches you how to play complete beginner-friendly songs.',
      Intermediate:
        'Expand your fretboard knowledge and playing confidence. Learn barre chords, scale patterns, lead playing basics, fingerstyle techniques, and develop groove and arrangement skills for band-ready performance.',
      Advanced:
        'Master advanced soloing, harmonic language, and composition. Develop professional-level technique with modal improvisation, complex rhythms, songwriting, and live performance skills.',
    },
    curriculum: {
      Beginner: [
        'Guitar setup, tuning, and proper hand position',
        'Open chords and smooth chord transitions',
        'Strumming patterns and rhythm fundamentals',
        'Introduction to tablature and chord charts',
        'Playing 5 beginner-friendly songs',
        'Basic ear training and practice routines',
      ],
      Intermediate: [
        'Barre chords and movable chord shapes',
        'Scale patterns and introductory lead playing',
        'Fingerstyle and hybrid picking basics',
        'Song arrangement and groove development',
        'Music theory applied to the fretboard',
        'Jam session and backing track practice',
      ],
      Advanced: [
        'Advanced soloing and modal improvisation',
        'Complex rhythm and time signature studies',
        'Songwriting and arrangement workshops',
        'Live performance and stagecraft training',
        'Tone shaping and gear optimization',
        'Professional demo recording project',
      ],
    },
    learningOutcomes: {
      Beginner: [
        'Tune and hold the guitar correctly',
        'Play open chords and basic strumming patterns',
        'Perform beginner songs with steady rhythm',
        'Read chord charts and simple tabs',
      ],
      Intermediate: [
        'Execute barre chords and lead fragments fluently',
        'Improvise over common chord progressions',
        'Play in ensemble settings with confidence',
        'Apply theory concepts directly on guitar',
      ],
      Advanced: [
        'Deliver advanced solos and compositions',
        'Perform live with strong stage presence',
        'Create original arrangements and songs',
        'Record demo-quality guitar performances',
      ],
    },
    prerequisites: {
      Beginner: ['No prior guitar experience required', 'Acoustic or electric guitar recommended'],
      Intermediate: [
        'Completion of Guitar Beginner or equivalent',
        'Ability to play open chords cleanly',
        'Basic rhythm and strumming competency',
      ],
      Advanced: [
        'Completion of Guitar Intermediate or audition approval',
        'Proficiency with barre chords and scales',
        'Performance or band experience preferred',
      ],
    },
    topicsCovered: {
      Beginner: ['Tuning', 'Open Chords', 'Strumming', 'Tabs', 'Songs', 'Rhythm'],
      Intermediate: ['Barre Chords', 'Scales', 'Lead Basics', 'Theory', 'Fingerstyle'],
      Advanced: ['Soloing', 'Composition', 'Live Performance', 'Tone', 'Recording'],
    },
  },
  {
    slug: 'drums',
    name: 'Drums',
    gradient: 'from-slate-700 via-gray-800 to-zinc-900',
    descriptions: {
      Beginner:
        'Master drum kit fundamentals, stick control, basic grooves, and essential rhythm patterns.',
      Intermediate:
        'Build independence, fills, genre grooves, and confident playing in musical contexts.',
      Advanced:
        'Develop professional-level technique, complex polyrhythms, studio skills, and stage mastery.',
    },
    aboutCourse: {
      Beginner:
        'Start your drumming journey with proper setup and fundamental technique. Learn stick grip, basic grooves, drum notation, metronome discipline, and perform your first complete songs on the kit.',
      Intermediate:
        'Develop independence and musical versatility. Master genre grooves, fill construction, dynamics, and learn to play confidently with other musicians in band settings.',
      Advanced:
        'Achieve professional drumming mastery. Work on advanced polyrhythms, studio recording skills, extended solos, genre specialization, and prepare for professional auditions and gigs.',
    },
    curriculum: {
      Beginner: [
        'Drum kit setup and ergonomic playing posture',
        'Stick grip, rebound control, and rudiments',
        'Basic rock and pop groove patterns',
        'Reading drum notation and counting systems',
        'Playing with metronome discipline',
        'First full-song drum performances',
      ],
      Intermediate: [
        'Limb independence and coordination drills',
        'Genre grooves: funk, rock, jazz, and Latin',
        'Fill construction and musical phrasing',
        'Dynamics, ghost notes, and groove feel',
        'Playing with backing tracks and bands',
        'Intermediate sight-reading for drums',
      ],
      Advanced: [
        'Advanced polyrhythms and metric modulation',
        'Studio recording and click-track mastery',
        'Extended soloing and performance sets',
        'Advanced genre specialization modules',
        'Gear tuning and live sound optimization',
        'Professional audition and gig preparation',
      ],
    },
    learningOutcomes: {
      Beginner: [
        'Play steady beginner grooves with a metronome',
        'Execute foundational rudiments accurately',
        'Read basic drum notation',
        'Perform complete songs on kit',
      ],
      Intermediate: [
        'Demonstrate limb independence in grooves',
        'Adapt drumming style across multiple genres',
        'Create musical fills that support songs',
        'Play confidently with other musicians',
      ],
      Advanced: [
        'Perform advanced technical and solo material',
        'Record studio-quality drum tracks',
        'Lead rhythm sections in live settings',
        'Prepare professional audition portfolios',
      ],
    },
    prerequisites: {
      Beginner: ['No prior drumming experience required', 'Practice pad or drum kit access'],
      Intermediate: [
        'Completion of Drums Beginner or equivalent',
        'Ability to play basic rock grooves at tempo',
        'Fundamental rudiment competency',
      ],
      Advanced: [
        'Completion of Drums Intermediate or audition approval',
        'Strong independence and genre groove skills',
        'Live or studio playing experience preferred',
      ],
    },
    topicsCovered: {
      Beginner: ['Kit Setup', 'Rudiments', 'Grooves', 'Notation', 'Metronome', 'Songs'],
      Intermediate: ['Independence', 'Fills', 'Genres', 'Dynamics', 'Band Playing'],
      Advanced: ['Polyrhythms', 'Studio Drumming', 'Solos', 'Live Sound', 'Auditions'],
    },
  },
  {
    slug: 'vocals',
    name: 'Vocals',
    gradient: 'from-rose-500 via-pink-600 to-fuchsia-700',
    descriptions: {
      Beginner:
        'Discover your voice with breathing, pitch, tone, and confidence-building vocal exercises.',
      Intermediate:
        'Strengthen range, control, stylistic delivery, and performance-ready vocal technique.',
      Advanced:
        'Refine artistry, advanced repertoire, recording skills, and professional vocal performance.',
    },
    aboutCourse: {
      Beginner:
        'Discover your unique voice! This course covers vocal anatomy, breathing techniques, pitch accuracy, warm-up routines, and helps you build confidence singing beginner-friendly melodies and songs.',
      Intermediate:
        'Expand your vocal capabilities and stylistic delivery. Develop range extension, register blending, harmony singing, song interpretation, and prepare for live performance with stronger stage presence.',
      Advanced:
        'Achieve professional vocal mastery. Master advanced repertoire, studio recording techniques, improvisation, ad-lib skills, artist branding, and deliver polished vocal showcase performances.',
    },
    curriculum: {
      Beginner: [
        'Vocal anatomy and healthy singing habits',
        'Breath support and diaphragmatic control',
        'Pitch accuracy and ear training drills',
        'Warm-up routines and vocal hygiene',
        'Singing simple melodies and songs',
        'Microphone basics and stage confidence',
      ],
      Intermediate: [
        'Range extension and register blending',
        'Vocal agility and stylistic ornamentation',
        'Harmony singing and ensemble vocals',
        'Song interpretation and emotional delivery',
        'Genre focus: pop, classical, and Bollywood',
        'Live performance and audition preparation',
      ],
      Advanced: [
        'Advanced repertoire and vocal athletics',
        'Recording studio technique and layering',
        'Improvisation and ad-lib mastery',
        'Artist branding and setlist design',
        'Vocal health for touring musicians',
        'Capstone vocal showcase performance',
      ],
    },
    learningOutcomes: {
      Beginner: [
        'Sing in tune with stable breath support',
        'Perform warm-ups safely and effectively',
        'Deliver beginner songs with clarity',
        'Understand basic vocal health practices',
      ],
      Intermediate: [
        'Expand usable vocal range comfortably',
        'Apply style-specific vocal techniques',
        'Sing harmonies and ensemble parts',
        'Perform with stronger stage presence',
      ],
      Advanced: [
        'Execute advanced repertoire with artistry',
        'Record polished vocal performances',
        'Improvise and adapt in live settings',
        'Prepare professional vocal auditions',
      ],
    },
    prerequisites: {
      Beginner: ['No prior vocal training required', 'Commitment to regular practice'],
      Intermediate: [
        'Completion of Vocals Beginner or equivalent',
        'Stable pitch and breath support',
        'Ability to perform 2–3 full songs',
      ],
      Advanced: [
        'Completion of Vocals Intermediate or audition approval',
        'Strong range and stylistic control',
        'Prior performance experience recommended',
      ],
    },
    topicsCovered: {
      Beginner: ['Breathing', 'Pitch', 'Warm-ups', 'Tone', 'Songs', 'Vocal Health'],
      Intermediate: ['Range', 'Harmony', 'Style', 'Performance', 'Interpretation'],
      Advanced: ['Repertoire', 'Recording', 'Improvisation', 'Branding', 'Showcase'],
    },
  },
  {
    slug: 'violin',
    name: 'Violin',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    descriptions: {
      Beginner:
        'Start your violin journey with posture, bowing, intonation, and beautiful beginner repertoire.',
      Intermediate:
        'Advance bow control, shifting, vibrato foundations, and expressive musical phrasing.',
      Advanced:
        'Excel in advanced technique, concert repertoire, ensemble leadership, and performance artistry.',
    },
    aboutCourse: {
      Beginner:
        'Begin your violin journey with proper posture and bow technique. Learn open strings, basic bow strokes, violin notation, and perform simple études and folk melodies.',
      Intermediate:
        'Develop advanced bow control and intonation. Master shifting and vibrato foundations, practice scales in multiple keys, perform intermediate pieces, and develop ensemble skills.',
      Advanced:
        'Master concert-level violin performance. Study advanced études and repertoire, perfect expressive vibrato and tone color, prepare for orchestral excerpts and chamber music, and deliver professional recitals.',
    },
    curriculum: {
      Beginner: [
        'Violin hold, bow grip, and posture fundamentals',
        'Open strings and first-position fingerings',
        'Basic bow strokes and tone production',
        'Reading violin sheet music',
        'Simple études and folk melodies',
        'Tuning, care, and practice discipline',
      ],
      Intermediate: [
        'Shifting and second-position studies',
        'Introductory vibrato and bow articulation',
        'Scales in multiple keys and bow patterns',
        'Intermediate classical and contemporary pieces',
        'Ensemble and duet performance skills',
        'Sight-reading for string players',
      ],
      Advanced: [
        'Advanced études and concert repertoire',
        'Expressive vibrato and tone color mastery',
        'Orchestral excerpt preparation',
        'Chamber music collaboration',
        'Audition and competition coaching',
        'Professional recital capstone',
      ],
    },
    learningOutcomes: {
      Beginner: [
        'Produce clear tone on open strings and simple pieces',
        'Read beginner violin notation',
        'Maintain correct posture and bow technique',
        'Perform introductory repertoire confidently',
      ],
      Intermediate: [
        'Play intermediate pieces with improved intonation',
        'Apply shifting and early vibrato techniques',
        'Participate in ensemble performances',
        'Sight-read at an intermediate level',
      ],
      Advanced: [
        'Perform advanced repertoire with artistry',
        'Prepare orchestral and solo auditions',
        'Lead chamber music collaborations',
        'Deliver professional recital performances',
      ],
    },
    prerequisites: {
      Beginner: ['No prior violin experience required', 'Access to a violin and bow'],
      Intermediate: [
        'Completion of Violin Beginner or equivalent',
        'Comfort in first position with steady intonation',
        'Basic bow control and reading skills',
      ],
      Advanced: [
        'Completion of Violin Intermediate or audition approval',
        'Shifting and vibrato foundation required',
        'Performance experience strongly recommended',
      ],
    },
    topicsCovered: {
      Beginner: ['Posture', 'Bowing', 'First Position', 'Notation', 'Tone', 'Care'],
      Intermediate: ['Shifting', 'Vibrato', 'Scales', 'Ensemble', 'Sight Reading'],
      Advanced: ['Repertoire', 'Orchestral Excerpts', 'Chamber Music', 'Auditions'],
    },
  },
  {
    slug: 'music-theory',
    name: 'Music Theory',
    gradient: 'from-blue-600 via-indigo-600 to-violet-700',
    descriptions: {
      Beginner:
        'Understand the language of music through notation, rhythm, scales, and basic harmony.',
      Intermediate:
        'Analyze harmony, chord progressions, form, and apply theory to composition and performance.',
      Advanced:
        'Master advanced harmony, orchestration concepts, analysis, and professional composition skills.',
    },
    aboutCourse: {
      Beginner:
        'Learn the fundamentals of music language. Understand staff notation, major and minor scales, intervals, triads, time signatures, and connect theory concepts to your instrument performance.',
      Intermediate:
        'Deepen your harmonic understanding and analytical skills. Study seventh chords, chord progressions, form and structure, melodic and harmonic dictation, and begin composition exercises.',
      Advanced:
        'Master advanced theoretical concepts. Study modal interchange, counterpoint, voice-leading principles, orchestration, advanced analysis, and film scoring for professional composition.',
    },
    curriculum: {
      Beginner: [
        'Staff notation, clefs, and rhythmic values',
        'Major and minor scales across keys',
        'Intervals, triads, and chord spelling',
        'Time signatures and rhythmic dictation',
        'Ear training fundamentals',
        'Applying theory to your primary instrument',
      ],
      Intermediate: [
        'Seventh chords and functional harmony',
        'Chord progressions in popular and classical music',
        'Form and structure: binary, ternary, sonata',
        'Melodic and harmonic dictation',
        'Transposition and score reading',
        'Composition exercises and analysis projects',
      ],
      Advanced: [
        'Modal interchange and extended harmony',
        'Counterpoint and voice-leading principles',
        'Orchestration and arranging fundamentals',
        'Advanced analysis of masterworks',
        'Film scoring and contemporary composition',
        'Portfolio composition capstone',
      ],
    },
    learningOutcomes: {
      Beginner: [
        'Read and write basic musical notation',
        'Identify scales, intervals, and triads',
        'Understand rhythm and meter clearly',
        'Connect theory concepts to performance',
      ],
      Intermediate: [
        'Analyze chord progressions in real music',
        'Compose short pieces using functional harmony',
        'Transcribe melodies and harmonies by ear',
        'Read intermediate scores with confidence',
      ],
      Advanced: [
        'Compose and arrange multi-part music',
        'Analyze complex harmonic language',
        'Apply orchestration principles effectively',
        'Build a professional theory portfolio',
      ],
    },
    prerequisites: {
      Beginner: ['No prior theory experience required', 'Basic familiarity with any instrument helps'],
      Intermediate: [
        'Completion of Music Theory Beginner or equivalent',
        'Ability to read treble and bass clef',
        'Understanding of major scales and triads',
      ],
      Advanced: [
        'Completion of Music Theory Intermediate or audition approval',
        'Strong harmonic analysis and dictation skills',
        'Composition experience recommended',
      ],
    },
    topicsCovered: {
      Beginner: ['Notation', 'Scales', 'Rhythm', 'Intervals', 'Triads', 'Ear Training'],
      Intermediate: ['Harmony', 'Progressions', 'Form', 'Dictation', 'Composition'],
      Advanced: ['Counterpoint', 'Orchestration', 'Analysis', 'Film Scoring', 'Portfolio'],
    },
  },
  {
    slug: 'bass-guitar',
    name: 'Bass Guitar',
    gradient: 'from-lime-600 via-green-600 to-emerald-700',
    descriptions: {
      Beginner:
        'Learn bass fundamentals including groove, timing, root notes, and essential band skills.',
      Intermediate:
        'Develop walking bass, genre grooves, fretboard fluency, and musical lock with drummers.',
      Advanced:
        'Master slap, soloing, advanced harmony, studio bass, and professional performance.',
    },
    aboutCourse: {
      Beginner:
        'Start your bass journey with proper setup and technique. Learn root-note grooves, basic scales, metronome practice, and play essential songs across pop and rock genres.',
      Intermediate:
        'Develop musical sophistication and band versatility. Master walking bass lines, genre studies, ghost notes, bass charts, and learn to lock confidently with drums in ensemble settings.',
      Advanced:
        'Achieve professional bass mastery. Learn advanced slap and tap techniques, harmonic substitution, studio recording workflows, advanced groove design, and prepare for professional gigs and auditions.',
    },
    curriculum: {
      Beginner: [
        'Bass setup, tuning, and hand technique',
        'Root-note grooves and rhythmic pocket',
        'Basic scales and fretboard navigation',
        'Playing with metronome and drum tracks',
        'Essential songs across pop and rock',
        'Amp tone and gear fundamentals',
      ],
      Intermediate: [
        'Walking bass lines and chord tone targeting',
        'Genre studies: funk, rock, jazz, and blues',
        'Ghost notes, slides, and rhythmic variation',
        'Reading bass charts and lead sheets',
        'Locking with drums in ensemble settings',
        'Intermediate slap and pop introduction',
      ],
      Advanced: [
        'Advanced slap, tap, and solo techniques',
        'Harmonic substitution and chord-scale theory',
        'Studio recording and editing workflows',
        'Advanced groove design and arrangement',
        'Live performance and stage monitoring',
        'Professional bass portfolio project',
      ],
    },
    learningOutcomes: {
      Beginner: [
        'Play steady bass grooves in time',
        'Navigate the fretboard for root-based lines',
        'Lock with drums on backing tracks',
        'Perform beginner song bass parts',
      ],
      Intermediate: [
        'Construct walking bass lines over changes',
        'Adapt style across multiple genres',
        'Read charts and collaborate in bands',
        'Apply intermediate slap techniques',
      ],
      Advanced: [
        'Perform advanced technical bass material',
        'Record professional-quality bass tracks',
        'Solo and improvise with harmonic awareness',
        'Prepare gig and audition portfolios',
      ],
    },
    prerequisites: {
      Beginner: ['No prior bass experience required', 'Electric bass and amp recommended'],
      Intermediate: [
        'Completion of Bass Guitar Beginner or equivalent',
        'Solid timing and root groove competency',
        'Basic fretboard knowledge',
      ],
      Advanced: [
        'Completion of Bass Guitar Intermediate or audition approval',
        'Walking bass and genre groove proficiency',
        'Band or studio experience preferred',
      ],
    },
    topicsCovered: {
      Beginner: ['Groove', 'Root Notes', 'Timing', 'Scales', 'Songs', 'Gear'],
      Intermediate: ['Walking Bass', 'Genres', 'Charts', 'Ensemble', 'Slap Intro'],
      Advanced: ['Slap', 'Soloing', 'Studio Bass', 'Harmony', 'Live Performance'],
    },
  },
  {
    slug: 'saxophone',
    name: 'Saxophone',
    gradient: 'from-yellow-500 via-amber-600 to-orange-700',
    descriptions: {
      Beginner:
        'Begin saxophone with embouchure, breath control, fingerings, and your first melodies.',
      Intermediate:
        'Expand tone, articulation, range, jazz fundamentals, and ensemble performance skills.',
      Advanced:
        'Achieve virtuosic technique, improvisation mastery, and professional saxophone performance.',
    },
    aboutCourse: {
      Beginner:
        'Start your saxophone journey with proper assembly and posture. Develop embouchure and breath support, learn fingerings and first notes, and practice tone development exercises with beginner repertoire.',
      Intermediate:
        'Expand your range and stylistic versatility. Master articulation, dynamics, jazz scales, improvisation basics, and develop ensemble skills for big band section performance.',
      Advanced:
        'Achieve virtuosic saxophone mastery. Study advanced improvisation, virtuosic études, concert repertoire, recording techniques, and prepare for professional auditions and recitals.',
    },
    curriculum: {
      Beginner: [
        'Saxophone assembly, reed care, and posture',
        'Embouchure and breath support fundamentals',
        'First notes, fingerings, and simple melodies',
        'Reading saxophone notation',
        'Tone development exercises',
        'Beginner repertoire and performance prep',
      ],
      Intermediate: [
        'Extended range and altissimo introduction',
        'Articulation, dynamics, and stylistic phrasing',
        'Jazz scales and introductory improvisation',
        'Ensemble and big band section skills',
        'Intermediate classical and jazz repertoire',
        'Sight-reading for woodwind players',
      ],
      Advanced: [
        'Advanced improvisation and language study',
        'Virtuosic études and concert repertoire',
        'Recording and microphone technique for sax',
        'Big band lead alto/tenor preparation',
        'Audition and competition coaching',
        'Professional recital capstone',
      ],
    },
    learningOutcomes: {
      Beginner: [
        'Produce a stable beginner saxophone tone',
        'Play simple melodies with correct fingerings',
        'Read beginner sax notation',
        'Care for reeds and instrument properly',
      ],
      Intermediate: [
        'Perform with improved range and expression',
        'Improvise over basic jazz progressions',
        'Contribute confidently in ensemble settings',
        'Sight-read intermediate sax parts',
      ],
      Advanced: [
        'Deliver advanced improvised and written performances',
        'Record professional saxophone tracks',
        'Prepare lead chair and solo auditions',
        'Present a capstone recital program',
      ],
    },
    prerequisites: {
      Beginner: ['No prior saxophone experience required', 'Alto or tenor saxophone recommended'],
      Intermediate: [
        'Completion of Saxophone Beginner or equivalent',
        'Stable tone and beginner repertoire competency',
        'Basic music reading skills',
      ],
      Advanced: [
        'Completion of Saxophone Intermediate or audition approval',
        'Strong improvisation and technical foundation',
        'Ensemble performance experience recommended',
      ],
    },
    topicsCovered: {
      Beginner: ['Embouchure', 'Fingerings', 'Tone', 'Notation', 'Repertoire', 'Care'],
      Intermediate: ['Range', 'Jazz Basics', 'Articulation', 'Ensemble', 'Improvisation'],
      Advanced: ['Virtuosity', 'Recording', 'Big Band', 'Auditions', 'Recital'],
    },
  },
]

function buildCourses(): Course[] {
  const courses: Course[] = []

  INSTRUMENTS.forEach((instrument) => {
    LEVELS.forEach((level) => {
      const config = LEVEL_CONFIG[level]
      const id = `${instrument.slug}-${level.toLowerCase()}`

      courses.push({
        id,
        title: `${instrument.name} ${level}`,
        category: instrument.slug,
        level,
        price: config.price,
        instructor: INSTRUCTOR,
        duration: config.duration,
        rating: config.rating,
        students: config.students,
        image: `/courses/${instrument.slug}-${level.toLowerCase()}.jpg`,
        description: instrument.descriptions[level],
        aboutCourse: instrument.aboutCourse[level],
        curriculum: instrument.curriculum[level],
        learningOutcomes: instrument.learningOutcomes[level],
        prerequisites: instrument.prerequisites[level],
        topicsCovered: instrument.topicsCovered[level],
        highlights: instrument.learningOutcomes[level],
      })
    })
  })

  return courses
}

const ALL_COURSES = buildCourses()

export const COURSE_COUNTS: Record<string, number> = {
  piano: 3,
  guitar: 3,
  drums: 3,
  vocals: 3,
  violin: 3,
  'music-theory': 3,
  'bass-guitar': 3,
  saxophone: 3,
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
  const instrument = INSTRUMENTS.find((i) => i.slug === category)
  return instrument?.gradient ?? 'from-purple-600 via-violet-600 to-indigo-700'
}

export const getAllCourses = (): Course[] => ALL_COURSES

export const getCourseById = (id: string): Course | undefined =>
  ALL_COURSES.find((course) => course.id === id)

export const getCoursesByCategory = (category: string): Course[] =>
  ALL_COURSES.filter((course) => course.category === category)

export const getCategoryDisplayName = (category: string): string => {
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
  return names[category] || category
}
