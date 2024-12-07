import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image, StyleSheet } from 'react-native';

export default function HomeLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#3C444F',
          borderTopWidth: 0, // Eliminar el borde superior
          height: 80, // Ajusta el tamaño según lo que necesites
          width: '100%',
          paddingTop: 20,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('@/assets/images/profile-active.png')
                  : require('@/assets/images/profile-inactive.png')
              }
              style={{
                width: 32,
                height: 32,
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="companies"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('@/assets/images/positions-active.png')
                  : require('@/assets/images/positions-inactive.png')
              }
              style={{
                width: 32,
                height: 32,
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('@/assets/images/notifications-active.png')
                  : require('@/assets/images/notifications-inactive.png')
              }
              style={{
                width: 32,
                height: 32,
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}