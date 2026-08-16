import React, { useState } from 'react';
import { LogOut, ShieldAlert, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LogoutPageProps {
  onCancel: () => void;
  onLogoutCompleted: () => void;
}

export const LogoutPage: React.FC<LogoutPageProps> = ({
  onCancel,
  onLogoutCompleted,
}) => {
  const { logout, user } = useAuth();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmLogout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      logout();
      setIsProcessing(false);
      setIsLoggedOut(true);

      // Auto redirect after 2 seconds
      setTimeout(() => {
        onLogoutCompleted();
      }, 2000);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background Ambient Ambient Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/15 blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-600/10 blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-lg bg-slate-900/80 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-6">
        {/* Top Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-500/20 to-cyan-500/20 border border-white/15 flex items-center justify-center mx-auto text-rose-400 shadow-xl shadow-rose-950/30">
          {!isLoggedOut ? <LogOut className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8 text-emerald-400 animate-bounce" />}
        </div>

        {!isLoggedOut ? (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                SOC Session Termination
              </span>
              <h2 className="text-2xl font-extrabold text-white font-mono mt-3">
                Are you sure you want to logout?
              </h2>
              <p className="text-xs text-slate-300 mt-2 font-sans leading-relaxed">
                Logging out will invalidate your current SOC terminal session token. Unsaved threat filters and active real-time stream buffers will be cleared.
              </p>
            </div>

            {user && (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs flex items-center justify-between text-left">
                <div>
                  <span className="text-slate-400 text-[10px] block">Active Analyst</span>
                  <span className="text-white font-bold">{user.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">Role</span>
                  <span className="text-cyan-400 font-bold">{user.role}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={isProcessing}
                className="py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs font-bold transition-all backdrop-blur-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isProcessing}
                className="py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span>Confirm Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-extrabold text-white font-mono">
                You have been securely logged out.
              </h2>
              <p className="text-xs text-cyan-300 mt-2 font-sans leading-relaxed font-medium">
                Thank you for using CryptoShield AI threat detection platform.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Session tokens & memory caches cleared. Redirecting to login...</span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onLogoutCompleted}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2"
              >
                <span>Return to Login Immediately</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
