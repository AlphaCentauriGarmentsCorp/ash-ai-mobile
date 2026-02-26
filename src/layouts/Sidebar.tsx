import { useAuth } from '@/context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  title: string;
  route?: string;
  subItems?: SubMenuItem[];
}

const SIDEBAR_WIDTH = 280;

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Log user data for debugging
  useEffect(() => {
    console.log('Sidebar - Current user:', JSON.stringify(user, null, 2));
  }, [user]);

  useEffect(() => {
    if (visible) {
      // Slide in animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide out animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, opacityAnim]);

  const handleClose = () => {
    // Start close animation first, then call onClose
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const homeItems: MenuItem[] = [
    { id: 'dashboard', title: 'Dashboard', icon: 'home-outline', route: '/dashboard' },
    { id: 'clients', title: 'Clients', icon: 'people-outline', route: '/client' },
    { 
      id: 'dropdown-settings', 
      title: 'Dropdown Settings', 
      icon: 'settings-outline',
      subItems: [
        { id: 'pattern-type', title: 'Pattern Type', route: '/dropdown-settings/Pattern Type' },
        { id: 'apparel-type', title: 'Apparel Type', route: '/dropdown-settings/Apparel Type' },
        { id: 'service-type', title: 'Service Type', route: '/dropdown-settings/Service Type' },
        { id: 'fabric-type', title: 'Fabric Type', route: '/dropdown-settings/Fabric Type' },
        { id: 'color', title: 'Color', route: '/dropdown-settings/Color' },
        { id: 'size', title: 'Size', route: '/dropdown-settings/Size' },
        { id: 'print-label', title: 'Print Label', route: '/dropdown-settings/Print Label' },
        { id: 'print-method', title: 'Print Method', route: '/dropdown-settings/Print Method' },
      ]
    },
    { id: 'accounts', title: 'Accounts', icon: 'person-circle-outline', route: '/Account' },
    { id: 'reefer', title: 'Reefer', icon: 'shirt-outline' },
    { id: 'sorbetes', title: 'Sorbetes', icon: 'ice-cream-outline' },
  ];

  const dailyOperations: MenuItem[] = [
    { id: 'orders', title: 'Orders', icon: 'receipt-outline', route: '/order' },
    { id: 'design', title: 'Design and Approval', icon: 'color-palette-outline' },
    { id: 'cutting', title: 'Cutting Operations', icon: 'cut-outline' },
    { id: 'printing', title: 'Printing Operations', icon: 'print-outline' },
    { id: 'material', title: 'Material Preparation', icon: 'cube-outline' },
  ];

  const toggleExpand = (itemId: string, parentId?: string) => {
    setExpandedItems((prev: Record<string, boolean>) => {
      const newState = { ...prev };
      
      // Toggle the clicked item
      newState[itemId] = !prev[itemId];
      
      return newState;
    });
  };

  const handleItemPress = (item: MenuItem | SubMenuItem, parentId?: string) => {
    if (item.subItems && item.subItems.length > 0) {
      toggleExpand(item.id, parentId);
    } else if (item.route) {
      router.push(item.route as any);
      handleClose();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      router.replace('/login' as any);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderSubMenuItem = (item: SubMenuItem, level: number = 1, parentId?: string) => (
    <View key={item.id}>
      <TouchableOpacity
        style={[styles.subMenuItem, { paddingLeft: 20 + (level * 20) }]}
        onPress={() => handleItemPress(item, parentId)}
        activeOpacity={0.7}
      >
        <Text style={styles.subMenuText}>{item.title}</Text>
        {item.subItems && item.subItems.length > 0 && (
          <Ionicons 
            name={expandedItems[item.id] ? "chevron-down" : "chevron-forward"} 
            size={16} 
            color="#ffffff" 
          />
        )}
      </TouchableOpacity>
      {expandedItems[item.id] && item.subItems && item.subItems.map(subItem => 
        renderSubMenuItem(subItem, level + 1, item.id)
      )}
    </View>
  );

  const renderMenuItem = (item: MenuItem) => (
    <View key={item.id}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.menuItemContent}>
          <Ionicons name={item.icon as any} size={20} color="#ffffff" />
          <Text style={styles.menuText}>{item.title}</Text>
        </View>
        {item.subItems && item.subItems.length > 0 && (
          <Ionicons 
            name={expandedItems[item.id] ? "chevron-down" : "chevron-forward"} 
            size={16} 
            color="#ffffff" 
          />
        )}
      </TouchableOpacity>
      {expandedItems[item.id] && item.subItems && item.subItems.map(subItem => 
        renderSubMenuItem(subItem, 1, item.id)
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.backdrop,
            {
              opacity: opacityAnim,
            }
          ]}
        >
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={styles.backdropTouchable} />
          </TouchableWithoutFeedback>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.sidebarContainer,
            {
              transform: [{ translateX: slideAnim }],
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            }
          ]}
        >
          <View style={styles.contentWrapper}>
            {/* Sidebar Header */}
            <View style={styles.header}>
              <View style={styles.userCard}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={24} color="#1e3a5f" />
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{user?.name || 'User'}</Text>
                    <View style={styles.adminBadge}>
                      <View style={styles.statusDot} />
                      <Text style={styles.adminText}>
                        {user?.domain_role?.[0] || user?.role || 'User'}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <Ionicons 
                    name={showUserDropdown ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
              
              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <View style={styles.userDropdown}>
                  <TouchableOpacity 
                    style={styles.dropdownItem}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="log-out-outline" size={18} color="#d32f2f" />
                    <Text style={styles.dropdownItemText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Sidebar Menu */}
            <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
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
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'relative',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#1e3a5f',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  contentWrapper: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 24,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4caf50',
    marginRight: 6,
  },
  adminText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  dropdownButton: {
    padding: 4,
  },
  userDropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '500',
  },
  menuContainer: {
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
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 16,
    fontWeight: '400',
  },
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingRight: 4,
    marginBottom: 4,
  },
  subMenuText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '300',
    flex: 1,
  },
});
