import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Bell,
  CheckCircle2,
  Cpu,
  Smartphone,
  Save,
  Radio,
  Sliders,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  loadSocPreferences,
  saveSocPreferences,
  SocPreferences,
} from '../../services/socPreferencesService';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');

  const [riskSensitivity, setRiskSensitivity] = useState<'high' | 'medium' | 'strict'>('medium');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [autoBlockHighRisk, setAutoBlockHighRisk] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load preferences from backend on startup
  useEffect(() => {
    loadSocPreferences().then((prefs) => {
      setName(prefs.name || user?.name || '');
      setEmail(prefs.email || user?.email || '');
      setDepartment(prefs.department || user?.department || 'Cyber Threat Intelligence');
      setRiskSensitivity(prefs.riskSensitivity || 'medium');
      setTwoFactorEnabled(prefs.twoFactorEnabled ?? true);
      setAutoBlockHighRisk(prefs.autoBlockHighRisk ?? true);
      setWebhookUrl(prefs.webhookUrl || '');
    }).catch(console.error);
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      const preferencesData: SocPreferences = {
        name: name.trim(),
        email: email.trim(),
        department: department.trim(),
        riskSensitivity,
        twoFactorEnabled,
        autoBlockHighRisk,
        webhookUrl: webhookUrl.trim(),
      };

      // Save to PostgreSQL through the backend
      await saveSocPreferences(preferencesData);

      // Update Auth Profile
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        department: department.trim(),
      });

      setIsSaving(false);
      setIsSaved(true);
      setSuccessMessage('SOC Preferences saved successfully');

      setTimeout(() => {
        setIsSaved(false);
      }, 3000);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      setIsSaving(false);
      const msg = err?.message || 'Failed to save SOC Preferences';
      setErrorMessage(msg.startsWith('Failed') ? msg : `Failed to save SOC Preferences: ${msg}`);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
          <Sliders className="w-6 h-6 text-cyan-400" />
          SOC Terminal & Analyst Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-sans">
          Configure security credentials, notification webhooks, ML sensitivity thresholds, and analyst profile preferences.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: User Profile Settings */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 border-b border-white/10 pb-3">
            <User className="w-4 h-4 text-cyan-400" />
            Analyst Profile & Credentials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">SOC Analyst Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">Department / Division</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-400 focus:outline-none backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">Role Classification</label>
              <input
                type="text"
                value={user?.role || 'SOC Senior Threat Analyst'}
                disabled
                className="w-full bg-white/5 border border-white/5 opacity-60 rounded-xl px-3.5 py-2.5 text-slate-400 font-mono cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Security & Authentication */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 border-b border-white/10 pb-3">
            <Shield className="w-4 h-4 text-cyan-400" />
            Security & Session Controls
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="text-white font-bold block">Two-Factor Authentication (2FA Hardware Key)</span>
                  <span className="text-slate-400 text-[10px]">Require FIDO2 / YubiKey verification on SOC logins</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="w-5 h-5 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <Radio className="w-5 h-5 text-rose-400" />
                <div>
                  <span className="text-white font-bold block">Automated High-Risk Circuit Breaker</span>
                  <span className="text-slate-400 text-[10px]">Automatically freeze transactions with Risk Score &gt; 85</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoBlockHighRisk}
                onChange={(e) => setAutoBlockHighRisk(e.target.checked)}
                className="w-5 h-5 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 3: ML Sensitivity & Webhooks */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 border-b border-white/10 pb-3">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Risk Engine Sensitivity Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">Detection Rigor Threshold</label>
              <select
                value={riskSensitivity}
                onChange={(e) => setRiskSensitivity(e.target.value as any)}
                className="w-full bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white focus:outline-none cursor-pointer"
              >
                <option value="medium">Balanced (Standard SOC Baseline)</option>
                <option value="strict">Strict (Ultra Low False Negative - High Sensitivity)</option>
                <option value="high">High Volume Filter (Reduces Alert Fatigue)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">SIEM Webhook Integration</label>
              <div className="relative">
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-400 focus:outline-none backdrop-blur-md"
                />
                <Bell className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-6 py-3 rounded-2xl font-mono font-bold text-xs transition-all shadow-xl flex items-center gap-2 ${
              isSaving
                ? 'bg-slate-700 text-slate-300 cursor-not-allowed opacity-80'
                : isSaved
                ? 'bg-emerald-600 text-white shadow-emerald-950/50'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-950/50'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : isSaved ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Saved ✓</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save SOC Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

