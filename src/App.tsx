import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { LogoutPage } from './components/auth/LogoutPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { Header, ActiveTab } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { ThreatOverviewChart } from './components/dashboard/ThreatOverviewChart';
import { ThreatDistributionChart } from './components/dashboard/ThreatDistributionChart';
import { LiveDetectionStream } from './components/dashboard/LiveDetectionStream';
import { SystemHealthWidget } from './components/dashboard/SystemHealthWidget';
import { TransactionFilter } from './components/transactions/TransactionFilter';
import { TransactionTable } from './components/transactions/TransactionTable';
import { TransactionDetailModal } from './components/transactions/TransactionDetailModal';
import { AiThreatAnalyzer } from './components/analyzer/AiThreatAnalyzer';
import { WalletRiskAnalyzer } from './components/wallet/WalletRiskAnalyzer';
import { AnalyticsOverview } from './components/analytics/AnalyticsOverview';
import { AlertsManager } from './components/alerts/AlertsManager';
import { LandingPage } from './components/landing/LandingPage';
import { transactionService, TransactionFilterOptions } from './services/transactionService';
import { alertService } from './services/alertService';
import { apiFetch } from './services/apiClient';
import { SystemAnalytics } from './types/crypto';
import { Transaction } from './types/crypto';
import { liveTransactionService } from './services/liveTransactionService';

export type RoutePath =
  | '/login'
  | '/register'
  | '/logout'
  | '/dashboard'
  | '/transactions'
  | '/threat-detection'
  | '/wallet-analysis'
  | '/analytics'
  | '/alerts'
  | '/settings'
  | '/landing';

// Convert tab to route
const tabToRoute = (tab: ActiveTab): RoutePath => {
  switch (tab) {
    case 'dashboard':
      return '/dashboard';
    case 'transactions':
      return '/transactions';
    case 'detection':
      return '/threat-detection';
    case 'wallet':
      return '/wallet-analysis';
    case 'analytics':
      return '/analytics';
    case 'alerts':
      return '/alerts';
    case 'landing':
      return '/landing';
    case 'settings':
      return '/settings';
  }
};

// Convert route to tab
const routeToTab = (route: string): ActiveTab => {
  switch (route) {
    case '/transactions':
      return 'transactions';
    case '/threat-detection':
      return 'detection';
    case '/wallet-analysis':
      return 'wallet';
    case '/analytics':
      return 'analytics';
    case '/alerts':
      return 'alerts';
    case '/landing':
      return 'landing';
    case '/settings':
      return 'settings';
    case '/dashboard':
    default:
      return 'dashboard';
  }
};

function MainAppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  // Helper to parse current pathname
  const getCurrentPath = (): string => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (
        path === '/login' ||
        path === '/register' ||
        path === '/logout' ||
        path === '/dashboard' ||
        path === '/transactions' ||
        path === '/threat-detection' ||
        path === '/wallet-analysis' ||
        path === '/analytics' ||
        path === '/alerts' ||
        path === '/settings' ||
        path === '/landing'
      ) {
        return path;
      }
    }
    return '/dashboard';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getCurrentPath());
  const [activeTab, setActiveTabState] = useState<ActiveTab>(routeToTab(getCurrentPath()));

  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(0);
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [liveTransactions, setLiveTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    (async () => {
      setDataLoading(true);
      try {
        await Promise.all([
          transactionService.load({ sortBy: 'timestamp', sortOrder: 'desc' }),
          alertService.load(),
          apiFetch<{ analytics: SystemAnalytics }>('/analytics/overview').then(r => { if (!cancelled) setAnalytics(r.analytics); }),
        ]);
        if (!cancelled) setUnreadAlertsCount(alertService.getUnreadCount());
      } catch (error) {
        console.error('Failed to load SOC data:', error);
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    const refreshLive = async () => {
      try {
        const live = await liveTransactionService.loadBitcoin();
        if (!cancelled) setLiveTransactions(live);
      } catch (error) {
        console.warn('Live Bitcoin feed unavailable:', error);
      }
    };
    refreshLive();
    const timer = window.setInterval(refreshLive, 15000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [isAuthenticated]);

  // Transaction filter state
  const [filterOptions, setFilterOptions] = useState<TransactionFilterOptions>({
    searchQuery: '',
    riskLevel: 'all',
    currency: 'all',
    threatType: 'all',
    sortBy: 'timestamp',
    sortOrder: 'desc',
  });

  // Selected Transaction for Detail Modal
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Target wallet for Wallet Risk tab
  const [targetWallet, setTargetWallet] = useState<string>('elliptic:226704643');

  // Navigation push function
  const navigateTo = (path: string) => {
    setCurrentRoute(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    if (
      path !== '/login' &&
      path !== '/register' &&
      path !== '/logout'
    ) {
      setActiveTabState(routeToTab(path));
    }
  };

  const handleSetActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    const path = tabToRoute(tab);
    navigateTo(path);
  };

  // Sync state on popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = getCurrentPath();
      setCurrentRoute(path);
      if (path !== '/login' && path !== '/register' && path !== '/logout') {
        setActiveTabState(routeToTab(path));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Protected Route Logic Guard
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      // Unauthenticated users can only visit /login or /register
      if (currentRoute !== '/login' && currentRoute !== '/register') {
        navigateTo('/login');
      }
    } else {
      // Authenticated users visiting /login or /register get redirected to /dashboard
      if (currentRoute === '/login' || currentRoute === '/register') {
        navigateTo('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, currentRoute]);

  const filteredTransactions = transactionService.filter(filterOptions);
  const allTransactions = transactionService.getAll();

  const handleOpenTxDetail = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  const handleGlobalSearch = (query: string) => {
    setFilterOptions((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleSelectWalletFromTx = (address: string) => {
    setTargetWallet(address);
    setIsModalOpen(false);
    handleSetActiveTab('wallet');
  };

  // Show subtle loader while auth session or initial backend data initializes
  if (isLoading || (isAuthenticated && dataLoading)) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
          <p className="text-xs font-mono text-cyan-400 font-bold">
            Initializing CryptoShield AI SOC Session...
          </p>
        </div>
      </div>
    );
  }

  // 1. Unauthenticated Route Views
  if (!isAuthenticated) {
    if (currentRoute === '/register') {
      return (
        <RegisterPage
          onNavigateLogin={() => navigateTo('/login')}
          onRegisterSuccess={() => navigateTo('/dashboard')}
        />
      );
    }
    // Default unauthenticated route is Login
    return (
      <LoginPage
        onNavigateRegister={() => navigateTo('/register')}
        onLoginSuccess={() => navigateTo('/dashboard')}
      />
    );
  }

  // 2. Logout View
  if (currentRoute === '/logout') {
    return (
      <LogoutPage
        onCancel={() => navigateTo('/dashboard')}
        onLogoutCompleted={() => navigateTo('/login')}
      />
    );
  }

  // 3. Authenticated Dashboard & Feature Views
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background Ambient Glass Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/15 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[20%] w-[35%] h-[35%] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none z-0" />

      {/* Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        unreadAlertsCount={unreadAlertsCount}
        onGlobalSearch={handleGlobalSearch}
        onTriggerLogout={() => navigateTo('/logout')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 relative z-10">
        {/* ROUTE 1: OVERVIEW / LANDING */}
        {activeTab === 'landing' && (
          <LandingPage
            onLaunchDashboard={() => handleSetActiveTab('dashboard')}
            onGoToDetection={() => handleSetActiveTab('detection')}
          />
        )}

        {/* ROUTE 2: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <SummaryCards
              totalAnalyzed={analytics?.totalAnalyzed ?? 0}
              threatsDetected={analytics?.totalThreats ?? 0}
              highRiskCount={analytics?.highRiskCount ?? 0}
              accuracy={analytics?.detectionAccuracy ?? 0}
              activeAlerts={unreadAlertsCount}
              networkRiskScore={24}
              onAlertsClick={() => handleSetActiveTab('alerts')}
              onTransactionsClick={() => handleSetActiveTab('transactions')}
            />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ThreatOverviewChart timeSeriesData={analytics?.timeSeriesData ?? []} />
              </div>
              <div>
                <ThreatDistributionChart distribution={analytics?.threatDistribution ?? []} />
              </div>
            </div>

            {/* Stream Feed & System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LiveDetectionStream
                  transactions={[...liveTransactions, ...allTransactions]}
                  onSelectTransaction={handleOpenTxDetail}
                  onViewAll={() => handleSetActiveTab('transactions')}
                />
              </div>
              <div>
                <SystemHealthWidget />
              </div>
            </div>
          </div>
        )}

        {/* ROUTE 3: TRANSACTIONS MONITORING */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">
                Cryptocurrency Transaction Monitoring Table
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Filter and inspect live ingested transactions across multi-chain networks
              </p>
            </div>

            <TransactionFilter
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
              onReset={() =>
                setFilterOptions({
                  searchQuery: '',
                  riskLevel: 'all',
                  currency: 'all',
                  threatType: 'all',
                  sortBy: 'timestamp',
                  sortOrder: 'desc',
                })
              }
            />

            <TransactionTable
              transactions={filteredTransactions}
              onSelectTransaction={handleOpenTxDetail}
            />
          </div>
        )}

        {/* ROUTE 4: AI THREAT DETECTION */}
        {activeTab === 'detection' && <AiThreatAnalyzer />}

        {/* ROUTE 5: WALLET RISK ANALYSIS */}
        {activeTab === 'wallet' && (
          <WalletRiskAnalyzer
            initialAddress={targetWallet}
            onInspectWallet={(addr) => setTargetWallet(addr)}
          />
        )}

        {/* ROUTE 6: ANALYTICS OVERVIEW */}
        {activeTab === 'analytics' && <AnalyticsOverview />}

        {/* ROUTE 7: ALERTS MANAGER */}
        {activeTab === 'alerts' && (
          <AlertsManager
            onInspectTx={(txId) => {
              const tx = transactionService.getById(txId);
              if (tx) handleOpenTxDetail(tx);
              else handleSetActiveTab('transactions');
            }}
            onInspectWallet={(addr) => {
              setTargetWallet(addr);
              handleSetActiveTab('wallet');
            }}
            onAlertsChange={() => setUnreadAlertsCount(alertService.getUnreadCount())}
          />
        )}

        {/* ROUTE 8: SETTINGS */}
        {activeTab === 'settings' && <SettingsPage />}
      </main>

      {/* Transaction Detail Inspector Modal */}
      <TransactionDetailModal
        transaction={selectedTx}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectWallet={handleSelectWalletFromTx}
        onActionExecute={(txId, actName) => {
          transactionService.updateStatus(txId, 'Blocked').then(() => setUnreadAlertsCount(alertService.getUnreadCount())).catch(console.error);
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
