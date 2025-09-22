
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../styles/commonStyles';
import { DailyTask } from '../types/challenge';
import Icon from './Icon';

interface TaskListProps {
  tasks: DailyTask[];
  onTaskToggle: (taskId: string, completed: boolean) => void;
  day: number;
}

export default function TaskList({ tasks, onTaskToggle, day }: TaskListProps) {
  const handleTaskPress = (task: DailyTask) => {
    if (task.requiresApp) {
      Alert.alert(
        `${task.requiresApp.toUpperCase()} Integration`,
        `This task requires ${task.requiresApp.toUpperCase()} app integration. For now, you can manually mark it as complete.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: task.completed ? 'Mark Incomplete' : 'Mark Complete',
            onPress: () => onTaskToggle(task.id, !task.completed)
          }
        ]
      );
    } else {
      onTaskToggle(task.id, !task.completed);
    }
  };

  const getTaskIcon = (task: DailyTask) => {
    switch (task.icon) {
      case 'camera': return 'camera';
      case 'water': return 'water';
      case 'nutrition': return 'nutrition';
      case 'fitness': return 'fitness';
      case 'close-circle': return 'close-circle';
      default: return 'checkmark-circle';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Day {day} Tasks</Text>
      
      {tasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          style={[
            styles.taskCard,
            task.completed && styles.completedTask
          ]}
          onPress={() => handleTaskPress(task)}
        >
          <View style={styles.taskContent}>
            <View style={styles.taskIcon}>
              <Icon 
                name={getTaskIcon(task)} 
                size={24} 
                color={task.completed ? colors.success : colors.primary} 
              />
            </View>
            
            <View style={styles.taskInfo}>
              <Text style={[
                styles.taskName,
                task.completed && styles.completedText
              ]}>
                {task.name}
              </Text>
              <Text style={styles.taskDescription}>
                {task.description}
              </Text>
              {task.requiresApp && (
                <Text style={styles.appBadge}>
                  {task.requiresApp.toUpperCase()}
                </Text>
              )}
            </View>
            
            <View style={styles.statusIcon}>
              <Icon 
                name={task.completed ? 'checkmark-circle' : 'ellipse-outline'} 
                size={28} 
                color={task.completed ? colors.success : colors.grey} 
              />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  completedTask: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.success,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskIcon: {
    marginRight: 16,
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.grey,
  },
  taskDescription: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 4,
  },
  appBadge: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusIcon: {
    marginLeft: 16,
  },
});
