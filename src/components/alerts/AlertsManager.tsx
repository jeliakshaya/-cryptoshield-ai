import React, { useState } from 'react';
import { SecurityAlert } from '../../types/crypto';
import { alertService } from '../../services/alertService';
import { AlertCard } from './AlertCard';
import { Bell, Filter, ShieldAlert } from 'lucide-react';

interface AlertsManagerProps {
  onInspectTx: (txId: string) => void;
  onInspectWallet: (address: string) => void;
  onAlertsChange?: () => void;
}

export const AlertsManager: React.FC<AlertsManagerProps> = ({
  onInspectTx,
  onInspectWallet,
  onAlertsChange,
}) => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>(alertService.getAll());

  React.useEffect(() => {
    alertService.load().then(setAlerts).catch(console.error);
  }, []);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleUpdateStatus = (id: string, status: SecurityAlert['status']) => {
    alertService.updateAlertStatus(id, status).then(() => {
      setAlerts(alertService.getAll());
      onAlertsChange?.();
    }).catch(console.error);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-400 animate-pulse" />
            Real-time Security Incident Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Active threat queue requiring SOC analyst verification or circuit breaker response
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Severity */}
          <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-mono"
            >
              <option value="all" className="bg-slate-900">All Severities</option>
              <option value="critical" className="bg-slate-900">Critical Only</option>
              <option value="high" className="bg-slate-900">High Only</option>
              <option value="medium" className="bg-slate-900">Medium Only</option>
            </select>
          </div>

          {/* Status */}
          <div className="bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-mono"
            >
              <option value="all" className="bg-slate-900">All Statuses</option>
              <option value="open" className="bg-slate-900">Open</option>
              <option value="investigating" className="bg-slate-900">Investigating</option>
              <option value="resolved" className="bg-slate-900">Resolved</option>
              <option value="ignored" className="bg-slate-900">Dismissed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center text-slate-400 font-mono">
            <ShieldAlert className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            No security incidents match the current filter selection.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onUpdateStatus={handleUpdateStatus}
              onInspectTx={onInspectTx}
              onInspectWallet={onInspectWallet}
            />
          ))
        )}
      </div>
    </div>
  );
};
