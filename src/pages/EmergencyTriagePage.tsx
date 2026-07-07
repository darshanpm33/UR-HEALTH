import { useState } from 'react';
import { useEmergency } from '@/context/EmergencyContext';
import { Zap, ArrowUpDown, AlertTriangle, Heart, Clock, ChevronDown, User } from 'lucide-react';

export default function EmergencyTriagePage() {
  const { patients, hospitals, allocatePatientManually, addAlert } = useEmergency();
  const [sortBy, setSortBy] = useState<'severity' | 'arrival' | 'survival'>('severity');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Record<string, string>>({});

  const filtered = patients
    .filter(p => filterPriority === 'All' || p.priority === filterPriority)
    .sort((a, b) => {
      if (sortBy === 'severity') return b.severityScore - a.severityScore;
      if (sortBy === 'survival') return a.survivalProbability - b.survivalProbability;
      return 0;
    });

  const counts = {
    Critical: patients.filter(p => p.priority === 'Critical').length,
    High: patients.filter(p => p.priority === 'High').length,
    Medium: patients.filter(p => p.priority === 'Medium').length,
    Low: patients.filter(p => p.priority === 'Low').length,
  };

  const priorityConfig: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    Critical: { bg: 'bg-emergency/10', text: 'text-emergency', border: 'border-emergency/20', icon: '🔴' },
    High: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', icon: '🟠' },
    Medium: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', icon: '🟡' },
    Low: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', icon: '🟢' },
  };

  const handleAssign = (patientId: string) => {
    const hospitalId = selectedHospital[patientId];
    if (!hospitalId) return;
    allocatePatientManually(patientId, hospitalId);
    addAlert({
      type: 'info',
      title: 'Patient Reassigned',
      message: `Patient manually assigned to ${hospitals.find(h => h.id === hospitalId)?.name}`,
    });
    setExpandedId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl emergency-gradient flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          Emergency Triage
        </h1>
        <p className="text-muted-foreground text-sm">Real-time AI-powered patient prioritization</p>
      </div>

      {/* Priority summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(counts).map(([priority, count]) => {
          const cfg = priorityConfig[priority];
          return (
            <button
              key={priority}
              onClick={() => setFilterPriority(filterPriority === priority ? 'All' : priority)}
              className={`rounded-2xl border p-4 text-left transition-all card-hover ${
                filterPriority === priority ? `${cfg.bg} ${cfg.border} border-2` : 'bg-card'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{cfg.icon}</span>
                <span className={`text-2xl font-bold ${cfg.text}`}>{count}</span>
              </div>
              <p className="text-sm font-medium">{priority}</p>
              <p className="text-[10px] text-muted-foreground">
                {priority === 'Critical' ? 'Immediate care' : priority === 'High' ? 'Urgent care' : priority === 'Medium' ? 'Standard care' : 'Non-urgent'}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filter & sort controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {['All', 'Critical', 'High', 'Medium', 'Low'].map(p => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              filterPriority === p ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {p} {p !== 'All' && <span className="ml-1 opacity-70">({counts[p as keyof typeof counts] || 0})</span>}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          {(['severity', 'survival', 'arrival'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                sortBy === s ? 'bg-primary text-primary-foreground' : 'border hover:bg-secondary'
              }`}
            >
              <ArrowUpDown className="w-3 h-3" />
              {s === 'severity' ? 'Severity' : s === 'survival' ? 'Survival' : 'Arrival'}
            </button>
          ))}
        </div>
      </div>

      {/* Patient list */}
      <div className="space-y-2">
        {filtered.map((p, i) => {
          const cfg = priorityConfig[p.priority] || priorityConfig.Low;
          const isExpanded = expandedId === p.id;
          const assignedHospital = hospitals.find(h => h.id === p.assignedHospital);

          return (
            <div key={p.id} className={`bg-card border rounded-2xl overflow-hidden transition-all card-hover ${isExpanded ? 'shadow-lg' : ''}`} style={{ animationDelay: `${i * 30}ms` }}>
              <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : p.id)}>
                {/* Severity circle */}
                <div className={`w-12 h-12 rounded-2xl ${cfg.bg} flex flex-col items-center justify-center`}>
                  <span className={`text-lg font-bold ${cfg.text}`}>{p.severityScore}</span>
                </div>

                {/* Patient info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{p.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border} font-medium`}>{p.priority}</span>
                    {p.status === 'Pending' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emergency/10 text-emergency font-medium animate-pulse">Awaiting Triage</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.condition} • {p.age}{p.gender} • Arrived {p.arrivalTime}</p>
                </div>

                {/* Survival indicator */}
                <div className="text-center px-3">
                  <div className="flex items-center gap-1">
                    <Heart className={`w-3.5 h-3.5 ${p.survivalProbability < 50 ? 'text-emergency' : p.survivalProbability < 75 ? 'text-warning' : 'text-success'}`} />
                    <span className="text-sm font-bold">{p.survivalProbability}%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Survival</p>
                </div>

                {/* Status & hospital */}
                <div className="text-right min-w-[100px]">
                  <span className={`text-xs px-2.5 py-1 rounded-lg ${
                    p.status === 'Admitted' ? 'bg-success/10 text-success' : p.status === 'Transferred' ? 'bg-info/10 text-info' : p.status === 'Assigned' ? 'bg-warning/10 text-warning' : 'bg-emergency/10 text-emergency'
                  }`}>{p.status}</span>
                  {assignedHospital && <p className="text-[10px] text-muted-foreground mt-1">{assignedHospital.name}</p>}
                </div>

                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>

              {/* Expanded panel with manual assignment */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t bg-secondary/20 animate-fade-in-up">
                  <div className="pt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase">Patient Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">ID:</span> {p.id}</p>
                        <p><span className="text-muted-foreground">Condition:</span> {p.condition}</p>
                        <p><span className="text-muted-foreground">ETA:</span> {p.eta || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase">AI Assessment</h4>
                      <div className="space-y-1.5">
                        <div>
                          <div className="flex justify-between text-xs mb-0.5"><span>Severity</span><span>{p.severityScore}/100</span></div>
                          <div className="w-full bg-secondary rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${p.severityScore > 80 ? 'bg-emergency' : p.severityScore > 60 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${p.severityScore}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-0.5"><span>Survival</span><span>{p.survivalProbability}%</span></div>
                          <div className="w-full bg-secondary rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${p.survivalProbability > 75 ? 'bg-success' : p.survivalProbability > 50 ? 'bg-warning' : 'bg-emergency'}`} style={{ width: `${p.survivalProbability}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase">Manual Assignment</h4>
                      <select
                        value={selectedHospital[p.id] || ''}
                        onChange={e => setSelectedHospital(prev => ({ ...prev, [p.id]: e.target.value }))}
                        className="w-full border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select hospital...</option>
                        {hospitals.map(h => (
                          <option key={h.id} value={h.id}>{h.name} (Load: {h.loadPercent}%)</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAssign(p.id)}
                        disabled={!selectedHospital[p.id]}
                        className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
                      >
                        Assign to Hospital
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <User className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No patients match the current filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
