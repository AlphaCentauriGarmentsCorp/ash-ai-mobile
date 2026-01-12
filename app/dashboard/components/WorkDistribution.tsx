import { StyleSheet, Text, View } from 'react-native';

export default function WorkDistribution() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Work Distribution</Text>
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No employee data available</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4a90e2',
    padding: 16,
    marginVertical: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});