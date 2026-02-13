import API_CONFIG from './config';

/**
 * Test API connection
 * Use this to verify the API is reachable
 */
export const testApiConnection = async () => {
  console.log('Testing API connection...');
  console.log('Base URL:', API_CONFIG.BASE_URL);
  
  try {
    const response = await fetch(API_CONFIG.BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    console.log('Connection test response:', response.status);
    return {
      success: true,
      status: response.status,
      baseUrl: API_CONFIG.BASE_URL,
    };
  } catch (error: any) {
    console.error('Connection test failed:', error.message);
    return {
      success: false,
      error: error.message,
      baseUrl: API_CONFIG.BASE_URL,
    };
  }
};
