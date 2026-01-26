export type CourseEntry = {
  course: string;
  universities: string[];
  level: 'degree' | 'diploma' | 'certificate' | 'artisan';
  note?: string;
};

/**
 * Determine course level based on course name
 */
const determineCourseLevel = (courseName: string): 'degree' | 'diploma' | 'certificate' | 'artisan' => {
  const lower = courseName.toLowerCase();
  if (lower.includes('bachelor') || lower.includes('master') || lower.includes('phd') || lower.includes('degree')) {
    return 'degree';
  }
  if (lower.includes('diploma') || lower.includes('higher diploma')) {
    return 'diploma';
  }
  if (lower.includes('certificate')) {
    return 'certificate';
  }
  // Default to artisan for any unlabeled courses
  return 'artisan';
};

/**
 * Helper to create course entry with auto-detected level
 */
const course = (name: string, unis: string[]): CourseEntry => ({
  course: name,
  universities: unis,
  level: determineCourseLevel(name)
});

export const CLUSTER_COURSES: Record<number, CourseEntry[]> = {
  1: [
    course('Bachelor of Science (Computer Science)', ['University of Nairobi', 'JKUAT', 'Kenyatta University', 'Moi University']),
    course('Bachelor of Science (Mathematics)', ['University of Nairobi', 'Moi University', 'Kenyatta University']),
    course('Diploma in Information Technology', ['Technical University of Kenya', 'Maseno University', 'Kisii University']),
    course('Bachelor of Science (Software Engineering)', ['JKUAT', 'University of Nairobi', 'Kenyatta University']),
    course('Diploma in Computer Studies', ['Technical University of Kenya', 'Maseno University', 'Kisii University'])
  ],
  2: [
    course('Bachelor of Science (Physics)', ['University of Nairobi', 'Moi University', 'Kenyatta University']),
    course('Bachelor of Science (Chemistry)', ['University of Nairobi', 'Moi University', 'Egerton University']),
    course('Diploma in Laboratory Technology', ['Technical University of Kenya', 'Maseno University', 'Kisii University']),
    course('Bachelor of Science (Applied Physics)', ['JKUAT', 'University of Nairobi', 'Moi University'])
  ],
  3: [
    course('Bachelor of Science (Biology)', ['University of Nairobi', 'Moi University', 'Kenyatta University']),
    course('Bachelor of Science (Biochemistry)', ['University of Nairobi', 'Moi University', 'JKUAT']),
    course('Bachelor of Science (Microbiology)', ['University of Nairobi', 'JKUAT', 'Kenyatta University']),
    course('Diploma in Medical Laboratory Science', ['Technical University of Kenya', 'Maseno University'])
  ],
  4: [
    course('Bachelor of Technology (Mechanical Engineering)', ['JKUAT', 'Technical University of Kenya', 'Moi University']),
    course('Bachelor of Technology (Electrical Engineering)', ['JKUAT', 'Technical University of Kenya', 'Moi University']),
    course('Diploma in Mechanical Engineering', ['Technical University of Kenya', 'Maseno University', 'Kisii University'])
  ],
  5: [
    course('Bachelor of Commerce', ['University of Nairobi', 'Kenyatta University', 'Moi University', 'JKUAT']),
    course('Bachelor of Business Management', ['Egerton University', 'Maseno University', 'JKUAT']),
    course('Diploma in Business Administration', ['Technical University of Kenya', 'Kisii University', 'Maseno University']),
    course('Bachelor of Commerce (Finance)', ['JKUAT', 'University of Nairobi', 'Kenyatta University'])
  ],
  6: [
    course('Bachelor of Arts (English)', ['University of Nairobi', 'Moi University', 'Kenyatta University']),
    course('Bachelor of Arts (History)', ['Egerton University', 'Maseno University', 'Kenyatta University']),
    course('Bachelor of Arts (Sociology)', ['University of Nairobi', 'Moi University', 'Egerton University']),
    course('Diploma in Social Work', ['Maseno University', 'Kisii University', 'Technical University of Kenya'])
  ],
  7: [
    course('Bachelor of Science (Agriculture)', ['Egerton University', 'University of Nairobi', 'Maseno University']),
    course('Bachelor of Science (Horticulture)', ['Egerton University', 'JKUAT', 'Maseno University']),
    course('Diploma in Agriculture', ['Egerton University', 'Maseno University', 'Technical University of Kenya'])
  ],
  8: [
    course('Bachelor of Medicine & Surgery (MBChB)', ['University of Nairobi', 'Moi University', 'Kenyatta University', 'JKUAT']),
    course('Bachelor of Nursing Science', ['University of Nairobi', 'Kenyatta University', 'Moi University']),
    course('Bachelor of Pharmacy', ['University of Nairobi', 'JKUAT', 'Moi University']),
    course('Diploma in Clinical Medicine', ['Kenya Medical Training College', 'Technical University of Kenya'])
  ],
  9: [
    course('Bachelor of Engineering (Civil)', ['University of Nairobi', 'JKUAT', 'Moi University']),
    course('Bachelor of Engineering (Mechanical)', ['JKUAT', 'University of Nairobi', 'Moi University']),
    course('Bachelor of Engineering (Electrical)', ['JKUAT', 'University of Nairobi', 'Moi University']),
    course('Diploma in Civil Engineering', ['Technical University of Kenya', 'Maseno University'])
  ],
  10: [
    course('Bachelor of Architecture', ['JKUAT', 'University of Nairobi', 'Kenyatta University']),
    course('Bachelor of Science (Construction Management)', ['JKUAT', 'University of Nairobi', 'Moi University']),
    course('Diploma in Architectural Technology', ['Technical University of Kenya', 'Maseno University'])
  ],
  11: [
    course('Bachelor of Education (Science)', ['University of Nairobi', 'Moi University', 'Kenyatta University']),
    course('Bachelor of Education (Mathematics)', ['Kenyatta University', 'Moi University', 'Egerton University']),
    course('Diploma in Education (Science)', ['Maseno University', 'Technical University of Kenya'])
  ],
  12: [
    course('Bachelor of Education (Arts)', ['University of Nairobi', 'Kenyatta University', 'Moi University']),
    course('Bachelor of Education (Languages)', ['Kenyatta University', 'Moi University', 'Egerton University']),
    course('Diploma in Education (Arts)', ['Maseno University', 'Kisii University'])
  ],
  13: [
    course('Bachelor of Fine Arts', ['University of Nairobi', 'Kenyatta University', 'JKUAT']),
    course('Bachelor of Design (Graphics)', ['University of Nairobi', 'Kenyatta University', 'JKUAT']),
    course('Diploma in Fine Arts', ['Technical University of Kenya', 'Maseno University'])
  ],
  14: [
    course('Bachelor of Arts (English)', ['University of Nairobi', 'Moi University', 'Kenyatta University']),
    course('Bachelor of Arts (Kiswahili)', ['University of Nairobi', 'Moi University', 'Kenyatta University']),
    course('Bachelor of Arts (French)', ['University of Nairobi', 'Moi University', 'Kenyatta University'])
  ],
  15: [
    course('Bachelor of Arts (Mass Communication)', ['University of Nairobi', 'JKUAT', 'Moi University']),
    course('Bachelor of Arts (Journalism)', ['University of Nairobi', 'Moi University', 'Kenyatta University']),
    course('Diploma in Journalism', ['Technical University of Kenya', 'Maseno University'])
  ],
  16: [
    course('Bachelor of Economics', ['University of Nairobi', 'Moi University', 'Kenyatta University']),
    course('Bachelor of Science (Economics)', ['JKUAT', 'University of Nairobi', 'Moi University']),
    course('Diploma in Economics', ['Technical University of Kenya', 'Maseno University'])
  ],
  17: [
    course('Bachelor of Laws (LL.B)', ['University of Nairobi', 'Kenyatta University', 'Moi University', 'JKUAT']),
    course('Diploma in Law', ['Technical University of Kenya', 'Maseno University'])
  ],
  18: [
    course('Bachelor of Science (Geography)', ['University of Nairobi', 'Moi University', 'Kenyatta University']),
    course('Bachelor of Science (Environmental Science)', ['University of Nairobi', 'Moi University', 'Egerton University']),
    course('Diploma in Environmental Studies', ['Technical University of Kenya', 'Maseno University'])
  ],
  19: [
    course('Bachelor of Science (Home Economics)', ['Kenyatta University', 'Egerton University', 'Moi University']),
    course('Bachelor of Science (Food Science)', ['University of Nairobi', 'JKUAT', 'Egerton University']),
    course('Diploma in Hotel Management', ['Technical University of Kenya', 'Maseno University'])
  ],
  20: [
    course('Bachelor of Music', ['University of Nairobi', 'Moi University', 'Kenyatta University']),
    course('Bachelor of Arts (Music)', ['Kenyatta University', 'Moi University', 'Egerton University']),
    course('Diploma in Music', ['Technical University of Kenya', 'Maseno University'])
  ]
};
  2: [
    { course: 'Bachelor of Commerce', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University', 'JKUAT', 'Egerton University'] },
    { course: 'Bachelor of Business Management', universities: ['Egerton University', 'Maseno University', 'JKUAT', 'Kenyatta University'] },
    { course: 'Diploma in Business Administration', universities: ['Technical University of Kenya', 'Kisii University', 'Kenya Institute of Management', 'Maseno University'] },
    { course: 'Bachelor of Economics', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University', 'JKUAT'] },
    { course: 'Diploma in Accounting', universities: ['Kenya Institute of Management', 'Technical University of Mombasa', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Bachelor of Commerce (Finance)', universities: ['JKUAT', 'University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Higher Diploma in Marketing', universities: ['Kisii University', 'Maseno University', 'Egerton University', 'Technical University of Kenya'] },
    { course: 'Diploma in Supply Chain Management', universities: ['Technical University of Kenya', 'Kenyatta University', 'Moi University', 'Maseno University'] },
    { course: 'Certificate in Entrepreneurship', universities: ['Nairobi Institute of Business Studies', 'Kenya Institute of Management', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Business Information Technology', universities: ['JKUAT', 'Kenyatta University', 'University of Nairobi', 'Moi University'] },
    { course: 'Diploma in Human Resource Management', universities: ['Kenya Institute of Management', 'Technical University of Kenya', 'Nairobi Institute of Business Studies'] },
    { course: 'Bachelor of Commerce (International Business)', universities: ['University of Nairobi', 'JKUAT', 'Kenyatta University'] },
    { course: 'Certificate in Financial Accounting', universities: ['Kenya Institute of Management', 'Nairobi Institute of Business Studies', 'Technical University of Mombasa'] },
    { course: 'Diploma in Corporate Governance', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Business Administration', universities: ['Egerton University', 'Moi University', 'Kenyatta University'] }
  ],
  3: [
    { course: 'Bachelor of Arts (English)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University', 'Egerton University'] },
    { course: 'Bachelor of Arts (History)', universities: ['Egerton University', 'Maseno University', 'Kenyatta University', 'University of Nairobi'] },
    { course: 'Diploma in Community Development', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University', 'Moi University'] },
    { course: 'Bachelor of Arts (Mass Communication)', universities: ['University of Nairobi', 'JKUAT', 'Moi University', 'Kenyatta University'] },
    { course: 'Diploma in Creative Writing and Journalism', universities: ['Nairobi Institute of Business Studies', 'Kisii University', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Arts (Linguistics)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University', 'Egerton University'] },
    { course: 'Diploma in Theatre Arts and Drama', universities: ['Maseno University', 'Kisii University', 'Technical University of Kenya'] },
    { course: 'Certificate in Journalism', universities: ['Nairobi Institute of Business Studies', 'Kenya Institute of Mass Communication', 'Technical University of Kenya'] },
    { course: 'Bachelor of Arts (Religious Studies)', universities: ['Egerton University', 'Kenyatta University', 'Moi University', 'University of Nairobi'] },
    { course: 'Diploma in Social Work and Community Services', universities: ['Maseno University', 'Kisii University', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Arts (Philosophy)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Bachelor of Arts (Sociology)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Diploma in Publishing and Media', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Certificate in Creative Industries', universities: ['Nairobi Institute of Business Studies', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Arts (Anthropology)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] }
  ],
  4: [
    { course: 'Bachelor of Science (Geology)', universities: ['University of Nairobi', 'Moi University', 'Egerton University', 'Kenyatta University'] },
    { course: 'Bachelor of Surveying and Mapping', universities: ['JKUAT', 'Technical University of Kenya', 'Kenyatta University', 'University of Nairobi'] },
    { course: 'Diploma in Geological Technology', universities: ['Egerton University', 'Masinde Muliro University', 'Technical University of Mombasa', 'Maseno University'] },
    { course: 'Bachelor of Science (Environmental Science)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University', 'Egerton University'] },
    { course: 'Diploma in Land Surveying and GIS', universities: ['Technical University of Kenya', 'JKUAT', 'Kisii University', 'Maseno University'] },
    { course: 'Certificate in GIS and Remote Sensing', universities: ['Maseno University', 'Technical University of Kenya', 'University of Nairobi'] },
    { course: 'Bachelor of Science (Natural Resources Management)', universities: ['Egerton University', 'Moi University', 'Kenyatta University'] },
    { course: 'Diploma in Cartography and Mapping', universities: ['JKUAT', 'Technical University of Kenya', 'Maseno University'] },
    { course: 'Bachelor of Science (Geospatial Engineering)', universities: ['JKUAT', 'University of Nairobi', 'Moi University'] },
    { course: 'Certificate in Mineral Exploration', universities: ['Egerton University', 'Technical University of Mombasa', 'Kisii University'] },
    { course: 'Bachelor of Science (Environmental Geology)', universities: ['University of Nairobi', 'Egerton University', 'Moi University'] },
    { course: 'Diploma in Environmental Management', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Science (Geography)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Certificate in Geographic Information Systems', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in Urban and Regional Planning', universities: ['JKUAT', 'Technical University of Kenya', 'Maseno University'] }
  ],
  5: [
    { course: 'Bachelor of Education (Special Needs)', universities: ['Kenyatta University', 'Moi University', 'University of Nairobi', 'Egerton University'] },
    { course: 'Diploma in Special Needs Education', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University', 'Moi University'] },
    { course: 'Certificate in Inclusive Education', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Bachelor of Education (Psychology)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Diploma in Educational Psychology', universities: ['Maseno University', 'Kisii University', 'Egerton University'] }
  ],
  6: [
    { course: 'Bachelor of Arts (Kiswahili)', universities: ['University of Nairobi', 'Moi University', 'Egerton University', 'Kenyatta University'] },
    { course: 'Diploma in Kiswahili Translation', universities: ['Technical University of Kenya', 'Kenyatta University', 'Maseno University', 'Kisii University'] },
    { course: 'Certificate in Kiswahili Language', universities: ['Nairobi Institute of Business Studies', 'Technical University of Kenya', 'Maseno University'] },
    { course: 'Bachelor of Arts (Kiswahili and Literature)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Diploma in Publishing (Kiswahili)', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] }
  ],
  7: [
    { course: 'Bachelor of Engineering (Civil)', universities: ['University of Nairobi', 'JKUAT', 'Moi University', 'Kenyatta University'] },
    { course: 'Diploma in Civil Engineering', universities: ['Technical University of Kenya', 'Kisii University', 'Maseno University', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Engineering (Mechanical)', universities: ['JKUAT', 'University of Nairobi', 'Moi University'] },
    { course: 'Bachelor of Engineering (Electrical)', universities: ['JKUAT', 'University of Nairobi', 'Moi University'] },
    { course: 'Diploma in Mechanical Engineering', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Certificate in Engineering Technology', universities: ['Technical University of Kenya', 'Technical University of Mombasa', 'Nairobi Institute of Business Studies'] },
    { course: 'Bachelor of Engineering (Chemical)', universities: ['JKUAT', 'University of Nairobi', 'Moi University'] },
    { course: 'Diploma in Electrical Engineering', universities: ['Technical University of Kenya', 'Technical University of Mombasa', 'Maseno University'] },
    { course: 'Bachelor of Engineering (Biomedical)', universities: ['JKUAT', 'University of Nairobi', 'Kenyatta University'] },
    { course: 'Diploma in Construction and Building Technology', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] }
  ],
  8: [
    { course: 'Bachelor of Architecture', universities: ['JKUAT', 'University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Diploma in Architectural Technology', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Science (Urban Planning)', universities: ['JKUAT', 'University of Nairobi', 'Moi University'] },
    { course: 'Certificate in Interior Design', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in Building and Construction', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Science (Landscape Architecture)', universities: ['JKUAT', 'Egerton University', 'Kenyatta University'] },
    { course: 'Certificate in Architectural Drafting', universities: ['Technical University of Kenya', 'Technical University of Mombasa', 'Nairobi Institute of Business Studies'] },
    { course: 'Diploma in Town and Country Planning', universities: ['JKUAT', 'Technical University of Kenya', 'Maseno University'] },
    { course: 'Bachelor of Science (Construction Management)', universities: ['JKUAT', 'University of Nairobi', 'Moi University'] },
    { course: 'Certificate in Environmental Design', universities: ['Technical University of Kenya', 'Kisii University', 'Maseno University'] }
  ],
  9: [
    { course: 'Bachelor of Science (Computer Science)', universities: ['University of Nairobi', 'JKUAT', 'Kenyatta University', 'Moi University'] },
    { course: 'Diploma in Information Technology', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Science (Software Engineering)', universities: ['JKUAT', 'University of Nairobi', 'Kenyatta University'] },
    { course: 'Certificate in Web Development', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in Software Development', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Science (Information Security)', universities: ['JKUAT', 'University of Nairobi', 'Moi University'] },
    { course: 'Certificate in Cybersecurity', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'JKUAT'] },
    { course: 'Diploma in Database Management', universities: ['Technical University of Kenya', 'Maseno University', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Science (Data Science)', universities: ['JKUAT', 'University of Nairobi', 'Kenyatta University'] },
    { course: 'Certificate in Cloud Computing', universities: ['Technical University of Kenya', 'JKUAT', 'Nairobi Institute of Business Studies'] },
    { course: 'Bachelor of Science (Artificial Intelligence)', universities: ['JKUAT', 'University of Nairobi', 'Kenyatta University'] },
    { course: 'Diploma in Mobile App Development', universities: ['Technical University of Kenya', 'Maseno University', 'Nairobi Institute of Business Studies'] },
    { course: 'Bachelor of Technology (Information Technology)', universities: ['JKUAT', 'Kenyatta University', 'Moi University'] },
    { course: 'Certificate in System Administration', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in IT Support Services', universities: ['Technical University of Kenya', 'Technical University of Mombasa', 'Kisii University'] }
  ],
  10: [
    { course: 'Bachelor of Science (Agriculture)', universities: ['Egerton University', 'University of Nairobi', 'Maseno University', 'Kenyatta University'] },
    { course: 'Diploma in Agribusiness', universities: ['Kisii University', 'Technical University of Mombasa', 'Kenyatta University', 'Maseno University'] },
    { course: 'Bachelor of Science (Horticulture)', universities: ['Egerton University', 'JKUAT', 'Maseno University'] },
    { course: 'Certificate in Agricultural Technology', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in Crop Production', universities: ['Egerton University', 'Maseno University', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Science (Animal Science)', universities: ['University of Nairobi', 'Egerton University', 'JKUAT'] },
    { course: 'Diploma in Livestock Production', universities: ['Maseno University', 'Technical University of Mombasa', 'Kenyatta University'] },
    { course: 'Certificate in Agronomy', universities: ['Technical University of Kenya', 'Egerton University', 'Maseno University'] },
    { course: 'Bachelor of Science (Agricultural Economics)', universities: ['Egerton University', 'University of Nairobi', 'Maseno University'] },
    { course: 'Diploma in Cooperative Development', universities: ['Maseno University', 'Kisii University', 'Technical University of Kenya'] },
    { course: 'Bachelor of Science (Agricultural Engineering)', universities: ['JKUAT', 'University of Nairobi', 'Egerton University'] },
    { course: 'Diploma in Farm Management', universities: ['Egerton University', 'Maseno University', 'Technical University of Mombasa'] },
    { course: 'Certificate in Organic Farming', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Diploma in Aquaculture', universities: ['Maseno University', 'Kisii University', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Science (Agricultural Extension)', universities: ['Egerton University', 'University of Nairobi', 'Maseno University'] }
  ],
  11: [
    { course: 'Bachelor of Science (Biology)', universities: ['University of Nairobi', 'Moi University', 'Egerton University', 'Kenyatta University'] },
    { course: 'Diploma in Laboratory Technology', universities: ['Kenyatta University', 'Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Science (Biochemistry)', universities: ['University of Nairobi', 'Moi University', 'JKUAT'] },
    { course: 'Certificate in Medical Laboratory Science', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in Microbiology', universities: ['Maseno University', 'Technical University of Kenya', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Science (Zoology)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Certificate in Biological Sciences', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Diploma in Environmental Microbiology', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Science (Parasitology)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Diploma in Biomedical Science', universities: ['Technical University of Kenya', 'Maseno University', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Science (Botany)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Certificate in Biotechnology', universities: ['Technical University of Kenya', 'JKUAT', 'Nairobi Institute of Business Studies'] },
    { course: 'Diploma in Applied Biology', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Science (Medical Microbiology)', universities: ['University of Nairobi', 'JKUAT', 'Moi University'] },
    { course: 'Certificate in Laboratory Technician', universities: ['Technical University of Kenya', 'Technical University of Mombasa', 'Maseno University'] }
  ],
  12: [
    { course: 'Bachelor of Science (Mathematics and Economics)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University', 'JKUAT'] },
    { course: 'Diploma in Applied Statistics', universities: ['Egerton University', 'Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Science (Mathematical Sciences)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Certificate in Business Statistics', universities: ['Kenya Institute of Management', 'Nairobi Institute of Business Studies', 'Technical University of Kenya'] },
    { course: 'Diploma in Finance and Banking', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Economics (Quantitative)', universities: ['University of Nairobi', 'Moi University', 'JKUAT'] },
    { course: 'Certificate in Econometrics', universities: ['Nairobi Institute of Business Studies', 'Technical University of Kenya', 'Kenya Institute of Management'] },
    { course: 'Diploma in Actuarial Science', universities: ['Technical University of Kenya', 'Maseno University', 'JKUAT'] },
    { course: 'Bachelor of Science (Statistics)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Certificate in Data Analysis', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in Applied Mathematics', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Science (Physics and Mathematics)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Certificate in Financial Analysis', universities: ['Kenya Institute of Management', 'Nairobi Institute of Business Studies', 'Technical University of Kenya'] },
    { course: 'Diploma in Investment Management', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Science (Computational Mathematics)', universities: ['JKUAT', 'University of Nairobi', 'Moi University'] }
  ],
  13: [
    { course: 'Bachelor of Design (Textiles)', universities: ['Kenyatta University', 'University of Nairobi', 'JKUAT', 'Moi University'] },
    { course: 'Diploma in Fashion and Textile Design', universities: ['Kenya Textile Training Institute', 'Technical University of Mombasa', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Arts (Fashion Design)', universities: ['University of Nairobi', 'Kenyatta University', 'JKUAT'] },
    { course: 'Certificate in Fashion and Clothing', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in Interior Design', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Design (Product Design)', universities: ['JKUAT', 'University of Nairobi', 'Kenyatta University'] },
    { course: 'Certificate in Batik and Textile Art', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Diploma in Leather Technology', universities: ['Technical University of Kenya', 'Kenya Textile Training Institute', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Design (Graphic Design)', universities: ['University of Nairobi', 'Kenyatta University', 'JKUAT'] },
    { course: 'Certificate in Apparel Design', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Kenya Textile Training Institute'] },
    { course: 'Diploma in Textile Production', universities: ['Technical University of Kenya', 'Maseno University', 'Kenya Textile Training Institute'] },
    { course: 'Bachelor of Arts (Visual Communication Design)', universities: ['University of Nairobi', 'Kenyatta University', 'JKUAT'] },
    { course: 'Certificate in Fashion Business', universities: ['Nairobi Institute of Business Studies', 'Technical University of Kenya', 'Kenya Institute of Management'] },
    { course: 'Diploma in Footwear Design', universities: ['Technical University of Kenya', 'Kenya Textile Training Institute', 'Maseno University'] },
    { course: 'Bachelor of Science (Textile Technology)', universities: ['JKUAT', 'University of Nairobi', 'Kenyatta University'] }
  ],
  14: [
    { course: 'Diploma in Sports Management', universities: ['Kenya Institute of Sports', 'Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Science (Physical Education)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University', 'Egerton University'] },
    { course: 'Certificate in Coaching and Sports Science', universities: ['Kenya Institute of Sports', 'Technical University of Kenya', 'Maseno University'] },
    { course: 'Diploma in Sports Coaching', universities: ['Kenya Institute of Sports', 'Maseno University', 'Technical University of Kenya'] },
    { course: 'Bachelor of Science (Sports Science)', universities: ['Moi University', 'University of Nairobi', 'Kenyatta University'] },
    { course: 'Certificate in Fitness and Wellness', universities: ['Kenya Institute of Sports', 'Nairobi Institute of Business Studies', 'Technical University of Kenya'] },
    { course: 'Diploma in Recreation and Leisure Management', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Education (Physical Education)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Certificate in Athletic Training', universities: ['Kenya Institute of Sports', 'Technical University of Kenya', 'Maseno University'] },
    { course: 'Diploma in Sports Tourism', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Science (Exercise Physiology)', universities: ['Moi University', 'University of Nairobi', 'JKUAT'] },
    { course: 'Certificate in Sports Nutrition', universities: ['Nairobi Institute of Business Studies', 'Kenya Institute of Sports', 'Technical University of Kenya'] },
    { course: 'Diploma in Sports Administration', universities: ['Kenya Institute of Sports', 'Maseno University', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Science (Sports Management)', universities: ['Moi University', 'University of Nairobi', 'Kenyatta University'] },
    { course: 'Certificate in Personal Training', universities: ['Kenya Institute of Sports', 'Nairobi Institute of Business Studies', 'Technical University of Kenya'] }
  ],
  15: [
    { course: 'Bachelor of Medicine & Surgery (MBChB)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University', 'JKUAT'] },
    { course: 'Diploma in Clinical Medicine', universities: ['Kenya Medical Training College', 'Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Nursing Science', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University', 'Egerton University'] },
    { course: 'Diploma in Nursing', universities: ['Kenya Medical Training College', 'Technical University of Kenya', 'Maseno University', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Pharmacy', universities: ['University of Nairobi', 'JKUAT', 'Moi University'] },
    { course: 'Diploma in Pharmaceutical Science', universities: ['Technical University of Kenya', 'Maseno University', 'Kenya Medical Training College'] },
    { course: 'Bachelor of Medical Radiation Science', universities: ['JKUAT', 'University of Nairobi', 'Moi University'] },
    { course: 'Diploma in Medical Laboratory Science', universities: ['Technical University of Kenya', 'Kenya Medical Training College', 'Maseno University'] },
    { course: 'Bachelor of Public Health', universities: ['University of Nairobi', 'JKUAT', 'Moi University'] },
    { course: 'Diploma in Environmental Health', universities: ['Technical University of Kenya', 'Maseno University', 'Kenya Medical Training College'] },
    { course: 'Bachelor of Science (Physiotherapy)', universities: ['University of Nairobi', 'JKUAT', 'Moi University'] },
    { course: 'Diploma in Physiotherapy', universities: ['Technical University of Kenya', 'Kenya Medical Training College', 'Maseno University'] },
    { course: 'Bachelor of Dental Surgery', universities: ['University of Nairobi', 'JKUAT', 'Moi University'] },
    { course: 'Diploma in Dental Technology', universities: ['Technical University of Kenya', 'Kenya Medical Training College', 'Maseno University'] },
    { course: 'Bachelor of Nutrition Science', universities: ['University of Nairobi', 'Kenyatta University', 'JKUAT'] }
  ],
  16: [
    { course: 'Bachelor of Arts (History)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University', 'Egerton University'] },
    { course: 'Diploma in Heritage Management', universities: ['Maseno University', 'Kisii University', 'Technical University of Kenya', 'Moi University'] },
    { course: 'Bachelor of Arts (Archaeology)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Certificate in Museum Studies', universities: ['Nairobi Institute of Business Studies', 'Technical University of Kenya', 'Maseno University'] },
    { course: 'Diploma in Archaeological Science', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Arts (Historical Studies)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Certificate in Archives Management', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in Cultural Tourism', universities: ['Maseno University', 'Kisii University', 'Technical University of Kenya'] },
    { course: 'Bachelor of Arts (History and Geography)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Certificate in Preservation and Conservation', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Diploma in Tourism Management', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Arts (Historiography)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Certificate in Local History Research', universities: ['Technical University of Kenya', 'Maseno University', 'Nairobi Institute of Business Studies'] },
    { course: 'Diploma in Community Archives', universities: ['Maseno University', 'Kisii University', 'Technical University of Kenya'] },
    { course: 'Bachelor of Arts (Social History)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] }
  ],
  17: [
    { course: 'Bachelor of Science (Agriculture and Environmental Science)', universities: ['Egerton University', 'University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Diploma in Food Science and Technology', universities: ['Kenyatta University', 'Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Science (Food Science)', universities: ['University of Nairobi', 'JKUAT', 'Egerton University'] },
    { course: 'Certificate in Food Preservation', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in Food Technology', universities: ['Technical University of Kenya', 'Maseno University', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Science (Environmental Management)', universities: ['Egerton University', 'Moi University', 'University of Nairobi'] },
    { course: 'Certificate in Environmental Audit', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Diploma in Environmental Protection', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Science (Agricultural Biotechnology)', universities: ['JKUAT', 'University of Nairobi', 'Egerton University'] },
    { course: 'Certificate in Crop Improvement', universities: ['Technical University of Kenya', 'Egerton University', 'Maseno University'] },
    { course: 'Diploma in Agricultural Biotechnology', universities: ['Technical University of Kenya', 'JKUAT', 'Maseno University'] },
    { course: 'Bachelor of Science (Nutrition and Dietetics)', universities: ['University of Nairobi', 'Kenyatta University', 'JKUAT'] },
    { course: 'Certificate in Food Safety', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in Food Quality Assurance', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Science (Post-Harvest Technology)', universities: ['JKUAT', 'Egerton University', 'University of Nairobi'] }
  ],
  18: [
    { course: 'Bachelor of Science (Geography)', universities: ['University of Nairobi', 'Moi University', 'Egerton University', 'Kenyatta University'] },
    { course: 'Diploma in Natural Resource Management', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University', 'Egerton University'] },
    { course: 'Bachelor of Science (Environmental Science)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Certificate in Water Resource Management', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Diploma in Environmental Conservation', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Science (Geomorphology)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Certificate in Climate Change Studies', universities: ['Technical University of Kenya', 'Maseno University', 'Nairobi Institute of Business Studies'] },
    { course: 'Diploma in Disaster Risk Management', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Science (Climatology)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Certificate in Environmental Impact Assessment', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Diploma in Environmental Monitoring', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Science (Biogeography)', universities: ['University of Nairobi', 'Egerton University', 'Moi University'] },
    { course: 'Certificate in Land Degradation Studies', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Diploma in Conservation Biology', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Science (Urban and Regional Planning)', universities: ['JKUAT', 'University of Nairobi', 'Moi University'] }
  ],
  19: [
    { course: 'Bachelor of Arts (French)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University', 'Egerton University'] },
    { course: 'Diploma in Translation (French)', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University', 'Moi University'] },
    { course: 'Bachelor of Arts (French and Linguistics)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Certificate in French Language Studies', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in French Literature', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Arts (French and English)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Certificate in Francophone Studies', universities: ['Technical University of Kenya', 'Maseno University', 'Nairobi Institute of Business Studies'] },
    { course: 'Diploma in French Business Communication', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Arts (French Cultural Studies)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Certificate in French Teaching', universities: ['Nairobi Institute of Business Studies', 'Technical University of Kenya', 'Maseno University'] },
    { course: 'Diploma in Interpretation (French)', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Arts (Comparative French Studies)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Certificate in French Tourism', universities: ['Technical University of Kenya', 'Maseno University', 'Nairobi Institute of Business Studies'] },
    { course: 'Diploma in Francophone Literature', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Arts (French and Philosophy)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] }
  ],
  20: [
    { course: 'Bachelor of Arts (German)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University', 'Egerton University'] },
    { course: 'Diploma in German Language', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University', 'Moi University'] },
    { course: 'Bachelor of Arts (German and Linguistics)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Certificate in German Language Studies', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in German Literature', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Arts (German and English)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Certificate in German Business Communication', universities: ['Technical University of Kenya', 'Maseno University', 'Nairobi Institute of Business Studies'] },
    { course: 'Diploma in Translation (German)', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Arts (German Cultural Studies)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Certificate in German Teaching', universities: ['Nairobi Institute of Business Studies', 'Technical University of Kenya', 'Maseno University'] },
    { course: 'Diploma in Interpretation (German)', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Arts (Comparative German Studies)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Certificate in German Tourism', universities: ['Technical University of Kenya', 'Maseno University', 'Nairobi Institute of Business Studies'] },
    { course: 'Diploma in German Literature and Culture', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Arts (German and Philosophy)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] }
  ],
  21: [
    { course: 'Bachelor of Music', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University', 'Egerton University'] },
    { course: 'Diploma in Music and Performance', universities: ['Maseno University', 'Kisii University', 'Technical University of Kenya', 'Moi University'] },
    { course: 'Bachelor of Arts (Music Education)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Certificate in Music Production', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in Music Composition', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Arts (Music and Ethnomusicology)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Certificate in Sound Engineering', universities: ['Technical University of Kenya', 'Maseno University', 'Nairobi Institute of Business Studies'] },
    { course: 'Diploma in Studio Recording', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Arts (Contemporary Music)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Certificate in Music Technology', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in Music Management', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Arts (World Music Studies)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Certificate in Music Therapy', universities: ['Technical University of Kenya', 'Maseno University', 'Nairobi Institute of Business Studies'] },
    { course: 'Diploma in Classical Music', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Arts (Music and Cultural Studies)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] }
  ],
  22: [
    { course: 'Bachelor of Education (Arts)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University', 'Egerton University'] },
    { course: 'Diploma in Education', universities: ['Maseno University', 'Kisii University', 'Technical University of Kenya', 'Moi University'] },
    { course: 'Bachelor of Education (Science)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University', 'Egerton University'] },
    { course: 'Certificate in Teacher Training', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in Early Childhood Education', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Education (Primary)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Certificate in Curriculum Development', universities: ['Technical University of Kenya', 'Maseno University', 'Nairobi Institute of Business Studies'] },
    { course: 'Diploma in Educational Administration', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Education (Secondary)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Certificate in Instructional Design', universities: ['Technical University of Kenya', 'Maseno University', 'Nairobi Institute of Business Studies'] },
    { course: 'Diploma in Educational Technology', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Education (Adult Learning)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Certificate in Special Education Teaching', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Diploma in Teacher Professional Development', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Education (Distance Learning)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] }
  ],
  23: [
    { course: 'Bachelor of Theology/Religious Studies', universities: ['Kenyatta University', 'Moi University', 'University of Nairobi', 'Egerton University'] },
    { course: 'Diploma in Religious Studies', universities: ['Maseno University', 'Kisii University', 'Technical University of Kenya', 'Moi University'] },
    { course: 'Bachelor of Arts (Biblical Studies)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Certificate in Pastoral Theology', universities: ['Technical University of Kenya', 'Nairobi Institute of Business Studies', 'Maseno University'] },
    { course: 'Diploma in Theological Studies', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Arts (Christian Ministry)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Certificate in Religious Education', universities: ['Technical University of Kenya', 'Maseno University', 'Nairobi Institute of Business Studies'] },
    { course: 'Diploma in Missiology', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Arts (Religious Philosophy)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Certificate in Comparative Religion', universities: ['Technical University of Kenya', 'Maseno University', 'Nairobi Institute of Business Studies'] },
    { course: 'Diploma in Church Administration', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Arts (Islamic Studies)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Certificate in Interfaith Dialogue', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Diploma in Religious Leadership', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] },
    { course: 'Bachelor of Arts (Religion and Society)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] }
  ]
};

export default CLUSTER_COURSES;

