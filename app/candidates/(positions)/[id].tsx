import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BackButton from '@/app/utils/components/BackButton';
import { useFirebase } from '@/context/firebase/Firestore';
import { useAuth } from '@/context/auth/AuthContext';

interface Position {
    title: string;
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

export default function PositionView() {
    const { readDocuments } = useFirebase();
    const { userId } = useAuth();
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true); // Estado de carga.
    const [newPosition, setNewPosition] = useState<Position>({
        title: '',
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
    const fetchPosition = async () => {
        setIsLoading(true);
        try {
            const data: any = await readDocuments('position');
            const selectedPosition = data.find((pos: any) => pos.id === id);
            console.log('posId: ', id);
            console.log('positions: ', data);
            console.log('position: ', selectedPosition);
            setNewPosition(selectedPosition);
            setIsLoading(false);
        } catch (error: any) {
            throw new Error('error', error);
        }
    }
    useEffect(() => {
        fetchPosition();
        setIsLoading(false);
    }, []);
    const modalities = ["Presencial", "Remoto", "Hibrido"];
    const contratation = ["Medio tiempo", "Tiempo completo", "Contrato indefinido"];
    const experience = ["Menos de 1 año", "De 1 a 2 años", "De 2 a 3 años", "Más de 4 años"];

    const goBack = () => {
        router.replace('/candidates/(home)/companies');
    };
    if (isLoading) {
        // Mostrar un indicador de carga mientras se cargan los datos
        return (
            <View>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text>Cargando posiciones...</Text>
            </View>
        );
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.mainTitleContainer}>
                <BackButton onPressFunction={() => { goBack() }} color="white" />
                <Text style={styles.mainTitle}>Puesto nuevo</Text>
            </View>
            <View style={styles.separator}></View>

            {/* Descripción del puesto */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Titulo del Puesto</Text>
                <Text style={styles.questionSubText}>{newPosition.title}</Text>
            </View>
            <View style={styles.separator}></View>

            {/* Estilo de comunicación */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Descripción del Puesto</Text>
                <Text style={styles.questionSubText}>{newPosition.description}</Text>
            </View>
            <View style={styles.separator}></View>

            {/* Selector de habilidades técnicas en forma de "pills" */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Aptitudes Requeridas</Text>
                <View style={styles.skillsContainer}>
                    {newPosition.requirements.softSkills ? newPosition.requirements.softSkills.map((skill, index) => (
                        <View key={index} style={[styles.skillPill, styles.selectedSkillPill]}>
                            <Text style={[
                                styles.skillText
                            ]}>
                                {skill}
                            </Text>
                        </View>
                    )) : <Text style={[
                        styles.skillText
                    ]}>
                        No tiene ningun registro
                    </Text>}
                </View>
            </View>
            <View style={styles.separator}></View>
            {/* Selector de habilidades técnicas en forma de "pills" */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Habilidades Técnicas Requeridas</Text>
                <View style={styles.skillsContainer}>
                    {newPosition.requirements.hardSkills ? newPosition.requirements.hardSkills.map((skill, index) => (
                        <View key={index} style={[styles.skillPill, styles.selectedSkillPill]}>
                            <Text style={[
                                styles.skillText
                            ]}>
                                {skill}
                            </Text>
                        </View>
                    )) : <Text style={[
                        styles.skillText
                    ]}>
                        No tiene ningun registro
                    </Text>}
                </View>
            </View>
            <View style={styles.separator}></View>

            {/* Selector de habilidades técnicas en forma de "pills" */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Modalidad</Text>
                <View style={styles.skillsContainer}>
                    {modalities.map((modality, index) => (
                        <View
                            key={index}
                            style={[
                                styles.skillPill,
                                newPosition.requirements.modality === modality && styles.selectedSkillPill // Solo una opción seleccionada
                            ]}
                        >
                            <Text style={[
                                styles.skillText,
                                newPosition.requirements.modality === modality && styles.selectedSkillText // Solo una opción seleccionada
                            ]}>
                                {modality}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.separator}></View>

            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Tipo de contratación</Text>
                <View style={styles.skillsContainer}>
                    {contratation.map((contratation, index) => (
                        <View
                            key={index}
                            style={[
                                styles.skillPill,
                                newPosition.requirements.type === contratation && styles.selectedSkillPill // Solo una opción seleccionada
                            ]}
                        >
                            <Text style={[
                                styles.skillText,
                                newPosition.requirements.type === contratation && styles.selectedSkillText // Solo una opción seleccionada
                            ]}>
                                {contratation}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.separator}></View>

            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Años de Experiencia</Text>
                <View style={styles.skillsContainer}>
                    {experience.map((exp, index) => (
                        <View
                            key={index}
                            style={[
                                styles.skillPill,
                                newPosition.requirements.yearsExperience === exp && styles.selectedSkillPill // Solo una opción seleccionada
                            ]}
                        >
                            <Text style={[
                                styles.skillText,
                                newPosition.requirements.yearsExperience === exp && styles.selectedSkillText // Solo una opción seleccionada
                            ]}>
                                {exp}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.separator}></View>

            {/* Estilo de comunicación */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Salario</Text>
                <Text style={styles.questionSubText}>${newPosition.salary}</Text>
            </View>
            <View style={styles.separator}></View>

            {/* Botón para enviar */}
            <View style={styles.submitButtonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={goBack}>
                    <Text style={styles.submitButtonText}>Regresar</Text>
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
    questionText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 16,
        opacity: 0.7
    },
    questionSubText: {
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 16,
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
        width: 'auto',
        borderColor: '#333',
        borderWidth: 1,
    },
    selectedSkillPill: {
        backgroundColor: 'transparent',
        borderColor: '#E010CD',
        borderWidth: 1,
    },
    skillText: {
        color: '#ffffff',
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
        backgroundColor: '#333',
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