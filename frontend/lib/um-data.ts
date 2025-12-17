// University of Mindanao Colleges and Programs Data
export const UM_COLLEGES = [
    {
        code: 'CAE',
        name: 'College of Accounting Education',
        programs: [
            'BS Accountancy',
            'BS Accounting Information System',
            'BS Management Accounting',
        ],
    },
    {
        code: 'CAFAE',
        name: 'College of Architecture and Fine Arts Education',
        programs: [
            'BS Architecture',
            'BFA & Design Major in Painting',
            'BS Interior Design',
        ],
    },
    {
        code: 'CASE',
        name: 'College of Arts and Sciences Education',
        programs: [
            'BA Communication',
            'BA English',
            'BA Political Science',
            'BS Agroforestry',
            'BS Biology (Ecology)',
            'BS Environmental Science',
            'BS Forestry',
            'BS Psychology',
            'BS Social Work',
        ],
    },
    {
        code: 'CBAE',
        name: 'College of Business Administration Education',
        programs: [
            'BS Business Administration – Business Economics',
            'BS Business Administration – Financial Management',
            'BS Business Administration – Human Resource Management',
            'BS Business Administration – Marketing Management',
            'BS Entrepreneurship',
            'BS Legal Management',
            'BS Real Estate Management',
        ],
    },
    {
        code: 'CCE',
        name: 'College of Computing Education',
        programs: [
            'BS Computer Science',
            'BS Information Technology',
            'BS Entertainment & Multimedia Computing',
            'BS Multimedia Arts',
            'BS Library & Information Science',
        ],
    },
    {
        code: 'CCJE',
        name: 'College of Criminal Justice Education',
        programs: ['BS Criminology'],
    },
    {
        code: 'CEE',
        name: 'College of Engineering Education',
        programs: [
            'BS Chemical Engineering',
            'BS Civil Engineering – Geotechnical',
            'BS Civil Engineering – Structural',
            'BS Civil Engineering – Transportation',
            'BS Computer Engineering',
            'BS Electrical Engineering',
            'BS Electronics Engineering',
            'BS Materials Engineering',
            'BS Mechanical Engineering',
        ],
    },
    {
        code: 'CHE',
        name: 'College of Hospitality Education',
        programs: ['BS Hospitality Management', 'BS Tourism Management'],
    },
    {
        code: 'CHSE',
        name: 'College of Health Sciences Education',
        programs: [
            'BS Medical Technology',
            'BS Nursing',
            'BS Nutrition & Dietetics',
            'BS Pharmacy',
        ],
    },
    {
        code: 'CTE',
        name: 'College of Teacher Education',
        programs: [
            'BS Elementary Education',
            'BS Physical Education',
            'BS Secondary Education Major in English',
            'BS Secondary Education Major in Filipino',
            'BS Secondary Education Major in Mathematics',
            'BS Secondary Education Major in Science',
            'BS Secondary Education Major in Social Studies',
            'BS Special Needs Education',
        ],
    },
    {
        code: 'CLE',
        name: 'College of Legal Education',
        programs: ['Juris Doctor (Law)'],
    },
    {
        code: 'PS',
        name: 'Professional Schools (Graduate & Post-Graduate)',
        programs: [
            'MBA',
            'MAEd',
            'MPA',
            'MSc Criminal Justice',
            'MSc Psychology (Clinical)',
            'MITHM',
            'MIT',
            'MS Social Work',
            'EdD',
            'PhD (Education)',
            'PhD (Management)',
            'PhD (Criminal Justice)',
            'PhD (Applied Linguistics)',
            'PhD (Mathematics)',
            'DBA',
            'DPA',
        ],
    },
] as const

export type College = typeof UM_COLLEGES[number]
export type CollegeCode = College['code']
