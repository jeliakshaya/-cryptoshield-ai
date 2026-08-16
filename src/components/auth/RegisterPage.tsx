import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Shield,
  Check,
  X,
  Cpu,
  Activity,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface RegisterPageProps {
  onNavigateLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateLogin,
  onRegisterSuccess,
}) => {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Live password requirements evaluation
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const calculateStrength = () => {
    let score = 0;
    if (hasMinLength) score++;
    if (hasUpper) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    return score;
  };

  const strengthScore = calculateStrength();

  const getStrengthLabel = () => {
    if (password.length === 0) return { label: 'None', color: 'bg-slate-700', text: 'text-slate-400' };
    if (strengthScore <= 1) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (strengthScore <= 3) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-400' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
  };

  const strengthInfo = getStrengthLabel();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Full Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!hasMinLength) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await register(fullName, email, password);
      if (res.success) {
        setSuccessMessage('Analyst account registered successfully! Redirecting to SOC Dashboard...');
        setTimeout(() => {
          onRegisterSuccess();
        }, 1200);
      } else {
        setIsLoading(false);
        setErrorMessage(res.message || 'Registration failed.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('An unexpected error occurred during account creation.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Ambient Radial Glowing Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/15 blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[30%] w-[35%] h-[35%] rounded-full bg-indigo-600/10 blur-[160px] pointer-events-none z-0" />

      {/* Split-Screen Card */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl shadow-2xl overflow-hidden min-h-[660px]">
        {/* LEFT COLUMN: Cybersecurity Visual */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/60 p-8 sm:p-10 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Header */}
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
                  Analyst Registration
                </p>
              </div>
            </div>
          </div>

          {/* Graphic Features List */}
          <div className="relative z-10 my-6 space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
              <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                SOC Analyst Privileges Included:
              </span>
              <ul className="space-y-2 text-xs text-slate-300 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Access to Realtime Mempool Stream</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Graph Neural Network Relationship Mapping</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Automated Ransomware Vault Blockers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>JSON Audit Export & Forensic Reports</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Join the Crypto Threat SOC Team
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-1 font-sans">
                Deploy advanced machine learning models to combat illicit crypto transfers, wash trading, and peeling chain mixers.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Role-Based Access Control
            </span>
            <span className="text-cyan-400 font-semibold">Tier-2 Certified</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Register Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center relative bg-slate-900/40">
          <div className="space-y-6 max-w-md mx-auto w-full">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Create Analyst Account
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </h1>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Register your credentials to access the SOC threat detection console.
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

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Sarah Jenkins"
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none backdrop-blur-md font-mono transition-all"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                  SOC Analyst Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="s.jenkins@cryptoshield.ai"
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none backdrop-blur-md font-mono transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                  Password
                </label>
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

                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-slate-400">Password Strength:</span>
                      <span className={`font-bold ${strengthInfo.text}`}>{strengthInfo.label}</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex gap-1 p-0.5">
                      <div className={`h-full rounded-full transition-all duration-300 ${strengthScore >= 1 ? strengthInfo.color : 'bg-transparent'} flex-1`} />
                      <div className={`h-full rounded-full transition-all duration-300 ${strengthScore >= 2 ? strengthInfo.color : 'bg-transparent'} flex-1`} />
                      <div className={`h-full rounded-full transition-all duration-300 ${strengthScore >= 3 ? strengthInfo.color : 'bg-transparent'} flex-1`} />
                      <div className={`h-full rounded-full transition-all duration-300 ${strengthScore >= 4 ? strengthInfo.color : 'bg-transparent'} flex-1`} />
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-400 pt-1">
                      <div className="flex items-center gap-1">
                        {hasMinLength ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-rose-400" />}
                        <span>8+ characters</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {hasUpper ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-rose-400" />}
                        <span>Uppercase letter</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {hasNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-rose-400" />}
                        <span>Number (0-9)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {hasSpecial ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-rose-400" />}
                        <span>Special character</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full bg-white/5 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none backdrop-blur-md font-mono transition-all ${
                      confirmPassword && confirmPassword !== password
                        ? 'border-rose-500/80 focus:border-rose-400'
                        : 'border-white/10 focus:border-cyan-400/80'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-[10px] font-mono text-rose-400 mt-1">
                    Passwords do not match.
                  </p>
                )}
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
                    <span>Provisioning Account...</span>
                  </div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-2 font-mono text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onNavigateLogin}
                className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors underline"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
