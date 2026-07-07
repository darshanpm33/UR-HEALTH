import { useState, useEffect } from 'react';
import { useEmergency } from '@/context/EmergencyContext';
import { Users, Heart, BedDouble, Clock, AlertTriangle, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Zap, MapPin } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { emergencyInflow, bedOccupancy } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { patients, alerts, hospitals, isEmergencyActive, surgeScore } = useEmergency();
  const navigate = useNavigate();
  const criticalCases = patients.filter(p => p.priority === 'Critical').length;
  const totalBeds = hospitals.reduce((s, h) => s + h.icuTotal + h.generalTotal, 0);
  const availBeds = hospitals.reduce((s, h) => s + h.icuAvailable + h.generalAvailable, 0);
  const occupancy = Math.round(((totalBeds - availBeds) / totalBeds) * 100);
  const pendingTriage = patients.filter(p => p.status === 'Pending').length;
  const admittedToday = patients.filter(p => p.status === 'Admitted').length;
  const unreadAlerts = alerts.filter(a => !a.read).length;
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 15000);
    return () => clearInterval(t);
  }, []);

  const stats = [
    { label: 'Total Patients', value: patients.length, sub: `${admittedToday} admitted`, icon: Users, gradient: 'primary-gradient', trend: '+12%', up: true },
    { label: 'Critical Cases', value: criticalCases, sub: 'Immediate attention', icon: Heart, gradient: 'emergency-gradient', trend: criticalCases > 3 ? '+' + criticalCases : 'Stable', up: criticalCases > 3 },
    { label: 'Available Beds', value: `${availBeds}/${totalBeds}`, sub: `${occupancy}% occupancy`, icon: BedDouble, gradient: occupancy > 80 ? 'emergency-gradient' : 'success-gradient', trend: `${100 - occupancy}% free`, up: false },
  ];

  const critAlerts = alerts.filter(a => a.type === 'critical' && !a.read);

  const recentPatients = [...patients].reverse().slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" /> Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Live hospital command center — Last refreshed {format(liveTime, 'MMM dd, yyyy - hh:mm:ss a')}
          </p>
        </div>
        {isEmergencyActive && (
          <button onClick={() => navigate('/special-emergency')} className="emergency-gradient text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 animate-pulse-emergency shadow-lg">
            <AlertTriangle className="w-4 h-4" /> Emergency Active — View
          </button>
        )}
      </div>

      {/* Critical alerts banner */}
      {critAlerts.length > 0 && (
        <div className="bg-emergency/5 border border-emergency/20 rounded-2xl px-5 py-4 flex items-start gap-3 card-hover cursor-pointer" onClick={() => navigate('/alerts')}>
          <div className="w-10 h-10 rounded-xl bg-emergency/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-emergency" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-emergency text-sm">{critAlerts.length} Critical Alert{critAlerts.length > 1 ? 's' : ''} Active</p>
            <p className="text-emergency/70 text-sm mt-0.5">{critAlerts[0]?.message}</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-emergency/50" />
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className="bg-card rounded-2xl border p-5 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
              <div className={`w-10 h-10 rounded-xl ${s.gradient} flex items-center justify-center shadow-md`}>
                <s.icon className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            <p className="text-3xl font-bold stat-value">{s.value}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">{s.sub}</p>
              <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${s.up ? 'text-emergency' : 'text-success'}`}>
                {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {s.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border p-5 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Emergency Inflow</h2>
                <p className="text-[10px] text-muted-foreground">Last 12 hours</p>
              </div>
            </div>
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={emergencyInflow}>
              <defs>
                <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))' }} />
              <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="url(#primaryGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl border p-5 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                <BedDouble className="w-4 h-4 text-info" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Bed Occupancy</h2>
                <p className="text-[10px] text-muted-foreground">By ward</p>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bedOccupancy}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="ward" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="occupancy" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom: Recent patients + Hospital network */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent patients */}
        <div className="bg-card rounded-2xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Recent Patients
            </h2>
            <button onClick={() => navigate('/patients')} className="text-xs text-primary font-medium hover:underline">View All →</button>
          </div>
          <div className="space-y-2">
            {recentPatients.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  p.priority === 'Critical' ? 'bg-emergency/10 text-emergency' : p.priority === 'High' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                }`}>
                  {p.severityScore}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.condition}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  p.status === 'Admitted' ? 'bg-success/10 text-success' : p.status === 'Pending' ? 'bg-emergency/10 text-emergency' : 'bg-info/10 text-info'
                }`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital network */}
        <div className="bg-card rounded-2xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Hospital Network
            </h2>
            <button onClick={() => navigate('/icu-beds')} className="text-xs text-primary font-medium hover:underline">Details →</button>
          </div>
          <div className="space-y-2">
            {hospitals.sort((a, b) => a.distance - b.distance).map(h => (
              <div key={h.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 transition-colors">
                <span className={`w-3 h-3 rounded-full shrink-0 ${h.status === 'red' ? 'bg-emergency' : h.status === 'yellow' ? 'bg-warning' : 'bg-success'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{h.name}</p>
                  <p className="text-[10px] text-muted-foreground">{h.distance}km • ICU: {h.icuAvailable} • Gen: {h.generalAvailable}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${h.status === 'red' ? 'text-emergency' : h.status === 'yellow' ? 'text-warning' : 'text-success'}`}>{h.loadPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
