import { useState } from 'react';
import { useEmergency } from '@/context/EmergencyContext';
import { Users, Search, Eye, X, MapPin, Heart, Clock, ChevronRight } from 'lucide-react';

export default function PatientsPage() {
  const { patients, hospitals, allocatePatientManually } = useEmergency();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [reassignHospital, setReassignHospital] = useState('');

  const filtered = patients
    .filter(p => statusFilter === 'All' || p.status === statusFilter)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.condition.toLowerCase().includes(search.toLowerCase()));

  const getHospitalName = (id?: string) => hospitals.find(h => h.id === id)?.name || '—';
  const selectedP = patients.find(p => p.id === selectedPatient);

  const statusCounts = {
    All: patients.length,
    Pending: patients.filter(p => p.status === 'Pending').length,
    Assigned: patients.filter(p => p.status === 'Assigned').length,
    Transferred: patients.filter(p => p.status === 'Transferred').length,
    Admitted: patients.filter(p => p.status === 'Admitted').length,
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'Admitted': return 'bg-success/10 text-success';
      case 'Transferred': return 'bg-info/10 text-info';
      case 'Assigned': return 'bg-warning/10 text-warning';
      case 'Pending': return 'bg-emergency/10 text-emergency';
      default: return 'bg-secondary text-foreground';
    }
  };

  const handleReassign = () => {
    if (selectedPatient && reassignHospital) {
      allocatePatientManually(selectedPatient, reassignHospital);
      setReassignHospital('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl primary-gradient flex items-center justify-center">
            <Users className="w-4 h-4 text-primary-foreground" />
          </div>
          Patients
        </h1>
        <p className="text-muted-foreground text-sm">Track and manage all patients across the hospital network</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-2xl border p-4 text-left transition-all card-hover ${
              statusFilter === status ? 'bg-primary/5 border-primary/30 border-2' : 'bg-card'
            }`}
          >
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs text-muted-foreground">{status}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or condition..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className={`bg-card border rounded-2xl overflow-hidden flex-1 transition-all ${selectedPatient ? 'lg:w-2/3' : ''}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Patient</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Score</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Priority</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Hospital</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className={`border-b last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer ${selectedPatient === p.id ? 'bg-primary/5' : ''}`} onClick={() => setSelectedPatient(p.id)}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground">{p.age}{p.gender} • {p.arrivalTime}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{p.condition}</td>
                  <td className="px-4 py-3">
                    <span className={`font-mono font-bold text-sm ${p.severityScore >= 80 ? 'text-emergency' : p.severityScore >= 60 ? 'text-warning' : 'text-success'}`}>{p.severityScore}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${p.priority === 'Critical' ? 'bg-emergency/10 text-emergency' : p.priority === 'High' ? 'bg-primary/10 text-primary' : p.priority === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                      {p.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{getHospitalName(p.assignedHospital)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-lg ${statusColor(p.status)}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No patients found.</p>}
        </div>

        {/* Detail panel */}
        {selectedP && (
          <div className="hidden lg:block w-80 bg-card border rounded-2xl p-5 space-y-5 animate-slide-in shrink-0 self-start sticky top-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Patient Details</h3>
              <button onClick={() => setSelectedPatient(null)} className="p-1 rounded-lg hover:bg-secondary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pb-4 border-b">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <p className="font-bold text-lg">{selectedP.name}</p>
              <p className="text-sm text-muted-foreground">{selectedP.age}{selectedP.gender} • {selectedP.condition}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> Severity</span>
                <span className="font-bold">{selectedP.severityScore}/100</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className={`h-2 rounded-full ${selectedP.severityScore > 80 ? 'bg-emergency' : selectedP.severityScore > 60 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${selectedP.severityScore}%` }} />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> Survival</span>
                <span className="font-bold">{selectedP.survivalProbability}%</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Arrived</span>
                <span className="font-medium">{selectedP.arrivalTime}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Hospital</span>
                <span className="font-medium text-xs">{getHospitalName(selectedP.assignedHospital)}</span>
              </div>
            </div>

            {/* Reassign */}
            <div className="pt-3 border-t space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">Reassign Hospital</h4>
              <select value={reassignHospital} onChange={e => setReassignHospital(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select hospital...</option>
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name} ({h.loadPercent}%)</option>
                ))}
              </select>
              <button onClick={handleReassign} disabled={!reassignHospital} className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity">
                Reassign
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
