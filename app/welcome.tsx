
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Athlete } from '../types/athlete';

export default function WelcomeScreen() {
  const [loading, setLoading] = useState(true);
  const [currentAthlete, setCurrentAthlete] = useState<Athlete | null>(null);

  useEffect(() => {
    checkExistingAthlete();
  }, []);

  const checkExistingAthlete = async () => {
    try {
      console.log('Checking for existing athlete');
      const athleteData = await AsyncStorage.getItem('current_athlete');
      if (athleteData) {
        const athlete = JSON.parse(athleteData) as Athlete;
        setCurrentAthlete(athlete);
        console.log('Found existing athlete:', athlete.name);
      }
    } catch (error) {
      console.error('Error checking existing athlete:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    console.log('Navigating to sign up');
    router.push('/signup');
  };

  const handleContinue = () => {
    console.log('Continuing to main app');
    router.replace('/(tabs)');
  };

  const handleSwitchAccount = () => {
    Alert.alert(
      'Switch Account',
      'Are you sure you want to switch to a different account? This will sign you out.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Switch Account',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('current_athlete');
            setCurrentAthlete(null);
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, { justifyContent: 'center' }]}>
          <Text style={commonStyles.title}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
            source={require('../assets/images/1610e06d-3ce0-4c86-b31d-40575532c8cc.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Transform Your Life in 75 Days</Text>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {currentAthlete ? (
            // Returning User
            <View style={styles.welcomeBack}>
              <View style={styles.welcomeCard}>
                <Icon name="person-circle" size={48} color={colors.primary} />
                <Text style={styles.welcomeTitle}>Welcome Back!</Text>
                <Text style={styles.welcomeName}>{currentAthlete.name}</Text>
                <Text style={styles.welcomeSubtitle}>
                  Ready to continue your challenge?
                </Text>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleContinue}
              >
                <Text style={styles.primaryButtonText}>Continue Challenge</Text>
                <Icon name="arrow-forward" size={20} color={colors.background} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleSwitchAccount}
              >
                <Text style={styles.secondaryButtonText}>Switch Account</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // New User
            <View style={styles.newUser}>
              <View style={styles.featuresCard}>
                <Text style={styles.featuresTitle}>Join the Challenge</Text>
                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <Icon name="checkmark-circle" size={20} color={colors.success} />
                    <Text style={styles.featureText}>75 days of transformation</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Icon name="trophy" size={20} color={colors.success} />
                    <Text style={styles.featureText}>Live leaderboard competition</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Icon name="fitness" size={20} color={colors.success} />
                    <Text style={styles.featureText}>YAZIO & STRAVA integration</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Icon name="camera" size={20} color={colors.success} />
                    <Text style={styles.featureText}>Progress photo tracking</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Icon name="star" size={20} color={colors.success} />
                    <Text style={styles.featureText}>Earn points for every task</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSignUp}
              >
                <Text style={styles.primaryButtonText}>Start Your Journey</Text>
                <Icon name="arrow-forward" size={20} color={colors.background} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Join thousands of athletes transforming their lives
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 280,
    height: 120,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  contentSection: {
    flex: 2,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  welcomeBack: {
    alignItems: 'center',
  },
  welcomeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  welcomeName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
  },
  newUser: {
    alignItems: 'center',
  },
  featuresCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.textSecondary,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.grey,
    textAlign: 'center',
  },
});
