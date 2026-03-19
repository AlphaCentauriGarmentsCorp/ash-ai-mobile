import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PageHeaderProps {
  title: string;
  onBackPress?: () => void;
}

export default function PageHeader({ title, onBackPress }: PageHeaderProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={handleBackPress} 
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={24} color="#FFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0D253F',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  backButton: {
    backgroundColor: 'transparent',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontFamily: FONT_FAMILY.bold,
    marginLeft: 10,
    flex: 1,
  },
});
