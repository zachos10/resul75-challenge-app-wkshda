
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useChallengeData } from '../../hooks/useChallengeData';
import ProgressStats from '../../components/ProgressStats';
import IntegrationStatus from '../../components/IntegrationStatus';
import Icon from '../../components/Icon';

export default function HomeScreen() {
  const { challengeData, loading } = useChallengeData();

  const navigateToCalendar = () => {
    console.log('Navigating to calendar');
    router.push('/(tabs)/calendar');
  };

  const navigateToLeaderboard = () => {
    console.log('Navigating to leaderboard');
    router.push('/(tabs)/leaderboard');
  };

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, { justifyContent: 'center' }]}>
          <Text style={commonStyles.title}>Loading Challenge...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!challengeData) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, { justifyContent: 'center' }]}>
          <Text style={commonStyles.title}>Error Loading Challenge</Text>
          <Text style={commonStyles.text}>Please restart the app</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/1610e06d-3ce0-4c86-b31d-40575532c8cc.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome back, {challengeData.athleteName}!</Text>
        </View>

        {/* Progress Stats */}
        <View style={styles.section}>
          <ProgressStats challengeData={challengeData} />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={navigateToCalendar}
            >
              <Icon name="calendar" size={32} color={colors.primary} />
              <Text style={styles.actionTitle}>View Calendar</Text>
              <Text style={styles.actionSubtitle}>Track your daily progress</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={navigateToLeaderboard}
            >
              <Icon name="trophy" size={32} color={colors.primary} />
              <Text style={styles.actionTitle}>Leaderboard</Text>
              <Text style={styles.actionSubtitle}>See your ranking</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Integration Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Integrations</Text>
          <IntegrationStatus />
        </View>

        {/* Challenge Info */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Icon name="information-circle" size={24} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Your 75-Day Challenge</Text>
              <Text style={styles.infoText}>
                Complete 5 daily tasks to earn 50 points per day. Weekly challenges give you an extra 10 points. Stay consistent and climb the leaderboard!
              </Text>
            </View>
          </View>
        </View>

        {/* Today's Tasks Preview */}
        <View style={styles.section}>
          <View style={styles.todayCard}>
            <Text style={styles.todayTitle}>Today's Tasks</Text>
            <Text style={styles.todaySubtitle}>
              Day {challengeData.currentDay} of {challengeData.totalDays}
            </Text>
            <TouchableOpacity 
              style={styles.viewTasksButton}
              onPress={navigateToCalendar}
            >
              <Text style={styles.viewTasksText}>View Tasks</Text>
              <Icon name="arrow-forward" size={16} color={colors.background} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    width: 200,
    height: 60,
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: colors.grey,
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  todayCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  todayTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  todaySubtitle: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 16,
  },
  viewTasksButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewTasksText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
  },
});
