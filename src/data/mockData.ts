import { CategoryData } from '../types';

export const mockCategories: CategoryData[] = [
  {
    id: 'prastuti', name: 'Prastuti',
    description: 'Comprehensive mathematics and science curriculum for classes 8-10',
    topicsCount: 6, videosCount: 78, gradientClass: 'bg-gradient-prastuti', icon: 'microscope',
    topics: [
      {
        id: 'science', name: 'Science',
        description: 'Scientific experiments and interactive activities',
        classesCount: 3, videosCount: 35, gradientClass: 'bg-gradient-science', icon: 'microscope',
        classes: [
          { id: 'class-8-sci', name: 'Class 8', description: 'Interactive science experiments and activities for Class 8 students', videosCount: 17, gradientClass: 'bg-gradient-class8-sci' },
          { id: 'class-9-sci', name: 'Class 9', description: 'Interactive science experiments and activities for Class 9 students', videosCount: 17, gradientClass: 'bg-gradient-class9-sci' },
          { id: 'class-10-sci', name: 'Class 10', description: 'Interactive science experiments and activities for Class 10 students', videosCount: 1, gradientClass: 'bg-gradient-class10-sci' }
        ]
      },
      {
        id: 'maths', name: 'Maths',
        description: 'Mathematical concepts and problem-solving...',
        classesCount: 3, videosCount: 43, gradientClass: 'bg-gradient-maths', icon: 'calculator',
        classes: [
          { id: 'class-8-math', name: 'Class 8', description: 'Mathematics activities and concepts for Class 8 students', videosCount: 16, gradientClass: 'bg-gradient-class8-math' },
          { id: 'class-9-math', name: 'Class 9', description: 'Mathematics activities and concepts for Class 9 students', videosCount: 16, gradientClass: 'bg-gradient-class9-math' },
          { id: 'class-10-math', name: 'Class 10', description: 'Mathematics activities and concepts for Class 10 students', videosCount: 11, gradientClass: 'bg-gradient-class10-math' }
        ]
      }
    ]
  },
  {
    id: 'anubhav', name: 'Anubhav',
    description: 'Hands-on experiential learning activities through practical exploration',
    topicsCount: 3, videosCount: 13, gradientClass: 'bg-gradient-anubhav', icon: 'book', topics: []
  },
  {
    id: 'geomagic', name: 'Geomagic',
    description: 'Geometric concepts and visual mathematics through interactive activities',
    topicsCount: 3, videosCount: 48, gradientClass: 'bg-gradient-geomagic', icon: 'code', topics: []
  }
];
