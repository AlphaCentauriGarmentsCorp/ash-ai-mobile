import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import API_CONFIG from '@api/config';
import { orderApi } from '@api/order';
import type { Order } from '@api/types';
import { usePoppinsFonts } from '@hooks';
import { Header, PageTitle } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES, SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';

const STEPS = [
  { id: 1, label: 'Client Information', key: 'client' },
  { id: 2, label: 'Shipping Information', key: 'shipping' },
  { id: 3, label: 'Product Details', key: 'product' },
  { id: 4, label: 'Fabric Details', key: 'fabric' },
  { id: 5, label: 'Freebies', key: 'freebies' },
  { id: 6, label: 'Placement Measurements', key: 'placement' },
  { id: 7, label: 'Design & Mockups', key: 'design' },
  { id: 8, label: 'Pricing Information', key: 'pricing' },
  { id: 9, label: 'P.O Items', key: 'items' },
];

export default function ViewOrderScreen() {
  const router = useRouter();
  const { po_code } = useLocalSearchParams<{ po_code: string }>();
  const fontsLoaded = usePoppinsFonts();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [qrImageLoading, setQrImageLoading] = useState(true);
  const [qrImageError, setQrImageError] = useState(false);
  const [barcodeImageLoading, setBarcodeImageLoading] = useState(true);
  const [barcodeImageError, setBarcodeImageError] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [itemCodeModalVisible, setItemCodeModalVisible] = useState(false);
  const [selectedItemCode, setSelectedItemCode] = useState<{ type: 'qr' | 'barcode'; item: any } | null>(null);
  const [itemCodePath, setItemCodePath] = useState<string | null>(null);
  const [itemCodeError, setItemCodeError] = useState<string | null>(null);
  
  const scrollViewRef = React.useRef<ScrollView>(null);
  const sectionRefs = React.useRef<{ [key: number]: View | null }>({});
  const sectionPositions = React.useRef<{ [key: number]: number }>({});
  const isScrollingToSection = React.useRef(false);

  useEffect(() => {
    if (po_code) {
      fetchOrderDetails();
    }
  }, [po_code]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderApi.show(po_code);
      setOrder(response.data);
    } catch (err: any) {
      console.error('Error fetching order details:', err);
      setError(err.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (stepId: number) => {
    setCurrentStep(stepId);
    isScrollingToSection.current = true;
    
    const position = sectionPositions.current[stepId];
    if (position !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: position - 20, animated: true });
      
      // Re-enable scroll tracking after animation completes
      setTimeout(() => {
        isScrollingToSection.current = false;
      }, 500);
    }
  };

  const handleScroll = (event: any) => {
    // Don't update active step while programmatically scrolling
    if (isScrollingToSection.current) return;
    
    const scrollY = event.nativeEvent.contentOffset.y;
    
    // Show/hide scroll to top button
    setShowScrollTop(scrollY > 300);
    
    // Determine which section is currently visible
    let activeStep = 1;
    Object.keys(sectionPositions.current).forEach((key) => {
      const stepId = parseInt(key);
      const position = sectionPositions.current[stepId];
      if (scrollY >= position - 100) {
        activeStep = stepId;
      }
    });
    
    if (activeStep !== currentStep) {
      setCurrentStep(activeStep);
    }
  };

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      isScrollingToSection.current = true;
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
      setCurrentStep(1);
      setShowScrollTop(false); // Hide button immediately
      
      setTimeout(() => {
        isScrollingToSection.current = false;
      }, 500);
    }
  };

  const handleGenerateItemCode = (type: 'qr' | 'barcode', item: any) => {
    const codePath = type === 'qr' ? item.qr_path : item.barcode_path;
    
    if (!codePath) {
      setItemCodeError(`No ${type === 'qr' ? 'QR code' : 'barcode'} available for this item`);
      setSelectedItemCode({ type, item });
      setItemCodeModalVisible(true);
      return;
    }
    
    setSelectedItemCode({ type, item });
    setItemCodePath(codePath);
    setItemCodeError(null);
    setItemCodeModalVisible(true);
  };

  const closeItemCodeModal = () => {
    setItemCodeModalVisible(false);
    setSelectedItemCode(null);
    setItemCodePath(null);
    setItemCodeError(null);
  };

  const renderAllContent = () => {
    if (!order) return null;

    return (
      <>
        {/* Client Information */}
        <View 
          ref={(ref) => (sectionRefs.current[1] = ref)}
          onLayout={(event) => {
            sectionPositions.current[1] = event.nativeEvent.layout.y;
          }}
          style={styles.contentSection}
        >
          <Text style={styles.sectionTitle}>Client Information</Text>
          <View style={styles.infoCard}>
            <InfoRow label="PO Code" value={order.po_code} />
            <InfoRow label="Client Name" value={order.client?.name || 'N/A'} />
            <InfoRow label="Client Brand" value={order.client_brand || 'N/A'} />
            <InfoRow label="Brand" value={order.brand || 'N/A'} />
            <InfoRow label="Priority" value={order.priority || 'N/A'} />
            <InfoRow label="Deadline" value={order.deadline || 'N/A'} />
          </View>
        </View>

        {/* Shipping Information */}
        <View 
          ref={(ref) => (sectionRefs.current[2] = ref)}
          onLayout={(event) => {
            sectionPositions.current[2] = event.nativeEvent.layout.y;
          }}
          style={styles.contentSection}
        >
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          <View style={styles.infoCard}>
            <InfoRow label="Courier" value={order.courier || 'N/A'} />
            <InfoRow label="Method" value={order.method || 'N/A'} />
            <InfoRow label="Receiver Name" value={order.receiver_name || 'N/A'} />
            <InfoRow label="Receiver Contact" value={order.receiver_contact || 'N/A'} />
            <InfoRow label="Address" value={order.address || 'N/A'} />
          </View>
        </View>

        {/* Product Details */}
        <View 
          ref={(ref) => (sectionRefs.current[3] = ref)}
          onLayout={(event) => {
            sectionPositions.current[3] = event.nativeEvent.layout.y;
          }}
          style={styles.contentSection}
        >
          <Text style={styles.sectionTitle}>Product Details</Text>
          <View style={styles.infoCard}>
            <InfoRow label="Design Name" value={order.design_name || 'N/A'} />
            <InfoRow label="Apparel Type" value={order.apparel_type || 'N/A'} />
            <InfoRow label="Pattern Type" value={order.pattern_type || 'N/A'} />
            <InfoRow label="Service Type" value={order.service_type || 'N/A'} />
            <InfoRow label="Print Method" value={order.print_method || 'N/A'} />
            <InfoRow label="Print Service" value={order.print_service || 'N/A'} />
            <InfoRow label="Size Label" value={order.size_label || 'N/A'} />
            <InfoRow label="Print Label Placement" value={order.print_label_placement || 'N/A'} />
          </View>
        </View>

        {/* Fabric Details */}
        <View 
          ref={(ref) => (sectionRefs.current[4] = ref)}
          onLayout={(event) => {
            sectionPositions.current[4] = event.nativeEvent.layout.y;
          }}
          style={styles.contentSection}
        >
          <Text style={styles.sectionTitle}>Fabric Details</Text>
          <View style={styles.infoCard}>
            <InfoRow label="Fabric Type" value={order.fabric_type || 'N/A'} />
            <InfoRow label="Fabric Supplier" value={order.fabric_supplier || 'N/A'} />
            <InfoRow label="Fabric Color" value={order.fabric_color || 'N/A'} />
            <InfoRow label="Thread Color" value={order.thread_color || 'N/A'} />
            <InfoRow label="Ribbing Color" value={order.ribbing_color || 'N/A'} />
          </View>
        </View>

        {/* Freebies */}
        <View 
          ref={(ref) => (sectionRefs.current[5] = ref)}
          onLayout={(event) => {
            sectionPositions.current[5] = event.nativeEvent.layout.y;
          }}
          style={styles.contentSection}
        >
          <Text style={styles.sectionTitle}>Freebies</Text>
          <View style={styles.infoCard}>
            <InfoRow label="Freebie Items" value={order.freebie_items || 'N/A'} />
            <InfoRow label="Freebie Color" value={order.freebie_color || 'N/A'} />
            <InfoRow label="Freebie Others" value={order.freebie_others || 'N/A'} />
          </View>
        </View>

        {/* Placement Measurements */}
        <View 
          ref={(ref) => (sectionRefs.current[6] = ref)}
          onLayout={(event) => {
            sectionPositions.current[6] = event.nativeEvent.layout.y;
          }}
          style={styles.contentSection}
        >
          <Text style={styles.sectionTitle}>Placement Measurements</Text>
          <View style={styles.infoCard}>
            <InfoRow label="Measurements" value={order.placement_measurements || 'N/A'} />
          </View>
        </View>

        {/* Design & Mockups */}
        <View 
          ref={(ref) => (sectionRefs.current[7] = ref)}
          onLayout={(event) => {
            sectionPositions.current[7] = event.nativeEvent.layout.y;
          }}
          style={styles.contentSection}
        >
          <Text style={styles.sectionTitle}>Design Files & Mockups</Text>

          {order.qr_path && (
            <View style={styles.codeCard}>
              <View style={styles.codeHeader}>
                <Ionicons name="qr-code-outline" size={20} color="#6B7280" />
                <Text style={styles.codeTitle}>QR Code</Text>
              </View>
              <View style={styles.codePlaceholder}>
                {qrImageLoading && (
                  <ActivityIndicator size="large" color={COLORS.primary} />
                )}
                {qrImageError ? (
                  <View style={styles.imageErrorContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text style={styles.imageErrorText}>Failed to load QR code</Text>
                  </View>
                ) : (
                  <Image
                    source={{ uri: `${API_CONFIG.STORAGE_BASE_URL}${order.qr_path}` }}
                    style={styles.qrImage}
                    resizeMode="contain"
                    onLoad={() => setQrImageLoading(false)}
                    onError={() => {
                      setQrImageLoading(false);
                      setQrImageError(true);
                    }}
                  />
                )}
              </View>
              <Text style={styles.codeLabel}>{order.po_code}</Text>
            </View>
          )}

          {order.barcode_path && (
            <View style={styles.codeCard}>
              <View style={styles.codeHeader}>
                <Ionicons name="barcode-outline" size={20} color="#6B7280" />
                <Text style={styles.codeTitle}>Barcode</Text>
              </View>
              <View style={styles.barcodePlaceholder}>
                {barcodeImageLoading && (
                  <ActivityIndicator size="large" color={COLORS.primary} />
                )}
                {barcodeImageError ? (
                  <View style={styles.imageErrorContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text style={styles.imageErrorText}>Failed to load barcode</Text>
                  </View>
                ) : (
                  <Image
                    source={{ uri: `${API_CONFIG.STORAGE_BASE_URL}${order.barcode_path}` }}
                    style={styles.barcodeImage}
                    resizeMode="contain"
                    onLoad={() => setBarcodeImageLoading(false)}
                    onError={() => {
                      setBarcodeImageLoading(false);
                      setBarcodeImageError(true);
                    }}
                  />
                )}
              </View>
              <Text style={styles.codeLabel}>{order.po_code}</Text>
            </View>
          )}
        </View>

        {/* Pricing Information */}
        <View 
          ref={(ref) => (sectionRefs.current[8] = ref)}
          onLayout={(event) => {
            sectionPositions.current[8] = event.nativeEvent.layout.y;
          }}
          style={styles.contentSection}
        >
          <Text style={styles.sectionTitle}>Pricing Information</Text>
          <View style={styles.infoCard}>
            <InfoRow label="Payment Method" value={order.payment_method || 'N/A'} />
            <InfoRow label="Payment Plan" value={order.payment_plan || 'N/A'} />
            <InfoRow label="Total Quantity" value={order.total_quantity?.toString() || 'N/A'} />
            <InfoRow 
              label="Average Unit Price" 
              value={order.average_unit_price ? `₱${Number(order.average_unit_price).toFixed(2)}` : 'N/A'} 
            />
            <InfoRow 
              label="Total Price" 
              value={order.total_price ? `₱${Number(order.total_price).toFixed(2)}` : 'N/A'}
              highlight
            />
            <InfoRow 
              label="Deposit (50%)" 
              value={order.deposit ? `₱${Number(order.deposit).toFixed(2)}` : 'N/A'}
              highlight
            />
          </View>
        </View>

        {/* P.O Items */}
        <View 
          ref={(ref) => (sectionRefs.current[9] = ref)}
          onLayout={(event) => {
            sectionPositions.current[9] = event.nativeEvent.layout.y;
          }}
          style={styles.contentSection}
        >
          <Text style={styles.sectionTitle}>P.O Items</Text>
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemCode}>{item.sku || item.product_name}</Text>
                  <View style={styles.itemActions}>
                    <TouchableOpacity 
                      style={styles.iconButton}
                      onPress={() => handleGenerateItemCode('qr', item)}
                    >
                      <Ionicons name="qr-code-outline" size={18} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.iconButton}
                      onPress={() => handleGenerateItemCode('barcode', item)}
                    >
                      <Ionicons name="barcode-outline" size={18} color="#10B981" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.itemSubtitle}>
                  {item.color && item.size ? `${item.color} • ${item.size}` : 'Color • Size'}
                </Text>
                <View style={styles.itemQuantity}>
                  <Text style={styles.quantityLabel}>Quantity:</Text>
                  <Text style={styles.quantityValue}>{item.quantity}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.infoCard}>
              <Text style={styles.emptyText}>No items available</Text>
            </View>
          )}
        </View>
      </>
    );
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" />

      <Header />
      <PageTitle 
        title="Order Details" 
        icon="document-text-outline" 
        breadcrumb={`Home / Orders / ${po_code || ''}`}
      />

      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading order details...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchOrderDetails}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Stepper */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.stepperContainer}
              contentContainerStyle={styles.stepperContent}
            >
              {STEPS.map((step, index) => (
                <TouchableOpacity
                  key={step.id}
                  style={[
                    styles.stepItem,
                    currentStep === step.id && styles.stepItemActive
                  ]}
                  onPress={() => scrollToSection(step.id)}
                >
                  <View style={[
                    styles.stepNumber,
                    currentStep === step.id && styles.stepNumberActive
                  ]}>
                    <Text style={[
                      styles.stepNumberText,
                      currentStep === step.id && styles.stepNumberTextActive
                    ]}>
                      {step.id}
                    </Text>
                  </View>
                  <Text style={[
                    styles.stepLabel,
                    currentStep === step.id && styles.stepLabelActive
                  ]}>
                    {step.label}
                  </Text>
                  {index < STEPS.length - 1 && (
                    <View style={styles.stepConnector} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Content */}
            <ScrollView 
              ref={scrollViewRef}
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {renderAllContent()}
              <View style={{ height: hp(3) }} />
            </ScrollView>
          </>
        )}

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <TouchableOpacity
            style={styles.scrollToTopButton}
            onPress={scrollToTop}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-up" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Item Code Modal */}
        <Modal
          visible={itemCodeModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeItemCodeModal}
        >
          <Pressable style={styles.modalOverlay} onPress={closeItemCodeModal}>
            <Pressable style={styles.itemCodeModalContent} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleContainer}>
                  <Ionicons 
                    name={selectedItemCode?.type === 'qr' ? 'qr-code-outline' : 'barcode-outline'} 
                    size={24} 
                    color="#0D253F" 
                  />
                  <Text style={styles.modalTitle}>
                    {selectedItemCode?.type === 'qr' ? 'QR Code' : 'Barcode'}
                  </Text>
                </View>
                <TouchableOpacity onPress={closeItemCodeModal}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.itemCodeContent}>
                {selectedItemCode && (
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemInfoLabel}>Item:</Text>
                    <Text style={styles.itemInfoValue}>
                      {selectedItemCode.item.sku || selectedItemCode.item.product_name}
                      {selectedItemCode.item.color && selectedItemCode.item.size && 
                        ` (${selectedItemCode.item.color} • ${selectedItemCode.item.size})`
                      }
                    </Text>
                  </View>
                )}

                {itemCodeError ? (
                  <View style={styles.itemCodeImageContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
                    <Text style={styles.errorText}>{itemCodeError}</Text>
                  </View>
                ) : itemCodePath ? (
                  <View style={styles.itemCodeImageContainer}>
                    <Image
                      source={{ uri: `${API_CONFIG.STORAGE_BASE_URL}${itemCodePath}` }}
                      style={selectedItemCode?.type === 'qr' ? styles.qrModalImage : styles.barcodeModalImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.itemCodeLabel}>
                      {order?.po_code} - {selectedItemCode?.item.sku || selectedItemCode?.item.product_name}
                    </Text>
                  </View>
                ) : null}
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={closeItemCodeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]}>{value}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.regular,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(4),
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    fontFamily: FONT_FAMILY.regular,
    textAlign: 'center',
    marginBottom: hp(2),
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: SIZES.radius.md,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
  },
  stepperContainer: {
    maxHeight: hp(12),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  stepperContent: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    alignItems: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(4),
  },
  stepItemActive: {
    // Active step styling handled by child elements
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2),
  },
  stepNumberActive: {
    backgroundColor: '#0D253F',
  },
  stepNumberText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: '#6B7280',
  },
  stepNumberTextActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#6B7280',
    maxWidth: wp(25),
  },
  stepLabelActive: {
    fontFamily: FONT_FAMILY.semiBold,
    color: '#0D253F',
  },
  stepConnector: {
    width: wp(4),
    height: 2,
    backgroundColor: '#E5E7EB',
    marginLeft: wp(2),
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  contentSection: {
    paddingTop: hp(3),
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.text,
    marginBottom: hp(2),
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: SIZES.radius.md,
    padding: wp(4),
    marginBottom: hp(2),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(1.2),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.text,
    flex: 1,
    textAlign: 'right',
  },
  infoValueHighlight: {
    color: '#10B981',
    fontFamily: FONT_FAMILY.semiBold,
  },
  codeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: SIZES.radius.md,
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  codeTitle: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONT_FAMILY.medium,
    color: '#6B7280',
    marginLeft: wp(2),
  },
  codePlaceholder: {
    width: wp(40),
    height: wp(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: SIZES.radius.md,
    marginBottom: hp(1),
    overflow: 'hidden',
  },
  barcodePlaceholder: {
    width: wp(70),
    height: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: SIZES.radius.md,
    marginBottom: hp(1),
    overflow: 'hidden',
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
  barcodeImage: {
    width: '100%',
    height: '100%',
  },
  imageErrorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageErrorText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#EF4444',
    marginTop: hp(1),
    textAlign: 'center',
  },
  codeLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#9CA3AF',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: SIZES.radius.md,
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  itemCode: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.text,
  },
  itemActions: {
    flexDirection: 'row',
    gap: wp(2),
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemSubtitle: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#6B7280',
    marginBottom: hp(1),
  },
  itemQuantity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#6B7280',
  },
  quantityValue: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.text,
  },
  emptyText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: hp(3),
    right: wp(5),
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0D253F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCodeModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.lg,
    padding: wp(6),
    width: wp(90),
    maxWidth: 500,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.text,
  },
  itemCodeContent: {
    marginBottom: hp(3),
  },
  itemInfo: {
    flexDirection: 'row',
    marginBottom: hp(2),
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemInfoLabel: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#6B7280',
    marginRight: wp(2),
  },
  itemInfoValue: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.text,
    flex: 1,
  },
  itemCodeImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp(30),
    backgroundColor: '#F9FAFB',
    borderRadius: SIZES.radius.md,
    padding: wp(4),
  },
  qrModalImage: {
    width: wp(60),
    height: wp(60),
  },
  barcodeModalImage: {
    width: wp(75),
    height: wp(25),
  },
  itemCodeLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.regular,
    color: '#9CA3AF',
    marginTop: hp(2),
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#0D253F',
    paddingVertical: hp(1.5),
    borderRadius: SIZES.radius.md,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.white,
  },
});
