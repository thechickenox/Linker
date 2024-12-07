// auth/_layout.tsx
import { Stack } from 'expo-router';

export default function QuizLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Aquí se cargarán las pantallas de autenticación, como `login.tsx` */}
    </Stack>
  );
}