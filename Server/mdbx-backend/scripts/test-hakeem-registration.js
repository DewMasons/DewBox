const axios = require('axios');

const testData = {
  firstname: 'Hakeem',
  othername: 'Olasunkanmi',
  surname: 'Oludimu',
  email: 'hakeem.test@example.com', // Using test email to avoid duplicate
  mobile: '2348153478999', // Using different number to avoid duplicate
  password: 'Ephrata@John1010B',
  confirmPassword: 'Ephrata@John1010B',
  address1: 'Plot 243, RatCon Road Akara Odo Ona Kekere',
  country: 'Nigeria',
  state: 'Oyo',
  city: 'Ibadan',
  lga: 'Oluyole',
  dob: '1967-03-21',
  gender: 'male',
  alternatePhone: '2348146007275',
  currency: 'NGN',
  nextOfKinName: 'David Oludimu',
  nextOfKinContact: '2347010805958',
  joinEsusu: 'yes',
  referral: 'Hakeem Oludimu',
  referralPhone: '09014845195'
};

async function testRegistration() {
  console.log('🧪 Testing registration with Hakeem data...');
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
      console.error('📦 Request timeout or network error');
    } else {
      console.error('📦 Error:', error.message);
    }
  }
}

testRegistration();
