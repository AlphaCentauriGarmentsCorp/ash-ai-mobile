import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
          <Ionicons name={getIcon()} size={16} color={textColor} />
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
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
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
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  viewMore: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});