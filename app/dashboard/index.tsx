import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePoppinsFonts } from '../../hooks';
import GlobalHeader from '../components/GlobalHeader';
import PageTitle from '../components/PageTitle';
import { COLORS, PADDING } from '../constants';
import ExternalOperations from './components/ExternalOperations';
import Manufacturing from './components/Manufacturing';
import QuickActions from './components/QuickActions';
import StatsCards from './components/StatsCards';
import TopSellingProducts from './components/TopSellingProducts';
import WorkDistribution from './components/WorkDistribution';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getResponsivePadding = () => {
  const isSmallDevice = SCREEN_WIDTH < 375;
  return isSmallDevice ? PADDING.container.sm : PADDING.container.base;
};

export default function Dashboard() {
  const fontsLoaded = usePoppinsFonts();
  
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <GlobalHeader />
      <PageTitle title="Dashboard" icon="stats-chart-outline" />
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
    backgroundColor: COLORS.surface,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(),
  },
});