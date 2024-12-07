import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const DownloadButton = ({ fileUrl, fileName }: any) => {
  const handleDownload = async () => {
    try {
      if (!fileUrl) {
        Alert.alert('Error', 'No se proporcionó una URL válida para el archivo.');
        return;
      }

      // Ruta donde se guardará el archivo
      const downloadPath = `${FileSystem.documentDirectory}${fileName}`;

      // Descargar el archivo
      const { uri } = await FileSystem.downloadAsync(fileUrl, downloadPath);

      Alert.alert('Descarga Completa', `Archivo guardado en: ${uri}`);

      // Compartir o abrir el archivo (opcional)
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('No se puede compartir', 'La función para compartir no está disponible en este dispositivo.');
      }
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      Alert.alert('Error', 'No se pudo descargar el archivo.');
    }
  };

  return (
    <View style={styles.downloadContainer}>
      <TouchableOpacity onPress={handleDownload} style={styles.downloadButton}>
        <Text style={styles.downloadButtonText}>Descargar PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  downloadContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: '#BC8FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DownloadButton;