import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

const ProfileSwiperInfo = () => {
  return (
    <Swiper
      loop={true}
      autoplay={true}
      autoplayTimeout={3}
      showsPagination={true}
      paginationStyle={styles.pagination}
      activeDotColor="#ffffff"
      dotColor="#666"
      style={styles.swiper}
    >
      <View style={styles.slide}>
        <Text style={styles.text}>"Level up every action you take on"</Text>
      </View>
      <View style={styles.slide}>
        <Text style={styles.text}>"Take your journey to the next level"</Text>
      </View>
      <View style={styles.slide}>
        <Text style={styles.text}>"Explore new possibilities with us"</Text>
      </View>
      <View style={styles.slide}>
        <Text style={styles.text}>"Enhance your skills every day"</Text>
      </View>
      <View style={styles.slide}>
        <Text style={styles.text}>"Embrace the future of innovation"</Text>
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  swiper: {
    height: 150,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e', // Fondo oscuro
  },
  text: {
    color: '#b3a4ff', // Color lila para el texto
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  pagination: {
    bottom: 10, // Ajusta la posición de la paginación
  },
});

export default ProfileSwiperInfo;