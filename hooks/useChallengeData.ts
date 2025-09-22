
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChallengeData, DayProgress, DEFAULT_DAILY_TASKS, WEEKLY_CHALLENGES, WeeklyChallenge } from '../types/challenge';
import { Athlete } from '../types/athlete';

const STORAGE_KEY = 'resul75_challenge_data';
const ATHLETES_KEY = 'resul75_athletes';

export const useChallengeData = () => {
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);

  const generateAthleteId = () => {
    return 'athlete_' + Math.random().toString(36).substr(2, 9);
  };

  const initializeChallenge = async (athlete?: Athlete) => {
    console.log('Initializing new challenge');
    const startDate = new Date().toISOString().split('T')[0];
    const days: DayProgress[] = [];
    
    let athleteId: string;
    let athleteName: string;

    if (athlete) {
      athleteId = athlete.id;
      athleteName = athlete.name;
    } else {
      // Check for current athlete
      const currentAthleteData = await AsyncStorage.getItem('current_athlete');
      if (currentAthleteData) {
        const currentAthlete = JSON.parse(currentAthleteData) as Athlete;
        athleteId = currentAthlete.id;
        athleteName = currentAthlete.name;
      } else {
        // Fallback for existing users
        athleteId = generateAthleteId();
        athleteName = 'Athlete ' + Math.floor(Math.random() * 1000);
      }
    }

    for (let i = 1; i <= 75; i++) {
      const date = new Date();
      date.setDate(date.getDate() + (i - 1));
      
      const weekNumber = Math.floor((i - 1) / 7) + 1;
      const isFirstDayOfWeek = (i - 1) % 7 === 0;
      
      let weeklyChallenge: WeeklyChallenge | undefined;
      if (isFirstDayOfWeek && weekNumber <= WEEKLY_CHALLENGES.length) {
        weeklyChallenge = {
          id: `weekly-challenge-${weekNumber}`,
          name: 'Weekly Challenge',
          description: WEEKLY_CHALLENGES[weekNumber - 1],
          completed: false,
          week: weekNumber,
          points: 10,
        };
      }

      const tasks = DEFAULT_DAILY_TASKS.map(task => ({
        ...task,
        completed: false,
      }));

      days.push({
        day: i,
        date: date.toISOString().split('T')[0],
        tasks,
        weeklyChallenge,
        allCompleted: false,
        totalPoints: 0,
      });
    }

    const newChallengeData: ChallengeData = {
      startDate,
      currentDay: 1,
      days,
      totalDays: 75,
      totalScore: 0,
      athleteId,
      athleteName,
    };

    setChallengeData(newChallengeData);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newChallengeData));
    return newChallengeData;
  };

  const loadChallengeData = async () => {
    try {
      console.log('Loading challenge data');
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as ChallengeData;
        
        // Check if we have a current athlete and update if needed
        const currentAthleteData = await AsyncStorage.getItem('current_athlete');
        if (currentAthleteData) {
          const currentAthlete = JSON.parse(currentAthleteData) as Athlete;
          if (data.athleteId !== currentAthlete.id) {
            // Different athlete, initialize new challenge
            return await initializeChallenge(currentAthlete);
          }
          // Update athlete name if it changed
          if (data.athleteName !== currentAthlete.name) {
            data.athleteName = currentAthlete.name;
          }
        }
        
        // Migrate old data if needed
        if (!data.athleteId) {
          data.athleteId = generateAthleteId();
          data.athleteName = 'Athlete ' + Math.floor(Math.random() * 1000);
        }
        if (!data.totalScore) {
          data.totalScore = calculateTotalScore(data.days);
        }
        setChallengeData(data);
        return data;
      } else {
        return await initializeChallenge();
      }
    } catch (error) {
      console.error('Error loading challenge data:', error);
      return await initializeChallenge();
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalScore = (days: DayProgress[]) => {
    return days.reduce((total, day) => {
      const taskPoints = day.tasks.reduce((dayTotal, task) => 
        dayTotal + (task.completed ? task.points : 0), 0
      );
      const weeklyPoints = day.weeklyChallenge?.completed ? day.weeklyChallenge.points : 0;
      return total + taskPoints + weeklyPoints;
    }, 0);
  };

  const updateTaskCompletion = async (day: number, taskId: string, completed: boolean) => {
    if (!challengeData) return;

    console.log(`Updating task ${taskId} for day ${day}: ${completed}`);
    
    const updatedDays = challengeData.days.map(dayData => {
      if (dayData.day === day) {
        const updatedTasks = dayData.tasks.map(task => 
          task.id === taskId ? { ...task, completed } : task
        );
        
        const taskPoints = updatedTasks.reduce((total, task) => 
          total + (task.completed ? task.points : 0), 0
        );
        const weeklyPoints = dayData.weeklyChallenge?.completed ? dayData.weeklyChallenge.points : 0;
        const totalPoints = taskPoints + weeklyPoints;
        
        const allCompleted = updatedTasks.every(task => task.completed) && 
          (!dayData.weeklyChallenge || dayData.weeklyChallenge.completed);
        
        return {
          ...dayData,
          tasks: updatedTasks,
          allCompleted,
          totalPoints,
        };
      }
      return dayData;
    });

    const totalScore = calculateTotalScore(updatedDays);

    const updatedChallengeData = {
      ...challengeData,
      days: updatedDays,
      totalScore,
    };

    setChallengeData(updatedChallengeData);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChallengeData));
    
    // Update athlete score in athletes list
    await updateAthleteScore(updatedChallengeData);
  };

  const updateWeeklyChallengeCompletion = async (day: number, completed: boolean) => {
    if (!challengeData) return;

    console.log(`Updating weekly challenge for day ${day}: ${completed}`);
    
    const updatedDays = challengeData.days.map(dayData => {
      if (dayData.day === day && dayData.weeklyChallenge) {
        const updatedWeeklyChallenge = {
          ...dayData.weeklyChallenge,
          completed,
        };
        
        const taskPoints = dayData.tasks.reduce((total, task) => 
          total + (task.completed ? task.points : 0), 0
        );
        const weeklyPoints = completed ? updatedWeeklyChallenge.points : 0;
        const totalPoints = taskPoints + weeklyPoints;
        
        const allCompleted = dayData.tasks.every(task => task.completed) && completed;
        
        return {
          ...dayData,
          weeklyChallenge: updatedWeeklyChallenge,
          allCompleted,
          totalPoints,
        };
      }
      return dayData;
    });

    const totalScore = calculateTotalScore(updatedDays);

    const updatedChallengeData = {
      ...challengeData,
      days: updatedDays,
      totalScore,
    };

    setChallengeData(updatedChallengeData);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChallengeData));
    
    // Update athlete score in athletes list
    await updateAthleteScore(updatedChallengeData);
  };

  const updateAthleteScore = async (challengeData: ChallengeData) => {
    try {
      const athletesData = await AsyncStorage.getItem(ATHLETES_KEY);
      if (athletesData) {
        const athletes: Athlete[] = JSON.parse(athletesData);
        const athleteIndex = athletes.findIndex(a => a.id === challengeData.athleteId);
        
        if (athleteIndex >= 0) {
          const completedTasks = challengeData.days.reduce((total, day) => {
            const taskCount = day.tasks.filter(task => task.completed).length;
            const weeklyCount = day.weeklyChallenge?.completed ? 1 : 0;
            return total + taskCount + weeklyCount;
          }, 0);

          const currentStreak = calculateCurrentStreak(challengeData.days, challengeData.currentDay);

          athletes[athleteIndex] = {
            ...athletes[athleteIndex],
            totalScore: challengeData.totalScore,
            completedTasks,
            currentStreak,
          };

          await AsyncStorage.setItem(ATHLETES_KEY, JSON.stringify(athletes));
          console.log('Updated athlete score in leaderboard:', athletes[athleteIndex].name, challengeData.totalScore);
        } else {
          console.log('Athlete not found in leaderboard, may need to sign up');
        }
      }
    } catch (error) {
      console.error('Error updating athlete score:', error);
    }
  };

  const calculateCurrentStreak = (days: DayProgress[], currentDay: number): number => {
    let streak = 0;
    for (let i = currentDay - 1; i >= 0; i--) {
      if (days[i]?.allCompleted) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const resetChallenge = async () => {
    console.log('Resetting challenge');
    await AsyncStorage.removeItem(STORAGE_KEY);
    await initializeChallenge();
  };

  useEffect(() => {
    loadChallengeData();
  }, []);

  return {
    challengeData,
    loading,
    updateTaskCompletion,
    updateWeeklyChallengeCompletion,
    resetChallenge,
    initializeChallenge,
  };
};
