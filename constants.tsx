
import { Grade, Subject, ClusterRequirement } from './types';

export const GRADE_POINTS: Record<Grade, number> = {
  'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8, 'C+': 7, 
  'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1
};

export const SUBJECTS: Subject[] = [
  { id: 'eng', name: 'English', category: 'compulsory' },
  { id: 'kis', name: 'Kiswahili', category: 'compulsory' },
  { id: 'mat', name: 'Mathematics', category: 'compulsory' },
  { id: 'bio', name: 'Biology', category: 'sciences' },
  { id: 'phy', name: 'Physics', category: 'sciences' },
  { id: 'che', name: 'Chemistry', category: 'sciences' },
  { id: 'his', name: 'History', category: 'humanities' },
  { id: 'geo', name: 'Geography', category: 'humanities' },
  { id: 'cre', name: 'CRE/IRE/HRE', category: 'humanities' },
  { id: 'agr', name: 'Agriculture', category: 'technical' },
  { id: 'bus', name: 'Business Studies', category: 'technical' },
  { id: 'comp', name: 'Computer Studies', category: 'technical' },
  { id: 'home', name: 'Home Science', category: 'technical' },
  { id: 'art', name: 'Art and Design', category: 'technical' },
  { id: 'fre', name: 'French', category: 'languages' },
  { id: 'ger', name: 'German', category: 'languages' },
  { id: 'ara', name: 'Arabic', category: 'languages' },
  { id: 'mus', name: 'Music', category: 'languages' },
];

export const CLUSTERS: ClusterRequirement[] = [
  { id: 1, name: 'Law', subjects: [['eng'], ['his', 'geo', 'cre'], ['mat', 'bio', 'phy', 'che'], ['kis', 'bus']] },
  { id: 2, name: 'Business, Hospitality & Related', subjects: [['mat'], ['eng', 'kis'], ['bio', 'phy', 'che'], ['bus', 'geo', 'his']] },
  { id: 3, name: 'Social Sciences, Media Studies, Fine Arts, Film, Animation, Graphics & Related', subjects: [['eng', 'kis'], ['mat', 'bio', 'phy', 'che'], ['his', 'geo', 'cre'], ['art', 'mus', 'bus', 'fre', 'ger', 'ara']] },
  { id: 4, name: 'Geosciences & Related', subjects: [['mat'], ['phy'], ['che'], ['geo']] },
  { id: 5, name: 'Engineering, Engineering Technology & Related', subjects: [['mat'], ['phy'], ['che'], ['bio', 'geo', 'eng', 'kis']] },
  { id: 6, name: 'Architecture, Building Construction & Related', subjects: [['mat'], ['phy'], ['eng', 'kis'], ['che', 'bio', 'art', 'geo']] },
  { id: 7, name: 'Computing, IT & Related', subjects: [['mat'], ['phy', 'bio', 'che'], ['eng', 'kis'], ['comp', 'bus', 'geo']] },
  { id: 8, name: 'Agribusiness & Related', subjects: [['mat'], ['bio', 'che'], ['eng', 'kis'], ['bus', 'agr']] },
  { id: 9, name: 'General Science, Biological Sciences, Physics, Chemistry & Related', subjects: [['mat'], ['bio'], ['che'], ['phy', 'geo']] },
  { id: 10, name: 'Actuarial Science, Accountancy, Mathematics, Economics, Statistics & Related', subjects: [['mat'], ['eng', 'kis'], ['bio', 'phy', 'che'], ['bus', 'geo']] },
  { id: 11, name: 'Interior Design, Fashion Design, Textiles & Related', subjects: [['art', 'home'], ['mat', 'bio', 'phy', 'che'], ['eng', 'kis'], ['bus', 'his', 'geo']] },
  { id: 12, name: 'Sport Science & Related', subjects: [['bio'], ['eng', 'kis'], ['mat', 'phy', 'che'], ['his', 'geo', 'cre', 'bus']] },
  { id: 13, name: 'Medicine, Health, Veterinary Medicine & Related', subjects: [['bio'], ['che'], ['mat', 'phy'], ['eng', 'kis']] },
  { id: 14, name: 'History, Archeology & Related', subjects: [['his'], ['eng', 'kis'], ['mat', 'bio', 'phy', 'che'], ['geo', 'cre', 'bus']] },
  { id: 15, name: 'Agriculture, Animal Health, Food Science, Nutrition Dietetics, Environmental Sciences, Natural Resources & Related', subjects: [['bio'], ['che'], ['mat', 'phy', 'geo'], ['agr', 'bus', 'eng', 'kis']] },
  { id: 16, name: 'Geography & Related', subjects: [['geo'], ['mat'], ['bio', 'phy', 'che'], ['eng', 'kis', 'bus']] },
  { id: 17, name: 'French & German', subjects: [['fre', 'ger', 'ara'], ['eng', 'kis'], ['mat', 'bio', 'phy', 'che'], ['his', 'geo', 'cre']] },
  { id: 18, name: 'Music & Related', subjects: [['mus'], ['eng', 'kis'], ['mat', 'bio', 'phy', 'che'], ['his', 'geo', 'cre', 'fre', 'ger', 'ara']] },
  { id: 19, name: 'Education & Related', subjects: [['eng', 'kis'], ['mat', 'bio', 'phy', 'che'], ['his', 'geo', 'cre'], ['bus', 'art', 'fre', 'ger', 'ara']] },
  { id: 20, name: 'Religious Studies, Theology, Islamic Studies & Related', subjects: [['cre', 'ara'], ['eng', 'kis'], ['mat', 'bio', 'phy', 'che'], ['his', 'geo']] }
];
