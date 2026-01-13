export type CourseEntry = {
  course: string;
  universities: string[];
  note?: string;
};

export const CLUSTER_COURSES: Record<number, CourseEntry[]> = {
  1: [
    { course: 'Bachelor of Laws (LL.B)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Diploma in Paralegal Studies', universities: ['Kenyatta University - Diploma College', 'Technical University of Kenya', 'Maseno University'] },
    { course: 'Bachelor of Arts (Political Science)', universities: ['University of Nairobi', 'Egerton University', 'Moi University'] },
    { course: 'Bachelor of Commerce (Corporate Law option)', universities: ['Jomo Kenyatta University of Agriculture and Technology', 'Kenyatta University', 'University of Nairobi'] },
    { course: 'Diploma in Human Rights', universities: ['Kisii University', 'Technical University of Kenya', 'Maseno University'] },
    { course: 'Bachelor of Arts (Sociology)', universities: ['Moi University', 'University of Nairobi', 'Kenyatta University'] },
    { course: 'Certificate/Diploma in Litigation Support', universities: ['Technical University of Kenya', 'Kisii University', 'PCEA Kikuyu College'] },
    { course: 'Bachelor of Arts (Criminology & Security Studies)', universities: ['Egerton University', 'Moi University', 'Kenyatta University'] },
    { course: 'Diploma in Law and Public Administration', universities: ['Maseno University', 'University of Eldoret', 'Kisii University'] },
    { course: 'Post-Secondary Paralegal Certificate', universities: ['Technical University of Mombasa', 'Kenya Institute of Legal Studies', 'Nairobi Institute of Business Studies'] }
  ],
  2: [
    { course: 'Bachelor of Commerce', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Bachelor of Business Management', universities: ['Egerton University', 'Maseno University', 'Jomo Kenyatta University of Agriculture and Technology'] },
    { course: 'Diploma in Business Administration', universities: ['Technical University of Kenya', 'Kisii University', 'Kenya Institute of Management'] },
    { course: 'Bachelor of Economics', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Diploma in Accounting', universities: ['Kenya Institute of Management', 'Technical University of Mombasa', 'Nairobi Institute of Business Studies'] },
    { course: 'Bachelor of Commerce (Finance)', universities: ['JKUAT', 'University of Nairobi', 'USIU Africa'] },
    { course: 'Higher Diploma in Marketing', universities: ['Kisii University', 'Maseno University', 'Egerton University'] },
    { course: 'Diploma in Supply Chain Management', universities: ['Technical University of Kenya', 'Kenyatta University', 'Moi University'] },
    { course: 'Certificate in Entrepreneurship', universities: ['Nairobi Institute of Business Studies', 'Kenya Institute of Management', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Business Information Technology', universities: ['JKUAT', 'Kenyatta University', 'University of Nairobi'] }
  ],
  3: [
    { course: 'Bachelor of Arts (English)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Bachelor of Arts (History)', universities: ['Egerton University', 'Maseno University', 'Kenyatta University'] },
    { course: 'Diploma in Community Development', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] },
    { course: 'Bachelor of Arts (Mass Communication)', universities: ['University of Nairobi', 'JKUAT', 'Moi University'] },
    { course: 'Diploma in Creative Writing', universities: ['Nairobi Institute of Business Studies', 'Kisii University', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Arts (Linguistics)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Diploma in Theatre Arts', universities: ['Maseno University', 'Kisii University', 'Technical University of Kenya'] },
    { course: 'Certificate in Journalism', universities: ['Nairobi Institute of Business Studies', 'Kenya Institute of Mass Communication', 'Technical University of Kenya'] },
    { course: 'Bachelor of Arts (Religious Studies)', universities: ['Egerton University', 'Kenyatta University', 'Moi University'] },
    { course: 'Diploma in Social Work', universities: ['Maseno University', 'Kisii University', 'Technical University of Mombasa'] }
  ],
  4: [
    { course: 'Bachelor of Science (Geology)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Bachelor of Surveying and Mapping', universities: ['JKUAT', 'Technical University of Kenya', 'Kenyatta University'] },
    { course: 'Diploma in Geological Technology', universities: ['Egerton University', 'Masinde Muliro University', 'Technical University of Mombasa'] },
    { course: 'Bachelor of Science (Environmental Science)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Diploma in Land Surveying', universities: ['Technical University of Kenya', 'JKUAT', 'Kisii University'] },
    { course: 'Certificate in GIS and Remote Sensing', universities: ['Maseno University', 'Technical University of Kenya', 'University of Nairobi'] },
    { course: 'Bachelor of Science (Natural Resources Management)', universities: ['Egerton University', 'Moi University', 'Kenyatta University'] },
    { course: 'Diploma in Cartography', universities: ['JKUAT', 'Technical University of Kenya', 'Maseno University'] },
    { course: 'Bachelor of Science (Geospatial Engineering)', universities: ['JKUAT', 'University of Nairobi', 'Moi University'] },
    { course: 'Certificate in Mineral Exploration', universities: ['Egerton University', 'Technical University of Mombasa', 'Kisii University'] }
  ],
  5: [
    { course: 'Bachelor of Education (Special Needs)', universities: ['Kenyatta University', 'Moi University', 'University of Nairobi'] },
    { course: 'Diploma in Special Needs Education', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] }
  ],
  6: [
    { course: 'Bachelor of Arts (Kiswahili)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Diploma in Kiswahili Translation', universities: ['Technical University of Kenya', 'Kenyatta University', 'Maseno University'] }
  ],
  7: [
    { course: 'Bachelor of Engineering (Civil)', universities: ['University of Nairobi', 'JKUAT', 'Moi University'] },
    { course: 'Diploma in Civil Engineering', universities: ['Technical University of Kenya', 'Kisii University', 'Maseno University'] }
  ],
  8: [
    { course: 'Bachelor of Architecture', universities: ['JKUAT', 'University of Nairobi', 'Kenyatta University'] },
    { course: 'Diploma in Architectural Technology', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] }
  ],
  9: [
    { course: 'Bachelor of Science (Computer Science)', universities: ['University of Nairobi', 'JKUAT', 'Kenyatta University'] },
    { course: 'Diploma in Information Technology', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] }
  ],
  10: [
    { course: 'Bachelor of Science (Agriculture)', universities: ['Egerton University', 'University of Nairobi', 'Maseno University'] },
    { course: 'Diploma in Agribusiness', universities: ['Kisii University', 'Technical University of Mombasa', 'Kenyatta University'] }
  ],
  11: [
    { course: 'Bachelor of Science (Biology)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Diploma in Laboratory Technology', universities: ['Kenyatta University', 'Technical University of Kenya', 'Maseno University'] }
  ],
  12: [
    { course: 'Bachelor of Science (Mathematics and Economics)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Diploma in Applied Statistics', universities: ['Egerton University', 'Technical University of Kenya', 'Maseno University'] }
  ],
  13: [
    { course: 'Bachelor of Design (Textiles)', universities: ['Kenyatta University', 'University of Nairobi', 'JKUAT'] },
    { course: 'Diploma in Fashion and Textile Design', universities: ['Kenya Textile Training Institute', 'Technical University of Mombasa', 'Maseno University'] }
  ],
  14: [
    { course: 'Diploma in Sports Management', universities: ['Kenya Institute of Sports', 'Maseno University', 'Technical University of Kenya'] },
    { course: 'Bachelor of Science (Physical Education)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] }
  ],
  15: [
    { course: 'Bachelor of Medicine & Surgery (MBChB)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Diploma in Clinical Medicine', universities: ['Kenya Medical Training College', 'Technical University of Kenya', 'Maseno University'] }
  ],
  16: [
    { course: 'Bachelor of Arts (History)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Diploma in Heritage Management', universities: ['Maseno University', 'Kisii University', 'Technical University of Kenya'] }
  ],
  17: [
    { course: 'Bachelor of Science (Agriculture and Environmental Science)', universities: ['Egerton University', 'University of Nairobi', 'Moi University'] },
    { course: 'Diploma in Food Science and Technology', universities: ['Kenyatta University', 'Technical University of Kenya', 'Maseno University'] }
  ],
  18: [
    { course: 'Bachelor of Science (Geography)', universities: ['University of Nairobi', 'Moi University', 'Egerton University'] },
    { course: 'Diploma in Natural Resource Management', universities: ['Maseno University', 'Technical University of Kenya', 'Kisii University'] }
  ],
  19: [
    { course: 'Bachelor of Arts (French)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Diploma in Translation (French)', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] }
  ],
  20: [
    { course: 'Bachelor of Arts (German)', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Diploma in German Language', universities: ['Technical University of Kenya', 'Maseno University', 'Kisii University'] }
  ],
  21: [
    { course: 'Bachelor of Music', universities: ['University of Nairobi', 'Moi University', 'Kenyatta University'] },
    { course: 'Diploma in Music and Performance', universities: ['Maseno University', 'Kisii University', 'Technical University of Kenya'] }
  ],
  22: [
    { course: 'Bachelor of Education (Arts)', universities: ['University of Nairobi', 'Kenyatta University', 'Moi University'] },
    { course: 'Diploma in Education', universities: ['Maseno University', 'Kisii University', 'Technical University of Kenya'] }
  ],
  23: [
    { course: 'Bachelor of Theology/Religious Studies', universities: ['Kenyatta University', 'Moi University', 'University of Nairobi'] },
    { course: 'Diploma in Religious Studies', universities: ['Maseno University', 'Kisii University', 'Technical University of Kenya'] }
  ]
};

export default CLUSTER_COURSES;
