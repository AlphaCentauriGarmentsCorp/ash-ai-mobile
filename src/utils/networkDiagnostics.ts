/**
 * Network Diagnostics Utility
 * Run this to test your API connection
 */

import { Platform } from 'react-native';
import API_CONFIG from '../api/config';

export const runNetworkDiagnostics = async () => {
  console.log('\n========================================');
  console.log('🔍 NETWORK DIAGNOSTICS');
  console.log('========================================\n');

  // 1. Platform info
  console.log('📱 Platform:', Platform.OS);
  console.log('');

  // 2. Configuration
  console.log('⚙️  Configuration:');
  console.log('   API_URL:', API_CONFIG.BASE_URL);
  console.log('   STORAGE_URL:', API_CONFIG.STORAGE_BASE_URL);
  console.log('');

  // 3. Test basic fetch
  console.log('🌐 Testing connection to:', API_CONFIG.BASE_URL);
  console.log('');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(API_CONFIG.BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('✅ Connection successful!');
    console.log('   Status:', response.status);
    console.log('   Status Text:', response.statusText);
    console.log('');

    return { success: true, status: response.status };
  } catch (error: any) {
    console.log('❌ Connection failed!');
    console.log('   Error:', error.message);
    console.log('');

    // Provide specific guidance
    if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
      console.log('💡 Possible causes:');
      console.log('');
      
      if (Platform.OS === 'android') {
        console.log('   For Android Emulator:');
        console.log('   1. Backend must be running: php artisan serve --host=0.0.0.0 --port=8000');
        console.log('   2. URL should use 10.0.2.2 (not 127.0.0.1)');
        console.log('   3. Current URL:', API_CONFIG.BASE_URL);
        console.log('   4. Expected URL: http://10.0.2.2:8000/api/v2');
      } else if (Platform.OS === 'ios') {
        console.log('   For iOS Simulator:');
        console.log('   1. Backend must be running: php artisan serve --port=8000');
        console.log('   2. URL can use 127.0.0.1');
        console.log('   3. Current URL:', API_CONFIG.BASE_URL);
      } else {
        console.log('   For Physical Device:');
        console.log('   1. Backend must be running: php artisan serve --host=0.0.0.0 --port=8000');
        console.log('   2. Use your computer\'s IP address (e.g., 192.168.1.100)');
        console.log('   3. Both devices must be on the same WiFi network');
        console.log('   4. Current URL:', API_CONFIG.BASE_URL);
      }
      
      console.log('');
      console.log('   Test in browser:');
      if (Platform.OS === 'android') {
        console.log('   - From computer: http://127.0.0.1:8000/api/v2');
        console.log('   - From emulator: http://10.0.2.2:8000/api/v2');
      } else {
        console.log('   - Open: ' + API_CONFIG.BASE_URL);
      }
    }

    console.log('');
    console.log('========================================\n');

    return { success: false, error: error.message };
  }
};

// Auto-run diagnostics on import (only in development)
if (__DEV__) {
  // Run after a short delay to let other logs settle
  setTimeout(() => {
    runNetworkDiagnostics();
  }, 2000);
}
