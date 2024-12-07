import React, { useEffect, useState } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useFirebase } from "@/context/firebase/Firestore";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '@/firebaseconfig';
import { StyleSheet } from "react-native";

interface Candidate {
  id: string;
  extension: string;
  phone: string;
  email: string;
  password: string;
  birthdate: string;
  img: string;
  name: string;
  gender: string;
  experience: string;
  softSkills: string[];
  hardSkills: string[];
  contact: {
    email: string;
    linkedin: string;
    github: string;
  };
}

interface Position {
  id: string;
  title: string;
  companyId: string;
  description: string;
  requirements: {
    hardSkills: string[];
    softSkills: string[];
    modality: string;
    type: string;
    yearsExperience: string;
  };
  salary: string;
  status: string;
  candidates?: any[];
}

const SwipeableCard = ({ position }: { position: Position }) => {
  const dummyCandidate = {
    id: 'string',
    extension: 'string',
    phone: 'string',
    email: 'string',
    password: 'string',
    birthdate: 'string',
    img: 'string',
    name: 'string',
    gender: 'string',
    experience: 'string',
    softSkills: [],
    hardSkills: [],
    contact: {
      email: 'string',
      linkedin: 'string',
      github: 'string',
    }
  }
  const [index, setIndex] = useState(0);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [seenCandidates, setSeenCandidates] = useState<string[]>([]); // IDs de candidatos ya vistos
  const [candidate, setCandidate] = useState<Candidate>(dummyCandidate); // IDs de candidatos ya vistos
  const { readDocuments, updateDocument } = useFirebase();

  const filterCandidates = (candidates: Candidate[], position: Position): Candidate[] => {
    return candidates
      .filter((candidate) => {
        const candidateExperience = candidate.experience || "";
        const candidateHardSkills = candidate.hardSkills || [];
        const candidateSoftSkills = candidate.softSkills || [];

        const positionHardSkills = position.requirements.hardSkills || [];
        const positionSoftSkills = position.requirements.softSkills || [];
        const positionCandidates = position.candidates || [];

        // Verificar si el candidato ya está en `position.candidates`
        const isAlreadyInCandidates = positionCandidates.some((cand) => cand.id === candidate.id);
        if (isAlreadyInCandidates) {
          return false; // Excluir si ya está en la lista de candidatos seleccionados
        }

        // Evaluar los demás criterios de filtrado
        const experienceMatches =
          position.requirements.yearsExperience &&
          candidateExperience === position.requirements.yearsExperience;

        const hardSkillsMatch = positionHardSkills.some((skill) =>
          candidateHardSkills.includes(skill)
        );

        const softSkillsMatch = positionSoftSkills.some((skill) =>
          candidateSoftSkills.includes(skill)
        );

        // Retornar candidatos que cumplen con al menos una de las condiciones
        return experienceMatches || hardSkillsMatch;
      })
      .map((candidate) => {
        // Transformar al candidato para que solo tenga las habilidades coincidentes
        const candidateHardSkills = candidate.hardSkills || [];
        const candidateSoftSkills = candidate.softSkills || [];

        const positionHardSkills = position.requirements.hardSkills || [];
        const positionSoftSkills = position.requirements.softSkills || [];

        const matchedHardSkills = candidateHardSkills.filter((skill) =>
          positionHardSkills.includes(skill)
        );

        const matchedSoftSkills = candidateSoftSkills.filter((skill) =>
          positionSoftSkills.includes(skill)
        );

        return {
          ...candidate,
          hardSkills: matchedHardSkills, // Sobrescribir solo las habilidades que coinciden
          softSkills: matchedSoftSkills,
        };
      });
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        console.log('posicion: ', position);
        const allCandidates = await readDocuments("candidates");
        const filtered = filterCandidates(allCandidates, position)
        console.log('Filtered candidates: ', filtered);
        setFilteredCandidates(filtered);
        setCandidate(filtered[index]);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, [position]);

  const handleLike = async () => {
    const candidateSelected = filteredCandidates[index];
    if (!candidateSelected) {
      console.error("Candidate is undefined");
      return;
    }

    const candidateData = {
      id: candidateSelected.id,
      candidateName: candidateSelected.name,
      selectionDate: new Date().toISOString(),
      status: "selected",
    };

    try {
      const exists = position.candidates?.find((candidate: any) => {
        return candidate.id === candidateSelected.id
      })
      console.log('exists', exists);
      if (!exists) {
        console.log('candidato guardado')
        const resp = await updateDocument('position', position.id, {
          ...position,
          candidates: arrayUnion(candidateData),
        })
        console.log('updated', resp)
      } else {
        console.error('Ya se guardó ese candidato')
      }
      console.log("Liked", `${candidateSelected.name} ha sido agregado a la posición.`);
    } catch (error) {
      console.error("Error updating position:", error);
    }
  };

  const handleSwipeButton = (action: string) => async () => {
    if (filteredCandidates.length === 0) {
      // Si ya no hay candidatos disponibles, no hacemos nada
      console.log("No hay más candidatos para mostrar.");
      return;
    }
  
    const candidateSelected = filteredCandidates[index];
  
    if (!candidateSelected) {
      console.error("Candidate is undefined");
      return; // Termina la ejecución si no hay candidato válido
    }
  
    if (action === "like") {
      await handleLike(); // Llamar la función `handleLike` solo si es necesario
    }
  
    // Avanzar al siguiente candidato
    const nextIndex = index + 1;
  
    if (nextIndex >= filteredCandidates.length) {
      // Si ya no hay más candidatos
      setIndex(0); // Reiniciar índice por si se reutiliza la lista más tarde
      setFilteredCandidates([]); // Vaciar lista de candidatos disponibles
      setCandidate(dummyCandidate); // Asignar candidato vacío
      console.log("Ya no hay más candidatos.");
    } else {
      // Actualizar estado para mostrar el siguiente candidato
      setIndex(nextIndex);
      setCandidate(filteredCandidates[nextIndex]);
    }
  };

  // Filtrar candidatos no vistos
  useEffect(() => {
    console.log('seenCandidates: ', seenCandidates);
    const filt = filteredCandidates.filter((cand) => !seenCandidates.includes(cand.id))
    console.log('filteredCandidates: ', filt);
    setFilteredCandidates(filt);

  }, [seenCandidates]);

  if (filteredCandidates.length === 0 || candidate?.id === undefined) {
    return (
      <View className="w-full h-full flex items-center justify-center bg-gray-900">
        <Text className="text-white text-center">
          Ya viste todos los candidatos posibles.
        </Text>
      </View>
    );
  }

  return (
    <View className="w-full h-full flex flex-col bg-gray-900">
      <View className="flex-1 bg-gray-800 overflow-hidden relative">
        <View className="absolute bottom-0 w-full p-8 bg-black bg-opacity-70">
          <View style={styles.titleContainer}>
          <Text className="text-white text-3xl font-bold" style={styles.name}>{candidate.name}</Text>
          <Text className="text-white">Lives in Cancun</Text>
          </View>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>Aptitudes</Text>
            <View style={styles.skillsContainer}>
              {candidate.softSkills ? candidate.softSkills.map((skill, index) => (
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
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>Habilidades</Text>
            <View style={styles.skillsContainer}>
              {candidate.hardSkills ? candidate.hardSkills.map((skill, index) => (
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
          <View style={styles.questionContainer}>
          <Text style={styles.questionText}>Experiencia</Text>
            <Text className="text-xl">{candidate?.experience || 'Sin experiencia'}</Text>
          </View>
          <View className="flex-row justify-evenly items-center w-full my-4">
            <TouchableOpacity
              onPress={handleSwipeButton("dislike")}
              className="bg-red-500 p-4 rounded-full w-14 h-14 flex items-center"
            >
              <FontAwesome name="times" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSwipeButton("like")}
              className="bg-green-500 p-4 rounded-full w-14 h-14 flex items-center"
            >
              <FontAwesome name="heart" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SwipeableCard;
const styles = StyleSheet.create({
  name: {
    textTransform: 'capitalize'
  },
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
  titleContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  questionContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingTop: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
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
    backgroundColor: '#333',
    margin: 5,
  },
  selectedSkillPill: {
    backgroundColor: '#E010CD',
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