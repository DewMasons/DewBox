require('dotenv').config();
const axios = require('axios');

async function testEndpoints() {
  const baseURL = 'http://localhost:4000';
  
  // Test user credentials
  const testEmail = 'hakeem.oludimu@gmail.com';
  const testMobile = '2349014845195';
  
  try {
    console.log('🔐 Testing Authentication...\n');
    
    // Login to get token
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      mobile: testMobile,
      password: 'password123' // You'll need to provide the actual password
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    console.log('Token:', token.substring(0, 20) + '...\n');
    
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    // Test contribution history
    console.log('📊 Testing /contributions/history...');
    try {
      const contribResponse = await axios.get(`${baseURL}/contributions/history`, { headers });
      console.log('✅ Contributions:', contribResponse.data);
    } catch (err) {
      console.log('❌ Error:', err.response?.data || err.message);
    }
    
    console.log('\n📊 Testing /transactions/me...');
    try {
      const transResponse = await axios.get(`${baseURL}/transactions/me`, { headers });
      console.log('✅ Transactions:', transResponse.data);
    } catch (err) {
      console.log('❌ Error:', err.response?.data || err.message);
    }
    
    console.log('\n📊 Testing /users/subscriber...');
    try {
      const subResponse = await axios.get(`${baseURL}/users/subscriber`, { headers });
      console.log('✅ Subscriber ICA Balance:', subResponse.data.data?.subscriber?.ica_balance);
    } catch (err) {
      console.log('❌ Error:', err.response?.data || err.message);
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    console.log('\nNote: Make sure to update the password in the script');
  }
}

testEndpoints();
