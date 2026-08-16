import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Radio,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface LoginPageProps {
  onNavigateRegister: () => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateRegister,
  onLoginSuccess,
}) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Email or username is required.');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email, password, rememberMe);
      if (res.success) {
        setSuccessMessage('Authentication verified! Granting SOC Dashboard access...');
        setTimeout(() => {
          onLoginSuccess();
        }, 1000);
      } else {
        setIsLoading(false);
        setErrorMessage(res.message || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('An unexpected authentication error occurred.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background Ambient Ambient Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/15 blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[30%] w-[35%] h-[35%] rounded-full bg-indigo-600/10 blur-[160px] pointer-events-none z-0" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl shadow-2xl overflow-hidden min-h-[620px]">
        {/* LEFT COLUMN: Cybersecurity & AI Animated Visuals */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/60 p-8 sm:p-10 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center p-2 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                <ShieldAlert className="w-6 h-6 text-white font-bold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-mono text-white tracking-tight">
                    CryptoShield
                  </span>
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold">
                    AI SOC
                  </span>
                </div>
                <p className="text-xs text-cyan-400/90 font-mono font-medium">
                  AI-Based Cyber Threat Detection
                </p>
              </div>
            </div>
          </div>

          {/* Center Graphic - Interactive Network Node Graph */}
          <div className="relative z-10 my-8 space-y-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden space-y-4 shadow-xl">
              <div className="flex items-center justify-between font-mono text-xs text-slate-300">
                <span className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                  Mempool Threat Monitor
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] border border-emerald-500/30">
                  RISK ENGINE ACTIVE
                </span>
              </div>

              {/* Animated Network Node Simulation */}
              <div className="h-32 w-full relative flex items-center justify-center bg-slate-950/80 rounded-xl border border-white/5 p-3 overflow-hidden">
                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line x1="20%" y1="50%" x2="50%" y2="30%" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 2" className="animate-pulse" />
                  <line x1="50%" y1="30%" x2="80%" y2="50%" stroke="#3b82f6" strokeWidth="1.5" />
                  <line x1="20%" y1="50%" x2="50%" y2="75%" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="50%" y1="75%" x2="80%" y2="50%" stroke="#a855f7" strokeWidth="1.5" />
                </svg>

                {/* Nodes */}
                <div className="absolute left-[18%] top-[42%] w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div className="absolute left-[47%] top-[20%] w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="absolute left-[47%] top-[68%] w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                  <ShieldAlert className="w-4 h-4 animate-bounce" />
                </div>
                <div className="absolute left-[78%] top-[42%] w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                  <Layers className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-slate-400 block text-[10px]">Realtime Latency</span>
                  <span className="text-cyan-400 font-bold">11.4 ms</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-slate-400 block text-[10px]">ML Confidence</span>
                  <span className="text-emerald-400 font-bold">N/A</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                AI-Powered Crypto Security Engine
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mt-2 font-sans">
                Real-time anomaly detection, transaction risk scoring, alerting, and analyst review workflows.
              </p>
            </div>
          </div>

          {/* Bottom Security Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              SOC Level-3 Protected
            </span>
            <span className="text-cyan-400 font-semibold">v3.4 Production</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Glassmorphic Login Form */}
        <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-center relative bg-slate-900/40">
          <div className="space-y-6 max-w-md mx-auto w-full">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Welcome Back
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </h1>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Securely access your AI-powered cryptocurrency threat detection dashboard.
              </p>
            </div>

            {/* Notifications */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Main Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email/Username Field */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                  Email or SOC Analyst ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none backdrop-blur-md font-mono transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-bold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none backdrop-blur-md font-mono transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-950 cursor-pointer"
                  />
                  <span>Remember me on this SOC terminal</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold font-mono text-xs transition-all shadow-xl shadow-cyan-950/50 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </div>
                ) : (
                  <>
                    <span>Authenticate & Access Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Create Account Link */}
            <div className="text-center pt-2 font-mono text-xs text-slate-400">
              Don't have an analyst account?{' '}
              <button
                type="button"
                onClick={onNavigateRegister}
                className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors underline"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        defaultEmail={email}
      />
    </div>
  );
};
