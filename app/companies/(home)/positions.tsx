import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import styled from 'styled-components/native';
import { Href, useRouter } from 'expo-router';
import { useFirebase } from '@/context/firebase/Firestore';
import { useAuth } from '@/context/auth/AuthContext';

export default function Positions() {
  const { readDocuments } = useFirebase();
  const { userId } = useAuth();
  const router = useRouter();
  const [positions, setPositions] = useState<any[]>([]);
  const fetchPositions = async () => {
    console.log(userId);
    const data = await readDocuments('position', 'companyId', userId || '');
    console.log('info: ', data);
    setPositions(data);
  };
  useEffect(() => {
    console.log('hola')
    fetchPositions();
  }, [userId]);

  const handlePageChange = (pageRoute: Href) => {
    router.replace(pageRoute);
  };

  const handleCandidatesChange = (id: string) => {
    router.push({ pathname: '/companies/(positions)/[id]', params: { id } });
  };
  const formatCurrency = (value: any) => {
    if (value == null) return 'N/A'; // Maneja valores nulos o indefinidos
    if (!value) return 'N/A'; // Maneja valores nulos o indefinidos
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  return (
    <MainContainer>
      <Header>Puestos guardados</Header>
        <FlatList
          data={positions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PositionContainer onPress={() => handleCandidatesChange(item.id)}>
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

      <OptionsContainer>
        <OptionsButton onPress={() => handlePageChange('/companies/(positions)/position-edit')}>
          Crear
        </OptionsButton>
      </OptionsContainer>
    </MainContainer>
  );
}

const MainContainer = styled.View`
  flex: 1;
  background-color: #111418;
  padding: 24px;
`;
const Container = styled.ScrollView`
  flex: 1;
  background-color: #111418;
  padding: 24px 34px;
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
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: white;
  border: 1.5px;
  border-color: #BC8FFF;
  border-radius: 26px;
`;

const Header = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #BC8FFF;
  margin-top: 16px;
  margin-bottom: 28px;
`;

const PositionContainer = styled.Text`
display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #1e1e1e;
  padding: 10px;
  padding-inline: 16px !important;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 2px solid #7C8591;
`;

const ProfileImage = styled.Image`
  width: 70px;
  height: 70px;
  border-radius: 25px;
  margin-right: 1px;
`;

const TextContainer = styled.View`
  flex: 1;
  padding-inline: 14px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`;
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

const Status = styled.Text`
  font-size: 14px;
  margin-top: 4px;
  color: #BC8FFF;
`;