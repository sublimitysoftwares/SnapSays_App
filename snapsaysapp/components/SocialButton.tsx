import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface SocialButtonProps {
  type: 'google' | 'apple';
  onPress: () => void;
}

export default function SocialButton({ type, onPress }: SocialButtonProps) {
  const isGoogle = type === 'google';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-1 flex-row items-center justify-center py-4 rounded-2xl border ${
        isGoogle ? 'bg-white border-gray-200' : 'bg-black border-black'
      } shadow-sm`}
    >
      <FontAwesome
        name={isGoogle ? 'google' : 'apple'}
        size={24}
        color={isGoogle ? '#DB4437' : '#FFFFFF'}
        className="mr-3"
      />
      <Text className={`${isGoogle ? 'text-gray-800' : 'text-white'} font-bold text-base`}>
        {isGoogle ? 'Google' : 'Apple'}
      </Text>
    </TouchableOpacity>
  );
}
