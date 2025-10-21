// Core TypeScript interfaces for the AI Career Agent Platform

export interface User {
  id: string;
  name: string;
  email: string;
  careerStage: 'student' | 'graduate' | 'professional';
  graduationDate?: string;
  currentRole?: string;
  targetRole?: string;
  skills: string[];
  resumeUrl?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  jobAlerts: boolean;
  emailNotifications: boolean;
  locations: string[];
  industries: string[];
  salaryRange: { min: number; max: number };
  remotePreference: 'remote' | 'hybrid' | 'onsite' | 'any';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote: boolean;
  salary: { min: number; max: number };
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  source: 'Indeed' | 'LinkedIn' | 'Glassdoor' | 'Custom';
  aiScore: number;
  matchAnalysis: {
    skillsMatch: number;
    experienceMatch: number;
    locationMatch: number;
    salaryMatch: number;
    overallFit: string;
  };
  applicationStatus?: 'not-applied' | 'applied' | 'interview' | 'offer' | 'rejected';
}

export interface Resume {
  id: string;
  name: string;
  uploadDate: string;
  atsScore: number;
  analysis: ResumeAnalysis;
  content: string;
}

export interface ResumeAnalysis {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  keywordMatch: number;
  formatScore: number;
  contentScore: number;
  tailoredSuggestions?: { [jobId: string]: string[] };
}

export interface MarketData {
  salaryTrends: {
    role: string;
    avgSalary: number;
    trend: number;
    location: string;
  }[];
  skillDemand: {
    skill: string;
    demand: number;
    growth: number;
  }[];
  industryTrends: {
    industry: string;
    jobCount: number;
    avgSalary: number;
    growth: number;
  }[];
}

export interface CareerRoadmap {
  currentLevel: string;
  targetLevel: string;
  estimatedTimeline: string;
  requiredSkills: {
    skill: string;
    currentLevel: number;
    requiredLevel: number;
    resources: string[];
  }[];
  milestones: {
    title: string;
    description: string;
    timeframe: string;
    completed: boolean;
  }[];
}

export interface EmailNotification {
  id: string;
  type: 'interview' | 'application-update' | 'job-alert' | 'weekly-report';
  subject: string;
  sender: string;
  receivedDate: string;
  content: string;
  actionRequired?: boolean;
  calendarEvent?: CalendarEvent;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  meetingLink?: string;
  company: string;
  type: 'interview' | 'networking' | 'deadline';
}

export type NavigationPage = 
  | 'landing'
  | 'login'
  | 'onboarding'
  | 'dashboard'
  | 'job-search'
  | 'job-swiper'
  | 'application-tracker'
  | 'resume'
  | 'cover-letter'
  | 'market-intelligence'
  | 'gmail'
  | 'mock-interview'
  | 'skill-gap'
  | 'offer-comparison'
  | 'settings';