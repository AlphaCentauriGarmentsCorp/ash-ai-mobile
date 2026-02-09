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
  pendingCount: number;
  isSelected: boolean;
  onPress: () => void;
}

function ManufacturingItem({ title, pendingCount, isSelected, onPress }: ManufacturingItemProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.manufacturingItem,
        isSelected && styles.selectedItem
      ]}
      onPress={onPress}
    >
      <Text style={styles.itemText}>{title}</Text>
      <View style={styles.rightSection}>
        <View style={styles.pendingBadge}>
          <Text style={styles.pendingText}>{pendingCount} Pending</Text>
        </View>
        <Ionicons name="chevron-forward" size={sizes.iconSize} color="white" />
      </View>
    </TouchableOpacity>
  );
}

export default function Manufacturing() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const items = [
    { title: 'Graphic Designing', pendingCount: 100 },
    { title: 'Purchasing', pendingCount: 100 },
    { title: 'Cutting', pendingCount: 100 },
    { title: 'Screen Making', pendingCount: 100 },
    { title: 'Sample Maker', pendingCount: 100 },
    { title: 'Sewing', pendingCount: 100 },
    { title: 'Packing', pendingCount: 100 },
    { title: 'Quality Control', pendingCount: 100 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manufacturing</Text>
      <Text style={styles.subtitle}>Fast access to all production stages</Text>
      
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <ManufacturingItem
            key={index}
            title={item.title}
            pendingCount={item.pendingCount}
            isSelected={selectedItem === item.title}
            onPress={() => setSelectedItem(item.title)}
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
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.isSmallDevice ? 8 : 12,
  },
  pendingBadge: {
    backgroundColor: '#FDB022',
    paddingHorizontal: sizes.isSmallDevice ? 10 : 12,
    paddingVertical: sizes.isSmallDevice ? 4 : 6,
    borderRadius: sizes.isSmallDevice ? 12 : 14,
  },
  pendingText: {
    color: '#1e3a5f',
    fontSize: sizes.isSmallDevice ? 12 : 14,
    fontWeight: '600',
  },
});