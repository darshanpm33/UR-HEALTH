import { useState } from 'react';
import { useEmergency } from '@/context/EmergencyContext';
import { Brain, TrendingUp, AlertTriangle, Activity, Zap, MapPin, Play, BarChart3, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const surgeData = [
  { time: 'Now', predicted: 15, actual: 15 },
  { time: '+5m', predicted: 18, actual: null },
  { time: '+10m', predicted: 22, actual: null },
  { time: '+15m', predicted: 25, actual: null },
  { time: '+20m', predicted: 28, actual: null },
  { time: '+25m', predicted: 24, actual: null },
  { time: '+30m', predicted: 20, actual: null },
];

const riskZones = [
  { zone: 'Downtown District', risk: 92, patients: 45, type: 'High Density', trend: 'rising' },
  { zone: 'Industrial Area', risk: 78, patients: 23, type: 'Chemical Risk', trend: 'stable' },
  { zone: 'Highway Corridor', risk: 65, patients: 12, type: 'Traffic Accidents', trend: 'falling' },
  { zone: 'Residential North', risk: 35, patients: 5, type: 'Low Risk', trend: 'stable' },
];

const recommendations = [
  { title: 'Activate Surge Protocol', desc: 'Patient inflow exceeding threshold. Recommend activating mass casualty protocol.', urgency: 'critical', action: 'Activate Now' },
  { title: 'Redirect to Parkview Hospital', desc: 'Parkview has 60 available beds and lowest load (38%). Redirect non-critical cases.', urgency: 'high', action: 'Apply Routing' },
  { title: 'Request Blood Supply', desc: 'O-negative blood critically low (4 bags). Initiate donor appeal and inter-hospital transfer.', urgency: 'critical', action: 'Send Request' },
  { title: 'Deploy Temporary Triage Unit', desc: 'Set up field triage at Downtown District to reduce transport time by 40%.', urgency: 'medium', action: 'Plan Deployment' },
  { title: 'Pre-alert Surgical Teams', desc: '3 critical patients incoming may need surgery. Pre-alert OR teams.', urgency: 'high', action: 'Send Alert' },
  { title: 'Rebalance Staff Shifts', desc: 'Current shift ending in 45 min. Ensure overlap for smooth handover.', urgency: 'medium', action: 'View Schedule' },
];

export default function AIPredictionsPage() {
  const { patients, hospitals, isEmergencyActive, addAlert, processBatch } = useEmergency();
  const [simulating, setSimulating] = useState(false);
  const [appliedRecs, setAppliedRecs] = useState<Set<number>>(new Set());

  const criticalCount = patients.filter(p => p.priority === 'Critical').length;
  const avgSurvival = Math.round(patients.reduce((s, p) => s + p.survivalProbability, 0) / (patients.length || 1));

  const radarData = [
    { metric: 'ICU Load', value: Math.round(hospitals.reduce((s, h) => s + ((h.icuTotal - h.icuAvailable) / h.icuTotal) * 100, 0) / hospitals.length) },
    { metric: 'Bed Avail', value: 100 - Math.round(hospitals.reduce((s, h) => s + h.loadPercent, 0) / hospitals.length) },
    { metric: 'Staff Level', value: 78 },
    { metric: 'Resources', value: 65 },
    { metric: 'Response', value: 82 },
    { metric: 'Capacity', value: 55 },
  ];

  const handleApplyRec = (i: number) => {
    setAppliedRecs(prev => new Set([...prev, i]));
    const rec = recommendations[i];
    addAlert({ type: 'info', title: `AI: ${rec.title}`, message: `Recommendation applied: ${rec.desc}` });
  };

  const runSimulation = () => {
    setSimulating(true);
    processBatch(15);
    addAlert({ type: 'warning', title: 'Simulation Running', message: 'AI is simulating a 15-patient surge to test network capacity.' });
    setTimeout(() => setSimulating(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl primary-gradient flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            AI Predictions
          </h1>
          <p className="text-muted-foreground text-sm">Machine learning-powered forecasting and risk analysis</p>
        </div>
        <button
          onClick={runSimulation}
          disabled={simulating}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-md"
        >
          <Play className="w-4 h-4" />
          {simulating ? 'Simulating...' : 'Run What-If Simulation'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-2xl p-5 card-hover">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><TrendingUp className="w-4 h-4" /> Predicted Surge</div>
          <p className="text-3xl font-bold">+28</p>
          <p className="text-xs text-emergency font-medium">patients in next 30 min</p>
        </div>
        <div className="bg-card border rounded-2xl p-5 card-hover">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><AlertTriangle className="w-4 h-4" /> Risk Level</div>
          <p className={`text-2xl font-bold ${isEmergencyActive ? 'text-emergency' : 'text-warning'}`}>{isEmergencyActive ? 'EXTREME' : 'MODERATE'}</p>
          <p className="text-xs text-muted-foreground">Network-wide assessment</p>
        </div>
        <div className="bg-card border rounded-2xl p-5 card-hover">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><Activity className="w-4 h-4" /> Avg Survival</div>
          <p className={`text-3xl font-bold ${avgSurvival > 75 ? 'text-success' : avgSurvival > 50 ? 'text-warning' : 'text-emergency'}`}>{avgSurvival}%</p>
          <p className="text-xs text-muted-foreground">Across all patients</p>
        </div>
        <div className="bg-card border rounded-2xl p-5 card-hover">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><Target className="w-4 h-4" /> AI Confidence</div>
          <p className="text-3xl font-bold text-success">87%</p>
          <p className="text-xs text-muted-foreground">Model accuracy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Surge chart */}
        <div className="bg-card border rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Predicted Surge (30 min)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={surgeData}>
              <defs>
                <linearGradient id="surgeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))' }} />
              <Area type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" fill="url(#surgeGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="bg-card border rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-4">Network Health Radar</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <PolarRadiusAxis tick={{ fontSize: 9 }} stroke="hsl(var(--border))" />
              <Radar name="Status" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk zones */}
      <div className="bg-card border rounded-2xl p-5">
        <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-emergency" /> Risk Zone Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {riskZones.map(z => (
            <div key={z.zone} className={`border rounded-xl p-4 ${z.risk > 75 ? 'border-emergency/20 bg-emergency/5' : z.risk > 50 ? 'border-warning/20 bg-warning/5' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-sm">{z.zone}</h3>
                  <p className="text-[10px] text-muted-foreground">{z.type} • {z.patients} patients</p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${z.risk > 75 ? 'text-emergency' : z.risk > 50 ? 'text-warning' : 'text-success'}`}>{z.risk}%</span>
                  <p className="text-[10px] text-muted-foreground capitalize">{z.trend}</p>
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className={`h-2 rounded-full ${z.risk > 75 ? 'bg-emergency' : z.risk > 50 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${z.risk}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-card border rounded-2xl p-5">
        <h2 className="font-semibold text-sm mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> AI Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recommendations.map((r, i) => {
            const applied = appliedRecs.has(i);
            return (
              <div key={i} className={`border rounded-xl p-4 transition-all ${applied ? 'opacity-60 bg-success/5 border-success/20' : r.urgency === 'critical' ? 'border-emergency/20 bg-emergency/5' : r.urgency === 'high' ? 'border-warning/20 bg-warning/5' : 'border-info/20 bg-info/5'}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm">{r.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.urgency === 'critical' ? 'bg-emergency/10 text-emergency' : r.urgency === 'high' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'}`}>{r.urgency}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{r.desc}</p>
                <button
                  onClick={() => handleApplyRec(i)}
                  disabled={applied}
                  className={`w-full py-1.5 rounded-lg text-xs font-medium transition-all ${
                    applied ? 'bg-success/10 text-success' : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  {applied ? '✓ Applied' : r.action}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
