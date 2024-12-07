import { useAuth } from '@/context/auth/AuthContext';
import { useFirebase } from '@/context/firebase/Firestore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from "expo-linear-gradient";
const sampleImage = "https://www.wowevents.com/wp-content/uploads/2018/05/accomplishment-achievement-adult-1059120-800x480.jpg";
import AntDesign from '@expo/vector-icons/AntDesign';

const CompanyList = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const { readDocuments } = useFirebase();
  const router = useRouter();
  const [positions, setPositions] = useState<any[]>([]);
  const fetchPositions = async () => {
    const data = await readDocuments('position');
    console.log('info: ', data);
    setPositions(data);
  };
  useEffect(() => {
    console.log('hola')
    fetchPositions();
  }, []);
  const handlePositionSelect = (id: any) => {
    setHoveredId(id);
    router.push({ pathname: '/candidates/(positions)/[id]', params: { id } });
  };
  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => handlePositionSelect(item.id)} style={styles.mainCardContainer}>
      <View
        style={styles.cardContainer}
      >
        <View style={[styles.cardTitle, hoveredId === item.id ? { opacity: 0.2 } : { opacity: .9 }]}>
          <View style={styles.overlayTitle}>
            <ProfileImage source={{ uri: item.img }} />
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.location}>{item.requirements.modality}</Text>
            </View>
          </View>
          <View style={styles.separator}></View>
          <View style={styles.overlayInfo}>
            <SkillsContainer>
              {
                item.requirements.hardSkills ? <Text style={styles.skillsTitle}>Habilidades</Text> : <></>
              }

              <InfoRow >
                {item.requirements.hardSkills ? item.requirements.hardSkills.map((skill: string, index: string) => {
                  if (Number(index) < 3) {
                    return <Value key={`hardSkill-${index}`}>{skill}</Value>
                  }
                }) :
                  <></>
                }
              </InfoRow>
            </SkillsContainer>
            <SkillsContainer>
              {
                item.requirements.softSkills ? <Text style={styles.skillsTitle}>Aptitudes</Text> : <></>
              }

              <InfoRow >
                {item.requirements.softSkills ? item.requirements.softSkills.map((skill: string, index: string) => {
                  if (Number(index) < 2) {
                    return <Value key={`hardSkill-${index}`}>{skill}</Value>
                  }
                }) :
                  <></>
                }
              </InfoRow>
            </SkillsContainer>
            <View style={styles.lowbarContainer}>
              <Text style={styles.hiringIndicator}>✓</Text>
              <Text style={styles.hiringIndicator}>Ver más...</Text>

            </View>
          </View>
        </View>
      </View>

    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContiainer}>
        <AntDesign style={styles.headerImg} name="book" size={65} color="white" />
        <Text style={styles.header}>Descubre puestos disponibles</Text>
      </View>
      <FlatList
        data={positions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={1}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
const SkillsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;
`;
const InfoRow = styled.View`
align-items: center;
justify-content: center;
flex-wrap: wrap;
  flex-direction: row;
  margin-bottom: 6px;
  gap: 4px;
  width: '50%';
`;
const Value = styled.Text`
width: fit-content;
  font-size: 10px;
  padding-inline: 5px;
  color: #ffffff;
  padding-inline: 15;
    padding-top: 10;
    padding-bottom: 10;
    border-radius: 20px;
    background: #3B0191;
`;
const ProfileImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111418', // Tailwind color: bg-gray-800
    padding: 16,
  },
  headerContiainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  overlayTitle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  overlayTitleChild: {
    marginRight: 16, // Simula gap
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 6,
  },
  skillPill: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#333',
    margin: 5, // Simula gap
  },
  headerImg: {
    opacity: 0.6,
    color: '#FFFFFF',
    alignContent: 'center',
  },
  header: {
    color: '#FFFFFF', // White
    fontSize: 30,
    fontWeight: 'bold',
    padding: 32,
    marginBottom: 16,
  },
  mainCardContainer: {
    width: '100%',
    padding: 8,
  },
  cardContainer: {
    width: '100%',
    padding: 28,
    borderRadius: 16,
    paddingTop: 34,
    backgroundColor: '#333',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  relative: {
    position: 'relative',
  },
  overlay: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayInfo: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '99%'
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
  skillsTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '21%',
  },
  location: {
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 16,
    width: '100%',
    textAlign: 'left'
  },
  hiringIndicator: {
    color: '#10B981', // Tailwind color: text-green-500
    marginTop: 4,
    fontSize: 18,
  },
  lowbarContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  separator: {
    height: 2,
    backgroundColor: '#505a68',
    width: '100%',
    marginTop: 5,
    marginBottom: 12,
  },
});

export default CompanyList;