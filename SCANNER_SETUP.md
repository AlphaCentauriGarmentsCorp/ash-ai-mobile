# Scanner Setup Instructions

The scanner screen has been created. If you're seeing an import error, follow these steps:

## 1. Install expo-camera package
```bash
npx expo install expo-camera
```

## 2. Clear Metro bundler cache and restart
```bash
# Stop the current Expo server (Ctrl+C)

# Clear cache and restart
npx expo start -c
```

## 3. If the issue persists, try:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Clear all caches
npx expo start -c --clear
```

## Files Created:
- `app/scanner.tsx` - Route file
- `src/screens/Scanner/ScannerScreen.tsx` - Scanner component

## Features:
- Scans both QR codes and barcodes
- Supports multiple barcode formats (EAN13, EAN8, Code128, Code39, etc.)
- Auto-detects PO codes and navigates to order details
- Flash/torch toggle
- Camera permission handling
- Professional UI with scanning frame

## Usage:
Once the cache is cleared and expo-camera is installed, tap the "Scanner" button on the dashboard to access the scanner.
