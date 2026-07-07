import { useState } from 'react';
import { useEmergency } from '@/context/EmergencyContext';
import { BedDouble, AlertTriangle, Plus, Minus, Activity, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ICUBedsPage() {
  const { hospitals, patients, addAlert } = useEmergency();
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);

  const totalICU = hospitals.reduce((s, h) => s + h.icuTotal, 0);
  const availICU = hospitals.reduce((s, h) => s + h.icuAvailable, 0);
  const totalGen = hospitals.reduce((s, h) => s + h.generalTotal, 0);
  const availGen = hospitals.reduce((s, h) => s + h.generalAvailable, 0);
  const icuOccPct = Math.round(((totalICU - availICU) / totalICU) * 100);
  const genOccPct = Math.round(((totalGen - availGen) / totalGen) * 100);

  const occupancyData = hospitals.map(h => ({
    name: h.name.split(' ')[0],
    icu: Math.round(((h.icuTotal - h.icuAvailable) / h.icuTotal) * 100),
    general: Math.round(((h.generalTotal - h.generalAvailable) / h.generalTotal) * 100),
  }));

  const patientsInHospital = (hId: string) => patients.filter(p => p.assignedHospital === hId);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl info-gradient flex items-center justify-center">
            <BedDouble className="w-4 h-4 text-primary-foreground" />
          </div>
          ICU & Beds Management
        </h1>
        <p className="text-muted-foreground text-sm">Real-time bed availability and allocation across the network</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-2xl p-5 card-hover">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground font-medium">ICU Beds</p>
            <div className="w-8 h-8 rounded-xl bg-emergency/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emergency" />
            </div>
          </div>
          <p className="text-3xl font-bold">{availICU}<span className="text-lg text-muted-foreground font-normal">/{totalICU}</span></p>
          <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
            <div className={`h-1.5 rounded-full ${icuOccPct > 85 ? 'bg-emergency' : icuOccPct > 60 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${icuOccPct}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{icuOccPct}% occupied</p>
        </div>
        <div className="bg-card border rounded-2xl p-5 card-hover">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground font-medium">General Beds</p>
            <div className="w-8 h-8 rounded-xl bg-info/10 flex items-center justify-center">
              <BedDouble className="w-4 h-4 text-info" />
            </div>
          </div>
          <p className="text-3xl font-bold">{availGen}<span className="text-lg text-muted-foreground font-normal">/{totalGen}</span></p>
          <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
            <div className={`h-1.5 rounded-full ${genOccPct > 85 ? 'bg-emergency' : genOccPct > 60 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${genOccPct}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{genOccPct}% occupied</p>
        </div>
        <div className="bg-card border rounded-2xl p-5 card-hover">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground font-medium">Critical Patients</p>
            <AlertTriangle className="w-5 h-5 text-emergency" />
          </div>
          <p className="text-3xl font-bold text-emergency">{patients.filter(p => p.priority === 'Critical').length}</p>
          <p className="text-xs text-muted-foreground mt-1">In ICU or waiting</p>
        </div>
        <div className="bg-card border rounded-2xl p-5 card-hover">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground font-medium">Network Status</p>
          </div>
          <p className={`text-3xl font-bold ${icuOccPct > 85 ? 'text-emergency' : icuOccPct > 60 ? 'text-warning' : 'text-success'}`}>
            {icuOccPct > 85 ? 'CRITICAL' : icuOccPct > 60 ? 'MODERATE' : 'NORMAL'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{hospitals.filter(h => h.status === 'red').length} hospitals overloaded</p>
        </div>
      </div>

      {/* Occupancy chart */}
      <div className="bg-card border rounded-2xl p-5">
        <h2 className="font-semibold text-sm mb-4">Occupancy by Hospital</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={occupancyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))' }} />
            <Bar dataKey="icu" fill="hsl(var(--emergency))" radius={[4, 4, 0, 0]} name="ICU %" />
            <Bar dataKey="general" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} name="General %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Hospital cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hospitals.map(h => {
          const icuOcc = Math.round(((h.icuTotal - h.icuAvailable) / h.icuTotal) * 100);
          const genOcc = Math.round(((h.generalTotal - h.generalAvailable) / h.generalTotal) * 100);
          const hPatients = patientsInHospital(h.id);
          const isSelected = selectedHospital === h.id;

          return (
            <div key={h.id} className={`bg-card border rounded-2xl p-5 card-hover cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''} ${h.status === 'red' ? 'border-emergency/30' : ''}`} onClick={() => setSelectedHospital(isSelected ? null : h.id)}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-sm">{h.name}</h3>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {h.location} • {h.distance}km</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${h.status === 'red' ? 'bg-emergency animate-pulse' : h.status === 'yellow' ? 'bg-warning' : 'bg-success'}`} />
              </div>

              {/* ICU bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">ICU ({h.icuAvailable}/{h.icuTotal})</span>
                  <span className={icuOcc > 85 ? 'text-emergency font-bold' : ''}>{icuOcc}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all ${icuOcc > 85 ? 'bg-emergency' : icuOcc > 65 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${icuOcc}%` }} />
                </div>
              </div>

              {/* General bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">General ({h.generalAvailable}/{h.generalTotal})</span>
                  <span>{genOcc}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all ${genOcc > 85 ? 'bg-emergency' : genOcc > 65 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${genOcc}%` }} />
                </div>
              </div>

              {/* Resources */}
              <div className="flex gap-3 text-[10px] text-muted-foreground pt-2 border-t">
                <span>🫁 O₂: {h.oxygen}%</span>
                <span>🫀 Vent: {h.ventilators}</span>
                <span>🚑 Amb: {h.ambulances}</span>
                <span>👥 Staff: {h.staff}</span>
              </div>

              {/* Expanded patients list */}
              {isSelected && hPatients.length > 0 && (
                <div className="mt-3 pt-3 border-t space-y-1 animate-fade-in-up">
                  <p className="text-xs font-semibold text-muted-foreground">{hPatients.length} patients assigned</p>
                  {hPatients.slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center justify-between text-xs py-1">
                      <span>{p.name}</span>
                      <span className={`px-1.5 py-0.5 rounded ${p.priority === 'Critical' ? 'bg-emergency/10 text-emergency' : 'bg-primary/10 text-primary'}`}>{p.priority}</span>
                    </div>
                  ))}
                  {hPatients.length > 5 && <p className="text-[10px] text-muted-foreground">+{hPatients.length - 5} more</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
