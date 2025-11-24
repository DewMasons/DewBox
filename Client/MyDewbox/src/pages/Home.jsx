import React, { useState, useMemo } from "react";
import { ArrowRight, TrendingUp, Plus, PiggyBank, Target, Clock, Bell, BellOff } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { apiService } from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

const Homepage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAutoPayModal, setShowAutoPayModal] = useState(false);

  // Fetch subscriber data
  const { data: subscriberData, isLoading: subscriberLoading } = useQuery({
    queryKey: ['subscriber'],
    queryFn: () => apiService.getSubscriber(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch contribution history
  const { data: contributionsData, isLoading: contributionsLoading } = useQuery({
    queryKey: ['contributionHistory'],
    queryFn: () => apiService.getContributionHistory(),
    retry: 1,
  });

  // Fetch recent transactions
  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiService.getTransactions(),
    retry: 1,
  });

  const userData = useMemo(() => {
    const subscriber = subscriberData?.data?.subscriber;
    if (!subscriber) return { 
      name: 'User', 
      mainBalance: 0, 
      icaBalance: 0, 
      piggyBalance: 0,
      hasContributed: false 
    };
    
    // Parse values to ensure they're numbers
    const icaBalance = parseFloat(subscriber.ica_balance) || 0;
    const piggyBalance = parseFloat(subscriber.piggy_balance) || 0;
    const mainBalance = parseFloat(subscriber.balance) || 0;
    
    return {
      name: subscriber.firstname || 'User',
      mainBalance,
      icaBalance,
      piggyBalance,
      hasContributed: (icaBalance > 0 || piggyBalance > 0),
    };
  }, [subscriberData]);

  const recentActivity = useMemo(() => {
    const transactions = transactionsData?.data || [];
    return transactions.slice(0, 5);
  }, [transactionsData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Check if user just made first contribution
  React.useEffect(() => {
    if (userData.hasContributed && contributionsData?.data?.length === 1) {
      // Show auto-pay modal after first contribution
      const hasSeenModal = localStorage.getItem('hasSeenAutoPayModal');
      if (!hasSeenModal) {
        setTimeout(() => setShowAutoPayModal(true), 1000);
      }
    }
  }, [userData.hasContributed, contributionsData]);

  const handleDismissAutoPayModal = () => {
    localStorage.setItem('hasSeenAutoPayModal', 'true');
    setShowAutoPayModal(false);
  };

  const handleEnableAutoPay = () => {
    // TODO: Implement auto-pay setup
    toast.success('Automatic payments will be available soon!');
    handleDismissAutoPayModal();
  };

  if (subscriberLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-4">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="h-80 bg-gray-200 rounded-3xl animate-pulse" />
          <div className="lg:col-span-2 space-y-4">
            <div className="h-36 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-36 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const totalSavings = userData.icaBalance + userData.piggyBalance;
  const icaProgress = userData.icaBalance > 0 ? Math.min((userData.icaBalance / 100000) * 100, 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Welcome back, {userData.name}! 👋
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Here's your financial overview
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Balance & Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          {/* Main Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-[28px] p-8 text-white shadow-[0_8px_30px_rgba(0,102,255,0.2)]"
          >
            <div className="mb-8">
              <div className="text-sm opacity-70 mb-3 font-medium">Wallet Balance</div>
              <div className="text-5xl font-bold mb-2 tracking-tight">
                {formatCurrency(userData.mainBalance)}
              </div>
              <div className="text-sm opacity-60">Available to spend</div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/dashboard/transactions?action=deposit')}
                className="bg-white/15 hover:bg-white/25 rounded-[20px] p-5 transition-all duration-200 text-left border border-white/20 backdrop-blur-sm"
              >
                <Plus className="w-6 h-6 mb-3" />
                <div className="text-sm font-semibold">Add Money</div>
              </button>
              <button
                onClick={() => navigate('/dashboard/transactions?action=withdraw')}
                className="bg-white/15 hover:bg-white/25 rounded-[20px] p-5 transition-all duration-200 text-left border border-white/20 backdrop-blur-sm"
              >
                <ArrowRight className="w-6 h-6 mb-3" />
                <div className="text-sm font-semibold">Transfer</div>
              </button>
            </div>
          </motion.div>

          {/* Total Savings Card */}
          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                Total Savings
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
              {formatCurrency(totalSavings)}
            </div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              ICA + Piggy combined
            </div>
          </Card>
        </div>

        {/* Right Column - Savings Breakdown & Activity */}
        <div className="lg:col-span-2 space-y-4">
          {/* Piggy & ICA Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Piggy Savings Card */}
            <Card variant="elevated" padding="lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] flex items-center justify-center">
                    <PiggyBank className="text-[#d97706]" size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                      Piggy Savings
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)]">
                      Monthly
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                {formatCurrency(userData.piggyBalance)}
              </div>
              <button
                onClick={() => navigate('/dashboard/contribute')}
                className="text-sm text-[#0066FF] hover:underline font-medium"
              >
                Add to Piggy →
              </button>
            </Card>

            {/* ICA Progress Card */}
            <Card variant="elevated" padding="lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#E6F0FF] flex items-center justify-center">
                    <Target className="text-[#0066FF]" size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                      ICA Progress
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)]">
                      Yearly Goal
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">
                {formatCurrency(userData.icaBalance)}
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-1">
                  <span>{icaProgress.toFixed(0)}% of ₦100,000</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${icaProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#0066FF] to-[#0052CC] rounded-full"
                  />
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard/contribute')}
                className="text-sm text-[#0066FF] hover:underline font-medium"
              >
                Contribute to ICA →
              </button>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="text-[var(--color-text-secondary)]" size={20} />
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  Recent Activity
                </h3>
              </div>
              <button
                onClick={() => navigate('/dashboard/transactions')}
                className="text-sm text-[#0066FF] hover:underline font-medium"
              >
                View All
              </button>
            </div>

            {transactionsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-[var(--color-surface)] rounded-xl hover:bg-[var(--color-surface-elevated)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'ica' || transaction.type === 'piggy' || transaction.type === 'contribution'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}>
                        {transaction.type === 'ica' || transaction.type === 'piggy' || transaction.type === 'contribution' ? (
                          <TrendingUp className="text-green-600" size={18} />
                        ) : (
                          <ArrowRight className="text-red-600" size={18} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-[var(--color-text-primary)]">
                          {transaction.type === 'ica' ? 'ICA Contribution' :
                           transaction.type === 'piggy' ? 'Piggy Savings' :
                           transaction.type === 'contribution' ? 'Contribution' :
                           transaction.type === 'withdrawal' ? 'Withdrawal' :
                           'Transfer'}
                        </div>
                        <div className="text-xs text-[var(--color-text-secondary)]">
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'ica' || transaction.type === 'piggy' || transaction.type === 'contribution'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'ica' || transaction.type === 'piggy' || transaction.type === 'contribution' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">
                <Clock className="mx-auto mb-3 opacity-30" size={48} />
                <p>No recent activity</p>
                <button
                  onClick={() => navigate('/dashboard/contribute')}
                  className="mt-3 text-[#0066FF] hover:underline font-medium"
                >
                  Make your first contribution
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Auto-Pay Setup Modal */}
      <AnimatePresence>
        {showAutoPayModal && (
          <Modal
            isOpen={showAutoPayModal}
            onClose={handleDismissAutoPayModal}
            title="Enable Automatic Payments?"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#E6F0FF] flex items-center justify-center">
                  <Bell className="text-[#0066FF]" size={32} />
                </div>
              </div>
              
              <p className="text-center text-[var(--color-text-secondary)]">
                Would you like to set up automatic monthly contributions of{' '}
                <span className="font-bold text-[var(--color-text-primary)]">
                  {formatCurrency(contributionsData?.data?.[0]?.amount || 0)}
                </span>
                ?
              </p>

              <div className="bg-[var(--color-surface)] rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="text-green-500 mt-0.5">✓</div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Never miss a contribution
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-green-500 mt-0.5">✓</div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Build consistent savings habits
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-green-500 mt-0.5">✓</div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Cancel anytime in settings
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={handleDismissAutoPayModal}
                  icon={<BellOff size={20} />}
                >
                  Not Now
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleEnableAutoPay}
                  icon={<Bell size={20} />}
                >
                  Enable Auto-Pay
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Homepage;
