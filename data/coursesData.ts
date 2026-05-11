export interface Course {
  id: string
  title: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price: number
  instructor: string
  duration: string
  rating: number
  students: number
  image: string
  description: string
}

interface BaseCourse {
  title: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price: number
  instructor: string
  duration: string
  rating: number
  students: number
}

// Course counts per category
export const COURSE_COUNTS = {
  piano: 12,
  guitar: 15,
  drums: 20,
  vocals: 14,
  violin: 18,
  'music-theory': 26,
  'bass-guitar': 28,
  saxophone: 19
}

// Generate courses for each category
export const generateCourses = (): Course[] => {
  const courses: Course[] = []
  
  // Piano Courses (12)
  const pianoCourses: BaseCourse[] = [
    { title: 'Piano Fundamentals', level: 'Beginner' as const, price: 2999, instructor: 'Ajinkya Amrule', duration: '8 weeks', rating: 4.8, students: 1234 },
    { title: 'Classical Piano Basics', level: 'Beginner' as const, price: 3499, instructor: 'Sarah Chen', duration: '10 weeks', rating: 4.9, students: 892 },
    { title: 'Jazz Piano Introduction', level: 'Intermediate' as const, price: 4499, instructor: 'Mike Johnson', duration: '12 weeks', rating: 4.7, students: 567 },
    { title: 'Piano Technique Mastery', level: 'Intermediate' as const, price: 3999, instructor: 'Ajinkya Amrule', duration: '8 weeks', rating: 4.6, students: 445 },
    { title: 'Advanced Piano Performance', level: 'Advanced' as const, price: 5999, instructor: 'Sarah Chen', duration: '16 weeks', rating: 4.9, students: 234 },
    { title: 'Piano Sight Reading', level: 'Intermediate' as const, price: 3499, instructor: 'David Lee', duration: '6 weeks', rating: 4.5, students: 678 },
    { title: 'Piano Music Theory', level: 'Beginner' as const, price: 2999, instructor: 'Emma Wilson', duration: '8 weeks', rating: 4.7, students: 923 },
    { title: 'Piano Improvisation', level: 'Advanced' as const, price: 6499, instructor: 'Ajinkya Amrule', duration: '14 weeks', rating: 4.8, students: 156 },
    { title: 'Piano for Children', level: 'Beginner' as const, price: 1999, instructor: 'Lisa Brown', duration: '6 weeks', rating: 4.6, students: 1456 },
    { title: 'Contemporary Piano Styles', level: 'Intermediate' as const, price: 4499, instructor: 'Mike Johnson', duration: '10 weeks', rating: 4.4, students: 334 },
    { title: 'Piano Recital Preparation', level: 'Advanced' as const, price: 5499, instructor: 'Sarah Chen', duration: '8 weeks', rating: 4.9, students: 189 },
    { title: 'Piano Accompaniment', level: 'Intermediate' as const, price: 3999, instructor: 'David Lee', duration: '8 weeks', rating: 4.5, students: 567 },
    { title: 'Piano Music History', level: 'Beginner' as const, price: 2999, instructor: 'Emma Wilson', duration: '6 weeks', rating: 4.8, students: 234 }
  ]

  const guitarCourses: BaseCourse[] = [
    { title: 'Guitar Fundamentals', level: 'Beginner' as const, price: 2499, instructor: 'Tom Wilson', duration: '8 weeks', rating: 4.6, students: 2345 },
    { title: 'Acoustic Guitar Basics', level: 'Beginner' as const, price: 2799, instructor: 'Chris Martin', duration: '10 weeks', rating: 4.7, students: 1678 },
    { title: 'Electric Guitar Introduction', level: 'Beginner' as const, price: 2999, instructor: 'Mike Johnson', duration: '8 weeks', rating: 4.5, students: 1890 },
    { title: 'Guitar Chord Mastery', level: 'Intermediate' as const, price: 3499, instructor: 'Tom Wilson', duration: '12 weeks', rating: 4.8, students: 567 },
    { title: 'Guitar Solo Techniques', level: 'Intermediate' as const, price: 3999, instructor: 'Chris Martin', duration: '10 weeks', rating: 4.6, students: 334 },
    { title: 'Advanced Guitar Performance', level: 'Advanced' as const, price: 5499, instructor: 'Mike Johnson', duration: '16 weeks', rating: 4.9, students: 234 },
    { title: 'Guitar Music Theory', level: 'Beginner' as const, price: 2499, instructor: 'Emma Wilson', duration: '6 weeks', rating: 4.7, students: 923 },
    { title: 'Guitar Improvisation', level: 'Advanced' as const, price: 6499, instructor: 'Tom Wilson', duration: '14 weeks', rating: 4.8, students: 156 },
    { title: 'Guitar for Beginners', level: 'Beginner' as const, price: 1999, instructor: 'Lisa Brown', duration: '6 weeks', rating: 4.6, students: 1456 },
    { title: 'Blues Guitar Mastery', level: 'Intermediate' as const, price: 3999, instructor: 'Chris Martin', duration: '8 weeks', rating: 4.7, students: 567 },
    { title: 'Guitar Songwriting', level: 'Intermediate' as const, price: 3499, instructor: 'Mike Johnson', duration: '10 weeks', rating: 4.4, students: 334 },
    { title: 'Guitar Maintenance', level: 'Beginner' as const, price: 1999, instructor: 'Emma Wilson', duration: '4 weeks', rating: 4.5, students: 923 },
    { title: 'Rock Guitar Techniques', level: 'Advanced' as const, price: 5499, instructor: 'Chris Martin', duration: '12 weeks', rating: 4.9, students: 234 },
    { title: 'Guitar Ensemble', level: 'Intermediate' as const, price: 3999, instructor: 'Tom Wilson', duration: '8 weeks', rating: 4.6, students: 567 }
  ]

  const drumsCourses: BaseCourse[] = [
    { title: 'Drum Fundamentals', level: 'Beginner' as const, price: 2999, instructor: 'Steve Smith', duration: '8 weeks', rating: 4.8, students: 1890 },
    { title: 'Rock Drumming Basics', level: 'Beginner' as const, price: 3499, instructor: 'Mike Portnoy', duration: '10 weeks', rating: 4.7, students: 1234 },
    { title: 'Jazz Drum Techniques', level: 'Advanced' as const, price: 5999, instructor: 'Steve Smith', duration: '16 weeks', rating: 4.9, students: 345 },
    { title: 'Drum Rudiments', level: 'Intermediate' as const, price: 3999, instructor: 'Mike Portnoy', duration: '12 weeks', rating: 4.6, students: 678 },
    { title: 'Electronic Drums', level: 'Intermediate' as const, price: 4499, instructor: 'Dave Weckl', duration: '8 weeks', rating: 4.7, students: 456 },
    { title: 'Drum Tuning & Setup', level: 'Beginner' as const, price: 2499, instructor: 'John Bonham', duration: '4 weeks', rating: 4.5, students: 890 },
    { title: 'Advanced Drum Solos', level: 'Advanced' as const, price: 6499, instructor: 'Steve Smith', duration: '14 weeks', rating: 4.9, students: 234 },
    { title: 'Latin Drumming', level: 'Intermediate' as const, price: 4799, instructor: 'Dave Weckl', duration: '10 weeks', rating: 4.8, students: 345 },
    { title: 'Drum Recording', level: 'Advanced' as const, price: 5999, instructor: 'Mike Portnoy', duration: '8 weeks', rating: 4.7, students: 189 },
    { title: 'Drum Practice Routines', level: 'Beginner' as const, price: 2799, instructor: 'Steve Smith', duration: '6 weeks', rating: 4.6, students: 1567 },
    { title: 'Funk Drumming', level: 'Intermediate' as const, price: 4299, instructor: 'John Bonham', duration: '8 weeks', rating: 4.8, students: 456 },
    { title: 'Drum Performance', level: 'Advanced' as const, price: 6999, instructor: 'Mike Portnoy', duration: '12 weeks', rating: 5.0, students: 123 },
    { title: 'Drum Kit Assembly', level: 'Beginner' as const, price: 1999, instructor: 'Dave Weckl', duration: '3 weeks', rating: 4.4, students: 678 },
    { title: 'Metal Drumming', level: 'Advanced' as const, price: 6499, instructor: 'Steve Smith', duration: '12 weeks', rating: 4.8, students: 234 },
    { title: 'Drum Timing & Groove', level: 'Intermediate' as const, price: 3799, instructor: 'Mike Portnoy', duration: '8 weeks', rating: 4.7, students: 567 },
    { title: 'Drum Fills & Licks', level: 'Advanced' as const, price: 5499, instructor: 'Dave Weckl', duration: '10 weeks', rating: 4.9, students: 189 },
    { title: 'Drum for Kids', level: 'Beginner' as const, price: 2499, instructor: 'Lisa Brown', duration: '8 weeks', rating: 4.6, students: 1234 },
    { title: 'Studio Drumming', level: 'Advanced' as const, price: 7499, instructor: 'Mike Portnoy', duration: '12 weeks', rating: 4.9, students: 89 },
    { title: 'Drum Independence', level: 'Intermediate' as const, price: 4299, instructor: 'Steve Smith', duration: '10 weeks', rating: 4.7, students: 345 },
    { title: 'Drum Maintenance', level: 'Beginner' as const, price: 1999, instructor: 'John Bonham', duration: '4 weeks', rating: 4.5, students: 456 }
  ]

  const vocalsCourses: BaseCourse[] = [
    { title: 'Vocal Fundamentals', level: 'Beginner' as const, price: 2999, instructor: 'Sarah Johnson', duration: '8 weeks', rating: 4.8, students: 2345 },
    { title: 'Breathing Techniques', level: 'Beginner' as const, price: 3499, instructor: 'Maria Garcia', duration: '6 weeks', rating: 4.9, students: 1678 },
    { title: 'Vocal Range Expansion', level: 'Intermediate' as const, price: 4499, instructor: 'Sarah Johnson', duration: '10 weeks', rating: 4.7, students: 890 },
    { title: 'Advanced Vocal Techniques', level: 'Advanced' as const, price: 5999, instructor: 'Maria Garcia', duration: '12 weeks', rating: 4.9, students: 456 },
    { title: 'Vocal Performance', level: 'Intermediate' as const, price: 4299, instructor: 'Sarah Johnson', duration: '8 weeks', rating: 4.6, students: 623 },
    { title: 'Vocal Health', level: 'Beginner' as const, price: 2799, instructor: 'Dr. Emily Chen', duration: '4 weeks', rating: 4.7, students: 1234 },
    { title: 'Opera Singing', level: 'Advanced' as const, price: 6999, instructor: 'Maria Garcia', duration: '16 weeks', rating: 5.0, students: 234 },
    { title: 'Pop Vocal Styles', level: 'Intermediate' as const, price: 4799, instructor: 'Sarah Johnson', duration: '8 weeks', rating: 4.8, students: 567 },
    { title: 'Vocal Harmony', level: 'Intermediate' as const, price: 3999, instructor: 'Lisa Brown', duration: '6 weeks', rating: 4.7, students: 345 },
    { title: 'Vocal Recording', level: 'Advanced' as const, price: 5499, instructor: 'Maria Garcia', duration: '8 weeks', rating: 4.8, students: 189 },
    { title: 'Vocal Warm-ups', level: 'Beginner' as const, price: 2499, instructor: 'Sarah Johnson', duration: '4 weeks', rating: 4.6, students: 1567 },
    { title: 'Jazz Vocals', level: 'Advanced' as const, price: 6499, instructor: 'Dr. Emily Chen', duration: '12 weeks', rating: 4.9, students: 123 },
    { title: 'Vocal Diction', level: 'Intermediate' as const, price: 3799, instructor: 'Maria Garcia', duration: '6 weeks', rating: 4.7, students: 456 },
    { title: 'Vocal Audition Prep', level: 'Advanced' as const, price: 5999, instructor: 'Sarah Johnson', duration: '8 weeks', rating: 4.8, students: 234 }
  ]

  const violinCourses: BaseCourse[] = [
    { title: 'Violin Fundamentals', level: 'Beginner' as const, price: 3499, instructor: 'Anna Petrov', duration: '10 weeks', rating: 4.8, students: 1234 },
    { title: 'Classical Violin Basics', level: 'Beginner' as const, price: 3999, instructor: 'Mikhail Ivanov', duration: '12 weeks', rating: 4.9, students: 890 },
    { title: 'Violin Technique', level: 'Intermediate' as const, price: 4999, instructor: 'Anna Petrov', duration: '12 weeks', rating: 4.7, students: 567 },
    { title: 'Advanced Violin Performance', level: 'Advanced' as const, price: 6999, instructor: 'Mikhail Ivanov', duration: '16 weeks', rating: 4.9, students: 234 },
    { title: 'Violin Sight Reading', level: 'Intermediate' as const, price: 4299, instructor: 'Anna Petrov', duration: '8 weeks', rating: 4.6, students: 445 },
    { title: 'Violin Maintenance', level: 'Beginner' as const, price: 2499, instructor: 'John Smith', duration: '4 weeks', rating: 4.5, students: 678 },
    { title: 'Baroque Violin', level: 'Advanced' as const, price: 7499, instructor: 'Mikhail Ivanov', duration: '14 weeks', rating: 5.0, students: 123 },
    { title: 'Violin Duets', level: 'Intermediate' as const, price: 4799, instructor: 'Anna Petrov', duration: '8 weeks', rating: 4.8, students: 345 },
    { title: 'Violin Concertos', level: 'Advanced' as const, price: 7999, instructor: 'Mikhail Ivanov', duration: '16 weeks', rating: 4.9, students: 89 },
    { title: 'Violin for Children', level: 'Beginner' as const, price: 2999, instructor: 'Lisa Brown', duration: '10 weeks', rating: 4.7, students: 1567 },
    { title: 'Violin Improvisation', level: 'Advanced' as const, price: 6999, instructor: 'Anna Petrov', duration: '12 weeks', rating: 4.8, students: 234 },
    { title: 'Violin Bowing Techniques', level: 'Intermediate' as const, price: 4499, instructor: 'Mikhail Ivanov', duration: '8 weeks', rating: 4.7, students: 456 },
    { title: 'Violin Vibrato', level: 'Intermediate' as const, price: 3999, instructor: 'Anna Petrov', duration: '6 weeks', rating: 4.6, students: 567 },
    { title: 'Violin Recording', level: 'Advanced' as const, price: 6499, instructor: 'Mikhail Ivanov', duration: '8 weeks', rating: 4.8, students: 189 },
    { title: 'Violin Ensemble', level: 'Intermediate' as const, price: 5299, instructor: 'Anna Petrov', duration: '10 weeks', rating: 4.7, students: 345 },
    { title: 'Violin Music Theory', level: 'Beginner' as const, price: 3299, instructor: 'Emma Wilson', duration: '8 weeks', rating: 4.6, students: 678 },
    { title: 'Violin Performance Anxiety', level: 'Intermediate' as const, price: 3799, instructor: 'Dr. Sarah Lee', duration: '6 weeks', rating: 4.7, students: 234 },
    { title: 'Violin Repertoire', level: 'Advanced' as const, price: 7499, instructor: 'Mikhail Ivanov', duration: '12 weeks', rating: 4.9, students: 123 }
  ]

  const musicTheoryCourses: BaseCourse[] = [
    { title: 'Music Theory Fundamentals', level: 'Beginner' as const, price: 2499, instructor: 'Dr. Robert Chen', duration: '8 weeks', rating: 4.8, students: 3456 },
    { title: 'Basic Harmony', level: 'Beginner' as const, price: 2999, instructor: 'Dr. Sarah Williams', duration: '10 weeks', rating: 4.7, students: 2345 },
    { title: 'Advanced Harmony', level: 'Advanced' as const, price: 4999, instructor: 'Dr. Robert Chen', duration: '12 weeks', rating: 4.9, students: 678 },
    { title: 'Counterpoint', level: 'Advanced' as const, price: 5499, instructor: 'Dr. Sarah Williams', duration: '14 weeks', rating: 4.8, students: 345 },
    { title: 'Music Analysis', level: 'Intermediate' as const, price: 3999, instructor: 'Dr. Robert Chen', duration: '8 weeks', rating: 4.6, students: 890 },
    { title: 'Orchestration', level: 'Advanced' as const, price: 6999, instructor: 'Dr. Sarah Williams', duration: '16 weeks', rating: 4.9, students: 234 },
    { title: 'Jazz Theory', level: 'Intermediate' as const, price: 4499, instructor: 'Dr. Robert Chen', duration: '10 weeks', rating: 4.7, students: 567 },
    { title: 'Pop Music Theory', level: 'Beginner' as const, price: 2799, instructor: 'Emma Wilson', duration: '6 weeks', rating: 4.6, students: 1234 },
    { title: 'Sight Singing', level: 'Intermediate' as const, price: 3299, instructor: 'Dr. Sarah Williams', duration: '8 weeks', rating: 4.7, students: 678 },
    { title: 'Ear Training', level: 'Beginner' as const, price: 2999, instructor: 'Dr. Robert Chen', duration: '10 weeks', rating: 4.8, students: 1567 },
    { title: 'Music Composition', level: 'Advanced' as const, price: 6499, instructor: 'Dr. Sarah Williams', duration: '12 weeks', rating: 4.9, students: 345 },
    { title: 'Songwriting', level: 'Intermediate' as const, price: 4299, instructor: 'Dr. Robert Chen', duration: '8 weeks', rating: 4.7, students: 789 },
    { title: 'Music History', level: 'Beginner' as const, price: 2499, instructor: 'Emma Wilson', duration: '8 weeks', rating: 4.6, students: 2345 },
    { title: 'World Music Theory', level: 'Intermediate' as const, price: 3799, instructor: 'Dr. Robert Chen', duration: '10 weeks', rating: 4.7, students: 456 },
    { title: 'Electronic Music Theory', level: 'Intermediate' as const, price: 4299, instructor: 'Dr. Sarah Williams', duration: '8 weeks', rating: 4.8, students: 567 },
    { title: 'Film Scoring', level: 'Advanced' as const, price: 7499, instructor: 'Dr. Robert Chen', duration: '14 weeks', rating: 4.9, students: 189 },
    { title: 'Music Production', level: 'Intermediate' as const, price: 4999, instructor: 'Dr. Sarah Williams', duration: '10 weeks', rating: 4.7, students: 345 },
    { title: 'Music Arranging', level: 'Advanced' as const, price: 6499, instructor: 'Dr. Robert Chen', duration: '12 weeks', rating: 4.8, students: 234 },
    { title: 'Music Notation', level: 'Beginner' as const, price: 2299, instructor: 'Emma Wilson', duration: '6 weeks', rating: 4.5, students: 1234 },
    { title: 'Music Form & Structure', level: 'Intermediate' as const, price: 3799, instructor: 'Dr. Sarah Williams', duration: '8 weeks', rating: 4.7, students: 456 },
    { title: 'Music Technology', level: 'Intermediate' as const, price: 4299, instructor: 'Dr. Robert Chen', duration: '10 weeks', rating: 4.6, students: 678 },
    { title: 'Music Pedagogy', level: 'Advanced' as const, price: 6999, instructor: 'Dr. Sarah Williams', duration: '12 weeks', rating: 4.8, students: 189 },
    { title: 'Music Research', level: 'Advanced' as const, price: 5999, instructor: 'Dr. Robert Chen', duration: '8 weeks', rating: 4.7, students: 123 },
    { title: 'Music Business', level: 'Intermediate' as const, price: 4299, instructor: 'Emma Wilson', duration: '8 weeks', rating: 4.6, students: 345 },
    { title: 'Music Psychology', level: 'Beginner' as const, price: 3299, instructor: 'Dr. Sarah Williams', duration: '6 weeks', rating: 4.7, students: 456 }
  ]

  const bassGuitarCourses: BaseCourse[] = [
    { title: 'Bass Guitar Fundamentals', level: 'Beginner' as const, price: 2799, instructor: 'John Paul Jones', duration: '8 weeks', rating: 4.8, students: 1567 },
    { title: 'Rock Bass Basics', level: 'Beginner' as const, price: 3299, instructor: 'Flea', duration: '10 weeks', rating: 4.7, students: 1234 },
    { title: 'Jazz Bass Techniques', level: 'Advanced' as const, price: 5499, instructor: 'John Paul Jones', duration: '14 weeks', rating: 4.9, students: 456 },
    { title: 'Bass Groove Mastery', level: 'Intermediate' as const, price: 3999, instructor: 'Flea', duration: '10 weeks', rating: 4.6, students: 678 },
    { title: 'Slap Bass Techniques', level: 'Advanced' as const, price: 5999, instructor: 'John Paul Jones', duration: '8 weeks', rating: 4.8, students: 234 },
    { title: 'Bass Music Theory', level: 'Beginner' as const, price: 2999, instructor: 'Emma Wilson', duration: '8 weeks', rating: 4.7, students: 890 },
    { title: 'Funk Bass Styles', level: 'Intermediate' as const, price: 4499, instructor: 'Flea', duration: '8 weeks', rating: 4.8, students: 345 },
    { title: 'Bass Soloing', level: 'Advanced' as const, price: 6499, instructor: 'John Paul Jones', duration: '12 weeks', rating: 4.9, students: 189 },
    { title: 'Bass Recording', level: 'Intermediate' as const, price: 3799, instructor: 'Flea', duration: '6 weeks', rating: 4.7, students: 456 },
    { title: 'Bass for Beginners', level: 'Beginner' as const, price: 2499, instructor: 'Lisa Brown', duration: '8 weeks', rating: 4.6, students: 1345 },
    { title: 'Advanced Bass Techniques', level: 'Advanced' as const, price: 6999, instructor: 'John Paul Jones', duration: '12 weeks', rating: 4.8, students: 123 },
    { title: 'Bass Performance', level: 'Intermediate' as const, price: 4299, instructor: 'Flea', duration: '8 weeks', rating: 4.7, students: 345 },
    { title: 'Bass Maintenance', level: 'Beginner' as const, price: 1999, instructor: 'John Smith', duration: '4 weeks', rating: 4.5, students: 567 },
    { title: 'Metal Bass', level: 'Advanced' as const, price: 6499, instructor: 'John Paul Jones', duration: '10 weeks', rating: 4.9, students: 189 },
    { title: 'Blues Bass', level: 'Intermediate' as const, price: 3799, instructor: 'Flea', duration: '8 weeks', rating: 4.7, students: 456 },
    { title: 'Latin Bass', level: 'Intermediate' as const, price: 4299, instructor: 'John Paul Jones', duration: '10 weeks', rating: 4.8, students: 234 },
    { title: 'Bass Improvisation', level: 'Advanced' as const, price: 6999, instructor: 'Flea', duration: '12 weeks', rating: 4.9, students: 89 },
    { title: 'Bass Rhythm', level: 'Intermediate' as const, price: 3499, instructor: 'John Paul Jones', duration: '8 weeks', rating: 4.6, students: 345 },
    { title: 'Bass Effects', level: 'Intermediate' as const, price: 3799, instructor: 'Flea', duration: '6 weeks', rating: 4.7, students: 234 },
    { title: 'Bass Ensemble', level: 'Advanced' as const, price: 5999, instructor: 'John Paul Jones', duration: '10 weeks', rating: 4.8, students: 156 },
    { title: 'Studio Bass', level: 'Advanced' as const, price: 7499, instructor: 'Flea', duration: '12 weeks', rating: 4.9, students: 67 },
    { title: 'Bass Songwriting', level: 'Intermediate' as const, price: 4299, instructor: 'John Paul Jones', duration: '8 weeks', rating: 4.7, students: 234 },
    { title: 'Bass Sight Reading', level: 'Intermediate' as const, price: 3299, instructor: 'Flea', duration: '6 weeks', rating: 4.6, students: 345 },
    { title: 'Bass for Kids', level: 'Beginner' as const, price: 2299, instructor: 'Lisa Brown', duration: '8 weeks', rating: 4.6, students: 1234 },
    { title: 'Bass Audition Prep', level: 'Advanced' as const, price: 5999, instructor: 'John Paul Jones', duration: '8 weeks', rating: 4.8, students: 123 },
    { title: 'Bass Practice Routines', level: 'Beginner' as const, price: 2799, instructor: 'Flea', duration: '6 weeks', rating: 4.7, students: 456 },
    { title: 'Bass Performance Anxiety', level: 'Intermediate' as const, price: 3299, instructor: 'Dr. Sarah Lee', duration: '6 weeks', rating: 4.6, students: 234 },
    { title: 'Bass Repertoire', level: 'Advanced' as const, price: 6999, instructor: 'John Paul Jones', duration: '12 weeks', rating: 4.9, students: 89 }
  ]

  const saxophoneCourses: BaseCourse[] = [
    { title: 'Saxophone Fundamentals', level: 'Beginner' as const, price: 3299, instructor: 'Charlie Parker', duration: '10 weeks', rating: 4.8, students: 890 },
    { title: 'Jazz Saxophone', level: 'Advanced' as const, price: 5999, instructor: 'John Coltrane', duration: '16 weeks', rating: 4.9, students: 234 },
    { title: 'Saxophone Technique', level: 'Intermediate' as const, price: 4299, instructor: 'Charlie Parker', duration: '12 weeks', rating: 4.7, students: 456 },
    { title: 'Classical Saxophone', level: 'Advanced' as const, price: 6499, instructor: 'John Coltrane', duration: '14 weeks', rating: 4.8, students: 189 },
    { title: 'Saxophone Maintenance', level: 'Beginner' as const, price: 2499, instructor: 'Mike Smith', duration: '4 weeks', rating: 4.5, students: 678 },
    { title: 'Saxophone Improvisation', level: 'Advanced' as const, price: 6999, instructor: 'Charlie Parker', duration: '12 weeks', rating: 4.9, students: 123 },
    { title: 'Saxophone Performance', level: 'Intermediate' as const, price: 4799, instructor: 'John Coltrane', duration: '8 weeks', rating: 4.7, students: 345 },
    { title: 'Saxophone Recording', level: 'Advanced' as const, price: 5999, instructor: 'Charlie Parker', duration: '8 weeks', rating: 4.8, students: 189 },
    { title: 'Saxophone for Beginners', level: 'Beginner' as const, price: 2799, instructor: 'Lisa Brown', duration: '8 weeks', rating: 4.6, students: 1234 },
    { title: 'Advanced Saxophone', level: 'Advanced' as const, price: 7499, instructor: 'John Coltrane', duration: '16 weeks', rating: 5.0, students: 67 },
    { title: 'Saxophone Ensemble', level: 'Intermediate' as const, price: 5299, instructor: 'Charlie Parker', duration: '10 weeks', rating: 4.7, students: 234 },
    { title: 'Saxophone Music Theory', level: 'Beginner' as const, price: 2999, instructor: 'Emma Wilson', duration: '8 weeks', rating: 4.6, students: 456 },
    { title: 'Saxophone Styles', level: 'Intermediate' as const, price: 4299, instructor: 'John Coltrane', duration: '8 weeks', rating: 4.7, students: 345 },
    { title: 'Saxophone Practice', level: 'Beginner' as const, price: 2499, instructor: 'Charlie Parker', duration: '6 weeks', rating: 4.6, students: 567 },
    { title: 'Saxophone Audition Prep', level: 'Advanced' as const, price: 5999, instructor: 'John Coltrane', duration: '8 weeks', rating: 4.8, students: 123 },
    { title: 'Saxophone Repertoire', level: 'Advanced' as const, price: 6999, instructor: 'Charlie Parker', duration: '12 weeks', rating: 4.9, students: 89 },
    { title: 'Saxophone Breathing', level: 'Beginner' as const, price: 2299, instructor: 'Dr. Sarah Lee', duration: '4 weeks', rating: 4.5, students: 345 },
    { title: 'Saxophone Effects', level: 'Intermediate' as const, price: 3799, instructor: 'John Coltrane', duration: '6 weeks', rating: 4.7, students: 234 },
    { title: 'Saxophone Performance Anxiety', level: 'Intermediate' as const, price: 3299, instructor: 'Dr. Sarah Lee', duration: '6 weeks', rating: 4.6, students: 189 }
  ]

  // Add all courses to the array with proper IDs
  const courseArrays = [
    { courses: pianoCourses, category: 'piano' },
    { courses: guitarCourses, category: 'guitar' },
    { courses: drumsCourses, category: 'drums' },
    { courses: vocalsCourses, category: 'vocals' },
    { courses: violinCourses, category: 'violin' },
    { courses: musicTheoryCourses, category: 'music-theory' },
    { courses: bassGuitarCourses, category: 'bass-guitar' },
    { courses: saxophoneCourses, category: 'saxophone' }
  ]

  courseArrays.forEach(({ courses, category }) => {
    const transformedCourses = courses.map((course, index) => ({
      ...course,
      id: `${category}-${index + 1}`,
      category,
      image: `/api/placeholder/300/200`,
      description: `Master ${course.title.toLowerCase()} with expert guidance and comprehensive curriculum designed for ${course.level.toLowerCase()} students.`
    }))
    courses.push(...transformedCourses)
  })

  // Flatten all course arrays
  courseArrays.forEach(({ courses }) => {
    courses.forEach((course) => {
      courses.push(course)
    })
  })

  return [
    ...pianoCourses.map((c, i) => ({ ...c, id: `piano-${i + 1}`, category: 'piano', image: '/api/placeholder/300/200', description: `Master ${c.title.toLowerCase()} with expert guidance.` })),
    ...guitarCourses.map((c, i) => ({ ...c, id: `guitar-${i + 1}`, category: 'guitar', image: '/api/placeholder/300/200', description: `Master ${c.title.toLowerCase()} with expert guidance.` })),
    ...drumsCourses.map((c, i) => ({ ...c, id: `drums-${i + 1}`, category: 'drums', image: '/api/placeholder/300/200', description: `Master ${c.title.toLowerCase()} with expert guidance.` })),
    ...vocalsCourses.map((c, i) => ({ ...c, id: `vocals-${i + 1}`, category: 'vocals', image: '/api/placeholder/300/200', description: `Master ${c.title.toLowerCase()} with expert guidance.` })),
    ...violinCourses.map((c, i) => ({ ...c, id: `violin-${i + 1}`, category: 'violin', image: '/api/placeholder/300/200', description: `Master ${c.title.toLowerCase()} with expert guidance.` })),
    ...musicTheoryCourses.map((c, i) => ({ ...c, id: `music-theory-${i + 1}`, category: 'music-theory', image: '/api/placeholder/300/200', description: `Master ${c.title.toLowerCase()} with expert guidance.` })),
    ...bassGuitarCourses.map((c, i) => ({ ...c, id: `bass-guitar-${i + 1}`, category: 'bass-guitar', image: '/api/placeholder/300/200', description: `Master ${c.title.toLowerCase()} with expert guidance.` })),
    ...saxophoneCourses.map((c, i) => ({ ...c, id: `saxophone-${i + 1}`, category: 'saxophone', image: '/api/placeholder/300/200', description: `Master ${c.title.toLowerCase()} with expert guidance.` }))
  ]
}

export const getAllCourses = (): Course[] => {
  return generateCourses()
}

export const getCoursesByCategory = (category: string): Course[] => {
  const allCourses = getAllCourses()
  return allCourses.filter(course => course.category === category)
}

export const getCategoryDisplayName = (category: string): string => {
  const names: { [key: string]: string } = {
    'piano': 'Piano',
    'guitar': 'Guitar',
    'drums': 'Drums',
    'vocals': 'Vocals',
    'violin': 'Violin',
    'music-theory': 'Music Theory',
    'bass-guitar': 'Bass Guitar',
    'saxophone': 'Saxophone'
  }
  return names[category] || category
}
