// Validation utilities for the application

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  // Accepts formats like +234... or international formats
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

const validateAmount = (amount) => {
  return !isNaN(amount) && parseFloat(amount) > 0;
};

const validateDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

const validateCurrency = (currency) => {
  const validCurrencies = ['NGN', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'CNY'];
  return validCurrencies.includes(currency);
};

const validateTransactionType = (type) => {
  return ['contribution', 'withdrawal'].includes(type);
};

const validateTransactionStatus = (status) => {
  return ['pending', 'completed', 'failed'].includes(status);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500); // Limit length
};

const validateSubscriberData = (data) => {
  const errors = [];

  if (!data.firstname || data.firstname.length < 2) {
    errors.push('First name is required and must be at least 2 characters');
  }

  if (!data.surname || data.surname.length < 2) {
    errors.push('Surname is required and must be at least 2 characters');
  }

  if (!data.mobile || !validatePhone(data.mobile)) {
    errors.push('Valid mobile number is required');
  }

  if (!data.dob || !validateDate(data.dob)) {
    errors.push('Valid date of birth is required');
  }

  if (!data.address1 || data.address1.length < 5) {
    errors.push('Address is required');
  }

  if (!data.city || data.city.length < 2) {
    errors.push('City is required');
  }

  if (!data.state || data.state.length < 2) {
    errors.push('State is required');
  }

  if (!data.country || data.country.length < 2) {
    errors.push('Country is required');
  }

  if (!data.gender || !['Male', 'Female', 'Other'].includes(data.gender)) {
    errors.push('Valid gender is required');
  }

  if (!data.currency || !validateCurrency(data.currency)) {
    errors.push('Valid currency is required');
  }

  if (!data.nextOfKinName || data.nextOfKinName.length < 2) {
    errors.push('Next of kin name is required');
  }

  if (!data.nextOfKinContact || !validatePhone(data.nextOfKinContact)) {
    errors.push('Valid next of kin contact is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateTransactionData = (data) => {
  const errors = [];

  if (!data.type || !validateTransactionType(data.type)) {
    errors.push('Valid transaction type is required (contribution or withdrawal)');
  }

  if (!data.amount || !validateAmount(data.amount)) {
    errors.push('Valid amount is required');
  }

  if (!data.currency || !validateCurrency(data.currency)) {
    errors.push('Valid currency is required');
  }

  if (!data.userId) {
    errors.push('User ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateCoopData = (data) => {
  const errors = [];

  if (!data.coop_id) {
    errors.push('Coop ID is required');
  }

  if (!data.coop_name || data.coop_name.length < 3) {
    errors.push('Coop name is required and must be at least 3 characters');
  }

  if (!data.coop_contact_name || data.coop_contact_name.length < 2) {
    errors.push('Contact name is required');
  }

  if (data.contact_phoneno && !validatePhone(data.contact_phoneno.toString())) {
    errors.push('Valid contact phone number is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validatePhone,
  validateAmount,
  validateDate,
  validateCurrency,
  validateTransactionType,
  validateTransactionStatus,
  sanitizeInput,
  validateSubscriberData,
  validateTransactionData,
  validateCoopData
};
