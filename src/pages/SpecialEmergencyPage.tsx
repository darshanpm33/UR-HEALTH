import { useState } from 'react';
import { useEmergency } from '@/context/EmergencyContext';
import { AlertTriangle, Power, Users, Truck, Activity, BedDouble, MapPin, Settings, Zap, Shield, Clock, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function SpecialEmergencyPage() {
  const {
    isEmergencyActive, emergencyType, activatedAt, hospitals, patients,
    surgeScore, totalIntake, totalDistributed, networkBeds,
    resourceTransfers, thresholds,
    activateEmergency, deactivateEmergency, processBatch,
    requestResourceTransfer, updateThresholds,
  } = useEmergency();

  const [batchCount, setBatchCount] = useState(50);
  const [selectedType, setSelectedType] = useState('Mass Casualty');
  const [showSettings, setShowSettings] = useState(false);
  const [showConfirmDeactivate, setShowConfirmDeactivate] = useState(false);
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferResource, setTransferResource] = useState('Oxygen Cylinders');

  const allocated = patients.filter(p => p.assignedHospital);
  const hospitalLoad = hospitals.map(h => ({ name: h.name.split(' ')[0], load: h.loadPercent, available: 100 - h.loadPercent }));

  const priorityDist = [
    { name: 'Critical', value: patients.filter(p => p.priority === 'Critical').length, color: 'hsl(0, 84%, 50%)' },
    { name: 'High', value: patients.filter(p => p.priority === 'High').length, color: 'hsl(24, 95%, 53%)' },
    { name: 'Medium', value: patients.filter(p => p.priority === 'Medium').length, color: 'hsl(38, 92%, 50%)' },
    { name: 'Low', value: patients.filter(p => p.priority === 'Low').length, color: 'hsl(142, 76%, 36%)' },
  ];

  const timelineData = [
    { time: '0m', patients: patients.length > 10 ? patients.length - 10 : 0 },
    { time: '5m', patients: patients.length > 5 ? patients.length - 5 : 0 },
    { time: '10m', patients: patients.length },
    { time: '15m', patients: Math.round(patients.length * 1.1) },
    { time: '20m', patients: Math.round(patients.length * 1.15) },
  ];

  const handleCustomTransfer = () => {
    if (!transferFrom || !transferTo || transferFrom === transferTo) return;
    const from = hospitals.find(h => h.id === transferFrom);
    const to = hospitals.find(h => h.id === transferTo);
    if (!from || !to) return;
    requestResourceTransfer({
      resource: transferResource,
      quantity: 5,
      from: from.name,
      to: to.name,
      route: `${from.location} → ${to.location}`,
      eta: `${Math.floor(Math.random() * 20 + 10)} min`,
    });
    setTransferFrom('');
    setTransferTo('');
  };

  // Inactive state
  if (!isEmergencyActive) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl emergency-gradient flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-primary-foreground" />
            </div>
            Special Emergency
          </h1>
          <p className="text-muted-foreground text-sm">AI Multi-Hospital Life-Saving System — Activate during mass casualty events</p>
        </div>

        <div className="max-w-2xl mx-auto text-center space-y-8 py-8">
          <div className="w-24 h-24 rounded-3xl bg-emergency/10 flex items-center justify-center mx-auto">
            <Shield className="w-12 h-12 text-emergency" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Emergency Mode is Inactive</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">Activate Special Emergency Mode during high-risk situations to enable AI-powered multi-hospital coordination and maximize survival rates.</p>
          </div>

          <div className="bg-card border rounded-2xl p-6 text-left space-y-5">
            <h3 className="font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-emergency" /> Select Emergency Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Mass Casualty', 'Natural Disaster', 'Pandemic Surge', 'Industrial Accident', 'Terrorist Attack', 'Other'].map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    selectedType === t
                      ? 'emergency-gradient text-primary-foreground border-emergency shadow-lg'
                      : 'hover:bg-secondary'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <h3 className="font-semibold flex items-center gap-2 pt-2"><Settings className="w-4 h-4" /> Detection Thresholds</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground font-medium">Patient Spike</label>
                <input type="number" value={thresholds.patientSpike} onChange={e => updateThresholds({ patientSpike: +e.target.value })} className="w-full border rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">ICU Occupancy %</label>
                <input type="number" value={thresholds.icuOccupancy} onChange={e => updateThresholds({ icuOccupancy: +e.target.value })} className="w-full border rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">Critical Cases</label>
                <input type="number" value={thresholds.criticalCases} onChange={e => updateThresholds({ criticalCases: +e.target.value })} className="w-full border rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </div>

          <button
            onClick={() => activateEmergency(selectedType)}
            className="emergency-gradient text-primary-foreground px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all flex items-center gap-3 mx-auto shadow-xl hover:shadow-2xl"
          >
            <Power className="w-6 h-6" />
            ACTIVATE EMERGENCY MODE
          </button>
        </div>
      </div>
    );
  }

  // Active state
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl emergency-gradient flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-primary-foreground animate-pulse" />
            </div>
            Special Emergency — Active
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" /> Since {activatedAt} • {emergencyType}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowSettings(!showSettings)} className="px-4 py-2 rounded-xl border text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-1.5">
            <Settings className="w-4 h-4" /> Controls
          </button>
          <button onClick={() => setShowConfirmDeactivate(true)} className="px-4 py-2 rounded-xl bg-emergency text-emergency-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md">
            <Power className="w-4 h-4" /> Deactivate
          </button>
        </div>
      </div>

      {/* Deactivate confirmation */}
      {showConfirmDeactivate && (
        <div className="bg-emergency/5 border border-emergency/20 rounded-2xl p-5 flex items-center justify-between animate-scale-in">
          <div>
            <p className="font-bold text-emergency text-sm">Confirm Deactivation</p>
            <p className="text-sm text-muted-foreground">This will end emergency coordination mode for all hospitals.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowConfirmDeactivate(false)} className="px-4 py-2 rounded-xl border text-sm font-medium hover:bg-secondary">Cancel</button>
            <button onClick={() => { deactivateEmergency(); setShowConfirmDeactivate(false); }} className="px-4 py-2 rounded-xl bg-emergency text-emergency-foreground text-sm font-bold hover:opacity-90">Confirm</button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-foreground text-background rounded-2xl p-5 card-hover">
          <p className="text-[10px] uppercase tracking-wider opacity-60 font-bold">Total Intake</p>
          <p className="text-4xl font-bold mt-2 stat-value">{totalIntake}</p>
          <Users className="w-5 h-5 opacity-40 mt-2" />
        </div>
        <div className="info-gradient rounded-2xl p-5 text-primary-foreground card-hover">
          <p className="text-[10px] uppercase tracking-wider opacity-70 font-bold">Distributed</p>
          <p className="text-4xl font-bold mt-2 stat-value">{totalDistributed}</p>
          <Truck className="w-5 h-5 opacity-40 mt-2" />
        </div>
        <div className="emergency-gradient rounded-2xl p-5 text-primary-foreground card-hover">
          <p className="text-[10px] uppercase tracking-wider opacity-70 font-bold">Surge Score</p>
          <p className="text-4xl font-bold mt-2 stat-value">{surgeScore.toFixed(1)}<span className="text-lg opacity-70">/100</span></p>
          <Activity className="w-5 h-5 opacity-40 mt-2" />
        </div>
        <div className="success-gradient rounded-2xl p-5 text-primary-foreground card-hover">
          <p className="text-[10px] uppercase tracking-wider opacity-70 font-bold">Network Beds</p>
          <p className="text-4xl font-bold mt-2 stat-value">{networkBeds}</p>
          <BedDouble className="w-5 h-5 opacity-40 mt-2" />
        </div>
      </div>

      {/* Command Controls */}
      {showSettings && (
        <div className="bg-card border rounded-2xl p-5 space-y-4 animate-scale-in">
          <h2 className="font-semibold flex items-center gap-2 text-sm"><Settings className="w-4 h-4" /> Command Center Controls</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground font-medium">Patient Spike Threshold</label>
              <input type="number" value={thresholds.patientSpike} onChange={e => updateThresholds({ patientSpike: +e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium">ICU Occupancy %</label>
              <input type="number" value={thresholds.icuOccupancy} onChange={e => updateThresholds({ icuOccupancy: +e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium">Critical Cases</label>
              <input type="number" value={thresholds.criticalCases} onChange={e => updateThresholds({ criticalCases: +e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bulk Processor */}
        <div className="bg-card border rounded-2xl p-5 border-emergency/20">
          <h2 className="font-semibold flex items-center gap-2 mb-4 text-sm"><Users className="w-5 h-5 text-emergency" /> Bulk Intake Processor</h2>
          <p className="text-xs text-muted-foreground mb-3">Simulate mass patient intake — AI auto-triages and distributes across hospitals.</p>
          <div className="flex items-center gap-3">
            <input type="number" value={batchCount} onChange={e => setBatchCount(+e.target.value)} min={1} max={200} className="w-28 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <button onClick={() => processBatch(batchCount)} className="emergency-gradient text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-md">
              Process {batchCount} Patients
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            {[5, 10, 25, 50, 100].map(n => (
              <button key={n} onClick={() => { setBatchCount(n); processBatch(n); }} className="px-3 py-1.5 border rounded-lg text-xs font-medium hover:bg-secondary transition-colors">
                +{n}
              </button>
            ))}
          </div>
        </div>

        {/* AI Allocation Queue */}
        <div className="bg-card border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2 text-sm"><Zap className="w-5 h-5 text-primary" /> AI Allocation Queue</h2>
            <span className="text-xs bg-success/10 text-success px-3 py-1 rounded-full font-medium">{allocated.length} routed</span>
          </div>
          <div className="overflow-auto max-h-56 scrollbar-thin">
            <table className="w-full text-xs">
              <thead><tr className="border-b"><th className="text-left py-2 px-2 font-semibold text-muted-foreground">Patient</th><th className="text-left py-2 px-2 font-semibold text-muted-foreground">Priority</th><th className="text-left py-2 px-2 font-semibold text-muted-foreground">Hospital</th><th className="text-left py-2 px-2 font-semibold text-muted-foreground">ETA</th><th className="text-left py-2 px-2 font-semibold text-muted-foreground">Survival</th></tr></thead>
              <tbody>
                {allocated.slice(-20).reverse().map(p => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="py-2 px-2 font-medium">{p.name}</td>
                    <td className="py-2 px-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${p.priority === 'Critical' ? 'bg-emergency/10 text-emergency' : p.priority === 'High' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>
                        {p.priority}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-muted-foreground">{hospitals.find(h => h.id === p.assignedHospital)?.name.split(' ').slice(0, 2).join(' ') || '—'}</td>
                    <td className="py-2 px-2">{p.eta || '—'}</td>
                    <td className="py-2 px-2">
                      <span className={p.survivalProbability < 50 ? 'text-emergency font-bold' : ''}>{p.survivalProbability}%</span>
                    </td>
                  </tr>
                ))}
                {allocated.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Process a batch to see AI allocations</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Hospital Network */}
      <div>
        <h2 className="font-semibold text-sm mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Live Hospital Network</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitals.sort((a, b) => a.distance - b.distance).map(h => (
            <div key={h.id} className={`bg-card border rounded-2xl p-5 card-hover ${h.status === 'red' ? 'border-emergency/30' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm">{h.name}</h3>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {h.location} • {h.distance}km</p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${h.status === 'red' ? 'text-emergency' : h.status === 'yellow' ? 'text-warning' : 'text-success'}`}>{h.loadPercent}%</span>
                  <p className="text-[10px] text-muted-foreground">Load</p>
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5 mb-3">
                <div className={`h-2.5 rounded-full transition-all ${h.status === 'red' ? 'bg-emergency' : h.status === 'yellow' ? 'bg-warning' : 'bg-success'}`} style={{ width: `${h.loadPercent}%` }} />
              </div>
              <div className="flex gap-4 text-[10px] text-muted-foreground">
                <span>ICU: <strong className="text-foreground">{h.icuAvailable}</strong></span>
                <span>Gen: <strong className="text-foreground">{h.generalAvailable}</strong></span>
                <span>🫁 {h.oxygen}%</span>
                <span>🫀 {h.ventilators}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-4">Hospital Load</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hospitalLoad}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="load" fill="hsl(var(--emergency))" radius={[4, 4, 0, 0]} name="Load %" />
              <Bar dataKey="available" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Avail %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-4">Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={priorityDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {priorityDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-4">Patient Timeline</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))' }} />
              <Line type="monotone" dataKey="patients" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resource Transfers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-2xl p-5">
          <h2 className="font-semibold flex items-center gap-2 mb-4 text-sm"><Truck className="w-5 h-5 text-info" /> Resource Transfers</h2>
          {resourceTransfers.length > 0 ? (
            <div className="overflow-auto max-h-48 scrollbar-thin">
              <table className="w-full text-xs">
                <thead><tr className="border-b"><th className="text-left py-2 font-semibold text-muted-foreground">Resource</th><th className="text-left py-2 font-semibold text-muted-foreground">Route</th><th className="text-left py-2 font-semibold text-muted-foreground">Status</th><th className="text-left py-2 font-semibold text-muted-foreground">ETA</th></tr></thead>
                <tbody>
                  {resourceTransfers.map(t => (
                    <tr key={t.id} className="border-b last:border-0">
                      <td className="py-2">{t.resource} (×{t.quantity})</td>
                      <td className="py-2 text-muted-foreground text-[10px]">{t.from} → {t.to}</td>
                      <td className="py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${t.status === 'Delivered' ? 'bg-success/10 text-success' : t.status === 'In Transit' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-2">{t.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 text-sm">No active transfers</p>
          )}

          {/* Custom transfer form */}
          <div className="mt-4 pt-4 border-t space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Request Transfer</p>
            <div className="grid grid-cols-3 gap-2">
              <select value={transferFrom} onChange={e => setTransferFrom(e.target.value)} className="border rounded-lg px-2 py-1.5 text-xs bg-background">
                <option value="">From...</option>
                {hospitals.map(h => <option key={h.id} value={h.id}>{h.name.split(' ')[0]}</option>)}
              </select>
              <select value={transferTo} onChange={e => setTransferTo(e.target.value)} className="border rounded-lg px-2 py-1.5 text-xs bg-background">
                <option value="">To...</option>
                {hospitals.map(h => <option key={h.id} value={h.id}>{h.name.split(' ')[0]}</option>)}
              </select>
              <select value={transferResource} onChange={e => setTransferResource(e.target.value)} className="border rounded-lg px-2 py-1.5 text-xs bg-background">
                <option>Oxygen Cylinders</option>
                <option>Ventilators</option>
                <option>Ambulances</option>
                <option>Blood Bags</option>
              </select>
            </div>
            <button onClick={handleCustomTransfer} disabled={!transferFrom || !transferTo} className="w-full py-2 bg-primary text-primary-foreground rounded-xl text-xs font-medium disabled:opacity-40 hover:opacity-90 transition-opacity">
              Send Transfer Request
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border rounded-2xl p-5">
          <h2 className="font-semibold mb-4 text-sm">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '+ 5 Patients', desc: 'Small intake', count: 5 },
              { label: '+ 10 Patients', desc: 'Standard surge', count: 10 },
              { label: '+ 25 Patients', desc: 'Medium surge', count: 25 },
              { label: '+ 50 Patients', desc: 'Major disaster', count: 50 },
              { label: '+ 100 Patients', desc: 'Catastrophic event', count: 100 },
              { label: '+ 200 Patients', desc: 'Maximum stress test', count: 200 },
            ].map(a => (
              <button key={a.count} onClick={() => processBatch(a.count)} className="p-3 border rounded-xl text-left hover:bg-secondary transition-colors card-hover">
                <span className="font-medium text-sm">{a.label}</span>
                <p className="text-[10px] text-muted-foreground">{a.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
