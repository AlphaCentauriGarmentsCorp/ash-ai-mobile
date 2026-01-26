import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ExternalOperations from '@components/specific/Dashboard/ExternalOperations';
import Manufacturing from '@components/specific/Dashboard/Manufacturing';
import QuickActions from '@components/specific/Dashboard/QuickActions';
import StatsCards from '@components/specific/Dashboard/StatsCards';
import TopSellingProducts from '@components/specific/Dashboard/TopSellingProducts';
import WorkDistribution from '@components/specific/Dashboard/WorkDistribution';
import { usePoppinsFonts } from '@hooks';
import { Header, PageTitle } from '@layouts';
import { COLORS, PADDING } from '@styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getResponsivePadding = () => {
  const isSmallDevice = SCREEN_WIDTH < 375;
  return isSmallDevice ? PADDING.container.sm : PADDING.container.base;
};

export default function DashboardScreen() {
  const fontsLoaded = usePoppinsFonts();
  
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Header />
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
