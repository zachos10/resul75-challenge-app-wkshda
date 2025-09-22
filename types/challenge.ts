
export interface DailyTask {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  icon: string;
  requiresApp?: 'yazio' | 'strava';
  points: number;
}

export interface WeeklyChallenge {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  week: number;
  points: number;
}

export interface DayProgress {
  day: number;
  date: string;
  tasks: DailyTask[];
  weeklyChallenge?: WeeklyChallenge;
  allCompleted: boolean;
  totalPoints: number;
}

export interface AthleteScore {
  athleteId: string;
  athleteName: string;
  totalScore: number;
  completedTasks: number;
  currentStreak: number;
  lastUpdated: string;
}

export interface ChallengeData {
  startDate: string;
  currentDay: number;
  days: DayProgress[];
  totalDays: 75;
  totalScore: number;
  athleteId: string;
  athleteName: string;
}

export const DEFAULT_DAILY_TASKS: Omit<DailyTask, 'completed'>[] = [
  {
    id: 'progress-photo',
    name: 'Progress Photo',
    description: 'Take a progress photo with your phone',
    icon: 'camera',
    points: 10,
  },
  {
    id: 'water-intake',
    name: 'Water Intake',
    description: 'Track water intake via YAZIO',
    icon: 'water',
    requiresApp: 'yazio',
    points: 10,
  },
  {
    id: 'healthy-diet',
    name: 'Healthy Diet',
    description: 'Follow healthy diet via YAZIO',
    icon: 'nutrition',
    requiresApp: 'yazio',
    points: 10,
  },
  {
    id: 'workout',
    name: 'Workout',
    description: 'Complete workout tracked via STRAVA',
    icon: 'fitness',
    requiresApp: 'strava',
    points: 10,
  },
  {
    id: 'no-alcohol',
    name: 'No Alcohol',
    description: 'Stay alcohol-free today',
    icon: 'close-circle',
    points: 10,
  },
];

export const WEEKLY_CHALLENGES = [
  'Complete 3 extra cardio sessions',
  'Try a new healthy recipe',
  'Meditate for 10 minutes daily',
  'Take 10,000 steps every day',
  'Do 100 push-ups throughout the week',
  'Drink green tea instead of coffee',
  'Read for 30 minutes daily',
  'Take cold showers',
  'Practice gratitude journaling',
  'Try a new workout class',
  'Meal prep for the entire week',
];
