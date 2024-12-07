import SwipeableCard from '@/components/SwipeableCard';
import { useAuth } from '@/context/auth/AuthContext';
import { useFirebase } from '@/context/firebase/Firestore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  FlatList,
  ActivityIndicator,
} from "react-native";
import styled from 'styled-components/native';

interface Position {
  title: string;
  description: string;
  requirements: {
    hardSkills: string[];
    modality: string;
    type: string;
    yearsExperience: string;
  };
  salary: string;
  status: string;
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  backButtonStyle: {
    height: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 65,
  }
});

const CandidatesSwipe = () => {
  const { readDocuments } = useFirebase();
  const { userId } = useAuth();
  const router = useRouter();
  const [positions, setPositions] = useState<any[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<any | null>(null); // Estado para la posición seleccionada
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga

  const fetchPositions = async () => {
    try {
      console.log(userId);
      const data = await readDocuments('position', 'companyId', userId || '');
      console.log('info: ', data);
      setPositions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [userId]);
  const handlePositionSelect = (position: any) => {
    setSelectedPosition(position); // Establece la posición seleccionada
  };

  const handleBackToList = () => {
    setSelectedPosition(null); // Regresa a la lista de posiciones
  };
  const formatCurrency = (value: any) => {
    if (value == null) return 'N/A'; // Maneja valores nulos o indefinidos
    if (!value) return 'N/A'; // Maneja valores nulos o indefinidos
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4">Cargando posiciones...</Text>
      </View>
    );
  }

  if (positions.length === 0) {
    return (
      <View style={styles.container}>
        <Text className="text-white">No hay posiciones disponibles</Text>
      </View>
    );
  }

  if (selectedPosition) {
    return (
      <View style={styles.container}>
        <SwipeableCard position={selectedPosition} />
      </View>
    );
  }

  return (
    <MainContainer>
      <Header>Elige un puesto para filtrar a los candidatos</Header>
      <Container>
        <FlatList
          data={positions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PositionContainer onPress={() => handlePositionSelect(item)}>
              <ProfileImage source={{ uri: item.img }} />
              <TextContainer>
                <Title>{item.title}</Title>
                <SubTitleInfo>
                  <SubTitle>
                    {item.requirements.modality} - {formatCurrency(item.salary)}

                  </SubTitle>
                </SubTitleInfo>
                <Status>{item.status}</Status>
              </TextContainer>
            </PositionContainer>
          )}
        />
      </Container>
    </MainContainer>);
};

const SubTitleInfo = styled.Text`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;
const SubTitle = styled.Text`
  font-size: 14px;
  color: #ffffff;
  opacity: 0.4;
  margin-top: 6px;
`;

const MainContainer = styled.View`
  flex: 1;
  background-color: #111418;
  padding: 32px;
`;
const Container = styled.View`
  flex: 1;
  background-color: #111418;
  padding: 16px;
`;
const OptionsContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const OptionsButton = styled.Text`
  padding-top: 16px;
  padding-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  color: white;
  border-top-width: 1px;
  border-top-color: #7C8591;
  border-bottom-width: 1px;
  border-bottom-color: #7C8591;
`;

const Header = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #BC8FFF;
  margin-top: 16px;
  margin-bottom: 16px;
  padding: 16px;
`;

const PositionContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #1e1e1e;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 2px solid #7C8591;
`;

const ProfileImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
`;

const TextContainer = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`;

const Status = styled.Text`
  font-size: 16px;
  margin-top: 4px;
  color: #BC8FFF;
`;
const BackButton = styled.Text`
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  padding: 10px 20px;
  background-color: #444;
  border-radius: 8px;
  text-align: center;
`;
export default CandidatesSwipe;