import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getResponsiveSizes = () => {
  const isSmallDevice = SCREEN_WIDTH < 375;
  const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
  
  return {
    containerPadding: isSmallDevice ? 12 : 16,
    titleSize: isSmallDevice ? 16 : 18,
    subtitleSize: isSmallDevice ? 12 : 14,
    itemPadding: isSmallDevice ? 12 : 16,
    itemTextSize: isSmallDevice ? 14 : 16,
    iconSize: isSmallDevice ? 18 : 20,
    borderRadius: isSmallDevice ? 10 : 12,
    isSmallDevice,
    isMediumDevice,
  };
};

const sizes = getResponsiveSizes();

interface ManufacturingItemProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

function ManufacturingItem({ title, isSelected, onPress }: ManufacturingItemProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.manufacturingItem,
        isSelected && styles.selectedItem
      ]}
      onPress={onPress}
    >
      <Text style={styles.itemText}>{title}</Text>
      <Ionicons name="chevron-forward" size={sizes.iconSize} color="white" />
    </TouchableOpacity>
  );
}

export default function Manufacturing() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const items = [
    'Graphic Designing',
    'Purchasing',
    'Cutting',
    'Screen Making',
    'Sample Maker',
    'Sewing',
    'Packing',
    'Quality Control',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manufacturing</Text>
      <Text style={styles.subtitle}>Fast access to all production stages</Text>
      
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <ManufacturingItem
            key={index}
            title={item}
            isSelected={selectedItem === item}
            onPress={() => setSelectedItem(item)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e8f4fd',
    borderRadius: sizes.borderRadius,
    padding: sizes.containerPadding,
    marginVertical: sizes.isSmallDevice ? 6 : 8,
  },
  title: {
    fontSize: sizes.titleSize,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: sizes.subtitleSize,
    color: '#666',
    marginBottom: sizes.isSmallDevice ? 12 : 16,
  },
  itemsContainer: {
    gap: sizes.isSmallDevice ? 6 : 8,
  },
  manufacturingItem: {
    backgroundColor: '#1e3a5f',
    borderRadius: sizes.isSmallDevice ? 6 : 8,
    padding: sizes.itemPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: '#4a90e2',
  },
  itemText: {
    color: 'white',
    fontSize: sizes.itemTextSize,
    fontWeight: '500',
  },
});