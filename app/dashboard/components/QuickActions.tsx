import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Responsive calculations based on screen size
const getResponsiveDimensions = () => {
  const isSmallDevice = SCREEN_WIDTH < 375;
  const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
  const isLargeDevice = SCREEN_WIDTH >= 768;
  
  const containerPadding = isSmallDevice ? 12 : 16;
  const cardSpacing = isSmallDevice ? 6 : 8;
  const availableWidth = SCREEN_WIDTH - (containerPadding * 2);
  
  // Show exactly 2 cards per slide
  const cardsPerSlide = 2;
  const totalSpacing = cardSpacing * (cardsPerSlide - 1);
  const cardWidth = (availableWidth - totalSpacing) / cardsPerSlide;
  
  return {
    containerPadding,
    cardSpacing,
    cardWidth: Math.floor(cardWidth),
    availableWidth,
    cardsPerSlide,
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
}

export default function QuickActions() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const quickActions: QuickActionItem[] = [
    { id: 'orders', title: 'View\nOrders', icon: 'receipt-outline' },
    { id: 'clients', title: 'Clients', icon: 'people-outline' },
    { id: 'payroll', title: 'Payroll', icon: 'card-outline' },
    { id: 'finance', title: 'Finance', icon: 'calculator-outline' },
  ];

  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    setScrollPosition(scrollX);
  };

  const renderActionCard = (item: QuickActionItem) => {
    return (
      <TouchableOpacity 
        key={item.id} 
        style={[
          styles.actionCard, 
          { 
            width: dimensions.cardWidth,
            marginRight: dimensions.cardSpacing
          }
        ]}
        onPress={() => console.log('Action pressed:', item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon as any} size={dimensions.isSmallDevice ? 20 : 22} color="white" />
        </View>
        <Text style={styles.actionTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderProgressIndicator = () => {
    const totalSlides = 3; // Fixed 3 slides for overlapping navigation
    
    if (totalSlides <= 1) return null;
    
    const slideWidth = dimensions.cardWidth + dimensions.cardSpacing;
    const currentSlide = Math.round(scrollPosition / slideWidth);
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          {Array.from({ length: totalSlides }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                currentSlide === index && styles.progressDotActive
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
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={dimensions.cardWidth + dimensions.cardSpacing}
        snapToAlignment="start"
        pagingEnabled={false}
      >
        {quickActions.map((item) => renderActionCard(item))}
      </ScrollView>
      
      {renderProgressIndicator()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e8f4fd',
    borderRadius: dimensions.isSmallDevice ? 10 : 12,
    padding: dimensions.containerPadding,
    marginVertical: dimensions.isSmallDevice ? 6 : 8,
  },
  title: {
    fontSize: dimensions.isSmallDevice ? 16 : dimensions.isMediumDevice ? 18 : 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: dimensions.isSmallDevice ? 12 : dimensions.isMediumDevice ? 13 : 14,
    color: '#666',
    marginBottom: dimensions.isSmallDevice ? 10 : 12,
  },
  scrollView: {
    marginBottom: dimensions.isSmallDevice ? 10 : 12,
    marginHorizontal: -dimensions.containerPadding,
  },
  scrollContent: {
    paddingHorizontal: dimensions.containerPadding,
    gap: dimensions.cardSpacing,
  },
  actionCard: {
    backgroundColor: '#1e3a5f',
    borderRadius: dimensions.isSmallDevice ? 8 : 10,
    padding: dimensions.isSmallDevice ? 10 : dimensions.isMediumDevice ? 12 : 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: dimensions.isSmallDevice ? 75 : dimensions.isMediumDevice ? 85 : 95,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: dimensions.isSmallDevice ? 16 : 18,
    padding: dimensions.isSmallDevice ? 6 : 8,
    marginBottom: dimensions.isSmallDevice ? 6 : 8,
    width: dimensions.isSmallDevice ? 32 : dimensions.isMediumDevice ? 36 : 40,
    height: dimensions.isSmallDevice ? 32 : dimensions.isMediumDevice ? 36 : 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    color: 'white',
    fontSize: dimensions.isSmallDevice ? 12 : dimensions.isMediumDevice ? 13 : 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: dimensions.isSmallDevice ? 16 : dimensions.isMediumDevice ? 17 : 18,
  },
  progressContainer: {
    alignItems: 'center',
    paddingHorizontal: dimensions.containerPadding,
  },
  progressTrack: {
    flexDirection: 'row',
    gap: dimensions.isSmallDevice ? 6 : 8,
    alignItems: 'center',
  },
  progressDot: {
    width: dimensions.isSmallDevice ? 6 : 8,
    height: dimensions.isSmallDevice ? 6 : 8,
    borderRadius: dimensions.isSmallDevice ? 3 : 4,
    backgroundColor: 'rgba(30, 58, 95, 0.3)',
  },
  progressDotActive: {
    backgroundColor: '#1e3a5f',
    width: dimensions.isSmallDevice ? 18 : 24,
  },
});