// BackButton.js
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BackButton = ({ onPressFunction, color = 'black' }: { onPressFunction: any, color: string}) => (
  <TouchableOpacity
    onPress={onPressFunction}
    style={{ padding: 10 }}
  >
    <Ionicons name="arrow-back" size={24} color={color} />
  </TouchableOpacity>
);

export default BackButton;