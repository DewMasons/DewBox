import React, { useState, useEffect, useMemo } from "react";
import { Home, User, Plus, CreditCard, Wallet, TrendingUp, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../services/api";

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch subscriber data using the same pattern as Profile component
  const { data: subscriberData, isLoading, error, isFetching } = useQuery({
    queryKey: ['subscriber'],
    queryFn: () => apiService.getSubscriber(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Debug logging (similar to Profile component)
  useEffect(() => {
    console.log('=== HOMEPAGE DEBUG INFO ===');
    console.log('subscriberData:', subscriberData);
    console.log('isLoading:', isLoading);
    console.log('isFetching:', isFetching);
    
    if (subscriberData) {
      console.log('subscriberData keys:', Object.keys(subscriberData));
      console.log('subscriberData.subscriber:', subscriberData.subscriber);
      
      if (subscriberData.subscriber) {
        console.log('subscriber keys:', Object.keys(subscriberData.subscriber));
      }
    }
    console.log('=== END DEBUG INFO ===');
  }, [subscriberData, isLoading, error]);

  // Info carousel data
  const carouselItems = [
    {
      title: 'Save Smart with Esusu',
      description: 'Join our rotating savings program and watch your money grow',
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Track Your Spending',
      description: 'Get insights into your financial habits with detailed analytics',
      color: 'from-green-500 to-teal-600'
    },
    {
      title: 'Secure Transactions',
      description: 'Bank-level security keeps your money safe and protected',
      color: 'from-orange-500 to-red-600'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Mock recent transactions (keep as is for now)
  const recentTransactions = [
    { id: 1, type: 'credit', amount: 500, description: 'Salary Deposit', date: '2024-06-02', category: 'income' },
    { id: 2, type: 'debit', amount: 150, description: 'Grocery Shopping', date: '2024-06-01', category: 'food' },
    { id: 3, type: 'credit', amount: 200, description: 'Esusu Contribution', date: '2024-05-31', category: 'savings' },
    { id: 4, type: 'debit', amount: 80, description: 'Utility Bill', date: '2024-05-30', category: 'bills' },
    { id: 5, type: 'credit', amount: 1200, description: 'Freelance Payment', date: '2024-05-29', category: 'income' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Memoize user data extraction (similar to Profile component)
  const userData = useMemo(() => {
    if (!subscriberData?.data?.subscriber || Object.keys(subscriberData.data.subscriber).length === 0) {
      return {
        name: 'User',
        firstname: '',
        surname: '',
        mainBalance: 0,
        esusuBalance: 0,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        createdAt: null
      };
    }
    
    const subscriber = subscriberData.data.subscriber;
    const fullName = subscriber.firstname && subscriber.surname 
      ? `${subscriber.firstname} ${subscriber.surname}` 
      : subscriber.firstname || subscriber.surname || 'User';
    
    return {
      name: fullName,
      firstname: subscriber.firstname || '',
      surname: subscriber.surname || '',
      mainBalance: subscriber.balance || subscriber.mainBalance || 0,
      esusuBalance: subscriber.available_balance || subscriber.esusuBalance || 0,
      avatar: subscriber.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      createdAt: subscriber.createdAt
    };
  }, [subscriberData]);

  // Handle loading state - same pattern as Profile component
  const hasValidSubscriberData = subscriberData?.data?.subscriber && Object.keys(subscriberData.data.subscriber).length > 0;
  
  if (isLoading || isFetching || !hasValidSubscriberData) {
    return (
      <div className="space-y-6 max-w-4xl ml-0 md:ml-72 px-4 md:px-0">
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    console.error('Homepage query error:', error);
    return (
      <div className="space-y-6 max-w-4xl ml-0 md:ml-72 px-4 md:px-0">
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <p className="text-red-600">Error loading dashboard data</p>
          <p className="text-sm text-gray-500">Check console for details</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Handle no data state
  if (!subscriberData?.data?.subscriber || Object.keys(subscriberData.data.subscriber).length === 0) {
    console.warn('No valid subscriber data found. subscriberData:', subscriberData);
    return (
      <div className="space-y-6 max-w-4xl ml-0 md:ml-72 px-4 md:px-0">
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <p className="text-gray-600">No dashboard data found</p>
          <p className="text-sm text-gray-500">Check console for API response details</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl ml-0 md:ml-72 px-4 md:px-0">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {userData.name}!</h1>
            <p className="text-blue-100">Here's your financial overview</p>
            {userData.createdAt && (
              <p className="text-blue-200 text-sm mt-1">
                Member since {new Date(userData.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </p>
            )}
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <img 
              src={userData.avatar} 
              alt="Avatar" 
              className="w-14 h-14 rounded-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';
              }}
            />
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Main Balance</h3>
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(userData.mainBalance)}</p>
          <p className="text-sm text-green-600 mt-2">Available funds</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Esusu Balance</h3>
            </div>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(userData.esusuBalance)}</p>
          <p className="text-sm text-purple-600 mt-2">Savings balance</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <button className="flex-1 py-3 px-6 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Shop</button>
        <button className="flex-1 py-3 px-6 rounded-xl bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition">Join an Esusu</button>
        <button className="flex-1 py-3 px-6 rounded-xl bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition">Create Wallet</button>
      </div>

      {/* Info Carousel */}
      <div className="relative">
        <div className="overflow-hidden rounded-2xl">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselItems.map((item, index) => (
              <div key={index} className={`w-full flex-shrink-0 bg-gradient-to-r ${item.color} p-6 text-white`}>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/90">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Carousel Controls */}
        <div className="flex justify-center mt-4 space-x-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Transactions</h3>
        <div className="space-y-3">
          {recentTransactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'credit' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <p className={`font-semibold ${
                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium">
          View All Transactions
        </button>
      </div>
    </div>
  );
};

export default Homepage;