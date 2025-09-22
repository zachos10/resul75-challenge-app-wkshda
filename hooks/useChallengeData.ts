
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChallengeData, DayProgress, DEFAULT_DAILY_TASKS, WEEKLY_CHALLENGES } from '../types/challenge';

const STORAGE_KEY = 'resul75_challenge_data';

export const useChallengeData = () => {
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);

  const initializeChallenge = async () => {
    console.log('Initializing new challenge');
    const startDate = new Date().toISOString().split('T')[0];
    const days: DayProgress[] = [];

    for (let i = 1; i <= 75; i++) {
      const date = new Date();
      date.setDate(date.getDate() + (i - 1));
      
      const weeklyChallenge = i % 7 === 1 ? 
        WEEKLY_CHALLENGES[Math.floor((i - 1) / 7) % WEEKLY_CHALLENGES.length] : 
        undefined;

      days.push({
        day: i,
        date: date.toISOString().split('T')[0],
        tasks: DEFAULT_DAILY_TASKS.map(task => ({
          ...task,
          completed: false,
        })),
        allCompleted: false,
        weeklyChallenge,
      });
    }

    const newChallengeData: ChallengeData = {
      startDate,
      currentDay: 1,
      days,
      totalDays: 75,
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

  const updateTaskCompletion = async (day: number, taskId: string, completed: boolean) => {
    if (!challengeData) return;

    console.log(`Updating task ${taskId} for day ${day}: ${completed}`);
    
    const updatedDays = challengeData.days.map(dayData => {
      if (dayData.day === day) {
        const updatedTasks = dayData.tasks.map(task => 
          task.id === taskId ? { ...task, completed } : task
        );
        const allCompleted = updatedTasks.every(task => task.completed);
        
        return {
          ...dayData,
          tasks: updatedTasks,
          allCompleted,
        };
      }
      return dayData;
    });

    const updatedChallengeData = {
      ...challengeData,
      days: updatedDays,
    };

    setChallengeData(updatedChallengeData);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChallengeData));
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
    resetChallenge,
    initializeChallenge,
  };
};
