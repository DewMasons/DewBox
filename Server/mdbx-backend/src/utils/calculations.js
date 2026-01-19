// Calculation utilities for financial operations

const calculateInterest = (principal, rate, time, frequency = 'yearly') => {
  const frequencies = {
    yearly: 1,
    monthly: 12,
    quarterly: 4,
    daily: 365
  };

  const n = frequencies[frequency] || 1;
  const r = rate / 100;
  
  // Compound interest formula: A = P(1 + r/n)^(nt)
  const amount = principal * Math.pow((1 + r / n), n * time);
  const interest = amount - principal;

  return {
    principal: parseFloat(principal),
    interest: parseFloat(interest.toFixed(2)),
    total: parseFloat(amount.toFixed(2)),
    rate,
    time,
    frequency
  };
};

const calculateLoanRepayment = (loanAmount, interestRate, months) => {
  const monthlyRate = (interestRate / 100) / 12;
  
  // Monthly payment formula: M = P[r(1+r)^n]/[(1+r)^n-1]
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - loanAmount;

  return {
    loanAmount: parseFloat(loanAmount),
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    totalPayment: parseFloat(totalPayment.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    months
  };
};

const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return parseFloat(((value / total) * 100).toFixed(2));
};

const calculateGrowthRate = (oldValue, newValue) => {
  if (oldValue === 0) return 0;
  const growth = ((newValue - oldValue) / oldValue) * 100;
  return parseFloat(growth.toFixed(2));
};

const calculateAverage = (values) => {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + parseFloat(val || 0), 0);
  return parseFloat((sum / values.length).toFixed(2));
};

const calculateSum = (values) => {
  if (!values || values.length === 0) return 0;
  return parseFloat(values.reduce((acc, val) => acc + parseFloat(val || 0), 0).toFixed(2));
};

const calculateBalanceAfterTransaction = (currentBalance, amount, type) => {
  const balance = parseFloat(currentBalance);
  const transactionAmount = parseFloat(amount);

  if (type === 'credit' || type === 'contribution') {
    return parseFloat((balance + transactionAmount).toFixed(2));
  } else if (type === 'debit' || type === 'withdrawal') {
    return parseFloat((balance - transactionAmount).toFixed(2));
  }

  return balance;
};

const calculateMonthlyContribution = (targetAmount, months, currentAmount = 0) => {
  const remaining = targetAmount - currentAmount;
  if (remaining <= 0) return 0;
  
  return parseFloat((remaining / months).toFixed(2));
};

const calculateYearProgress = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear() + 1, 0, 1);
  
  const progress = ((now - start) / (end - start)) * 100;
  return parseFloat(progress.toFixed(2));
};

const calculateMonthProgress = () => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  
  const progress = (currentDay / daysInMonth) * 100;
  return parseFloat(progress.toFixed(2));
};

const calculateDaysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const calculateMaturityDate = (startDate, months) => {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + months);
  return date;
};

const calculateROI = (initialInvestment, finalValue) => {
  if (initialInvestment === 0) return 0;
  const roi = ((finalValue - initialInvestment) / initialInvestment) * 100;
  return parseFloat(roi.toFixed(2));
};

module.exports = {
  calculateInterest,
  calculateLoanRepayment,
  calculatePercentage,
  calculateGrowthRate,
  calculateAverage,
  calculateSum,
  calculateBalanceAfterTransaction,
  calculateMonthlyContribution,
  calculateYearProgress,
  calculateMonthProgress,
  calculateDaysBetween,
  calculateMaturityDate,
  calculateROI
};
