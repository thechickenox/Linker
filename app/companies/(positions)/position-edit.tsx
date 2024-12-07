import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import BackButton from '@/app/utils/components/BackButton';
import { useFirebase } from '@/context/firebase/Firestore';
import { useAuth } from '@/context/auth/AuthContext';
import * as ImagePicker from 'expo-image-picker'; // Para seleccionar imágenes desde el dispositivo
import * as DocumentPicker from 'expo-document-picker'; // Para seleccionar PDFs
import { useSupabase } from '@/context/supabase/Supabase';
import styled from 'styled-components/native';
interface Position {
    title: string;
    img: string;
    companyId: string;
    description: string;
    requirements: {
        softSkills: string[];
        hardSkills: string[];
        modality: string;
        type: string;
        yearsExperience: string;
    };
    salary: string;
    status: string;
}
const ExpandText = styled.Text`
  font-size: 14px;
  margin-top: 8px;
  color: #E010CD;
  text-decoration: underline;
`;
export default function Formulario() {
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
    const hardSkillsOptions = [
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
    const { userId } = useAuth();
    const router = useRouter();
    const { createDocument } = useFirebase();
    const { uploadFile } = useSupabase();
    const [limitHardSkills, setLimitHardSkills] = useState(true);
    const [limitSoftSkills, setLimitSoftSkills] = useState(true);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [newPosition, setNewPosition] = useState<Position>({
        title: '',
        img: '',
        companyId: userId || '',
        description: '',
        requirements: {
            softSkills: [],
            hardSkills: [],
            modality: '',
            type: '',
            yearsExperience: ''
        },
        salary: '',
        status: 'Open',
    });

    const modalities = ["Presencial", "Remoto", "Hibrido"];
    const contratation = ["Medio tiempo", "Tiempo completo", "Contrato indefinido"];
    const experience = ["Menos de 1 año", "De 1 a 2 años", "De 2 a 3 años", "Más de 4 años"];
    const displayedHSkills = limitHardSkills
    ? hardSkillsOptions.slice(0, 10)
    : hardSkillsOptions;
    const displayedSSkills = limitSoftSkills
    ? skillsOptions.slice(0, 10)
    : skillsOptions;
    const toggleHard = () => {
        setLimitHardSkills(!limitHardSkills);
    };
    const toggleSoft = () => {
        setLimitSoftSkills(!limitSoftSkills);
    };
    const toggleExperience = (exp: string) => {
        setNewPosition({
            ...newPosition,
            requirements: { ...newPosition.requirements, yearsExperience: exp },
        });
    };

    const toggleContratations = (contratation: string) => {
        setNewPosition({
            ...newPosition,
            requirements: { ...newPosition.requirements, type: contratation },
        });
    };

    const toggleModalities = (modality: string) => {
        setNewPosition({
            ...newPosition,
            requirements: { ...newPosition.requirements, modality },
        });
    };

    const toggleSkill = (skill: string) => {
        const hardSkills = newPosition.requirements.hardSkills;
        const updatedSkills = hardSkills.includes(skill)
            ? hardSkills.filter(item => item !== skill)
            : [...hardSkills, skill];

        setNewPosition({
            ...newPosition,
            requirements: { ...newPosition.requirements, hardSkills: updatedSkills },
        });
    };
    const toggleSoftSkill = (skill: string) => {
        const softSkills = newPosition.requirements.softSkills;
        const updatedSkills = softSkills.includes(skill)
            ? softSkills.filter(item => item !== skill)
            : [...softSkills, skill];

        setNewPosition({
            ...newPosition,
            requirements: { ...newPosition.requirements, softSkills: updatedSkills },
        });
    };
    const handleImageUpload = async () => {
        try {
            // Pedir permisos para acceder a la galería
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                alert('Se requieren permisos para acceder a la galería.');
                return;
            }

            // Seleccionar imagen
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                const { uri, fileName = 'image.jpg' } = result.assets[0];

                // Crear el archivo como un objeto Blob
                const response = await fetch(uri);
                const blob = await response.blob();

                // Subir el archivo a Supabase
                const url = await uploadFile(
                    new File([blob], fileName!, { type: blob.type }),
                    'positions',
                    'positions'
                );

                console.log('URL de la imagen:', url);

                // Actualizar el estado con la URL de la imagen
                setNewPosition((prev) => ({ ...prev, img: url }));
                setSelectedImage(url);
            } else {
                console.log('No se seleccionó ninguna imagen.');
            }
        } catch (error) {
            console.error('Error al subir la imagen:', error);
        }
    };
    const onSubmit = async () => {
        if (!newPosition.title || !newPosition.description || !newPosition.salary) {
            Alert.alert("Error", "Todos los campos son obligatorios.");
            return;
        }

        try {
            setNewPosition({
                ...newPosition,
                companyId: userId || ''
            });
            await createDocument('position', {
                ...newPosition,
                createdAt: new Date().toISOString(),
            });
            Alert.alert("Éxito", "El puesto se creó correctamente.");
            router.replace('/companies/(home)/positions');
        } catch (error) {
            console.error("Error al crear el puesto:", error);
            Alert.alert("Error", "Hubo un problema al crear el puesto.");
        }
    };

    const goBack = () => {
        router.replace('/companies/(home)/positions');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.mainTitleContainer}>
                <BackButton onPressFunction={() => { goBack() }} color="white" />
                <Text style={styles.mainTitle}>Puesto nuevo</Text>
            </View>
            <View style={styles.separator}></View>

            {/* Descripción del puesto */}
            <View style={styles.questionContainer}>
                <View style={styles.uploadContainer}>
                    <TouchableOpacity onPress={handleImageUpload} style={styles.uploadButton}>
                        <Text style={styles.uploadButtonText}>Subir Imagen</Text>
                    </TouchableOpacity>
                    {selectedImage && <Text>Imagen seleccionada: {selectedImage.name}</Text>}
                </View>
            </View>
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Titulo del Puesto</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ingresa una descripción"
                    value={newPosition.title}
                    onChangeText={text => setNewPosition({ ...newPosition, title: text })}
                />
            </View>
            <View style={styles.separator}></View>

            {/* Estilo de comunicación */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Descripción del Puesto</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Describe your communication style"
                    value={newPosition.description}
                    onChangeText={text => setNewPosition({ ...newPosition, description: text })}
                />
            </View>
            <View style={styles.separator}></View>

            {/* Selector de habilidades técnicas en forma de "pills" */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Aptitudes Requeridas</Text>
                <View style={styles.skillsContainer}>
                    {displayedSSkills.map(skill => (
                        <TouchableOpacity
                            key={skill}
                            style={[
                                styles.skillPill,
                                newPosition.requirements.softSkills.includes(skill) && styles.selectedSkillPill
                            ]}
                            onPress={() => toggleSoftSkill(skill)}
                        >
                            <Text style={[
                                styles.skillText,
                                newPosition.requirements.softSkills.includes(skill) && styles.selectedSkillText
                            ]}>
                                {skill}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={toggleSoft}>
                        <ExpandText>{!limitSoftSkills ? 'Ocultar' : 'Ver más'}</ExpandText>

                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.separator}></View>
            {/* Selector de habilidades técnicas en forma de "pills" */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Habilidades Técnicas Requeridas</Text>
                <View style={styles.skillsContainer}>
                    {displayedHSkills.map((skill:any) => (
                        <TouchableOpacity
                            key={skill}
                            style={[
                                styles.skillPill,
                                newPosition.requirements.hardSkills.includes(skill) && styles.selectedSkillPill
                            ]}
                            onPress={() => toggleSkill(skill)}
                        >
                            <Text style={[
                                styles.skillText,
                                newPosition.requirements.hardSkills.includes(skill) && styles.selectedSkillText
                            ]}>
                                {skill}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={toggleHard}>
                        <ExpandText>{!limitHardSkills ? 'Ocultar' : 'Ver más'}</ExpandText>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.separator}></View>

            {/* Selector de habilidades técnicas en forma de "pills" */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Modalidad</Text>
                <View style={styles.skillsContainer}>
                    {modalities.map(modality => (
                        <TouchableOpacity
                            key={modality}
                            style={[
                                styles.skillPill,
                                newPosition.requirements.modality === modality && styles.selectedSkillPill // Solo una opción seleccionada
                            ]}
                            onPress={() => toggleModalities(modality)}
                        >
                            <Text style={[
                                styles.skillText,
                                newPosition.requirements.modality === modality && styles.selectedSkillText // Solo una opción seleccionada
                            ]}>
                                {modality}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={styles.separator}></View>

            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Tipo de contratación</Text>
                <View style={styles.skillsContainer}>
                    {contratation.map(contratation => (
                        <TouchableOpacity
                            key={contratation}
                            style={[
                                styles.skillPill,
                                newPosition.requirements.type === contratation && styles.selectedSkillPill // Solo una opción seleccionada
                            ]}
                            onPress={() => toggleContratations(contratation)}
                        >
                            <Text style={[
                                styles.skillText,
                                newPosition.requirements.type === contratation && styles.selectedSkillText // Solo una opción seleccionada
                            ]}>
                                {contratation}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={styles.separator}></View>

            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Años de Experiencia</Text>
                <View style={styles.skillsContainer}>
                    {experience.map(exp => (
                        <TouchableOpacity
                            key={exp}
                            style={[
                                styles.skillPill,
                                newPosition.requirements.yearsExperience === exp && styles.selectedSkillPill // Solo una opción seleccionada
                            ]}
                            onPress={() => toggleExperience(exp)}
                        >
                            <Text style={[
                                styles.skillText,
                                newPosition.requirements.yearsExperience === exp && styles.selectedSkillText // Solo una opción seleccionada
                            ]}>
                                {exp}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={styles.separator}></View>

            {/* Estilo de comunicación */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Salario</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Describe el salario ofrecido"
                    value={newPosition.salary}
                    onChangeText={text => setNewPosition({ ...newPosition, salary: text })}
                />
            </View>
            <View style={styles.separator}></View>

            {/* Botón para enviar */}
            <View style={styles.submitButtonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
                    <Text style={styles.submitButtonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    mainTitleContainer: {
        display: 'flex',
        padding: 20,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    mainTitle: {
        width: '100%',
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold'
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#111418',
    },
    separator: {
        height: 2,
        backgroundColor: '#3C444F',
        width: '100%',
        marginTop: 16,
        marginBottom: 10,
    },
    questionContainer: {
        padding: 20,
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
    questionText: {
        fontSize: 18,
        color: '#ffffff',
        marginBottom: 16,
        opacity: .7,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillPill: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'transparent',
        margin: 5,
        borderWidth: 1,
        borderColor: '#939BA7',
    },
    selectedSkillPill: {
        backgroundColor: '#E010CD',
    },
    skillText: {
        color: '#939BA7',
        fontSize: 14,
    },
    selectedSkillText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        borderColor: '#939BA7',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        color: '#939BA7',
        backgroundColor: 'transparent',
    },
    submitButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        marginBottom: 42
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#E010CD',
        padding: 15,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 20,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});