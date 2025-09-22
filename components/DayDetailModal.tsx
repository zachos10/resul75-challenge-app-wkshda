
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../styles/commonStyles';
import { DayProgress } from '../types/challenge';
import TaskList from './TaskList';
import ProgressPhotoGallery from './ProgressPhotoGallery';
import Icon from './Icon';

interface DayDetailModalProps {
  visible: boolean;
  dayData: DayProgress | null;
  onClose: () => void;
  onTaskToggle: (taskId: string, completed: boolean) => void;
  onWeeklyChallengeToggle?: (completed: boolean) => void;
}

export default function DayDetailModal({ 
  visible, 
  dayData, 
  onClose, 
  onTaskToggle, 
  onWeeklyChallengeToggle 
}: DayDetailModalProps) {
  if (!dayData) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const completedTasks = dayData.tasks.filter(task => task.completed).length;
  const totalTasks = dayData.tasks.length + (dayData.weeklyChallenge ? 1 : 0);
  const completedTotal = completedTasks + (dayData.weeklyChallenge?.completed ? 1 : 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.dayTitle}>Day {dayData.day}</Text>
            <Text style={styles.dateText}>{formatDate(dayData.date)}</Text>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                {completedTotal}/{totalTasks} Tasks Complete
              </Text>
              <Text style={styles.pointsText}>
                {dayData.totalPoints} Points Earned
              </Text>
            </View>
          </View>
          
          <View style={styles.statusIndicator}>
            <Icon 
              name={dayData.allCompleted ? 'checkmark-circle' : 'ellipse-outline'} 
              size={32} 
              color={dayData.allCompleted ? colors.success : colors.grey} 
            />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Task List */}
          <TaskList
            tasks={dayData.tasks}
            weeklyChallenge={dayData.weeklyChallenge}
            onTaskToggle={onTaskToggle}
            onWeeklyChallengeToggle={onWeeklyChallengeToggle}
            day={dayData.day}
          />

          {/* Progress Photos */}
          <View style={styles.photosSection}>
            <Text style={styles.sectionTitle}>Progress Photos</Text>
            <ProgressPhotoGallery day={dayData.day} />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  closeButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  dayTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  dateText: {
    fontSize: 14,
    color: colors.grey,
    marginTop: 4,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  statusIndicator: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  photosSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
});
