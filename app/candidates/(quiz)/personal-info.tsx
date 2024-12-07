import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth/AuthContext";
import BackButton from "@/app/utils/components/BackButton";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';// Para seleccionar PDFs
import { useSupabase } from "@/context/supabase/Supabase";

const styles = StyleSheet.create({
  filePreview: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    alignItems: 'center',
  },
  fileName: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  uploadContainer: {
    color: '#FFFFFF',
    padding: 20,
  },
  uploadButton: {
    borderRadius: 16,
    borderColor: '#E010CD',
    borderWidth: 1,
    backgroundColor: '#E010CD',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
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
  container: {
    flex: 1,
    height: "100%",
  },
  gradient: {
    justifyContent: "space-between", // Centrar el contenido verticalmente
    display: "flex",
    height: "100%",
    padding: 42,
    paddingBottom: 16,
  },
  content: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
    marginBottom: 42, // Espacio debajo de los botones
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
  questionContainer: {
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    color: "#ffffff",
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  skillPill: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#333",
    margin: 5,
  },
  selectedSkillPill: {
    backgroundColor: "#E010CD",
  },
  skillText: {
    color: "#ffffff",
    fontSize: 14,
  },
  selectedSkillText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#939BA7",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#939BA7",
    backgroundColor: "#333",
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

interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
}

interface NewRegister {
  extension: string;
  phone: string;
  email: string;
  password: string;
  birthdate: string;
  name: string;
  gender: string;
  experience: string;
  softSkills: string[];
  hardSkills: string[];
  contact: ContactInfo;
  role: string;
}
const CandidatesQuizz = () => {
  const hardSkillsList = [
    "JavaScript",
    "Typescript",
    "NestJs",
    "NextJs",
    "React",
    "React Native",
    "Vue.js",
    "Angular",
    "Svelte",
    "Node.js",
    "Express.js",
    "SQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Docker",
    "Kubernetes",
    "Git",
    "GitHub Actions",
    "GitLab CI",
    "APIs REST",
    "GraphQL",
    "AWS",
    "Azure",
    "Google Cloud Platform (GCP)",
    "Firebase",
    "CyberSecurity",
    "CI/CD",
    "Flutter",
    "Python",
    "Django",
    "Flask",
    "Ruby on Rails",
    "Java",
    "Kotlin",
    "Swift",
    "C#",
    ".NET",
    "PHP",
    "Laravel",
    "Tailwind CSS",
    "Sass",
    "Bootstrap",
    "Material-UI",
    "Three.js",
    "TensorFlow",
    "PyTorch",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Seaborn",
    "Scikit-learn",
    "Tableau",
    "Power BI",
    "Figma",
    "Adobe XD",
    "ElasticSearch",
    "Jenkins",
    "Terraform",
    "Ansible",
    "Prometheus",
    "Grafana",
  ];
  const skillsOptions = [
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
    "Inteligencia emocional",
    "Negociación",
    "Toma de decisiones",
    "Manejo de conflictos",
    "Autodisciplina",
    "Orientación al cliente",
    "Habilidades de presentación",
    "Capacidad de análisis",
    "Habilidades interpersonales",
    "Aprendizaje continuo",
    "Innovación",
    "Resiliencia",
    "Gestión de estrés",
    "Capacidad de persuasión",
    "Multitarea",
    "Habilidades de mentoría",
    "Colaboración digital",
    "Escucha activa",
    "Atención a los detalles",
    "Planificación estratégica",
  ];
  const [viewMode, setViewMode] = useState(0);
  const [viewPhase, setViewPhase] = useState(0);
  const [uploadedFile, setUploadedFile] = useState({});
  const [newRegister, setNewRegister] = useState<NewRegister>({
    extension: "",
    phone: "",
    email: "",
    password: "",
    birthdate: "",
    name: "",
    gender: "",
    experience: "",
    softSkills: [],
    hardSkills: [],
    contact: {
      email: "",
      linkedin: "",
      github: "",
    },
    role: "candidates",
  });
  const handleRemoveFile = () => {
    setUploadedFile(null); // Elimina el archivo del estado
  };
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
      "Mi numero es",
      "Datos de usuario",
      "Mi fecha de nacimiento es",
      "Mi nombre es",
      "Me identifico como",
      "Experiencia laboral",
      "Habilidades blandas",
      "Habilidades técnicas",
      "Contacto",
    ];
    return titles[viewPhase] || "Mi numero es";
  };
  const genderOptions = ["Hombre", "Mujer", "Prefiero no decirlo"];
  const expOptions = ["Menos de 1 año", "De 1 a 2 años", "De 2 a 3 años", "Más de 4 años"];

  const handleResetView = () => {
    setViewMode(0);
    setViewPhase(0);
  };
  const { registerCandidate } = useAuth();

  const { login } = useAuth();
  const { uploadFile } = useSupabase();
  const router = useRouter();
  const toggleGender = (gender: string) => {
    setNewRegister({
      ...newRegister,
      gender: gender,
    });
  };
  const toggleSkill = (skill: string) => {
    const hardSkills = newRegister.hardSkills;
    const updatedSkills = hardSkills.includes(skill)
      ? hardSkills.filter((item) => item !== skill)
      : [...hardSkills, skill];

    setNewRegister({
      ...newRegister,
      hardSkills: updatedSkills,
    });
  };
  const handlePDFUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', // Filtrar solo archivos PDF
      });

      if (result.canceled) {
        console.log('No se seleccionó ningún archivo.');
        return;
      }
      const { uri, name, size } = result.assets[0];

      // Crear el archivo como un objeto Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Subir el archivo a tu servicio (por ejemplo, Supabase o S3)
      const url = await uploadFile(
        new File([blob], name, { type: 'application/pdf' }),
        'positions', // Carpeta en tu bucket
        'pdfs'       // Identificador o subcarpeta en tu bucket
      );

      console.log('URL del PDF:', url);

      // Actualizar el estado con la URL del archivo
      setNewRegister((prev) => ({ ...prev, documentUrl: url }));

      // Actualiza el estado con los detalles del archivo
      setUploadedFile({ uri, name });
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validatePhase = () => {
    const newErrors: Record<string, string> = {};

    switch (viewPhase) {
      case 0: // Validar teléfono
        if (!newRegister.phone) {
          newErrors.phone = "El número de teléfono es obligatorio.";
        } else if (!/^\d{10}$/.test(newRegister.phone)) {
          newErrors.phone = "El número de teléfono debe tener 10 dígitos.";
        }
        break;

      case 1: // Validar email y contraseña
        if (!newRegister.email) {
          newErrors.email = "El correo electrónico es obligatorio.";
        } else if (!/\S+@\S+\.\S+/.test(newRegister.email)) {
          newErrors.email = "El correo electrónico no es válido.";
        }
        if (!newRegister.password) {
          newErrors.password = "La contraseña es obligatoria.";
        } else if (newRegister.password.length < 6) {
          newErrors.password =
            "La contraseña debe tener al menos 6 caracteres.";
        }
        break;

      case 2: // Validar fecha de nacimiento
        if (!newRegister.birthdate) {
          newErrors.birthdate = "La fecha de nacimiento es obligatoria.";
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(newRegister.birthdate)) {
          newErrors.birthdate =
            "La fecha de nacimiento debe estar en formato YYYY-MM-DD.";
        }
        break;

      case 3: // Validar nombre
        if (!newRegister.name) {
          newErrors.name = "El nombre es obligatorio.";
        } else if (newRegister.name.length < 3) {
          newErrors.name = "El nombre debe tener al menos 3 caracteres.";
        }
        break;

      case 4: // Validar género
        if (!newRegister.gender) {
          newErrors.gender = "Debe seleccionar un género.";
        }
        break;

      /* case 5: // pediente
        if (!newRegister.gender) {
          newErrors.gender = "Debe seleccionar un género.";
        }
        break; */
      case 5: // Validar habilidades blandas 
        if (!newRegister.hardSkills) {
          newErrors.hardSkills = "Debe seleccionar una de las habilidades.";
        }
        break;
      case 6: // pediente
        if (!newRegister.softSkills) {
          newErrors.softSkills = "Debe seleccionar una de las habilidades.";
        }
        break;


      // Agregar validaciones para las demás fases según el campo
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleNext = () => {
    if (validatePhase()) {
      setViewPhase(viewPhase + 1);
    }
  };

  const toggleSoftSkill = (skill: string) => {
    const softSkills = newRegister.softSkills;
    const updatedSkills = softSkills.includes(skill)
      ? softSkills.filter((item) => item !== skill)
      : [...softSkills, skill];

    setNewRegister({
      ...newRegister,
      softSkills: updatedSkills,
    });
  };
  const toggleExperience = (skill: string) => {
    const exp = newRegister.experience;

    setNewRegister({
      ...newRegister,
      experience: exp,
    });
  };
  const handleRegister = async () => {
    try {
      console.log('Register', newRegister);
      await registerCandidate(newRegister);
      router.push('/candidates/profile');
    } catch (error) {
      console.error("Error al registrar el candidato:", error);
    }
  };
  const calculateProgress = () => {
    const totalPhases = 9; // Número total de fases
    return `${(viewPhase / (totalPhases - 1)) * 100}%`; // Devuelve un porcentaje en formato de cadena
  };

  const handleLogin = () => {
    router.replace("/auth/login"); // Navega a la pantalla principal
  };
  const goBack = () => {
    router.replace("/auth/initiallogin"); // Navega a la pantalla principal
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {viewMode === 0 ? (
        <>
          <LinearGradient
            colors={["#240151", "#3B0191"]} // Degradado
            style={styles.gradient}
          >
            <View>
              <TouchableOpacity
                onPress={() => goBack()}
                style={{ padding: 10 }}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>¡Bienvenido Candidato!</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLogin()}
                >
                  <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
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
            <TouchableOpacity
              onPress={() =>
                viewPhase == 0 ? goBack() : setViewPhase(viewPhase - 1)
              }
              style={{ padding: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Background>
            <PhaseTitle>{titlePhase()}</PhaseTitle>

            {/* Fase 0 */}
            {viewPhase === 0 && (
              <>
                {errors.phone && (
                  <Text style={{ color: "red", marginBottom: 8 }}>
                    {errors.phone}
                  </Text>
                )}
                <Input
                  placeholder="9984233521"
                  keyboardType="numeric"
                  value={newRegister.phone}
                  onChangeText={(text) =>
                    setNewRegister({ ...newRegister, phone: text })
                  }
                />
                <InputSubTitle>
                  Ingrese su numero telefonico o de contacto
                </InputSubTitle>

                <Button onPress={() => handleNext()}>
                  <ButtonText>Continuar</ButtonText>
                </Button>
              </>
            )}

            {/* Fase 1 */}
            {viewPhase === 1 && (
              <>
                {errors.email && (
                  <Text style={{ color: "red", marginBottom: 8 }}>
                    {errors.email}
                  </Text>
                )}
                <InputSubTitle>Correo</InputSubTitle>
                <Input
                  placeholder="Correo"
                  keyboardType="default"
                  value={newRegister.email}
                  onChangeText={(text) =>
                    setNewRegister({ ...newRegister, email: text })
                  }
                />

                <InputSubTitle>Contreseña</InputSubTitle>
                <Input
                  placeholder="Contraseña"
                  secureTextEntry
                  value={newRegister.password}
                  onChangeText={(text) =>
                    setNewRegister({ ...newRegister, password: text })
                  }
                />
                {errors.password && (
                  <Text style={{ color: "red", marginBottom: 8 }}>
                    {errors.password}
                  </Text>
                )}
                <InputSubTitle>Ingrese un correo y contraseña</InputSubTitle>

                <Button onPress={() => handleNext()}>
                  <ButtonText>Continuar</ButtonText>
                </Button>
              </>
            )}

            {/* Fase 2 */}
            {viewPhase === 2 && (
              <>
                {errors.birthdate && (
                  <Text style={{ color: "red", marginBottom: 8 }}>
                    {errors.birthdate}
                  </Text>
                )}
                <Input
                  placeholder="2003-12-12"
                  keyboardType="default"
                  value={newRegister.birthdate}
                  onChangeText={(text) =>
                    setNewRegister({ ...newRegister, birthdate: text })
                  }
                />
                <InputSubTitle>Ingrese un fecha con este formato: AAAA-DD-MM</InputSubTitle>
                <Button onPress={() => handleNext()}>
                  <ButtonText>Continuar</ButtonText>
                </Button>
              </>
            )}

            {/* Fase 3 */}
            {viewPhase === 3 && (
              <>
                {errors.name && (
                  <Text style={{ color: "red", marginBottom: 8 }}>
                    {errors.name}
                  </Text>
                )}
                <Input
                  placeholder="Lalo Chan G"
                  value={newRegister.name}
                  onChangeText={(text) =>
                    setNewRegister({ ...newRegister, name: text })
                  }
                />

                <Button onPress={() => handleNext()}>
                  <ButtonText>Continuar</ButtonText>
                </Button>
              </>
            )}

            {/* Fase 4 */}
            {viewPhase === 4 && (
              <>
                <View style={styles.questionContainer}>
                  {errors.gender && (
                    <Text style={{ color: "red", marginBottom: 8 }}>
                      {errors.gender}
                    </Text>
                  )}
                  <View style={styles.skillsContainer}>
                    {genderOptions.map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        style={[
                          styles.skillPill,
                          newRegister.gender === gender &&
                          styles.selectedSkillPill, // Solo una opción seleccionada
                        ]}
                        onPress={() => toggleGender(gender)}
                      >
                        <Text
                          style={[
                            styles.skillText,
                            newRegister.gender === gender &&
                            styles.selectedSkillText, // Solo una opción seleccionada
                          ]}
                        >
                          {gender}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <Button onPress={() => handleNext()}>
                  <ButtonText>Continuar</ButtonText>
                </Button>
              </>
            )}

            {/* Fase 5 */}
            {viewPhase === 5 && (
              <>

                <View style={styles.skillsContainer}>
                  {expOptions.map((exp: any) => (
                    <TouchableOpacity
                      key={exp}
                      style={[
                        styles.skillPill,
                        newRegister.experience == exp &&
                        styles.selectedSkillPill,
                      ]}
                      onPress={() => setNewRegister({
                        ...newRegister,
                        experience: exp
                      })}
                    >
                      <Text
                        style={[
                          styles.skillText,
                          newRegister.experience == exp &&
                          styles.selectedSkillText,
                        ]}
                      >
                        {exp}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Button onPress={() => handleNext()}>
                  <ButtonText>Continuar</ButtonText>
                </Button>
              </>
            )}
            {/* Fase 6 */}
            {viewPhase === 6 && (
              <>
                <View style={styles.questionContainer}>
                  {errors.softSkills && (
                    <Text style={{ color: "red", marginBottom: 8 }}>
                      {errors.softSkills}
                    </Text>
                  )}
                  <View style={styles.skillsContainer}>
                    {skillsOptions.map((skill) => (
                      <TouchableOpacity
                        key={skill}
                        style={[
                          styles.skillPill,
                          newRegister.softSkills.includes(skill) &&
                          styles.selectedSkillPill,
                        ]}
                        onPress={() => toggleSoftSkill(skill)}
                      >
                        <Text
                          style={[
                            styles.skillText,
                            newRegister.softSkills.includes(skill) &&
                            styles.selectedSkillText,
                          ]}
                        >
                          {skill}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <Button onPress={() => handleNext()}>
                  <ButtonText>Continuar</ButtonText>
                </Button>
              </>
            )}

            {/* Fase 7 */}
            {viewPhase === 7 && (
              <>
                <View style={styles.questionContainer}>
                  {errors.hardSkills && (
                    <Text style={{ color: "red", marginBottom: 8 }}>
                      {errors.hardSkills}
                    </Text>
                  )}
                  <View style={styles.skillsContainer}>
                    {hardSkillsList.map((skill) => (
                      <TouchableOpacity
                        key={skill}
                        style={[
                          styles.skillPill,
                          newRegister.hardSkills.includes(skill) &&
                          styles.selectedSkillPill,
                        ]}
                        onPress={() => toggleSkill(skill)}
                      >
                        <Text
                          style={[
                            styles.skillText,
                            newRegister.hardSkills.includes(skill) &&
                            styles.selectedSkillText,
                          ]}
                        >
                          {skill}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <Button onPress={() => handleNext()}>
                  <ButtonText>Continuar</ButtonText>
                </Button>
              </>
            )}

            {/* Fase 8 */}
            {viewPhase === 8 && (
              <>
                <InputTitle>Email de trabajo</InputTitle>
                <Input
                  placeholder="example@example.com"
                  value={newRegister.contact.email}
                  onChangeText={(text) =>
                    setNewRegister({
                      ...newRegister,
                      contact: { ...newRegister.contact, email: text },
                    })
                  }
                />
                <InputSubTitle>
                  ( Opcional )
                </InputSubTitle>
                <InputTitle>LinkedIn</InputTitle>
                <Input
                  placeholder="linkedin.com/in/username"
                  value={newRegister.contact.linkedin}
                  onChangeText={(text) =>
                    setNewRegister({
                      ...newRegister,
                      contact: { ...newRegister.contact, linkedin: text },
                    })
                  }
                />
                <InputSubTitle>
                  ( Opcional )
                </InputSubTitle>

                {/* Descripción del puesto */}
                <View style={styles.uploadContainer}>
                  <TouchableOpacity onPress={handlePDFUpload} style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>Subir PDF</Text>
                  </TouchableOpacity>
                </View>

                {uploadedFile && (
                  <View style={styles.filePreview}>
                    <Text style={styles.fileName}>📄 {uploadedFile.name}</Text>
                    <TouchableOpacity
                      onPress={handleRemoveFile}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <Button onPress={handleRegister}>
                  <ButtonText>Registrar</ButtonText>
                </Button>
              </>
            )}
            {/* Additional phases can be added similarly... */}
          </Background>
        </BackgroundContainer>
      )}
    </ScrollView>
  );
};

export default CandidatesQuizz;
