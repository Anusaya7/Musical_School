"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const prisma_1 = require("../lib/generated/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new prisma_1.PrismaClient({ adapter });
// Level templates from coursesData.ts
const LEVEL_TEMPLATES = {
    BEGINNER: {
        about: `Has your child been learning for the past six months? The 2nd Inversion Method Book 1 course is designed to strengthen their musical foundation while introducing more advanced concepts in a structured and engaging way.

This course focuses on developing technical accuracy, musical expression, rhythmic understanding, and overall proficiency. Students will explore major and minor scales, chord inversions, syncopation, swing rhythm, key signatures, and repertoire development while building confidence in performance and musicianship.`,
        prerequisites: [
            'Understanding of basic fundamentals',
            'Completion of foundation-level concepts or equivalent experience'
        ],
        topicsCovered: [
            'Techniques and hand coordination',
            'Major scales and scale practice',
            'Primary chords and chord inversions',
            'Introduction to voice training and ear development',
            'Key signatures and syncopation',
            'Playing in the keys of C, G, and F Major',
            'Minor keys and transposition',
            'Swing rhythm and rhythmic interpretation',
            'Repertoire and song development'
        ],
        learningOutcomes: [
            'Demonstrate proper techniques for expressive and efficient playing',
            'Perform confidently in multiple major and minor keys',
            'Understand and apply chords, voicings, chord progressions, and inversions',
            'Apply musical concepts such as syncopation and swing rhythm',
            'Read and perform rhythms involving 16th notes accurately',
            'Develop left-hand accompaniment patterns',
            'Build a strong repertoire of performance-ready pieces'
        ],
        curriculum: [
            {
                moduleName: 'Module 1: Foundation & Technique',
                topics: ['Posture and hand positioning', 'Finger exercises and dexterity', 'Basic music notation review', 'Introduction to major scales']
            },
            {
                moduleName: 'Module 2: Chords & Harmony',
                topics: ['Primary chords in C Major', 'Chord inversions', 'Left-hand accompaniment patterns', 'Simple chord progressions']
            },
            {
                moduleName: 'Module 3: Rhythm & Timing',
                topics: ['Syncopation basics', 'Swing rhythm introduction', '16th note patterns', 'Rhythmic exercises']
            },
            {
                moduleName: 'Module 4: Repertoire Development',
                topics: ['Song selection and practice', 'Performance techniques', 'Expression and dynamics', 'Final performance preparation']
            }
        ]
    },
    INTERMEDIATE: {
        about: `Take your journey to the next level with the Spardha Method Book 2 course. Designed for students with over 18 months of learning experience, this course develops stronger technical skills, musical understanding, and performance confidence.

Students will explore advanced scales, new major and minor keys, blues progressions, rhythm techniques, and arpeggios while learning to perform a wider variety of repertoire.`,
        prerequisites: [
            'Beginner to intermediate-level playing skills',
            'Understanding of basic techniques and music fundamentals'
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
            }
        ]
    },
    ADVANCED: {
        about: `Step into the world of advanced performance with the 2nd Inversion Music Method Book 3 course.

This course focuses on refining technical mastery, musical expression, improvisation, and advanced harmonic understanding.

Students will explore advanced scales, extended chords, sophisticated rhythm patterns, and arpeggio-based accompaniment techniques.`,
        prerequisites: [
            'Successful completion of intermediate-level training',
            'Strong understanding of scales, chords, and rhythm concepts'
        ],
        topicsCovered: [
            'Advanced major and minor scales',
            'Harmonic and melodic minor scales',
            'Extended chords including Add9, Add13, and Suspended chords',
            'Advanced chord progressions',
            'Advanced hand positions and voicings',
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
            }
        ]
    }
};
function customizeText(text, instName) {
    let res = text.replace(/piano/g, instName.toLowerCase());
    res = res.replace(/Piano/g, instName);
    if (instName.toLowerCase() !== 'piano') {
        res = res.replace(/keyboard/g, instName.toLowerCase());
        res = res.replace(/Keyboard/g, instName);
    }
    return res;
}
async function seedCourseDetails(courseId, instName, levelUpper) {
    const levelKey = levelUpper === prisma_1.CourseLevel.BEGINNER ? 'BEGINNER' : levelUpper === prisma_1.CourseLevel.INTERMEDIATE ? 'INTERMEDIATE' : 'ADVANCED';
    const template = LEVEL_TEMPLATES[levelKey];
    const about = customizeText(template.about, instName);
    const prerequisites = template.prerequisites.map(p => customizeText(p, instName));
    const topicsCovered = template.topicsCovered.map(t => customizeText(t, instName));
    const learningOutcomes = template.learningOutcomes.map(l => customizeText(l, instName));
    const curriculumModules = template.curriculum.map(m => ({
        moduleName: customizeText(m.moduleName, instName),
        topics: m.topics.map(t => customizeText(t, instName))
    }));
    // Create CourseContent
    await prisma.courseContent.create({
        data: {
            courseId,
            about
        }
    });
    // Create Prerequisites
    if (prerequisites.length > 0) {
        await prisma.prerequisite.createMany({
            data: prerequisites.map(req => ({
                courseId,
                requirement: req
            }))
        });
    }
    // Create TopicsCovered
    if (topicsCovered.length > 0) {
        await prisma.topicsCovered.createMany({
            data: topicsCovered.map(topic => ({
                courseId,
                topic
            }))
        });
    }
    // Create LearningOutcomes
    if (learningOutcomes.length > 0) {
        await prisma.learningOutcome.createMany({
            data: learningOutcomes.map(outcome => ({
                courseId,
                outcome
            }))
        });
    }
    // Create Curriculum
    const curriculum = await prisma.curriculum.create({
        data: {
            courseId
        }
    });
    // Create Curriculum modules from template
    for (const mod of curriculumModules) {
        await prisma.curriculumModule.create({
            data: {
                curriculumId: curriculum.id,
                moduleName: mod.moduleName,
                topics: mod.topics
            }
        });
    }
    // Seed reviews
    const reviewsData = [
        { name: 'Sarah M.', rating: 5, comment: `This ${instName.toLowerCase()} course is wonderful! The structured lessons made it so easy to follow.` },
        { name: 'David K.', rating: 5, comment: `Excellent materials and guidance. Ajinkya is a phenomenal teacher.` }
    ];
    for (const rev of reviewsData) {
        await prisma.review.create({
            data: {
                courseId,
                name: rev.name,
                rating: rev.rating,
                comment: rev.comment
            }
        });
    }
}
async function main() {
    console.log('Checking database status for seeding...');
    console.log('PrismaClient import type:', typeof prisma_1.PrismaClient);
    console.log('prisma instance type:', typeof prisma);
    console.log('prisma keys at runtime:', Object.keys(prisma));
    console.log('prisma.instructor value:', prisma.instructor);
    // 1. Seed Instructor
    const instructorEmail = 'aamrule90@gmail.com';
    
    // Clear duplicates before seeding to prevent PK/Unique constraints failures
    await prisma.instructor.deleteMany({ where: { id: 'instructor-1' } });
    await prisma.instructor.deleteMany({ where: { email: instructorEmail } });

    let instructor = await prisma.instructor.findUnique({
        where: { email: instructorEmail }
    });
    if (!instructor) {
        console.log('Seeding default instructor Ajinkya Amrule...');
        instructor = await prisma.instructor.create({
            data: {
                id: 'instructor-1',
                name: 'Ajinkya Amrule',
                email: instructorEmail,
                expertise: 'Piano, Guitar, Vocals, Music Theory, Bass Guitar',
                rating: 4.9,
                students: 500,
                avatar: 'AA',
                isActive: true,
                certificates: ['Trinity College London Certified', 'Associated Board of the Royal Schools of Music (ABRSM)'],
                role: 'Senior Music Instructor',
                experience: '10+ Years',
                bio: 'Professional music educator dedicated to Trinity, Guildhall and modern performance training.',
                photo: '/images/instructor_portrait.jpg'
            }
        });
    }
    else {
        // Make sure details are updated to match requirements
        instructor = await prisma.instructor.update({
            where: { email: instructorEmail },
            data: {
                expertise: 'Piano, Guitar, Vocals, Music Theory, Bass Guitar',
                rating: 4.9,
                students: 500,
                certificates: ['Trinity College London Certified', 'Associated Board of the Royal Schools of Music (ABRSM)'],
                role: 'Senior Music Instructor',
                experience: '10+ Years',
                bio: 'Professional music educator dedicated to Trinity, Guildhall and modern performance training.',
                photo: '/images/instructor_portrait.jpg'
            }
        });
    }
    // 2. Seed Users
    const adminEmail = 'aamrule90@gmail.com';
    const studentEmail = 'student@2ndinversion.com';
    
    // Clear user IDs & emails first to prevent conflicts during seed runs
    await prisma.user.deleteMany({ where: { id: { in: ['admin-1', 'student-1', 'inst-user-1'] } } });
    await prisma.user.deleteMany({ where: { email: { in: [adminEmail, studentEmail] } } });
    
    console.log('Seeding default Admin/Instructor user...');
    const adminHash = await bcryptjs_1.default.hash('Ajinkya@123', 10);
    await prisma.user.create({
        data: {
            id: 'admin-1',
            name: 'Ajinkya Amrule',
            email: adminEmail,
            passwordHash: adminHash,
            role: 'SUPER_ADMIN',
            isVerified: true,
            status: 'Active'
        }
    });

    // Seed Admin details table
    await prisma.admin.deleteMany({ where: { email: adminEmail } });
    await prisma.admin.create({
        data: {
            id: 'admin-profile-1',
            name: 'Ajinkya Amrule',
            email: adminEmail,
            phone: '+91 77688 38832',
            isActive: true
        }
    });

    const studentUser = await prisma.user.findUnique({ where: { email: studentEmail } });
    if (!studentUser) {
        console.log('Seeding student user...');
        const studHash = await bcryptjs_1.default.hash('Student@123', 10);
        await prisma.user.create({
            data: {
                id: 'student-1',
                name: 'John Doe',
                email: studentEmail,
                passwordHash: studHash,
                role: 'STUDENT',
                isVerified: true,
                status: 'Active',
                enrolledCourses: ['piano-beginner']
            }
        });
    }
    // 3. Clear existing Category/Course and details to prevent primary key conflicts or duplicate records.
    console.log('Cleaning existing courses and instruments database tables...');
    await prisma.courseContent.deleteMany();
    await prisma.curriculumModule.deleteMany();
    await prisma.curriculum.deleteMany();
    await prisma.learningOutcome.deleteMany();
    await prisma.prerequisite.deleteMany();
    await prisma.topicsCovered.deleteMany();
    await prisma.review.deleteMany();
    await prisma.course.deleteMany();
    await prisma.instrument.deleteMany();
    console.log('Seeding categories and courses catalog...');
    const instrumentsData = [
        { id: 'piano', name: 'Piano', slug: 'piano', icon: 'M9 19V6l12-3v13', description: 'Master classical to modern piano techniques.', status: 'ACTIVE', isFeatured: true, image: '/instruments/piano.jpg', coursesCount: 3, startingPrice: 4999, levels: ['Beginner', 'Intermediate', 'Advanced'] },
        { id: 'guitar', name: 'Guitar', slug: 'guitar', icon: 'M9 19V6l12-3v13', description: 'Learn acoustic, electric, and bass guitar.', status: 'ACTIVE', isFeatured: true, image: '/instruments/guitar.jpg', coursesCount: 3, startingPrice: 4999, levels: ['Beginner', 'Intermediate', 'Advanced'] },
        { id: 'drums', name: 'Drums', slug: 'drums', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z', description: 'Develop rhythm, timing, and drumming patterns.', status: 'ACTIVE', isFeatured: false, image: '/instruments/drums.jpg', coursesCount: 3, startingPrice: 4999, levels: ['Beginner', 'Intermediate', 'Advanced'] },
        { id: 'vocals', name: 'Vocals', slug: 'vocals', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7', description: 'Train your voice and build confidence.', status: 'ACTIVE', isFeatured: false, image: '/instruments/vocals.jpg', coursesCount: 3, startingPrice: 4999, levels: ['Beginner', 'Intermediate', 'Advanced'] },
        { id: 'violin', name: 'Violin', slug: 'violin', icon: 'M9 19V6l12-3v13', description: 'Learn bowing, posture, and beautiful classical repertoire.', status: 'ACTIVE', isFeatured: false, image: '/instruments/violin.jpg', coursesCount: 3, startingPrice: 4999, levels: ['Beginner', 'Intermediate', 'Advanced'] },
        { id: 'music-theory', name: 'Music Theory', slug: 'music-theory', icon: 'M12 6.253v13', description: 'Understand notes, reading, notation, and harmony.', status: 'ACTIVE', isFeatured: false, image: '/instruments/music-theory.jpg', coursesCount: 3, startingPrice: 4999, levels: ['Beginner', 'Intermediate', 'Advanced'] },
        { id: 'bass-guitar', name: 'Bass Guitar', slug: 'bass-guitar', icon: 'M9 19V6l12-3v13', description: 'Lay the low end foundation with proper techniques.', status: 'ACTIVE', isFeatured: false, image: '/instruments/bass-guitar.jpg', coursesCount: 3, startingPrice: 4999, levels: ['Beginner', 'Intermediate', 'Advanced'] },
        { id: 'saxophone', name: 'Saxophone', slug: 'saxophone', icon: 'M9 19V6l12-3v13', description: 'Breathe life into jazz, blues, and classical solos.', status: 'COMING_SOON', isFeatured: false, isUpcoming: true, image: '/instruments/saxophone.jpg', coursesCount: 0, startingPrice: 4999, levels: [] }
    ];
    for (const instData of instrumentsData) {
        const instrument = await prisma.instrument.create({
            data: {
                id: instData.id,
                name: instData.name,
                slug: instData.slug,
                icon: instData.icon,
                description: instData.description,
                image: instData.image,
                status: instData.status,
                isFeatured: instData.isFeatured,
                isUpcoming: instData.isUpcoming || false,
                isVisible: true,
                coursesCount: instData.coursesCount,
                startingPrice: instData.startingPrice,
                levels: instData.levels
            }
        });
        // Saxophone remains upcoming without levels
        if (instData.id === 'saxophone') {
            continue;
        }
        // Seed 3 levels for active instruments
        const levels = [
            {
                level: prisma_1.CourseLevel.BEGINNER,
                title: `${instData.name} Beginner`,
                slug: `${instData.slug}-beginner`,
                duration: '3 Months',
                price: 4999,
                lessons: 24,
                projects: 3,
                assignments: 5,
                difficulty: prisma_1.CourseDifficulty.EASY,
                maxStudents: 30,
                description: `Build a strong ${instData.name.toLowerCase()} foundation with posture, note reading, scales, and your first performance pieces.`
            },
            {
                level: prisma_1.CourseLevel.INTERMEDIATE,
                title: `${instData.name} Intermediate`,
                slug: `${instData.slug}-intermediate`,
                duration: '4 Months',
                price: 6999,
                lessons: 32,
                projects: 4,
                assignments: 7,
                difficulty: prisma_1.CourseDifficulty.MEDIUM,
                maxStudents: 25,
                description: `Develop expressive playing, chord voicings, sight-reading fluency, and stylistic versatility in ${instData.name.toLowerCase()}.`
            },
            {
                level: prisma_1.CourseLevel.ADVANCED,
                title: `${instData.name} Advanced`,
                slug: `${instData.slug}-advanced`,
                duration: '6 Months',
                price: 9999,
                lessons: 48,
                projects: 6,
                assignments: 10,
                difficulty: prisma_1.CourseDifficulty.HARD,
                maxStudents: 20,
                description: `Master advanced repertoire, improvisation, performance technique, and professional-level musicianship in ${instData.name.toLowerCase()}.`
            }
        ];
        for (const lvl of levels) {
            await prisma.course.create({
                data: {
                    id: `${instData.id}-${lvl.level.toLowerCase()}`,
                    instrumentId: instrument.id,
                    title: lvl.title,
                    slug: lvl.slug,
                    level: lvl.level,
                    description: lvl.description,
                    duration: lvl.duration,
                    price: lvl.price,
                    discountPrice: lvl.price * 0.9,
                    instructorId: instructor.id,
                    thumbnail: `/courses/${instData.id}-${lvl.level.toLowerCase()}.jpg`,
                    banner: `/courses/${instData.id}-${lvl.level.toLowerCase()}-banner.jpg`,
                    maxStudents: lvl.maxStudents,
                    language: 'English',
                    difficulty: lvl.difficulty,
                    certificateAvailable: true,
                    status: prisma_1.CourseStatus.PUBLISHED,
                    publishDate: new Date(),
                    lessons: lvl.lessons,
                    projects: lvl.projects,
                    assignments: lvl.assignments,
                    curriculum: '["Fundamentals & Posture","Scales & Key Signatures","Practice Exercises","Performance Repertoire","Final Assignment"]'
                }
            });
            const courseId = `${instData.id}-${lvl.level.toLowerCase()}`;
            console.log(`Seeding course: ${courseId}...`);
            await seedCourseDetails(courseId, instData.name, lvl.level);
        }
    }
    console.log('Seeding finished successfully!');
    // Seed recent activities in AuditLog
    console.log('Seeding recent activities (AuditLog)...');
    await prisma.auditLog.deleteMany();
    const now = Date.now();
    await prisma.auditLog.createMany({
        data: [
            {
                userEmail: 'admin@musicalschool.com',
                action: 'New Piano Booking Registered',
                details: 'Aarav Mehta booked Piano Beginner',
                createdAt: new Date(now - 10 * 60 * 1000) // 10 mins ago
            },
            {
                userEmail: 'admin@musicalschool.com',
                action: 'Workshop Created Successfully',
                details: 'Classical Piano Masterclass initialized',
                createdAt: new Date(now - 60 * 60 * 1000) // 1 hour ago
            },
            {
                userEmail: 'admin@musicalschool.com',
                action: 'Recording Uploaded to Library',
                details: 'Piano Posture Alignment video published',
                createdAt: new Date(now - 3 * 60 * 60 * 1000) // 3 hours ago
            },
            {
                userEmail: 'admin@musicalschool.com',
                action: 'New Student Registered',
                details: 'Kabir Kapoor registered for Vocals',
                createdAt: new Date(now - 24 * 60 * 60 * 1000) // 1 day ago
            },
            {
                userEmail: 'admin@musicalschool.com',
                action: 'Course Price Updated',
                details: 'Guitar Beginner price adjusted to ₹4,999',
                createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000) // 2 days ago
            }
        ]
    });
}
main()
    .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
