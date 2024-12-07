import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; // Asegúrate de instalar expo-linear-gradient

export default function Initiallogin() {
  const router = useRouter();

  // Estados para cada botón
  const [scaleEmpresa] = useState(new Animated.Value(1));
  const [scaleCandidato] = useState(new Animated.Value(1));

  const handlePressIn = (scaleValue: Animated.Value) => {
    Animated.spring(scaleValue, {
      toValue: 0.95, // Reduce el tamaño del botón ligeramente
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scaleValue: Animated.Value, roleRoute: Href<string>) => {
    Animated.spring(scaleValue, {
      toValue: 1, // Vuelve al tamaño original
      useNativeDriver: true,
    }).start(() => {
      router.replace(roleRoute); // Navega después del efecto
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#240151', '#3B0191']} // Degradado
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Linker</Text>
          </View>
          <View style={styles.buttonContainer}>
            {/* Botón Empresa */}
            <Animated.View style={{ transform: [{ scale: scaleEmpresa }] }}>
              <TouchableOpacity
                style={[styles.button, styles.shadowEffect]}
                onPressIn={() => handlePressIn(scaleEmpresa)}
                onPressOut={() => handlePressOut(scaleEmpresa, '/companies/(quiz)/quizz')}
              >
                <Text style={styles.buttonText}>Ingresar como empresa</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Botón Candidato */}
            <Animated.View style={{ transform: [{ scale: scaleCandidato }] }}>
              <TouchableOpacity
                style={[styles.button, styles.shadowEffect]}
                onPressIn={() => handlePressIn(scaleCandidato)}
                onPressOut={() => handlePressOut(scaleCandidato, '/candidates/(quiz)/personal-info')}
              >
                <Text style={styles.buttonText}>Ingresar como candidato</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 42,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    paddingTop: 16,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80%',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    height: 'auto',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 67,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shadowEffect: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Sombra visible en Android
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    gap: 12,
    marginBottom: 20,
  },
});
