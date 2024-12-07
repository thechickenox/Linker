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
  const [newCandidate, setNewCandidate] = useState<any>({});

  const fetchCandidate = async () => {
    try {
      setIsLoading(true);
      console.log('userId', userId);
      const allCandidates = await readDocuments("companies");
      const filter = allCandidates.find((can: any) => { return can.id == userId })
      setCandidate(filter);
      setNewCandidate(filter);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const onSubmit = async () => {
    if (userId) {
      setIsLoading(true);
      console.log('userId', userId);
      const res = await updateDocument('companies', userId, newCandidate);
      console.log('reponse: ', res);
      console.log('enviado');
      setIsEditing(false);
      setIsLoading(false);
    }
  }
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4">Cargando...</Text>
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
            <Text style={styles.infoTextTitle}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={newCandidate.name}
              placeholder="Name"
              onChangeText={(text) => setNewCandidate({ ...newCandidate, name: text })}
            />
            <Text style={styles.infoTextTitle}>Email</Text>
            <TextInput
              style={styles.input}
              value={newCandidate.email}
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={(text) => setNewCandidate({ ...newCandidate, email: text })}
            />
            <View style={styles.submitButtonContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
                <Text style={styles.submitButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.infoTextTitle}>Nombre</Text>
            <Text style={styles.infoText}>{newCandidate.name}</Text>
            <Text style={styles.infoTextTitle}>Email</Text>
            <Text style={styles.infoText}>{newCandidate.email}</Text>
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
    borderColor: '#fff',
  },
  profileName: {
    color: '#BC8FFF',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  iconButtonSpecial: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    backgroundColor: '#BC8FFF',
    height: 90,
    width: 90
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
    borderColor: '#939BA7',
    borderWidth: 1,
  },
  infoTextTitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
    opacity: .5
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    color: '#fff',
    backgroundColor: '#444',
    fontSize: 16,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  swiperWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 0,
    marginBottom: 10, // Esto ayuda a dar un espacio extra en la parte inferior
  },
  submitButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
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