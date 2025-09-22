
export interface Athlete {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalScore: number;
  completedTasks: number;
  currentStreak: number;
  isActive: boolean;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
