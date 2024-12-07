import BackButton from '@/app/utils/components/BackButton';
import DownloadButton from '@/components/DownloadButton';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useAuth } from '@/context/auth/AuthContext';
import { useFirebase } from '@/context/firebase/Firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

export default function CadidatesPositions() {
  const { readDocuments } = useFirebase();
  const { userId } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [existsData, setExistsData] = useState<any>(true); // Para manejar la posición seleccionada.
  const [position, setPosition] = useState<any>(null); // Para manejar la posición seleccionada.
  const [positionState, setPositionState] = useState<any>([]); // Para manejar los datos de los candidatos.
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado de carga.

  const fetchPositions = async () => {
    setIsLoading(true); // Inicia el indicador de carga.
    try {
      const data: any[] = await readDocuments('position');
      const selectedPosition = data.find((position) => position.id === id);
      setPosition(selectedPosition);
      console.log('Selected Position:', selectedPosition);
      if (!selectedPosition) {
        console.error(`No position found with id ${id}`);
        return;
      }
      if (!selectedPosition.candidates) {
        console.log('No candidates found')
        setExistsData(false);
        return;
      }
      // Obtiene los datos de los candidatos
      const selectedCandidates = await Promise.all(
        selectedPosition.candidates.map(async (candidate: any) => {
          const candidateData = await fetchCandidates(candidate);
          return candidateData;
        })
      );
      console.log('Selected: ', selectedCandidates);
      setPositionState(selectedCandidates); // Asegúrate de aplanar el arreglo si `fetchCandidates` retorna múltiples elementos.
      setExistsData(true);
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setIsLoading(false); // Termina el indicador de carga.
    }
  };

  const fetchCandidates = async (usrDta: any) => {
    try {
      const data: any[] = await readDocuments('candidates');
      const filtered = data.find(candidate => candidate.id == usrDta.id);
      console.log('candidate', filtered);
      return filtered;
    } catch (error) {
      console.error(`Error fetching candidate with userId ${usrDta.id}:`, error);
      return [];
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const toggleDetails = (id: string) => {
    setPositionState((prevState: any) =>
      prevState.map((item: any) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };
  const goBack = () => {
    router.replace('/companies/(home)/positions'); // Navega a la pantalla principal
  };
  return (
    <MainContainer>
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator size="large" color="#42A5F5" />
          <LoadingText>Cargando...</LoadingText>
        </LoadingContainer>
      ) : (
        <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={ <BgImage source={position.img}/> }>
          <View style={styles.backButtonContainer}>
            <BackButton onPressFunction={() => { goBack() }} color="white" />
          </View>
          <View style={styles.mainTitleContainer}>
            <Header>{position?.title || 'Posición'}</Header>
          </View>

          {
            existsData ? (
              <Container>
                <SubHeader>Candidatos guardados</SubHeader>
                <FlatList
                  data={positionState}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <PositionContainer>
                      <TextContainer>
                        <Title>{item.name}</Title>
                        <Status>{item.status}</Status>
                        <TouchableOpacity onPress={() => toggleDetails(item.id)}>
                          <ExpandText>{item.expanded ? 'Ocultar detalles' : 'Ver detalles'}</ExpandText>
                        </TouchableOpacity>
                        {item.expanded && (
                          <DetailsContainer>
                            <Description>{item.description}</Description>

                            {/* Grupo de contacto */}
                            <GroupHeader>Contacto</GroupHeader>
                            <InfoRow>
                              <Label>Email:</Label>
                              <Value>{item.email || '-'}</Value>
                            </InfoRow>
                            <InfoRow>
                              <Label>Teléfono:</Label>
                              <Value>{item.phone}</Value>
                            </InfoRow>
                            <InfoRow>
                              <Label>LinkedIn:</Label>
                              <Value>{item.contact.linkedin || '-'}</Value>
                            </InfoRow>
                            <InfoRow>
                              <Label>GitHub:</Label>
                              <Value>{item.contact.GitHub || '-'}</Value>
                            </InfoRow>
                            <InfoRow>
                              <Label>CV:</Label>
                              <DownloadButton fileUrl={item.documentUrl} fileName={`${item.name}_resume.pdf`} />
                            </InfoRow>

                            {/* Grupo de habilidades técnicas */}
                            <GroupHeader>Habilidades Técnicas (Hard Skills)</GroupHeader>
                            <View style={styles.skillsContainer}>
                              {item.hardSkills.map((skill: string, index: string) => (
                                <View key={index} style={[styles.skillPill, styles.selectedSkillPill]}>
                                  <Text style={[
                                    styles.skillText
                                  ]}>
                                    {skill}
                                  </Text>
                                </View>
                              ))}
                            </View>

                            {/* Grupo de habilidades blandas */}
                            <GroupHeader>Habilidades Blandas (Soft Skills)</GroupHeader>
                            <View style={styles.skillsContainer}>
                              {item.softSkills.map((skill: string, index: string) => (
                                <View key={index} style={[styles.skillPill, styles.selectedSkillPill]}>
                                  <Text style={[
                                    styles.skillText
                                  ]}>
                                    {skill}
                                  </Text>
                                </View>
                              ))}
                            </View>

                            {/* Grupo de datos adicionales */}
                            <GroupHeader>Datos</GroupHeader>
                            <InfoRow>
                              <Label>Nombre:</Label>
                              <Value>{item.name}</Value>
                            </InfoRow>
                            <InfoRow>
                              <Label>Género:</Label>
                              <Value>{item.gender === 'H' ? 'Hombre' : 'Mujer'}</Value>
                            </InfoRow>
                            {/* <InfoRow>
                      <Label>Fecha de nacimiento:</Label>
                      <Value>{item.birthdate}</Value>
                    </InfoRow> */}
                            <InfoRow>
                              <Label>Experiencia:</Label>
                              <Value>{item.experience}</Value>
                            </InfoRow>
                          </DetailsContainer>
                        )}
                      </TextContainer>
                    </PositionContainer>
                  )}
                />
              </Container>
            ) : (
              <NonExists>No hay Candidatos agregados al puesto</NonExists>
            )
          }
    </ParallaxScrollView>
      )}
    </MainContainer>
  );
}
const GroupHeader = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #BC8FFF;
  margin-top: 12px;
  margin-bottom: 4px;
`;

const InfoRow = styled.View`
  display: flex;
align-items: center;
justify-content: flex-start;
flex-wrap: wrap;
  flex-direction: row;
  margin-bottom: 6px;
  gap: 4px;
  width: '100%';
`;

const NonExists = styled.Text`
  font-size: 20px;
  color: #fff;
  width: 100%;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
`;
const Label = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  opacity: 0.8;
  width: 100px; /* Ajusta según tu diseño */
`;

const Value = styled.Text`
  width: fit-content;
  font-size: 16px;
  padding-inline: 5px;
  color: #ffffff;
  padding-inline: 15;
    padding-top: 10;
    padding-bottom: 10;
    border-radius: 20px;
    background: #3B0191;
`;
const SkillsContainer = styled.View`
display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;
`;
const styles = StyleSheet.create({
  backButtonContainer: {
    display: 'flex',
    paddingHorizontal: 28,
    paddingTop: 28,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mainTitleContainer: {
    display: 'flex',
    padding: 28,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    width: 'auto'
  },
  selectedSkillPill: {
    backgroundColor: 'transparent',
    borderColor: '#BC8FFF',
    borderWidth: 1,
  },
  skillText: {
    color: '#ffffff',
    fontSize: 14,
  },
  skillsTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '100%',
  },
});

const MainContainer = styled.View`
  flex: 1;
  background-color: #111418;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #111418;
`;

const LoadingText = styled.Text`
  margin-top: 10px;
  font-size: 16px;
  color: #42A5F5;
`;

const Container = styled.View`
  flex: 1;
  background-color: #111418;
  padding: 16px;
`;

const Header = styled.Text`
  font-size: 38px;
  font-weight: bold;
  color: #fff;
`;
const SubHeader = styled.Text`
  font-size: 26px;
  color: #fff;
  margin-bottom: 28px;
  padding-inline: 20px;
  text-align: center;
`;

const PositionContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  background-color: #1e1e1e;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 2px solid #7C8591;
`;

const BgImage = styled.Image`
  width: 100%;
`;

const TextContainer = styled.View`
  flex: 1;
  padding: 10px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 600;
  color: #ffffff;
  text-transform: capitalize;
  opacity: 0.7;
`;

const Status = styled.Text`
  font-size: 14px;
  margin-top: 4px;
  color: #F44336;
`;

const ExpandText = styled.Text`
  font-size: 14px;
  margin-top: 8px;
  color: #BC8FFF;
  text-decoration: underline;
`;

const DetailsContainer = styled.View`
  margin-top: 8px;
  padding: 24px;
  background-color: #2c2c2c;
  border-radius: 8px;
`;

const Description = styled.Text`
  font-size: 14px;
  color: #ffffff;
`;