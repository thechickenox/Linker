import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
export default function CompanyHomeLayout() {
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
        name="positions"
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
        name="candidatesSwipe"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('@/assets/images/search-active.png')
                  : require('@/assets/images/search-inactive.png')
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