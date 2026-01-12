import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Responsive calculations
const getResponsiveDimensions = () => {
  const containerPadding = 16;
  const cardSpacing = 8;
  const availableWidth = SCREEN_WIDTH - (containerPadding * 2);
  
  // Show 2.2 cards for better UX (shows part of next card)
  const visibleCards = 2.2;
  const totalSpacing = cardSpacing * (visibleCards - 1);
  const cardWidth = (availableWidth - totalSpacing) / visibleCards;
  
  return {
    containerPadding,
    cardSpacing,
    cardWidth: Math.floor(cardWidth),
    availableWidth,
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

  const renderActionCard = (item: QuickActionItem, index: number) => {
    const isLastCard = index === quickActions.length - 1;
    
    return (
      <TouchableOpacity 
        key={item.id} 
        style={[
          styles.actionCard, 
          { 
            width: dimensions.cardWidth,
            marginRight: isLastCard ? dimensions.containerPadding : dimensions.cardSpacing
          }
        ]}
        onPress={() => console.log('Action pressed:', item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon as any} size={24} color="white" />
        </View>
        <Text style={styles.actionTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderProgressIndicator = () => {
    const totalContentWidth = (dimensions.cardWidth * quickActions.length) + 
                             (dimensions.cardSpacing * (quickActions.length - 1)) + 
                             (dimensions.containerPadding * 2);
    const visibleWidth = SCREEN_WIDTH;
    const maxScroll = Math.max(0, totalContentWidth - visibleWidth);
    
    if (maxScroll <= 0) return null; // Don't show progress if all content is visible
    
    const progressPercentage = Math.min(1, scrollPosition / maxScroll);
    const progressWidth = Math.max(20, (visibleWidth / totalContentWidth) * 100);
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progressWidth}%`,
                transform: [{ 
                  translateX: progressPercentage * (100 - progressWidth) * (SCREEN_WIDTH - 32) / 100 
                }]
              }
            ]} 
          />
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
        contentContainerStyle={[
          styles.scrollContent,
          { paddingLeft: dimensions.containerPadding }
        ]}
        decelerationRate="fast"
        snapToInterval={dimensions.cardWidth + dimensions.cardSpacing}
        snapToAlignment="start"
      >
        {quickActions.map((item, index) => renderActionCard(item, index))}
      </ScrollView>
      
      {renderProgressIndicator()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: Math.min(20, SCREEN_WIDTH * 0.05), // Responsive font size
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Math.min(16, SCREEN_WIDTH * 0.04), // Responsive font size
    color: '#666',
    marginBottom: 16,
  },
  scrollView: {
    marginBottom: 16,
  },
  scrollContent: {
    paddingRight: dimensions.containerPadding,
  },
  actionCard: {
    backgroundColor: '#1e3a5f',
    borderRadius: 12,
    padding: Math.max(16, SCREEN_WIDTH * 0.04), // Responsive padding
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Math.max(100, SCREEN_WIDTH * 0.25), // Responsive height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Math.max(20, SCREEN_WIDTH * 0.06), // Responsive border radius
    padding: Math.max(8, SCREEN_WIDTH * 0.02), // Responsive padding
    marginBottom: 8,
    width: Math.max(40, SCREEN_WIDTH * 0.1), // Responsive size
    height: Math.max(40, SCREEN_WIDTH * 0.1), // Responsive size
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    color: 'white',
    fontSize: Math.min(16, Math.max(14, SCREEN_WIDTH * 0.04)), // Responsive font size
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: Math.min(20, SCREEN_WIDTH * 0.05), // Responsive line height
  },
  progressContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(30, 58, 95, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1e3a5f',
    borderRadius: 3,
  },
});