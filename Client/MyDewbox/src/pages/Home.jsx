import React, { useState, useMemo } from "react";
import { ArrowRight, TrendingUp, Plus, PiggyBank, Target, Clock, Bell, BellOff, Calendar, Award, Zap, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { apiService } from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

const Homepage = () => {
  const navigate = useNavigate();
  const [showAutoPayModal, setShowAutoPayModal] = useState(false);

  // Fetch subscriber data
  const { data: subscriberData, isLoading: subscriberLoading } = useQuery({
    queryKey: ['subscriber'],
    queryFn: () => apiService.getSubscriber(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch contribution history
  const { data: contributionsData } = useQuery({
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

  // Fetch wallet data
  const { data: walletData } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => apiService.getWallet(),
    retry: 1,
  });

  const userData = useMemo(() => {
    const subscriber = subscriberData?.data?.subscriber;
    const wallet = walletData?.data?.wallet;
    
    if (!subscriber) return { 
      name: 'User', 
      mainBalance: 0, 
      icaBalance: 0, 
      piggyBalance: 0,
      hasContributed: false,
      walletBalance: 0
    };
    
    // Parse values to ensure they're numbers
    const icaBalance = parseFloat(subscriber.ica_balance) || 0;
    const piggyBalance = parseFloat(subscriber.piggy_balance) || 0;
    const mainBalance = parseFloat(subscriber.balance) || 0;
    const walletBalance = parseFloat(wallet?.balance) || mainBalance;
    
    return {
      name: subscriber.firstname || 'User',
      mainBalance,
      icaBalance,
      piggyBalance,
      hasContributed: (icaBalance > 0 || piggyBalance > 0),
      walletBalance,
      subscriberId: subscriber.id
    };
  }, [subscriberData, walletData]);

  // Calculate contribution statistics
  const contributionStats = useMemo(() => {
    const contributions = contributionsData?.data || [];
    
    if (contributions.length === 0) {
      return {
        totalContributions: 0,
        thisMonthContributions: 0,
        contributionStreak: 0,
        lastContributionDate: null,
        nextPaymentDate: null,
        averageContribution: 0
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter this month's contributions
    const thisMonthContributions = contributions.filter(c => {
      const date = new Date(c.contribution_date || c.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

    // Calculate streak (consecutive months with contributions)
    let streak = 0;
    let checkDate = new Date(currentYear, currentMonth, 1);
    
    for (let i = 0; i < 12; i++) {
      const monthContributions = contributions.filter(c => {
        const date = new Date(c.contribution_date || c.createdAt);
        return date.getMonth() === checkDate.getMonth() && 
               date.getFullYear() === checkDate.getFullYear();
      });
      
      if (monthContributions.length > 0) {
        streak++;
        checkDate.setMonth(checkDate.getMonth() - 1);
      } else {
        break;
      }
    }

    // Get last contribution date
    const sortedContributions = [...contributions].sort((a, b) => 
      new Date(b.contribution_date || b.createdAt) - new Date(a.contribution_date || a.createdAt)
    );
    const lastContributionDate = sortedContributions[0]?.contribution_date || sortedContributions[0]?.createdAt;

    // Calculate next payment date (1st of next month)
    const nextPaymentDate = new Date(currentYear, currentMonth + 1, 1);

    // Calculate average contribution
    const totalAmount = contributions.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
    const averageContribution = contributions.length > 0 ? totalAmount / contributions.length : 0;

    return {
      totalContributions: contributions.length,
      thisMonthContributions,
      contributionStreak: streak,
      lastContributionDate,
      nextPaymentDate,
      averageContribution
    };
  }, [contributionsData]);

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
        <div className="h-8 w-32 bg-[var(--color-surface-elevated)] rounded animate-pulse" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="h-80 bg-[var(--color-surface-elevated)] rounded-3xl animate-pulse" />
          <div className="lg:col-span-2 space-y-4">
            <div className="h-36 bg-[var(--color-surface-elevated)] rounded-2xl animate-pulse" />
            <div className="h-36 bg-[var(--color-surface-elevated)] rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const totalContributions = userData.icaBalance + userData.piggyBalance;
  const icaProgress = userData.icaBalance > 0 ? Math.min((userData.icaBalance / 100000) * 100, 100) : 0;
  const piggyProgress = userData.piggyBalance > 0 ? Math.min((userData.piggyBalance / 50000) * 100, 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Header - Clean and Professional */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Welcome back, {userData.name}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {contributionStats.contributionStreak > 0 
              ? `${contributionStats.contributionStreak} month${contributionStats.contributionStreak > 1 ? 's' : ''} contribution streak`
              : "Here's your financial overview"}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Balance Card */}
        <div className="lg:col-span-1">
          {/* Wallet Balance Card - Trust-building design */}
          <Card variant="elevated" padding="lg" className="mb-6">
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-3 font-medium">
              <Wallet size={16} />
              <span>Wallet Balance</span>
            </div>
            <div className="text-4xl font-bold text-[var(--color-text-primary)] mb-2 tracking-tight">
              {formatCurrency(userData.walletBalance)}
            </div>
            <div className="text-sm text-[var(--color-text-secondary)] mb-6">
              Available to spend or contribute
            </div>
            
            {/* Quick Actions - Clean buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/dashboard/transactions?action=deposit')}
                className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all duration-150"
              >
                <Plus className="w-5 h-5 mb-2 text-[var(--color-primary)]" />
                <div className="text-sm font-semibold text-[var(--color-text-primary)]">Add Money</div>
              </button>
              <button
                onClick={() => navigate('/dashboard/contribute')}
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-all duration-150"
              >
                <TrendingUp className="w-5 h-5 mb-2 text-white" />
                <div className="text-sm font-semibold text-white">Contribute</div>
              </button>
            </div>
          </Card>

          {/* Stats Cards - Minimal design */}
          <div className="space-y-4">
            {/* Total Contributions */}
            <Card variant="flat" padding="md">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                  Total Contributions
                </div>
                <TrendingUp className="text-green-600" size={18} />
              </div>
              <div className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
                {formatCurrency(totalContributions)}
              </div>
              <div className="text-xs text-[var(--color-text-secondary)]">
                ICA + Piggy combined
              </div>
            </Card>

            {/* Contribution Streak */}
            {contributionStats.contributionStreak > 0 && (
              <Card variant="flat" padding="md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Zap className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                      Contribution Streak
                    </div>
                    <div className="text-xl font-bold text-[var(--color-text-primary)]">
                      {contributionStats.contributionStreak} {contributionStats.contributionStreak === 1 ? 'Month' : 'Months'}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column - Contributions Breakdown & Activity */}
        <div className="lg:col-span-2 space-y-4">
          {/* Piggy & ICA Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Piggy Contributions Card */}
            <Card variant="elevated" padding="lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] flex items-center justify-center">
                    <PiggyBank className="text-[#d97706]" size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                      Piggy Contributions
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)]">
                      Monthly savings
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">
                {formatCurrency(userData.piggyBalance)}
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-1">
                  <span>{piggyProgress.toFixed(0)}% of ₦50,000 goal</span>
                </div>
                <div className="w-full h-2 bg-[var(--color-border-light)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${piggyProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] rounded-full"
                  />
                </div>
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
                      Yearly investment goal
                    </div>
                  </div>
                </div>
                {icaProgress >= 100 && (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Award className="text-green-600" size={16} />
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">
                {formatCurrency(userData.icaBalance)}
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mb-1">
                  <span>{icaProgress.toFixed(0)}% of ₦100,000 goal</span>
                  {icaProgress >= 100 && <span className="text-green-600 font-semibold">Goal Reached! 🎉</span>}
                </div>
                <div className="w-full h-2 bg-[var(--color-border-light)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${icaProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#0066FF] to-[#0052CC] rounded-full"
                  />
                </div>
              </div>
              {icaProgress < 100 && (
                <div className="text-xs text-[var(--color-text-secondary)] mb-3">
                  {formatCurrency(100000 - userData.icaBalance)} remaining to reach goal
                </div>
              )}
              <button
                onClick={() => navigate('/dashboard/contribute')}
                className="text-sm text-[#0066FF] hover:underline font-medium"
              >
                {icaProgress >= 100 ? 'Continue Contributing →' : 'Contribute to ICA →'}
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
                  <div key={i} className="h-16 bg-[var(--color-surface-elevated)] rounded-lg animate-pulse" />
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
                        transaction.type?.toLowerCase() === 'ica' || transaction.type?.toLowerCase() === 'piggy' || transaction.type?.toLowerCase() === 'contribution'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}>
                        {transaction.type?.toLowerCase() === 'ica' || transaction.type?.toLowerCase() === 'piggy' || transaction.type?.toLowerCase() === 'contribution' ? (
                          <TrendingUp className="text-green-600" size={18} />
                        ) : (
                          <ArrowRight className="text-red-600" size={18} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-[var(--color-text-primary)]">
                          {transaction.type?.toLowerCase() === 'ica' ? 'ICA Contribution' :
                           transaction.type?.toLowerCase() === 'piggy' ? 'Piggy Contribution' :
                           transaction.type?.toLowerCase() === 'contribution' ? 'Contribution' :
                           transaction.type?.toLowerCase() === 'withdrawal' ? 'Withdrawal' :
                           'Transfer'}
                        </div>
                        <div className="text-xs text-[var(--color-text-secondary)]">
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type?.toLowerCase() === 'ica' || transaction.type?.toLowerCase() === 'piggy' || transaction.type?.toLowerCase() === 'contribution'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {transaction.type?.toLowerCase() === 'ica' || transaction.type?.toLowerCase() === 'piggy' || transaction.type?.toLowerCase() === 'contribution' ? '+' : '-'}
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
                    Build consistent contribution habits
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
