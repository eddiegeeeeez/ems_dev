<?php

namespace Database\Seeders;

use App\Models\College;
use App\Models\Program;
use Illuminate\Database\Seeder;

class CollegeSeeder extends Seeder
{
    public function run(): void
    {
        $collegesData = [
            [
                'name' => 'College of Accounting Education',
                'code' => 'CAE',
                'dean' => 'Lord Eddie I. Aguilar, CPA, MBA',
                'description' => 'Dedicated to producing competent accounting professionals',
                'programs' => [
                    'BS Accountancy',
                    'BS Accounting Information System',
                    'BS Management Accounting',
                ],
            ],
            [
                'name' => 'College of Architecture and Fine Arts Education',
                'code' => 'CAFAE',
                'dean' => 'Ar. Iluminado D. Quinto Jr., MURP',
                'description' => 'Fostering creativity and design excellence',
                'programs' => [
                    'BS Architecture',
                    'BFA & Design Major in Painting',
                    'BS Interior Design',
                ],
            ],
            [
                'name' => 'College of Arts and Sciences Education',
                'code' => 'CASE',
                'dean' => 'Khristine Marie D. Concepcion, Ph.D',
                'description' => 'Advancing knowledge in arts, sciences, and social disciplines',
                'programs' => [
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
            ],
            [
                'name' => 'College of Business Administration Education',
                'code' => 'CBAE',
                'dean' => 'Vicente Salvador E. Montaño, DBA',
                'description' => 'Developing future business leaders and entrepreneurs',
                'programs' => [
                    'BS Business Administration – Business Economics',
                    'BS Business Administration – Financial Management',
                    'BS Business Administration – Human Resource Management',
                    'BS Business Administration – Marketing Management',
                    'BS Entrepreneurship',
                    'BS Legal Management',
                    'BS Real Estate Management',
                ],
            ],
            [
                'name' => 'College of Computing Education',
                'code' => 'CCE',
                'dean' => 'Ramcis N. Vilchez, DIT',
                'description' => 'Leading innovation in computing and information technology',
                'programs' => [
                    'BS Computer Science',
                    'BS Information Technology',
                    'BS Entertainment & Multimedia Computing',
                    'BS Multimedia Arts',
                    'BS Library & Information Science',
                ],
            ],
            [
                'name' => 'College of Criminal Justice Education',
                'code' => 'CCJE',
                'dean' => 'Carmelita B. Chavez, Ph.D',
                'description' => 'Training ethical and competent law enforcement professionals',
                'programs' => [
                    'BS Criminology',
                ],
            ],
            [
                'name' => 'College of Engineering Education',
                'code' => 'CEE',
                'dean' => 'Charlito L. Cañesares, Eng.D.',
                'description' => 'Engineering excellence for sustainable development',
                'programs' => [
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
            ],
            [
                'name' => 'College of Hospitality Education',
                'code' => 'CHE',
                'dean' => 'Dindo D. Silud, Ph.D',
                'description' => 'Cultivating world-class hospitality and tourism professionals',
                'programs' => [
                    'BS Hospitality Management',
                    'BS Tourism Management',
                ],
            ],
            [
                'name' => 'College of Health Sciences Education',
                'code' => 'CHSE',
                'dean' => 'Ofelia C. Lariego, MAN',
                'description' => 'Committed to healthcare excellence and service',
                'programs' => [
                    'BS Medical Technology',
                    'BS Nursing',
                    'BS Nutrition & Dietetics',
                    'BS Pharmacy',
                ],
            ],
            [
                'name' => 'College of Teacher Education',
                'code' => 'CTE',
                'dean' => 'Jocelyn B. Bacasmot, Ph.D',
                'description' => 'Shaping future educators and lifelong learners',
                'programs' => [
                    'BS Elementary Education',
                    'BS Physical Education',
                    'BS Secondary Education Major in English',
                    'BS Secondary Education Major in Filipino',
                    'BS Secondary Education Major in Mathematics',
                    'BS Secondary Education Major in Science',
                    'BS Secondary Education Major in Social Studies',
                    'BS Special Needs Education',
                ],
            ],
            [
                'name' => 'College of Legal Education',
                'code' => 'CLE',
                'dean' => 'Atty. Antonio B. Arellano',
                'description' => 'Producing competent and ethical legal professionals',
                'programs' => [
                    'Juris Doctor (Law)',
                ],
            ],
            [
                'name' => 'Professional Schools',
                'code' => 'PS',
                'dean' => 'Eugenio S. Guhao Jr.',
                'description' => 'Graduate and Post-Graduate programs for advanced studies',
                'programs' => [
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
            ],
        ];

        foreach ($collegesData as $collegeData) {
            $programs = $collegeData['programs'];
            unset($collegeData['programs']);
            
            $college = College::create($collegeData);
            
            foreach ($programs as $programName) {
                Program::create([
                    'college_id' => $college->id,
                    'name' => $programName,
                    'is_active' => true,
                ]);
            }
        }

        $this->command->info('✓ Created ' . College::count() . ' colleges with ' . Program::count() . ' programs');
    }
}
