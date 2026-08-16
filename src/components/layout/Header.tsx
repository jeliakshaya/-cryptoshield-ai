import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  LayoutDashboard,
  ArrowRightLeft,
  Cpu,
  BarChart3,
  Bell,
  Wallet,
  Search,
  BookOpen,
  UserCheck,
  Moon,
  Sun,
  Menu,
  X,
  Radio,
  LogOut,
  Sliders,
  ChevronDown,
  User,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export type ActiveTab =
  | 'dashboard'
  | 'transactions'
  | 'detection'
  | 'wallet'
  | 'analytics'
  | 'alerts'
  | 'landing'
  | 'settings';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  unreadAlertsCount: number;
  onGlobalSearch: (query: string) => void;
  onTriggerLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unreadAlertsCount,
  onGlobalSearch,
  onTriggerLogout,
}) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowRightLeft },
    { id: 'detection', label: 'Threat Detection', icon: Cpu },
    { id: 'wallet', label: 'Wallet Risk', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unreadAlertsCount },
    { id: 'landing', label: 'Overview', icon: BookOpen },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onGlobalSearch(searchQuery.trim());
      if (searchQuery.length > 30) {
        if (searchQuery.startsWith('0x') && searchQuery.length === 66) {
          setActiveTab('transactions');
        } else {
          setActiveTab('wallet');
        }
      } else {
        setActiveTab('transactions');
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/50 backdrop-blur-xl border-b border-white/10">
      {/* Top SOC Status Banner */}
      <div className="hidden md:flex items-center justify-between px-6 py-1.5 bg-slate-900/40 backdrop-blur-md border-b border-white/5 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <Radio className="w-3 h-3 animate-pulse" /> SOC Node 01: ONLINE
          </span>
          <span className="text-white/20">|</span>
          <span>Model: CryptoShield Risk Engine v1</span>
          <span className="text-white/20">|</span>
          <span className="text-cyan-400 font-medium">14,280 TPS Ingested</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-300 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-white font-bold">{user?.name || 'Alex Vance'}</span>
            <span className="text-slate-400">({user?.role || 'SOC Senior Analyst'})</span>
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 font-semibold backdrop-blur-md">
            AUTHENTICATED
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center p-2 shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-white font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
                  CryptoShield
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Cyber Threat Detection System
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.2 text-[10px] rounded-full font-bold font-mono ${
                        isActive
                          ? 'bg-cyan-400 text-slate-950'
                          : 'bg-rose-500 text-white animate-pulse'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search Bar & User Section */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative">
              <input
                type="text"
                placeholder="Search TX hash or wallet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 xl:w-56 bg-white/5 border border-white/10 focus:border-cyan-400/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:bg-white/10 transition-all font-mono backdrop-blur-md"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md"
              title="Toggle Cyber Theme Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {/* USER PROFILE SECTION */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all backdrop-blur-md cursor-pointer"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.name || 'User Avatar'}
                  className="w-8 h-8 rounded-xl object-cover border border-cyan-400/40"
                />
                <div className="hidden sm:block text-left font-mono">
                  <span className="text-xs font-bold text-white block truncate max-w-[110px]">
                    {user?.name || 'Alex Vance'}
                  </span>
                  <span className="text-[10px] text-cyan-400 block truncate max-w-[110px]">
                    {user?.role ? user.role.split(' ')[0] : 'Analyst'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* USER PROFILE DROPDOWN MENU */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 border border-white/20 rounded-3xl shadow-2xl backdrop-blur-2xl p-3 z-50 space-y-2 animate-fadeIn font-mono">
                  {/* User Info Header */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-xs font-bold text-white block">
                      {user?.name || 'Alex Vance'}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {user?.email || 'analyst@cryptoshield.ai'}
                    </span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      {user?.role || 'SOC Senior Threat Analyst'}
                    </span>
                  </div>

                  <div className="pt-1 space-y-1">
                    {/* Profile Summary */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('settings');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>Profile Details</span>
                    </button>

                    {/* Settings */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('settings');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <span>SOC Preferences</span>
                    </button>

                    {/* Logout */}
                    <div className="pt-1 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onTriggerLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/20 transition-colors font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 backdrop-blur-md"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/90 backdrop-blur-xl border-b border-white/10 px-4 pt-2 pb-4 space-y-2 font-mono">
          <form onSubmit={handleSearchSubmit} className="relative my-2">
            <input
              type="text"
              placeholder="Search TX hash or wallet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 font-mono backdrop-blur-md"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                      : 'bg-white/5 border border-white/10 text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              onClick={() => {
                setActiveTab('settings');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-slate-300"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onTriggerLogout();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
