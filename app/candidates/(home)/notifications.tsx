import { useAuth } from '@/context/auth/AuthContext';
import { useFirebase } from '@/context/firebase/Firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

type Position = {
  id: string;
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
  candidates: { id: string; name: string }[]; // Array de candidatos
};

export default function LikedCompanies() {
  const { readDocuments } = useFirebase();
  const [positions, setPositions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { userId } = useAuth();

  // Fetch de posiciones y filtro de las que te interesan.
  const fetchPositions = async () => {
    setIsLoading(true);
    const data: Position[] = await readDocuments('position');
    const companies: any[] = await readDocuments('companies');
    console.log(data);
    if (data.length > 0) {
      const interestedPositions = data.filter((position: Position) => {
        if (position.candidates) {
          return position.candidates!.find((candidate: any) => candidate.id === userId)
        }
      });
      console.log('interested: ', interestedPositions.length);
      const finalPositions: any[] = interestedPositions.map((position: any) =>{
        console.log('posicion: ',position)
        return position = {
          ...position,
          company: companies.find((company)=> company.id === position?.companyId)
        }
        if(position?.companyId){
        }
      })
      setPositions(finalPositions);
    }
    // Filtrar posiciones donde el usuario está en el array `candidates`
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPositions();
  }, []);
  if (isLoading) {
    // Mostrar un indicador de carga mientras se cargan los datos
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text>Cargando posiciones...</Text>
      </View>
    );
  }
  if (positions.length <= 0) {
    return (
      <View style={styles.container}>
        <NonExists>No hay notificaciones aun</NonExists>
      </View>
    );
  }
  return (
    <Container>
      <Header>Empresas interesadas en ti</Header>
      <FlatList
        data={positions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CompanyContainer>
            {/* Reemplaza `imageUri` con la propiedad que tengas para las imágenes */}
            <CompanyImage source={{ uri: item.img }} />
            <TextContainer>
              <Title>{item.title}</Title>
              <Location>{item.description}</Location>
              <LikedIndicator>{item?.company?.name} Se interesó en ti ❤️</LikedIndicator>
            </TextContainer>
          </CompanyContainer>
        )}
      />
    </Container>
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
    flex: 1,
    backgroundColor: '#111418',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const NonExists = styled.Text`
  font-size: 20px;
  color: #fff;
  width: 100%;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin-top: 42px;
`;

const Container = styled.View`
  flex: 1;
  background-color: #121212;
  padding: 40px;
`;

const Header = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 46px;
`;

const CompanyContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #1e1e1e;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const CompanyImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 12px;
  margin-left: 10px;
`;

const TextContainer = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`;

const Location = styled.Text`
  font-size: 14px;
  color: #BBBBBB;
  margin-top: 4px;
`;

const LikedIndicator = styled.Text`
  font-size: 14px;
  color: #10B981; /* Verde */
  margin-top: 4px;
`;