

export enum Subject {
  CSE = "Computer Science & Engg",
  IT = "Information Technology",
  MECH = "Mechanical Engineering",
  ELECTRICAL = "Electrical Engineering",
  ENTC = "Electronics & Telecom",
  CIVIL = "Civil Engineering",
  GEN = "General Aptitude"
}

export enum Difficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard"
}

export enum Role {
  USER = 'User',
  ADMIN = 'Admin'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
  subject: Subject;
  topic: string; // e.g., "Thermodynamics" or "Operating Systems"
  difficulty: Difficulty;
}

export interface ExamResult {
  id: string;
  date: string; // ISO string
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  subject: Subject;
  testName: string; // e.g. "Mock Test 1"
  timeTakenSeconds: number;
}

export interface SyllabusItem {
  id: string;
  subject: Subject;
  topic: string;
  completed: boolean;
}

export interface UserStats {
  testsTaken: number;
  averageScore: number;
  hoursStudied: number;
  streakDays: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; 
  role: Role;
  phone?: string;
  branch?: string;
  bio?: string;
  avatar?: string; // Data URL for profile picture
  joinedDate?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'alert' | 'success';
}

export enum MaterialType {
  NOTE = 'Note',
  VIDEO = 'Video',
  PAPER = 'Paper',
  MIND_MAP = 'Mind Map',
  FLOW_CHART = 'Flow Chart'
}

export interface MaterialItem {
  id: string;
  title: string;
  subject: Subject;
  type: MaterialType;
  url: string;
  description?: string;
  year?: number; // For past papers
}

export enum FeedbackType {
  BUG = 'Report Issue',
  FEATURE = 'Feature Request',
  GENERAL = 'General Feedback'
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  type: FeedbackType;
  message: string;
  date: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}
