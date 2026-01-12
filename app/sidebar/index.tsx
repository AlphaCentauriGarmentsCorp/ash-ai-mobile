import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SidebarHeader from './components/SidebarHeader';
import SidebarMenu from './components/SidebarMenu';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

const SIDEBAR_WIDTH = 280;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

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
            }
          ]}
        >
          <SafeAreaView style={styles.safeArea}>
            <SidebarHeader />
            <SidebarMenu onItemPress={handleClose} />
          </SafeAreaView>
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
  safeArea: {
    flex: 1,
  },
});