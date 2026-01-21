import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import GlobalHeader from '../src/components/common/GlobalHeader';
import PageTitle from '../src/components/common/PageTitle';
import ExternalOperations from '../src/components/specific/Dashboard/ExternalOperations';
import Manufacturing from '../src/components/specific/Dashboard/Manufacturing';
import QuickActions from '../src/components/specific/Dashboard/QuickActions';
import StatsCards from '../src/components/specific/Dashboard/StatsCards';
import TopSellingProducts from '../src/components/specific/Dashboard/TopSellingProducts';
import WorkDistribution from '../src/components/specific/Dashboard/WorkDistribution';
import { COLORS, PADDING } from '../src/constants';
import { usePoppinsFonts } from '../src/hooks';

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
