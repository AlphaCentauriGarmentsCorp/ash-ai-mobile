import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getResponsiveSizes = () => {
  const isSmallDevice = SCREEN_WIDTH < 375;
  const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
  
  return {
    containerPadding: isSmallDevice ? 12 : 16,
    titleSize: isSmallDevice ? 16 : 18,
    emptyTextSize: isSmallDevice ? 12 : 14,
    emptyPadding: isSmallDevice ? 40 : 60,
    borderRadius: isSmallDevice ? 10 : 12,
    isSmallDevice,
    isMediumDevice,
  };
};

const sizes = getResponsiveSizes();

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
    borderRadius: sizes.borderRadius,
    padding: sizes.containerPadding,
    marginVertical: sizes.isSmallDevice ? 6 : 8,
    marginBottom: sizes.isSmallDevice ? 20 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: sizes.titleSize,
    fontWeight: '600',
    color: '#333',
    marginBottom: sizes.isSmallDevice ? 12 : 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: sizes.emptyPadding,
  },
  emptyText: {
    fontSize: sizes.emptyTextSize,
    color: '#999',
  },
});