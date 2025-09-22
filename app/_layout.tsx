
import { Stack, useGlobalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { setupErrorLogging } from '../utils/errorLogger';
import { Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const STORAGE_KEY = 'natively_emulate_device';

export default function RootLayout() {
  const [emulate, setEmulate] = useState<string | null>(null);
  const { emulate: emulateParam } = useGlobalSearchParams();
  
  useEffect(() => {
    setupErrorLogging();
  }, [emulate]);

  const insets = useSafeAreaInsets();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
