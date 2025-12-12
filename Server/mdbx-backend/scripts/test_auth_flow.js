const axios = require('axios');

const API_URL = 'http://localhost:4000';

// Test user data
const testUser = {
  firstname: 'TestAuth',
  surname: 'User',
  othername: 'Flow',
  email: `testauth${Date.now()}@example.com`,
  mobile: `234${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
  password: 'TestAuth123!',
  address1: 'Test Address',
  country: 'NG',
  state: 'Lagos',
  dob: '1990-01-01',
  alternatePhone: '2348000000000',
  currency: 'NGN',
  city: 'Lagos',
  gender: 'Male',
  referral: 'Test Referral',
  referralPhone: '2348000000001',
  nextOfKinName: 'Test Kin',
  nextOfKinContact: '2348000000002'
};

async function testAuthFlow() {
  console.log('=== AUTHENTICATION FLOW TEST ===\n');
  
  try {
    // Test 1: Registration
    console.log('1️⃣  Testing Registration...');
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Mobile: ${testUser.mobile}`);
    console.log(`   Password: ${testUser.password}\n`);
    
    const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
    
    if (registerResponse.status === 201) {
      console.log('   ✅ Registration successful!');
      console.log(`   User ID: ${registerResponse.data.user.id}`);
      console.log(`   Token received: ${registerResponse.data.token ? 'Yes' : 'No'}\n`);
    }
    
    const token = registerResponse.data.token;
    
    // Test 2: Login with registered credentials
    console.log('2️⃣  Testing Login...');
    console.log(`   Mobile: ${testUser.mobile}`);
    console.log(`   Password: ${testUser.password}\n`);
    
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      mobile: testUser.mobile,
      password: testUser.password
    });
    
    if (loginResponse.status === 200) {
      console.log('   ✅ Login successful!');
      console.log(`   User: ${loginResponse.data.user.name}`);
      console.log(`   Token received: ${loginResponse.data.token ? 'Yes' : 'No'}\n`);
    }
    
    // Test 3: Access protected route
    console.log('3️⃣  Testing Protected Route Access...');
    
    const contributionInfoResponse = await axios.get(`${API_URL}/contributions/info`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (contributionInfoResponse.status === 200) {
      console.log('   ✅ Protected route access successful!');
      console.log(`   Contribution Type: ${contributionInfoResponse.data.data.type}`);
      console.log(`   Registration Day: ${contributionInfoResponse.data.data.registrationDay}\n`);
    }
    
    // Test 4: Test existing user login
    console.log('4️⃣  Testing Existing User Login...');
    console.log('   Mobile: 2348098765432');
    console.log('   Password: Test123!\n');
    
    const existingLoginResponse = await axios.post(`${API_URL}/auth/login`, {
      mobile: '2348098765432',
      password: 'Test123!'
    });
    
    if (existingLoginResponse.status === 200) {
      console.log('   ✅ Existing user login successful!');
      console.log(`   User: ${existingLoginResponse.data.user.name}\n`);
    }
    
    // Summary
    console.log('=== TEST SUMMARY ===');
    console.log('✅ All authentication tests passed!');
    console.log('\nTest Results:');
    console.log('  ✓ User registration');
    console.log('  ✓ User login');
    console.log('  ✓ Protected route access');
    console.log('  ✓ Existing user login');
    console.log('\n🎉 Authentication system is working correctly!');
    
  } catch (error) {
    console.error('\n❌ Test failed!');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data.message || error.response.data.error}`);
      console.error(`   Data:`, error.response.data);
    } else {
      console.error(`   Error: ${error.message}`);
    }
    process.exit(1);
  }
}

// Check if server is running
axios.get(`${API_URL}/`)
  .then(() => {
    console.log('✅ Server is running\n');
    testAuthFlow();
  })
  .catch(() => {
    console.error('❌ Server is not running!');
    console.error('Please start the server with: npm run dev');
    process.exit(1);
  });
