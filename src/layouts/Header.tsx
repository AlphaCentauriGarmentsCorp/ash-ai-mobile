import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import NotificationModal from './NotificationModal';
import Sidebar from './Sidebar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getResponsiveSizes = () => {
  const isSmallDevice = SCREEN_WIDTH < 375;
  
  return {
    headerPadding: isSmallDevice ? 12 : 16,
    iconSize: isSmallDevice ? 22 : 26,
    isSmallDevice,
  };
};

const sizes = getResponsiveSizes();

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setShowSidebar(true)}
        >
          <Ionicons name="menu" size={sizes.iconSize + 5} color="white" />
        </TouchableOpacity>
        
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.iconButton}>
            <View style={styles.iconCircle}>
              <Image 
               source={require('../assets/images/list-check-solid-full 1.png')}
                style={{
                  width: sizes.iconSize + 5,
                  height: sizes.iconSize + 5,
                }}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowNotifications(true)}
          >
            <View style={styles.iconCircle}>
              <Image 
               source={require('../assets/images/bell-solid-full.png')}
                style={{
                  width: sizes.iconSize - 4,
                  height: sizes.iconSize - 4,
                }}
                resizeMode="contain"
              />
              
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications Modal */}
      <NotificationModal 
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Sidebar */}
      <Sidebar 
        visible={showSidebar} 
        onClose={() => setShowSidebar(false)} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#001C34',
    paddingHorizontal: sizes.headerPadding,
    paddingVertical: sizes.isSmallDevice ? 14 : 18,
  },
  menuButton: {
    padding: sizes.isSmallDevice ? 6 : 8,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.isSmallDevice ? 12 : 16,
  },
  iconButton: {
    position: 'relative',
  },
  iconCircle: {
    width: sizes.isSmallDevice ? 40 : 44,
    height: sizes.isSmallDevice ? 40 : 44,
    borderRadius: sizes.isSmallDevice ? 20 : 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: sizes.isSmallDevice ? 18 : 20,
    height: sizes.isSmallDevice ? 18 : 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0a2540',
  },
  badgeText: {
    color: 'white',
    fontSize: sizes.isSmallDevice ? 10 : 11,
    fontWeight: 'bold',
  },
});
