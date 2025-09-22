
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';
import { photoService } from '../services/photoService';
import Icon from './Icon';

export default function IntegrationStatus() {
  const [photoStats, setPhotoStats] = useState({ totalPhotos: 0, photosByDay: {} });

  useEffect(() => {
    loadPhotoStats();
  }, []);

  const loadPhotoStats = async () => {
    try {
      const stats = await photoService.getPhotoStats();
      setPhotoStats(stats);
    } catch (error) {
      console.error('Error loading photo stats:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Integration Status</Text>
      
      <View style={styles.statusGrid}>
        <View style={styles.statusCard}>
          <Icon name="camera" size={24} color={colors.success} />
          <Text style={styles.statusTitle}>Camera</Text>
          <Text style={styles.statusValue}>✅ Active</Text>
          <Text style={styles.statusDetail}>{photoStats.totalPhotos} photos taken</Text>
        </View>
        
        <View style={styles.statusCard}>
          <Icon name="nutrition" size={24} color={colors.primary} />
          <Text style={styles.statusTitle}>YAZIO</Text>
          <Text style={styles.statusValue}>🔗 Ready</Text>
          <Text style={styles.statusDetail}>Tap tasks to open</Text>
        </View>
        
        <View style={styles.statusCard}>
          <Icon name="fitness" size={24} color={colors.primary} />
          <Text style={styles.statusTitle}>STRAVA</Text>
          <Text style={styles.statusValue}>🔗 Ready</Text>
          <Text style={styles.statusDetail}>Tap tasks to open</Text>
        </View>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>
          • <Text style={styles.bold}>Progress Photo</Text>: Opens camera/gallery directly{'\n'}
          • <Text style={styles.bold}>YAZIO Tasks</Text>: Opens YAZIO app for nutrition tracking{'\n'}
          • <Text style={styles.bold}>STRAVA Tasks</Text>: Opens STRAVA app for workout tracking{'\n'}
          • <Text style={styles.bold}>Manual Override</Text>: Mark tasks complete manually if needed
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statusCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  statusDetail: {
    fontSize: 10,
    color: colors.grey,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.grey,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
