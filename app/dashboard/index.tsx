import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardHeader from './components/DashboardHeader';
import ExternalOperations from './components/ExternalOperations';
import Manufacturing from './components/Manufacturing';
import QuickActions from './components/QuickActions';
import StatsCards from './components/StatsCards';
import TopSellingProducts from './components/TopSellingProducts';
import WorkDistribution from './components/WorkDistribution';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getResponsivePadding = () => {
  const isSmallDevice = SCREEN_WIDTH < 375;
  return isSmallDevice ? 12 : 16;
};

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <QuickActions />
        <StatsCards />
        <Manufacturing />
        <ExternalOperations />
        <TopSellingProducts />
        <WorkDistribution />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(),
  },
});