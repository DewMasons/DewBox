// Formatting utilities for the application

const formatCurrency = (amount, currency = 'NGN') => {
  const currencySymbols = {
    NGN: '₦',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AUD: 'A$',
    CAD: 'C$',
    JPY: '¥',
    CNY: '¥'
  };

  const symbol = currencySymbols[currency] || currency;
  const formattedAmount = parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return `${symbol}${formattedAmount}`;
};

const formatDate = (date, format = 'full') => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  const options = {
    full: { year: 'numeric', month: 'long', day: 'numeric' },
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    numeric: { year: 'numeric', month: '2-digit', day: '2-digit' }
  };

  return d.toLocaleDateString('en-US', options[format] || options.full);
};

const formatDateTime = (date) => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatPhone = (phone) => {
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Format Nigerian numbers
  if (cleaned.startsWith('+234')) {
    const number = cleaned.substring(4);
    return `+234 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
  }
  
  return cleaned;
};

const formatPercentage = (value, decimals = 2) => {
  return `${parseFloat(value).toFixed(decimals)}%`;
};

const formatName = (firstName, lastName, otherName = '') => {
  const parts = [firstName, otherName, lastName].filter(Boolean);
  return parts.join(' ');
};

const formatTransactionType = (type) => {
  const types = {
    contribution: 'Contribution',
    withdrawal: 'Withdrawal',
    transfer: 'Transfer',
    loan: 'Loan',
    repayment: 'Repayment'
  };
  
  return types[type] || type;
};

const formatTransactionStatus = (status) => {
  const statuses = {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled'
  };
  
  return statuses[status] || status;
};

const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const formatAddress = (address1, address2, city, state, country) => {
  const parts = [address1, address2, city, state, country].filter(Boolean);
  return parts.join(', ');
};

const formatBalance = (balance) => {
  return {
    available: formatCurrency(balance.available_balance || 0),
    mtd: formatCurrency(balance.mtd_contributed || 0),
    ytd: formatCurrency(balance.ytd_contributed || 0)
  };
};

module.exports = {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPhone,
  formatPercentage,
  formatName,
  formatTransactionType,
  formatTransactionStatus,
  truncateText,
  formatAddress,
  formatBalance
};
