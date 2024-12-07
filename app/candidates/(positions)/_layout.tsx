// auth/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
export default function PositionsViewLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Aquí se cargarán las pantallas de autenticación, como `login.tsx` */}
    </Stack>
  );
}