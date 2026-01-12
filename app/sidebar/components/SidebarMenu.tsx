import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  section?: string;
}

interface SidebarMenuProps {
  onItemPress: () => void;
}

export default function SidebarMenu({ onItemPress }: SidebarMenuProps) {
  const homeItems: MenuItem[] = [
    { id: 'dashboard', title: 'Dashboard', icon: 'home-outline' },
    { id: 'clients', title: 'Clients', icon: 'people-outline' },
    { id: 'reefer', title: 'Reefer', icon: 'shirt-outline' },
    { id: 'sorbetes', title: 'Sorbetes', icon: 'ice-cream-outline' },
  ];

  const dailyOperations: MenuItem[] = [
    { id: 'orders', title: 'Orders', icon: 'receipt-outline' },
    { id: 'design', title: 'Design and Approval', icon: 'color-palette-outline' },
    { id: 'cutting', title: 'Cutting Operations', icon: 'cut-outline' },
    { id: 'printing', title: 'Printing Operations', icon: 'print-outline' },
    { id: 'material', title: 'Material Preparation', icon: 'cube-outline' },
  ];

  const handleItemPress = (itemId: string) => {
    console.log('Menu item pressed:', itemId);
    onItemPress();
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleItemPress(item.id)}
      activeOpacity={0.7}
    >
      <Ionicons name={item.icon as any} size={20} color="#ffffff" />
      <Text style={styles.menuText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Home Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Home</Text>
        {homeItems.map(renderMenuItem)}
      </View>

      {/* Daily Operations Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Operations</Text>
        {dailyOperations.map(renderMenuItem)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  menuText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 16,
    fontWeight: '400',
  },
});