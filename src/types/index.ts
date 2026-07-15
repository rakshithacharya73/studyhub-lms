export interface ClassData {
  id: string;
  name: string;
  description: string;
  videosCount: number;
  gradientClass: string;
}

export interface TopicData {
  id: string;
  name: string;
  description: string;
  classesCount: number;
  videosCount: number;
  gradientClass: string;
  icon: string;
  classes: ClassData[];
}

export interface CategoryData {
  id: string;
  name: string;
  description: string;
  topicsCount: number;
  videosCount: number;
  gradientClass: string;
  icon: string;
  topics: TopicData[];
}

export interface User {
  uid: string;
  role: 'teacher' | 'student';
  schoolCode: string;
  name: string;
  email: string;
}

export interface QuizAttempt {
  id?: string;
  studentId: string;
  studentName: string;
  schoolCode: string;
  classId: string;
  className: string;
  score: number;
  totalQuestions: number;
  timestamp: Date | string | any;
}

export interface UploadedVideo {
  id?: string;
  fileName: string;
  fileSize: string;
  classId: string;
  className: string;
  schoolCode: string;
  timestamp: Date | string | any;
}

export interface UploadedNote {
  id?: string;
  fileName: string;
  fileSize: string;
  classId: string;
  className: string;
  schoolCode: string;
  timestamp: Date | string | any;
}
