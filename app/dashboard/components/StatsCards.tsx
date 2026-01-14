import { Ionicons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getResponsiveSizes = () => {
  const isSmallDevice = SCREEN_WIDTH < 375;
  const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
  
  return {
    cardPadding: isSmallDevice ? 12 : 16,
    titleSize: isSmallDevice ? 12 : 14,
    valueSize: isSmallDevice ? 20 : 24,
    changeSize: isSmallDevice ? 11 : 12,
    iconSize: isSmallDevice ? 14 : 16,
    minHeight: isSmallDevice ? 100 : 120,
    isSmallDevice,
    isMediumDevice,
  };
};

const sizes = getResponsiveSizes();

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'growth' | 'decline' | 'change';
  backgroundColor: string;
  textColor: string;
}

function StatCard({ title, value, change, changeType, backgroundColor, textColor }: StatCardProps) {
  const getIcon = () => {
    switch (changeType) {
      case 'growth':
        return 'trending-up';
      case 'decline':
        return 'trending-down';
      default:
        return 'swap-horizontal';
    }
  };

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor }]}>
      <Text style={[styles.cardTitle, { color: textColor }]}>{title}</Text>
      <Text style={[styles.cardValue, { color: textColor }]}>{value}</Text>
      <View style={styles.changeContainer}>
        <View style={styles.changeRow}>
          <Ionicons name={getIcon()} size={sizes.iconSize} color={textColor} />
          <Text style={[styles.changeText, { color: textColor }]}>{change}</Text>
        </View>
        <TouchableOpacity>
          <Text style={[styles.viewMore, { color: textColor }]}>View more</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function StatsCards() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StatCard
          title="Total Revenue"
          value="₱10,000.00"
          change="Growth"
          changeType="growth"
          backgroundColor="#c8e6c9"
          textColor="#2e7d32"
        />
        <StatCard
          title="Active Orders"
          value="335"
          change="Change"
          changeType="change"
          backgroundColor="#fff3c4"
          textColor="#f57c00"
        />
      </View>
      <View style={styles.row}>
        <StatCard
          title="Active Users"
          value="25"
          change="Decline"
          changeType="decline"
          backgroundColor="#ffcdd2"
          textColor="#c62828"
        />
        <StatCard
          title="Total Clients"
          value="124"
          change="Growth"
          changeType="growth"
          backgroundColor="#c8e6c9"
          textColor="#2e7d32"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: sizes.isSmallDevice ? 6 : 8,
  },
  row: {
    flexDirection: 'row',
    gap: sizes.isSmallDevice ? 8 : 12,
    marginBottom: sizes.isSmallDevice ? 8 : 12,
  },
  card: {
    flex: 1,
    borderRadius: sizes.isSmallDevice ? 10 : 12,
    padding: sizes.cardPadding,
    minHeight: sizes.minHeight,
  },
  cardTitle: {
    fontSize: sizes.titleSize,
    fontWeight: '500',
    marginBottom: sizes.isSmallDevice ? 6 : 8,
  },
  cardValue: {
    fontSize: sizes.valueSize,
    fontWeight: '700',
    marginBottom: sizes.isSmallDevice ? 10 : 12,
  },
  changeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: sizes.changeSize,
    fontWeight: '500',
    marginLeft: 4,
  },
  viewMore: {
    fontSize: sizes.changeSize,
    textDecorationLine: 'underline',
  },
});