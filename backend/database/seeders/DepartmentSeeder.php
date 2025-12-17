<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            [
                'name' => 'College of Accounting Education',
                'code' => 'CAE',
                'description' => 'Offers BS Accountancy, BS Accounting Information System, and BS Management Accounting. Dean: Lord Eddie I. Aguilar, CPA, MBA',
                'is_active' => true,
            ],
            [
                'name' => 'College of Architecture and Fine Arts Education',
                'code' => 'CAFAE',
                'description' => 'Offers BS Architecture, BFA & Design Major in Painting, and BS Interior Design. Dean: Ar. Iluminado D. Quinto Jr., MURP',
                'is_active' => true,
            ],
            [
                'name' => 'College of Arts and Sciences Education',
                'code' => 'CASE',
                'description' => 'Offers BA Communication, BA English, BA Political Science, BS Agroforestry, BS Biology (Ecology), BS Environmental Science, BS Forestry, BS Psychology, and BS Social Work. Dean: Khristine Marie D. Concepcion, Ph.D',
                'is_active' => true,
            ],
            [
                'name' => 'College of Business Administration Education',
                'code' => 'CBAE',
                'description' => 'Offers BS Business Administration programs (Business Economics, Financial Management, Human Resource Management, Marketing Management), BS Entrepreneurship, BS Legal Management, and BS Real Estate Management. Dean: Vicente Salvador E. Montaño, DBA',
                'is_active' => true,
            ],
            [
                'name' => 'College of Computing Education',
                'code' => 'CCE',
                'description' => 'Offers BS Computer Science, BS Information Technology, BS Entertainment & Multimedia Computing, BS Multimedia Arts, and BS Library & Information Science. Dean: Ramcis N. Vilchez, DIT',
                'is_active' => true,
            ],
            [
                'name' => 'College of Criminal Justice Education',
                'code' => 'CCJE',
                'description' => 'Offers BS Criminology. Dean: Carmelita B. Chavez, Ph.D',
                'is_active' => true,
            ],
            [
                'name' => 'College of Engineering Education',
                'code' => 'CEE',
                'description' => 'Offers BS Chemical Engineering, BS Civil Engineering (Geotechnical, Structural, Transportation), BS Computer Engineering, BS Electrical Engineering, BS Electronics Engineering, BS Materials Engineering, and BS Mechanical Engineering. Dean: Charlito L. Cañesares, Eng.D.',
                'is_active' => true,
            ],
            [
                'name' => 'College of Hospitality Education',
                'code' => 'CHE',
                'description' => 'Offers BS Hospitality Management and BS Tourism Management. Dean: Dindo D. Silud, Ph.D',
                'is_active' => true,
            ],
            [
                'name' => 'College of Health Sciences Education',
                'code' => 'CHSE',
                'description' => 'Offers BS Medical Technology, BS Nursing, BS Nutrition & Dietetics, and BS Pharmacy. Dean: Ofelia C. Lariego, MAN',
                'is_active' => true,
            ],
            [
                'name' => 'College of Teacher Education',
                'code' => 'CTE',
                'description' => 'Offers BS Elementary Education, BS Physical Education, BS Secondary Education (English, Filipino, Mathematics, Science, Social Studies), and BS Special Needs Education. Dean: Jocelyn B. Bacasmot, Ph.D',
                'is_active' => true,
            ],
            [
                'name' => 'College of Legal Education',
                'code' => 'CLE',
                'description' => 'Offers Juris Doctor (Law) program. Dean: Atty. Antonio B. Arellano',
                'is_active' => true,
            ],
            [
                'name' => 'Professional Schools',
                'code' => 'PS',
                'description' => 'Graduate & Post-Graduate programs including MBA, MAEd, MPA, MSc Criminal Justice, MSc Psychology, MITHM, MIT, MS Social Work, EdD, PhD, DBA, DPA. Dean: Eugenio S. Guhao Jr.',
                'is_active' => true,
            ],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }

        $this->command->info('✓ Created ' . count($departments) . ' University of Mindanao colleges/departments');
    }
}
