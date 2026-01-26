import { Ionicons } from '@expo/vector-icons';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getResponsiveSizes = () => {
  const isSmallDevice = SCREEN_WIDTH < 375;
  
  return {
    headerPadding: isSmallDevice ? 12 : 16,
    iconSize: isSmallDevice ? 22 : 26,
    modalTitleSize: isSmallDevice ? 18 : 20,
    notificationTitleSize: isSmallDevice ? 14 : 16,
    notificationMessageSize: isSmallDevice ? 12 : 14,
    isSmallDevice,
  };
};

const sizes = getResponsiveSizes();

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationModal({ visible, onClose }: NotificationModalProps) {
  const insets = useSafeAreaInsets();

  const notifications = [
    {
      id: 1,
      title: 'New Order Received',
      message: 'Order #12345 has been placed by John Doe',
      time: '2 minutes ago',
      type: 'order',
      unread: true,
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      message: 'Reefer clothing - Dark Days (Black) is running low',
      time: '15 minutes ago',
      type: 'warning',
      unread: true,
    },
    {
      id: 3,
      title: 'Production Complete',
      message: 'Quality Control batch #QC-001 has been completed',
      time: '1 hour ago',
      type: 'success',
      unread: false,
    },
    {
      id: 4,
      title: 'Client Update',
      message: 'ABC Company has updated their delivery address',
      time: '2 hours ago',
      type: 'info',
      unread: false,
    },
    {
      id: 5,
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight at 2 AM',
      time: '3 hours ago',
      type: 'info',
      unread: false,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return 'receipt-outline';
      case 'warning':
        return 'warning-outline';
      case 'success':
        return 'checkmark-circle-outline';
      case 'info':
        return 'information-circle-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return '#4a90e2';
      case 'warning':
        return '#ff9800';
      case 'success':
        return '#4caf50';
      case 'info':
        return '#2196f3';
      default:
        return '#666';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Notifications</Text>
          <TouchableOpacity 
            onPress={onClose}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={sizes.iconSize} color="#333" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.notificationsList}>
          {notifications.map((notification) => (
            <TouchableOpacity 
              key={notification.id} 
              style={[
                styles.notificationItem,
                notification.unread && styles.unreadNotification
              ]}
            >
              <View style={styles.notificationLeft}>
                <View style={[
                  styles.notificationIconContainer,
                  { backgroundColor: getNotificationColor(notification.type) + '20' }
                ]}>
                  <Ionicons 
                    name={getNotificationIcon(notification.type)} 
                    size={sizes.isSmallDevice ? 18 : 20} 
                    color={getNotificationColor(notification.type)} 
                  />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
              </View>
              {notification.unread && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))}
          <View style={{ height: insets.bottom + 20 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: sizes.headerPadding,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: sizes.modalTitleSize,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    backgroundColor: 'white',
    padding: sizes.isSmallDevice ? 12 : 16,
    marginHorizontal: sizes.isSmallDevice ? 12 : 16,
    marginVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIconContainer: {
    width: sizes.isSmallDevice ? 36 : 40,
    height: sizes.isSmallDevice ? 36 : 40,
    borderRadius: sizes.isSmallDevice ? 18 : 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: sizes.isSmallDevice ? 10 : 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: sizes.notificationTitleSize,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: sizes.notificationMessageSize,
    color: '#666',
    marginBottom: 4,
    lineHeight: sizes.isSmallDevice ? 16 : 18,
  },
  notificationTime: {
    fontSize: sizes.isSmallDevice ? 11 : 12,
    color: '#999',
  },
  unreadDot: {
    width: sizes.isSmallDevice ? 6 : 8,
    height: sizes.isSmallDevice ? 6 : 8,
    borderRadius: sizes.isSmallDevice ? 3 : 4,
    backgroundColor: '#4a90e2',
  },
});
