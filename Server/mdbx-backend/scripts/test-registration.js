const axios = require('axios');

const testData = {
  firstname: 'Test',
  othername: 'User',
  surname: 'Registration',
  email: `test${Date.now()}@example.com`,
  mobile: `234${Math.floor(Math.random() * 10000000000)}`,
  password: 'TestPassword123!',
  confirmPassword: 'TestPassword123!',
  address1: 'Test Address',
  country: 'Nigeria',
  state: 'Lagos',
  city: 'Lagos',
  lga: 'Ikeja',
  dob: '1990-01-01',
  gender: 'male',
  alternatePhone: '2348000000000',
  currency: 'NGN',
  nextOfKinName: 'Test Next of Kin',
  nextOfKinContact: '2348000000001',
  joinEsusu: 'no',
  referral: '',
  referralPhone: ''
};

async function testRegistration() {
  console.log('🧪 Testing registration endpoint...');
  console.log('📋 Test data:', testData);
  
  try {
    const response = await axios.post('http://localhost:4000/auth/register', testData, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Registration successful!');
    console.log('📦 Response:', response.data);
  } catch (error) {
    console.error('❌ Registration failed!');
    if (error.response) {
      console.error('📦 Response status:', error.response.status);
      console.error('📦 Response data:', error.response.data);
    } else if (error.request) {
      console.error('📦 No response received');
      console.error('📦 Request:', error.request);
    } else {
      console.error('📦 Error:', error.message);
    }
  }
}

testRegistration();
