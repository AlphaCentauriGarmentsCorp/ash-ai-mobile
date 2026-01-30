import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Responsive calculations based on screen size
const getResponsiveDimensions = () => {
  const isSmallDevice = SCREEN_WIDTH < 375;
  const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
  const isLargeDevice = SCREEN_WIDTH >= 768;
  
  const containerPadding = isSmallDevice ? 16 : 20;
  const cardSpacing = isSmallDevice ? 10 : 12;
  
  return {
    containerPadding,
    cardSpacing,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
  };
};

const dimensions = getResponsiveDimensions();

interface QuickActionItem {
  id: string;
  title: string;
  icon: string;
  route: string;
}

export default function QuickActions() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const quickActions: QuickActionItem[] = [
    { id: 'orders', title: 'View\nOrders', icon: 'receipt-outline', route: '/order' },
    { id: 'clients', title: 'Clients', icon: 'people-outline', route: '/client' },
    { id: 'payroll', title: 'Payroll', icon: 'card-outline', route: '' },
    { id: 'finance', title: 'Finance', icon: 'calculator-outline', route: '' },
  ];

  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    setScrollPosition(scrollX);
  };

  const onContainerLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const cardWidth = containerWidth > 0 
    ? (containerWidth - dimensions.cardSpacing) / 2 
    : (SCREEN_WIDTH - (dimensions.containerPadding * 2) - dimensions.cardSpacing) / 2;

  const handleActionPress = (item: QuickActionItem) => {
    router.push(item.route);
  };

  const renderActionCard = (item: QuickActionItem, index: number) => {
    return (
      <TouchableOpacity 
        key={item.id} 
        style={[
          styles.actionCard, 
          { 
            width: cardWidth,
          }
        ]}
        onPress={() => handleActionPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon as any} size={dimensions.isSmallDevice ? 28 : 32} color="#0D253F" />
        </View>
        <Text style={styles.actionTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderProgressIndicator = () => {
    const totalPages = Math.ceil(quickActions.length / 2);
    
    if (totalPages <= 1) return null;
    
    const pageWidth = cardWidth * 2 + dimensions.cardSpacing * 3;
    const currentPage = Math.round(scrollPosition / pageWidth);
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                currentPage === index && styles.progressDotActive
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <Text style={styles.subtitle}>Fast access to essential features</Text>
      
      <View 
        style={styles.carouselContainer}
        onLayout={onContainerLayout}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          decelerationRate="fast"
          snapToInterval={cardWidth * 2 + dimensions.cardSpacing * 3}
          snapToAlignment="start"
          pagingEnabled={false}
          bounces={false}
          overScrollMode="never"
        >
          {quickActions.map((item, index) => renderActionCard(item, index))}
        </ScrollView>
      </View>
      
      {renderProgressIndicator()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e8f4fd',
    borderRadius: dimensions.isSmallDevice ? 12 : 16,
    padding: dimensions.containerPadding,
    marginVertical: dimensions.isSmallDevice ? 8 : 10,
  },
  title: {
    fontSize: dimensions.isSmallDevice ? 20 : dimensions.isMediumDevice ? 22 : 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: dimensions.isSmallDevice ? 13 : dimensions.isMediumDevice ? 14 : 15,
    color: '#888',
    marginBottom: dimensions.isSmallDevice ? 16 : 20,
  },
  carouselContainer: {
    position: 'relative',
    marginBottom: dimensions.isSmallDevice ? 12 : 16,
    overflow: 'hidden',
  },
  scrollView: {
    overflow: 'visible',
  },
  scrollContent: {
    flexDirection: 'row',
    gap: dimensions.cardSpacing,
  },
  actionCard: {
    backgroundColor: '#0D253F',
    borderRadius: dimensions.isSmallDevice ? 12 : 16,
    padding: dimensions.isSmallDevice ? 16 : dimensions.isMediumDevice ? 20 : 24,
    justifyContent: 'space-between',
    height: dimensions.isSmallDevice ? 140 : dimensions.isMediumDevice ? 160 : 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: dimensions.isSmallDevice ? 12 : 14,
    padding: dimensions.isSmallDevice ? 10 : 12,
    width: dimensions.isSmallDevice ? 48 : dimensions.isMediumDevice ? 56 : 64,
    height: dimensions.isSmallDevice ? 48 : dimensions.isMediumDevice ? 56 : 64,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  actionTitle: {
    color: 'white',
    fontSize: dimensions.isSmallDevice ? 18 : dimensions.isMediumDevice ? 20 : 22,
    fontWeight: '700',
    textAlign: 'left',
    lineHeight: dimensions.isSmallDevice ? 24 : dimensions.isMediumDevice ? 26 : 28,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressTrack: {
    flexDirection: 'row',
    gap: dimensions.isSmallDevice ? 8 : 10,
    alignItems: 'center',
  },
  progressDot: {
    width: dimensions.isSmallDevice ? 40 : 50,
    height: dimensions.isSmallDevice ? 4 : 5,
    borderRadius: dimensions.isSmallDevice ? 2 : 2.5,
    backgroundColor: '#C4C4C4',
  },
  progressDotActive: {
    backgroundColor: '#3B82F6',
  },
});