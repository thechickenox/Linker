import { useAuth } from '@/context/auth/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { isAuthenticated } = useAuth(); // Cambia este valor a la lógica de autenticación real

  useEffect(() => {
    // Marcamos el componente como montado
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Solo navegamos si el componente está montado
    if (isMounted) {
      router.replace({ pathname: '/auth/initiallogin' });
    }
  }, [isAuthenticated, isMounted, router]);

  return null; // O puedes retornar un loader o algo similar
}