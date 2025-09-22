
export interface DailyTask {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  icon: string;
  requiresApp?: 'yazio' | 'strava';
}

export interface DayProgress {
  day: number;
  date: string;
  tasks: DailyTask[];
  allCompleted: boolean;
  weeklyChallenge?: string;
}

export interface ChallengeData {
  startDate: string;
  currentDay: number;
  days: DayProgress[];
  totalDays: 75;
}

export const DEFAULT_DAILY_TASKS: Omit<DailyTask, 'completed'>[] = [
  {
    id: 'progress-photo',
    name: 'Progress Photo',
    description: 'Take a progress photo with your phone',
    icon: 'camera',
  },
  {
    id: 'water-intake',
    name: 'Water Intake',
    description: 'Track water intake via YAZIO',
    icon: 'water',
    requiresApp: 'yazio',
  },
  {
    id: 'healthy-diet',
    name: 'Healthy Diet',
    description: 'Follow healthy diet via YAZIO',
    icon: 'nutrition',
    requiresApp: 'yazio',
  },
  {
    id: 'workout',
    name: 'Workout',
    description: 'Complete workout tracked via STRAVA',
    icon: 'fitness',
    requiresApp: 'strava',
  },
  {
    id: 'no-alcohol',
    name: 'No Alcohol',
    description: 'Stay alcohol-free today',
    icon: 'close-circle',
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
