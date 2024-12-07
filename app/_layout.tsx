import React from 'react';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/context/auth/AuthContext';
import { FirebaseProvider } from '@/context/firebase/Firestore';
import { SupabaseProvider } from '@/context/supabase/Supabase';



export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <FirebaseProvider>
      <SupabaseProvider>
        <AuthProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="auth/initiallogin" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </AuthProvider>
      </SupabaseProvider>
    </FirebaseProvider>
  );
}