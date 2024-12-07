import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import ProfileSwiperInfo from '@/components/ProfileSwiperInfo';
import { useAuth } from '@/context/auth/AuthContext';
import { useFirebase } from '@/context/firebase/Firestore';

export default function ProfileScreen() {
  const { logout, userId } = useAuth();
  const { readDocuments, updateDocument } = useFirebase();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [candidate, setCandidate] = useState<any>({});
  const [user, setUser] = useState({
    name: 'Rachel',
    age: 33,
    email: 'rachel@example.com',
    password: '********',
    available: 'Available',
  });

  const fetchCandidate = async () => {
    try {
      setIsLoading(true);
      console.log('userId', userId);
      const allCandidates = await readDocuments("candidates");
      const filter = allCandidates.find((can: any) => { return can.id == userId })
      console.log(filter);
      setCandidate(filter);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };
  useEffect(() => {
    fetchCandidate();
  }, [userId])

  if (!candidate) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4">Cargando...</Text>
      </View>
    )
  }
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4">Cargando posiciones...</Text>
      </View>
    )
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={require('@/assets/images/profile-pic.png')} // Reemplaza con la URL de la imagen de perfil
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{candidate?.name}</Text>
      </View>

      <View style={styles.iconsContainer}>
        <View style={styles.icon}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setIsEditing(false)}>
            <MaterialIcons name="person" size={32} color="#6C7482" />
          </TouchableOpacity>
          <Text style={isEditing ? styles.iconLabel : styles.activeIconLabel}>PROFILE</Text>
        </View>
        <View style={styles.icon}>
          <TouchableOpacity style={styles.iconButtonSpecial} onPress={() => setIsEditing(true)}>
            <MaterialIcons name="edit" size={32} color={isEditing ? "#E010CD" : "#6C7482"} />
          </TouchableOpacity>
          <Text style={!isEditing ? styles.iconLabel : styles.activeIconLabel}>EDIT PROFILE</Text>
        </View>
        <View style={styles.icon}>
          <TouchableOpacity style={styles.iconButton} onPress={() => logout()}>
            <FontAwesome name="heart" size={32} color="#E010CD" />
          </TouchableOpacity>
          <Text style={styles.iconLabel}>LOGOUT</Text>
        </View>
      </View>

      {/* Mostrar datos o inputs de usuario */}
      <View style={styles.userInfoContainer}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={candidate.name}
              placeholder="Name"
              onChangeText={(text) => setUser({ ...user, name: text })}
            />
            <TextInput
              style={styles.input}
              value={candidate.email}
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={(text) => setUser({ ...user, email: text })}
            />
            <TextInput
              style={styles.input}
              value={candidate.available}
              placeholder="Available"
              onChangeText={(text) => setUser({ ...user, available: text })}
            />
          </>
        ) : (
          <>
            <Text style={styles.infoTitle}>Información de usuario</Text>
            <Text style={styles.questionText}>Nombre</Text>
            <Text style={styles.infoText}>{candidate.name}</Text>
            <Text style={styles.questionText}>Email</Text>
            <Text style={styles.infoText}>{candidate.mail}</Text>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>Habilidades Técnicas</Text>
              <View style={styles.skillsContainer}>
                {candidate.hardSkills ? candidate.hardSkills.map((skill: any, index: any) => (
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
              <Text style={styles.questionText}>Aptitudes</Text>
              <View style={styles.skillsContainer}>
                {candidate.softSkills ? candidate.softSkills.map((skill: any, index: any) => (
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
          </>
        )}
      </View>

      {/* Swiper */}
      <View style={styles.swiperWrapper}>
        <ProfileSwiperInfo />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  infoTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  questionContainer: {
    paddingBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
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
  iconButtonSpecial: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    backgroundColor: '#BC8FFF',
    height: 90,
    width: 90
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  container: {
    flexGrow: 1,
    backgroundColor: '#1A1D21',
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 60,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  profileName: {
    color: '#B9A3E3',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 30,
    marginBottom: 48,
  },
  iconButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#BC8FFF',
    height: 70,
    width: 70
  },
  iconLabel: {
    color: '#6C7482',
    fontSize: 16,
    marginTop: 8,
  },
  activeIconLabel: {
    color: '#6C7482',
    fontSize: 16,
    marginTop: 8,
    fontWeight: 'bold'
  },
  userInfoContainer: {
    width: '80%',
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  swiperWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 0,
    marginBottom: 10, // Esto ayuda a dar un espacio extra en la parte inferior
  },
});