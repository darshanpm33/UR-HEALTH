import { useState } from 'react';
import { useEmergency } from '@/context/EmergencyContext';
import { Bell, AlertTriangle, Info, CheckCircle, X, Filter, Trash2, Volume2 } from 'lucide-react';

export default function AlertsCenterPage() {
  const { alerts, dismissAlert, addAlert } = useEmergency();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showRead, setShowRead] = useState(true);

  const filtered = alerts
    .filter(a => typeFilter === 'all' || a.type === typeFilter)
    .filter(a => showRead || !a.read);

  const critCount = alerts.filter(a => a.type === 'critical' && !a.read).length;
  const warnCount = alerts.filter(a => a.type === 'warning' && !a.read).length;
  const infoCount = alerts.filter(a => a.type === 'info' && !a.read).length;

  const typeIcon = (t: string) => {
    if (t === 'critical') return <AlertTriangle className="w-5 h-5 text-emergency" />;
    if (t === 'warning') return <AlertTriangle className="w-5 h-5 text-warning" />;
    return <Info className="w-5 h-5 text-info" />;
  };

  const dismissAll = () => {
    alerts.filter(a => !a.read).forEach(a => dismissAlert(a.id));
  };

  const generateTestAlert = (type: 'critical' | 'warning' | 'info') => {
    const messages = {
      critical: [
        { title: 'ICU at 95% Capacity', message: 'Memorial Healthcare ICU beds nearly full. Divert incoming patients.' },
        { title: 'Power Supply Failing', message: 'Backup generators activating at Unity Health Center.' },
      ],
      warning: [
        { title: 'Ambulance Delayed', message: 'Unit 7 delayed by 15 minutes due to traffic congestion.' },
        { title: 'Shift Change Approaching', message: 'Night shift ends in 30 minutes. Verify handover readiness.' },
      ],
      info: [
        { title: 'New Staff On-boarded', message: '3 additional nurses deployed to Emergency ward.' },
        { title: 'Supply Delivery', message: 'Oxygen cylinder shipment arriving in 20 minutes.' },
      ],
    };
    const pool = messages[type];
    const msg = pool[Math.floor(Math.random() * pool.length)];
    addAlert({ type, ...msg });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl primary-gradient flex items-center justify-center">
              <Bell className="w-4 h-4 text-primary-foreground" />
            </div>
            Alerts Center
          </h1>
          <p className="text-muted-foreground text-sm">Critical notifications and system alerts</p>
        </div>
        <div className="flex gap-2">
          <button onClick={dismissAll} className="px-3 py-1.5 rounded-xl border text-xs font-medium hover:bg-secondary transition-colors flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Dismiss All
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => setTypeFilter(typeFilter === 'critical' ? 'all' : 'critical')} className={`bg-card border rounded-2xl p-5 border-l-4 border-l-emergency card-hover text-left transition-all ${typeFilter === 'critical' ? 'ring-2 ring-emergency/30' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-emergency">{critCount}</p>
              <p className="text-sm text-muted-foreground font-medium">Critical</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-emergency/30" />
          </div>
        </button>
        <button onClick={() => setTypeFilter(typeFilter === 'warning' ? 'all' : 'warning')} className={`bg-card border rounded-2xl p-5 border-l-4 border-l-warning card-hover text-left transition-all ${typeFilter === 'warning' ? 'ring-2 ring-warning/30' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-warning">{warnCount}</p>
              <p className="text-sm text-muted-foreground font-medium">Warnings</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-warning/30" />
          </div>
        </button>
        <button onClick={() => setTypeFilter(typeFilter === 'info' ? 'all' : 'info')} className={`bg-card border rounded-2xl p-5 border-l-4 border-l-info card-hover text-left transition-all ${typeFilter === 'info' ? 'ring-2 ring-info/30' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-info">{infoCount}</p>
              <p className="text-sm text-muted-foreground font-medium">Info</p>
            </div>
            <Info className="w-8 h-8 text-info/30" />
          </div>
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {['all', 'critical', 'warning', 'info'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${typeFilter === t ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary hover:bg-secondary/80'}`}>{t}</button>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={showRead} onChange={e => setShowRead(e.target.checked)} className="rounded" />
          <span className="text-muted-foreground text-xs">Show dismissed</span>
        </label>
        <div className="flex gap-1.5">
          <button onClick={() => generateTestAlert('critical')} className="px-2.5 py-1.5 rounded-lg bg-emergency/10 text-emergency text-[10px] font-medium hover:bg-emergency/20 transition-colors">+ Critical</button>
          <button onClick={() => generateTestAlert('warning')} className="px-2.5 py-1.5 rounded-lg bg-warning/10 text-warning text-[10px] font-medium hover:bg-warning/20 transition-colors">+ Warning</button>
          <button onClick={() => generateTestAlert('info')} className="px-2.5 py-1.5 rounded-lg bg-info/10 text-info text-[10px] font-medium hover:bg-info/20 transition-colors">+ Info</button>
        </div>
      </div>

      {/* Alert list */}
      <div className="space-y-2">
        {filtered.map((a, i) => (
          <div
            key={a.id}
            className={`bg-card border rounded-2xl p-4 flex items-start gap-3 transition-all animate-fade-in-up ${
              a.read ? 'opacity-50' : a.type === 'critical' ? 'border-emergency/30 bg-emergency/5 shadow-sm' : a.type === 'warning' ? 'border-warning/20' : ''
            }`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              a.type === 'critical' ? 'bg-emergency/10' : a.type === 'warning' ? 'bg-warning/10' : 'bg-info/10'
            }`}>
              {typeIcon(a.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{a.title}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${
                  a.type === 'critical' ? 'bg-emergency/10 text-emergency' : a.type === 'warning' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'
                }`}>{a.type}</span>
                <span className="text-[10px] text-muted-foreground">{a.timestamp}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{a.message}</p>
            </div>
            {!a.read && (
              <button onClick={() => dismissAlert(a.id)} className="text-xs px-3 py-1.5 rounded-xl border hover:bg-secondary transition-colors flex items-center gap-1.5 shrink-0">
                <CheckCircle className="w-3.5 h-3.5" /> Dismiss
              </button>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground">No alerts match the current filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
