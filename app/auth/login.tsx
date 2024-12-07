import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { useAuth } from "@/context/auth/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocus] = useState(new Animated.Value(0));
  const [passwordFocus] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(false); // Estado para mostrar spinner
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensajes de error
  const router = useRouter();
  const [scaleAnim] = useState(new Animated.Value(1)); // Estado para la animación de escala
  const [scaleEmpresa] = useState(new Animated.Value(1));

  const handlePressIn = (scaleValue: Animated.Value) => {
    Animated.spring(scaleValue, {
      toValue: 0.95, // Reduce el tamaño del botón ligeramente
      useNativeDriver: true,
    }).start();
  };

const handlePressOut = (
  scaleValue: Animated.Value,
  callback: () => Promise<void>
) => {
  Animated.spring(scaleValue, {
    toValue: 1, // Vuelve al tamaño original
    useNativeDriver: true,
  }).start(async () => {
    await callback(); // Ejecuta la función pasada como argumento
  });
};


  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1); // Reinicia la animación al detenerse
    }
  }, [loading]);
  const handleFocus = (animatedValue: Animated.Value) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = (animatedValue: Animated.Value, value: string) => {
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");

    const result = await login(email, password);

    if (result.success) {
      // Esperar 500ms antes de redirigir
      setTimeout(() => {
        if (result.role === "candidate") {
          router.replace("/candidates/(home)/profile");
        } else if (result.role === "company") {
          router.replace("/companies/(home)/profile");
        }
      }, 500);
    } else {
      setErrorMessage(result.error || "Usuario o contraseña incorrectos");
      setLoading(false);
    }
  };

  const goBack = () => {
    router.replace("/auth/initiallogin");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView style={styles.container}>
          <LinearGradient
            colors={["#240151","#240151"]}
            style={styles.gradient}
          >
            <View>
              <TouchableOpacity onPress={goBack} style={{ padding: 10 }}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Linker</Text>
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Animated.Text
                    style={[
                      styles.placeholder,
                      {
                        transform: [
                          {
                            translateY: emailFocus.interpolate({
                              inputRange: [0, 1],
                              outputRange: [16, -24],
                            }),
                          },
                        ],
                        fontSize: emailFocus.interpolate({
                          inputRange: [0, 1],
                          outputRange: [16, 12],
                        }),
                      },
                    ]}
                  >
                    Correo electrónico
                  </Animated.Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => handleFocus(emailFocus)}
                    onBlur={() => handleBlur(emailFocus, email)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Animated.Text
                    style={[
                      styles.placeholder,
                      {
                        transform: [
                          {
                            translateY: passwordFocus.interpolate({
                              inputRange: [0, 1],
                              outputRange: [16, -24],
                            }),
                          },
                        ],
                        fontSize: passwordFocus.interpolate({
                          inputRange: [0, 1],
                          outputRange: [16, 12],
                        }),
                      },
                    ]}
                  >
                    Contraseña
                  </Animated.Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => handleFocus(passwordFocus)}
                    onBlur={() => handleBlur(passwordFocus, password)}
                    secureTextEntry
                  />
                </View>
              </View>

              {/* Animación de Loading */}
              {loading && (
                <View style={styles.loadingOverlay}>
                  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <ActivityIndicator size="large" color="#fff" />
                  </Animated.View>
                </View>
              )}

              {errorMessage ? (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              ) : null}
              <View style={styles.buttonContainer}>
                <Animated.View style={{ transform: [{ scale: scaleEmpresa }] }}>
                  <TouchableOpacity
                    style={styles.button}
                    onPressIn={() => handlePressIn(scaleEmpresa)}
                    onPressOut={() =>
                      handlePressOut(scaleEmpresa, async () => {
                        await handleLogin();
                      })
                    }
                  >
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          </LinearGradient>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },

  container: { flex: 1 },
  gradient: { flex: 1, padding: 42 },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    paddingTop: 30,
    paddingBottom: 50
  },
  titleContainer: { marginTop: 50, alignItems: "center" },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  inputContainer: { width: "100%", marginBottom: 20 },
  inputWrapper: {
    position: "relative",
    marginBottom: 35,
    marginHorizontal: 19,
  },
  input: {
    width: "100%",
    padding: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    color: "#fff",
    backgroundColor: "transparent",
  },
  placeholder: { position: "absolute", left: 16, color: "#ccc" },
  buttonContainer: { width: "100%", marginBottom: 15 },
  button: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 67,
    borderWidth: 1,
    borderColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorMessage: { color: "#ff5555", textAlign: "center", marginTop: 10 },
});
