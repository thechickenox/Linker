import React, { useState } from "react";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useAuth } from "@/context/auth/AuthContext";
import BackButton from "@/app/utils/components/BackButton";
import { Picker } from "@react-native-picker/picker";
import { Href, useRouter } from "expo-router";

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 8,
    width: "100%",
    backgroundColor: "#3c444f", // Color de fondo de la barra
    borderRadius: 4,
    marginBottom: 20, // Margen entre la barra y el contenido
    overflow: "hidden", // Importante para evitar que el progreso se salga del contenedor
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  shadowEffect: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Sombra visible en Android
  },
  container: {
    flex: 1,
  },
  gradient: {
    justifyContent: "space-between", // Centrar el contenido verticalmente
    display: "flex",
    height: "100%",
    padding: 42,
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    paddingTop: 50,
    paddingBottom: 40
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff", // Color del texto del título
    textAlign: "center", // Centrar el texto
    marginBottom: 20, // Espacio debajo del título
  },
  button: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16.1231, // Padding superior e inferior
    paddingHorizontal: 24,
    gap: 3.36,
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
  buttonContainer: {
    width: "100%",
    display: "flex",
    gap: 12,
    marginBottom: 20, // Espacio debajo de los botones
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    marginBottom: 15,
    width: "100%",
    backgroundColor: "transparent",
  },
  picker: {
    padding: 10,
    height: 50,
    color: "white",
    backgroundColor: "transparent",
    paddingHorizontal: 10,
    width: "100%",
  },
});

const BackgroundContainer = styled.View`
  display: flex;
  background-color: #111418;
  height: 100%;
`;
const Background = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding: 38px;
  background-color: #111418;
  height: 100%;
  padding-top: 42px;
`;

const InputContainer = styled.Text`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  flex-direction: column;
`;
const InputTitle = styled.Text`
  font-size: 24px;
  color: white;
  text-align: left;
  margin-bottom: 16px;
  margin-top: 16px;
  width: 100%;
`;
const InputSubTitle = styled.Text`
  font-size: 12px;
  opacity: 0.5;
  color: white;
  text-align: left;
  width: 100%;
`;
const Button = styled.TouchableOpacity`
  background: #3b0191;
  padding-top: 16px;
  padding-bottom: 16px;
  border-radius: 20px;
  width: 100%;
  align-items: center;
  margin-top: 24px;
  border: 1px;
`;
const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  text-align: center;
`;
const ProgressBarContainer = styled.View`
  height: 8px;
  width: 100%;
  background-color: white;
`;
const ProgressBar = styled.View`
  height: 8px;
  background-color: red;
  width: 100%;
`;
const Input = styled.TextInput`
  border: 2px solid #3c444f;
  background-color: black;
  color: white;
  opacity: 0.6;
  padding: 16px;
  font-size: 18px;
  margin-bottom: 16px;
  border-radius: 8px;
  width: 100%;
`;
const PhaseTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  text-align: left;
  margin-bottom: 24px;
  color: white;
  width: 100%;
`;

const CompaniesQuizz = () => {
  const [selectedWorkers, setSelectedWorkers] = useState("");
  const [selectedSatisfaction, setSelectedSatisfaction] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [viewMode, setViewMode] = useState(0);
  const [viewPhase, setViewPhase] = useState(0);
  const [newRegister, setNewRegister] = useState({
    name: "",
    description: "",
    email: "",
    password: "",
    servicesDescription: "",
    workingArea: "",
    workers: "",
    satifaction: "",
    contact: {
      email: "",
      linkedin: "",
      github: "",
    },
    role: "companies",
  });
  const router = useRouter();
  const calculateProgress = () => {
    const totalPhases = 9; // Número total de fases
    return `${(viewPhase / (totalPhases - 1)) * 100}%`; // Devuelve un porcentaje en formato de cadena
  };

  const [scaleCandidateLogin] = useState(new Animated.Value(1));
  const [scaleCandidato] = useState(new Animated.Value(1));

  const handlePressIn = (scaleValue: Animated.Value) => {
    Animated.spring(scaleValue, {
      toValue: 0.95, // Reduce el tamaño del botón ligeramente
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (
    scaleValue: Animated.Value,
    roleRoute: Href<string>
  ) => {
    Animated.spring(scaleValue, {
      toValue: 1, // Vuelve al tamaño original
      useNativeDriver: true,
    }).start(() => {
      router.replace(roleRoute); // Navega después del efecto
    });
  };
  const services = [
    { label: "Servicio 1", value: "service1" },
    { label: "Servicio 2", value: "service2" },
    { label: "Servicio 3", value: "service3" },
  ];
  const workers = ["De 10-15", "De 15-30", "De 31 a 50", "Mas de 50"];

  const countries = [
    { label: "México", value: "MX" },
    { label: "Estados Unidos", value: "US" },
    { label: "Canadá", value: "CA" },
  ];

  const loadStatus = () => {
    const widths = [
      "10%",
      "20%",
      "30%",
      "40%",
      "50%",
      "60%",
      "70%",
      "80%",
      "90%",
      "100%",
    ];
    return widths[viewPhase] || "10%";
  };

  const titlePhase = () => {
    const titles = [
      "Mi empresa se llama",
      "Describe a tu empresa",
      "Datos de Acceso",
      "Servicios",
      "Experiencia en contratación",
      "Tecnologias",
      "Perfil de empresa",
    ];
    return titles[viewPhase] || "Mi numero es";
  };

  // List of skills
  const softSkillsList = [
    "Comunicación",
    "Trabajo en equipo",
    "Adaptabilidad",
    "Resolución de problemas",
    "Creatividad",
    "Liderazgo",
    "Gestión del tiempo",
    "Pensamiento crítico",
    "Empatía",
    "Ética laboral",
  ];

  const hardSkillsList = [
    "JavaScript",
    "Vue.js",
    "SQL",
    "Git",
    "APIs REST",
    "AWS",
    "CyberSecurity",
    "CI/CD",
    "Flutter",
    "Python",
  ];
  const { registerCompany } = useAuth();

  const handleResetView = () => {
    setViewMode(0);
    setViewPhase(0);
  };
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (registerData: any) => {
    try {
      await registerCompany(registerData);
      console.log("Registro exitoso");
      router.replace("/companies/(home)"); // Navega a la pantalla principal de compañías
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };
  const handleLogin = () => {
    router.replace("/auth/login"); // Navega a la pantalla principal
  };
  const goBack = () => {
    router.replace("/auth/initiallogin"); // Navega a la pantalla principal
  };

  const nextPhase = (actualPhase: any) => {
    let canProceed = false;
    setErrorMessage("");

    switch (actualPhase) {
      case 0:
        // Validación para la fase 0
        canProceed = !!newRegister.name;
        break;
      case 1:
        // Validación para la fase 1
        canProceed = !!newRegister.description;
        break;
      case 2:
        // Validación para la fase 2
        canProceed = !!newRegister.email && !!newRegister.password;
        break;
      case 3:
        // Validación para la fase 3
        canProceed =
          !!newRegister.servicesDescription && !!newRegister.workingArea;
        break;
      case 4:
        // Validación para la fase 4
        canProceed = !!newRegister.workers && !!newRegister.satifaction;
        break;
      default:
        canProceed = true;
    }

    if (canProceed) {
      setViewPhase(actualPhase + 1);
    } else {
      setErrorMessage(
        "Por favor, completa todos los campos antes de continuar."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {viewMode === 0 ? (
        <>
          <LinearGradient
            colors={["#240151", "#3B0191"]} // Degradado
            style={styles.gradient}
          >
            <View>
              <BackButton
                onPressFunction={() => {
                  goBack();
                }}
                color="white"
              ></BackButton>
            </View>
            <View style={styles.content}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>¡Bienvenida Empresa!</Text>
              </View>
              <View style={styles.buttonContainer}>
                <Animated.View
                  style={{ transform: [{ scale: scaleCandidateLogin }] }}
                >
                  <TouchableOpacity
                    style={[styles.button, styles.shadowEffect]}
                    onPressIn={() => handlePressIn(scaleCandidateLogin)}
                    onPressOut={() =>
                      handlePressOut(scaleCandidateLogin, "/auth/login")
                    }
                  >
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                  </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setViewMode(2)}
                >
                  <Text style={styles.buttonText}>Registrarme</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </>
      ) : (
        <BackgroundContainer>
          <View style={styles.progressBarContainer}>
            <LinearGradient
              colors={["#3B0191", "#240151"]}
              style={[styles.progressBar, { width: calculateProgress() }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
          <View>
            <BackButton
              onPressFunction={() => {
                viewPhase == 0 ? goBack() : setViewPhase(viewPhase - 1);
              }}
              color="white"
            ></BackButton>
          </View>
          <Background>
            <PhaseTitle>{titlePhase()}</PhaseTitle>

            {/* Fase 0 */}
            {viewPhase === 0 && (
              <>
                <Input
                  placeholder="Nombre"
                  keyboardType="default"
                  value={newRegister.name}
                  onChangeText={(text) =>
                    setNewRegister({ ...newRegister, name: text })
                  }
                />
                <InputSubTitle>
                  Con este nombre te encontrarán a travez de la app
                </InputSubTitle>
                <Button onPress={() => nextPhase(0)}>
                  <ButtonText>Continuar</ButtonText>
                </Button>
                {errorMessage && (
                  <Text style={{ color: "red" }}>{errorMessage}</Text>
                )}
              </>
            )}

            {/* Fase 1 */}
            {viewPhase === 1 && (
              <>
                <Input
                  placeholder="Descripción"
                  keyboardType="default"
                  value={newRegister.description}
                  onChangeText={(text) =>
                    setNewRegister({ ...newRegister, description: text })
                  }
                />
                <InputSubTitle>
                  De esta manera te reconocerán los candidatos
                </InputSubTitle>
                <Button onPress={() => nextPhase(1)}>
                  <ButtonText>Continuar</ButtonText>
                </Button>
                {errorMessage && (
                  <Text style={{ color: "red" }}>{errorMessage}</Text>
                )}
              </>
            )}

            {/* Fase 1 */}
            {viewPhase === 2 && (
              <>
                <Input
                  placeholder="Correo"
                  keyboardType="default"
                  value={newRegister.email}
                  onChangeText={(text) =>
                    setNewRegister({ ...newRegister, email: text })
                  }
                />
                <Input
                  placeholder="Contraseña"
                  secureTextEntry
                  value={newRegister.password}
                  onChangeText={(text) =>
                    setNewRegister({ ...newRegister, password: text })
                  }
                />
                <Button onPress={() => nextPhase(2)}>
                  <ButtonText>Continuar</ButtonText>
                </Button>
                {errorMessage && (
                  <Text style={{ color: "red" }}>{errorMessage}</Text>
                )}
              </>
            )}

            {/* Fase 2 */}
            {viewPhase === 3 && (
              <>
                <InputContainer>
                  <InputTitle>
                    Describe brevemente los productos y servicios de tu empresa
                  </InputTitle>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedService}
                      onValueChange={(itemValue) => {
                        setSelectedService(itemValue);
                        setNewRegister({
                          ...newRegister,
                          workingArea: itemValue,
                        });
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="Selecciona un servicio" value="" />
                      {services.map((service) => (
                        <Picker.Item
                          key={service.value}
                          label={service.label}
                          value={service.value}
                        />
                      ))}
                    </Picker>
                  </View>
                  <InputSubTitle>
                    Puedes agregar una lista de servicios.
                  </InputSubTitle>
                </InputContainer>
                <InputContainer>
                  <InputTitle>¿En que país opera tu empresa?</InputTitle>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedCountry}
                      onValueChange={(itemValue) => {
                        setSelectedCountry(itemValue);
                        setNewRegister({
                          ...newRegister,
                          servicesDescription: itemValue,
                        });
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="Selecciona un pais" value="" />
                      {countries.map((country) => (
                        <Picker.Item
                          key={country.value}
                          label={country.label}
                          value={country.value}
                        />
                      ))}
                    </Picker>
                  </View>
                  <InputSubTitle></InputSubTitle>
                </InputContainer>
                <Button onPress={() => nextPhase(3)}>
                  <ButtonText>Continuar</ButtonText>
                </Button>
                {errorMessage && (
                  <Text style={{ color: "red" }}>{errorMessage}</Text>
                )}
              </>
            )}

            {/* Fase 3 */}
            {viewPhase === 4 && (
              <>
                <InputContainer>
                  <InputTitle>
                    ¿Con cuantos empleados cuenta tu empresa?
                  </InputTitle>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedWorkers}
                      onValueChange={(itemValue) => {
                        setSelectedWorkers(itemValue);
                        setNewRegister({ ...newRegister, workers: itemValue });
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="Selecciona uno" value="" />
                      {workers.map((service) => (
                        <Picker.Item
                          key={service}
                          label={service}
                          value={service}
                        />
                      ))}
                    </Picker>
                  </View>
                </InputContainer>
                <InputContainer>
                  <InputTitle>
                    Del 1 al 10, ¿Qué tan satisfecho(a) estas con tus ultimas
                    contrataciones?
                  </InputTitle>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedSatisfaction}
                      onValueChange={(itemValue) => {
                        setSelectedSatisfaction(itemValue);
                        setNewRegister({
                          ...newRegister,
                          satifaction: itemValue,
                        });
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="Selecciona un valor del 1 al 10" value="" />
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map(
                        (service) => (
                          <Picker.Item
                            key={service}
                            label={service}
                            value={service}
                          />
                        )
                      )}
                    </Picker>
                  </View>
                  <InputSubTitle></InputSubTitle>
                </InputContainer>
                <Button onPress={() => nextPhase(4)}>
                  <ButtonText>Continuar</ButtonText>
                </Button>
                {errorMessage && (
                  <Text style={{ color: "red" }}>{errorMessage}</Text>
                )}
              </>
            )}

            {/* Fase 5 */}
            {viewPhase === 5 && (
              <>
                <InputTitle>Linkedin</InputTitle>
                <Input placeholder="linkedin..." />
                <Button
                  onPress={() => {
                    handleRegister(newRegister);
                  }}
                >
                  <ButtonText>Ingresar</ButtonText>
                </Button>
                {errorMessage && (
                  <Text style={{ color: "red" }}>{errorMessage}</Text>
                )}
              </>
            )}

            {/* Additional phases can be added similarly... */}
          </Background>
        </BackgroundContainer>
      )}
    </SafeAreaView>
  );
};

export default CompaniesQuizz;
