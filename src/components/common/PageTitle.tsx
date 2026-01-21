import { Ionicons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getResponsiveSizes = () => {
  const isSmallDevice = SCREEN_WIDTH < 375;
  
  return {
    iconSize: isSmallDevice ? 20 : 24,
    titleFontSize: isSmallDevice ? 16 : 18,
    padding: isSmallDevice ? 12 : 16,
    isSmallDevice,
  };
};

const sizes = getResponsiveSizes();

interface PageTitleProps {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  breadcrumb?: string;
}

export default function PageTitle({ title, icon = 'stats-chart-outline', breadcrumb }: PageTitleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={sizes.iconSize} color="#333" />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {breadcrumb && (
        <Text style={styles.breadcrumb}>{breadcrumb}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: sizes.padding,
    paddingVertical: sizes.isSmallDevice ? 16 : 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: sizes.isSmallDevice ? 40 : 44,
    height: sizes.isSmallDevice ? 40 : 44,
    borderRadius: sizes.isSmallDevice ? 20 : 22,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: sizes.isSmallDevice ? 12 : 14,
  },
  title: {
    fontSize: sizes.titleFontSize,
    fontWeight: '600',
    color: '#333',
  },
  breadcrumb: {
    fontSize: sizes.isSmallDevice ? 11 : 12,
    color: '#666',
    marginLeft: sizes.isSmallDevice ? 8 : 12,
  },
});
