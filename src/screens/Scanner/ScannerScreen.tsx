import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePoppinsFonts } from '@hooks';
import { Header, PageTitle } from '@layouts';
import { COLORS, FONT_FAMILY, FONT_SIZES } from '@styles';
import { hp, wp } from '@utils/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ScannerScreen() {
  const router = useRouter();
  const fontsLoaded = usePoppinsFonts();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    
    // Check if it's a PO code format (e.g., ASH-2026-000001)
    const poCodePattern = /^[A-Z]+-\d{4}-\d{6}$/;
    
    if (poCodePattern.test(data)) {
      // Navigate to order details
      router.push(`/order/view?po_code=${data}`);
    } else {
      // Show the scanned data
      Alert.alert(
        'Scanned Successfully',
        `Type: ${type}\nSKU: ${data}`,
        [
          {
            text: 'Scan Again',
            onPress: () => setScanned(false),
          },
          {
            text: 'Close',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  const handleScanAgain = () => {
    setScanned(false);
  };

  if (!fontsLoaded) return null;

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="light-content" backgroundColor="#0a2540" />
        <Header />
        <PageTitle title="Scanner" icon="scan-outline" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.messageText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="light-content" backgroundColor="#0a2540" />
        <Header />
        <PageTitle title="Scanner" icon="scan-outline" />
        <View style={styles.centerContainer}>
          <Ionicons name="camera-outline" size={80} color="#9CA3AF" />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan QR codes and barcodes
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" />
      
      <Header />
      <PageTitle title="Scanner" icon="scan-outline" />

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          enableTorch={flashEnabled}
          barcodeScannerSettings={{
            barcodeTypes: [
              'qr',
              'ean13',
              'ean8',
              'code128',
              'code39',
              'code93',
              'upce',
              'pdf417',
              'aztec',
              'datamatrix',
            ],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          {/* Overlay */}
          <View style={styles.overlay}>
            {/* Top overlay */}
            <View style={styles.overlayTop} />
            
            {/* Middle section with scanning frame */}
            <View style={styles.overlayMiddle}>
              <View style={styles.overlaySide} />
              
              {/* Scanning frame */}
              <View style={styles.scanFrame}>
                {/* Corner indicators */}
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
                
                {/* Scanning line animation */}
                {!scanned && (
                  <View style={styles.scanLineContainer}>
                    <View style={styles.scanLine} />
                  </View>
                )}
              </View>
              
              <View style={styles.overlaySide} />
            </View>
            
            {/* Bottom overlay with instructions */}
            <View style={styles.overlayBottom}>
              <View style={styles.instructionsContainer}>
                <Ionicons name="information-circle-outline" size={24} color="#FFFFFF" />
                <Text style={styles.instructionsText}>
                  {scanned 
                    ? 'Code scanned! Processing...' 
                    : 'Align QR code or barcode within the frame'}
                </Text>
              </View>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleFlash}
              activeOpacity={0.8}
            >
              <Ionicons
                name={flashEnabled ? 'flash' : 'flash-off'}
                size={28}
                color="#FFFFFF"
              />
              <Text style={styles.controlButtonText}>Flash</Text>
            </TouchableOpacity>

            {scanned && (
              <TouchableOpacity
                style={[styles.controlButton, styles.scanAgainButton]}
                onPress={handleScanAgain}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={28} color="#FFFFFF" />
                <Text style={styles.controlButtonText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </CameraView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(6),
  },
  messageText: {
    marginTop: hp(2),
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.regular,
  },
  permissionTitle: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONT_FAMILY.semiBold,
    color: COLORS.text,
    marginTop: hp(3),
    marginBottom: hp(1),
    textAlign: 'center',
  },
  permissionText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.regular,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: hp(3),
    paddingHorizontal: wp(4),
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.5),
    borderRadius: 12,
  },
  permissionButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontFamily: FONT_FAMILY.semiBold,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: SCREEN_WIDTH * 0.7,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanFrame: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#3B82F6',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanLineContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
  },
  scanLine: {
    height: 2,
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-start',
    paddingTop: hp(3),
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(6),
    gap: wp(2),
  },
  instructionsText: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONT_FAMILY.medium,
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: hp(4),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(4),
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: wp(25),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  scanAgainButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.medium,
    marginTop: 4,
  },
});
