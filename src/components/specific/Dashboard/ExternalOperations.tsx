import { Ionicons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getResponsiveSizes = () => {
  const isSmallDevice = SCREEN_WIDTH < 375;
  const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
  
  return {
    containerPadding: isSmallDevice ? 12 : 16,
    titleSize: isSmallDevice ? 16 : 18,
    subtitleSize: isSmallDevice ? 12 : 14,
    cardPadding: isSmallDevice ? 16 : 20,
    iconSize: isSmallDevice ? 20 : 24,
    operationTitleSize: isSmallDevice ? 14 : 16,
    minHeight: isSmallDevice ? 85 : 100,
    borderRadius: isSmallDevice ? 10 : 12,
    isSmallDevice,
    isMediumDevice,
  };
};

const sizes = getResponsiveSizes();

export default function ExternalOperations() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>External Operations</Text>
      <Text style={styles.subtitle}>Manage deliveries and subcontract tasks</Text>
      
      <View style={styles.operationsRow}>
        <TouchableOpacity style={styles.operationCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="car-outline" size={sizes.iconSize} color="#1e3a5f" />
          </View>
          <Text style={styles.operationTitle}>Delivery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.operationCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="business-outline" size={sizes.iconSize} color="#1e3a5f" />
          </View>
          <Text style={styles.operationTitle}>Subcontract</Text>
        </TouchableOpacity>
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
  operationsRow: {
    flexDirection: 'row',
    gap: sizes.isSmallDevice ? 8 : 12,
  },
  operationCard: {
    flex: 1,
    backgroundColor: '#1e3a5f',
    borderRadius: sizes.borderRadius,
    padding: sizes.cardPadding,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: sizes.minHeight,
  },
  iconContainer: {
    backgroundColor: 'white',
    borderRadius: sizes.isSmallDevice ? 18 : 20,
    padding: sizes.isSmallDevice ? 10 : 12,
    marginBottom: sizes.isSmallDevice ? 6 : 8,
  },
  operationTitle: {
    color: 'white',
    fontSize: sizes.operationTitleSize,
    fontWeight: '500',
    textAlign: 'center',
  },
});