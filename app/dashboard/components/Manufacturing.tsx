import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ManufacturingItemProps {
  title: string;
  isSelected?: boolean;
}

function ManufacturingItem({ title, isSelected = false }: ManufacturingItemProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.manufacturingItem, 
        isSelected && styles.selectedItem
      ]}
    >
      <Text style={styles.itemText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="white" />
    </TouchableOpacity>
  );
}

export default function Manufacturing() {
  const items = [
    'Cutting',
    'Packer',
    'Printing',
    'Sewing',
    'Quality Control (QA)',
    'Inventory',
    'Screen Maker',
    'Sample Maker'
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
            isSelected={item === 'Quality Control (QA)'}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  itemsContainer: {
    gap: 8,
  },
  manufacturingItem: {
    backgroundColor: '#1e3a5f',
    borderRadius: 8,
    padding: 16,
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
    fontSize: 16,
    fontWeight: '500',
  },
});