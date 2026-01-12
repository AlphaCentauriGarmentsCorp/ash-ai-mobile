import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ExternalOperations() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>External Operations</Text>
      <Text style={styles.subtitle}>Manage deliveries and subcontract tasks</Text>
      
      <View style={styles.operationsRow}>
        <TouchableOpacity style={styles.operationCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="car-outline" size={24} color="#1e3a5f" />
          </View>
          <Text style={styles.operationTitle}>Delivery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.operationCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="business-outline" size={24} color="#1e3a5f" />
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
  operationsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  operationCard: {
    flex: 1,
    backgroundColor: '#1e3a5f',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  iconContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
    marginBottom: 8,
  },
  operationTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});