import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Hospital, Patient, ResourceTransfer, Alert, EmergencyEvent, hospitals as defaultHospitals, initialPatients, initialAlerts, generatePatientName, generateSeverity, allocatePatient, generateHospitalContext } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

interface EmergencyState {
  isEmergencyActive: boolean;
  emergencyType: string;
  activatedAt: string | null;
  hospitals: Hospital[];
  patients: Patient[];
  alerts: Alert[];
  resourceTransfers: ResourceTransfer[];
  emergencyEvents: EmergencyEvent[];
  surgeScore: number;
  totalIntake: number;
  totalDistributed: number;
  networkBeds: number;
  thresholds: { patientSpike: number; icuOccupancy: number; criticalCases: number };
}

interface EmergencyContextType extends EmergencyState {
  activateEmergency: (type: string) => void;
  deactivateEmergency: () => void;
  processBatch: (count: number) => void;
  allocatePatientManually: (patientId: string, hospitalId: string) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => void;
  dismissAlert: (id: string) => void;
  requestResourceTransfer: (transfer: Omit<ResourceTransfer, 'id' | 'status'>) => void;
  updateThresholds: (t: Partial<EmergencyState['thresholds']>) => void;
  addHospital: (h: Hospital) => void;
  removeHospital: (id: string) => void;
}

const EmergencyContext = createContext<EmergencyContextType | null>(null);

export function useEmergency() {
  const ctx = useContext(EmergencyContext);
  if (!ctx) throw new Error('useEmergency must be used within EmergencyProvider');
  return ctx;
}

export function EmergencyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EmergencyState>({
    isEmergencyActive: false,
    emergencyType: '',
    activatedAt: null,
    hospitals: defaultHospitals,
    patients: initialPatients,
    alerts: initialAlerts,
    resourceTransfers: [],
    emergencyEvents: [],
    surgeScore: 45,
    totalIntake: 10,
    totalDistributed: 7,
    networkBeds: 341,
    thresholds: { patientSpike: 20, icuOccupancy: 85, criticalCases: 10 },
  });

  const counterRef = useRef(100);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.username) {
      const generated = generateHospitalContext(user.username);
      setState(s => ({
        ...s,
        ...generated
      }));
    }
  }, [user?.username]);

  const activateEmergency = useCallback((type: string) => {
    const now = new Date();
    setState(s => ({
      ...s,
      isEmergencyActive: true,
      emergencyType: type,
      activatedAt: now.toLocaleTimeString(),
      surgeScore: 74.53,
      emergencyEvents: [...s.emergencyEvents, {
        id: `ee-${Date.now()}`,
        timestamp: now.toLocaleString(),
        cause: type,
        type: 'MASS_CASUALTY',
        patientsInvolved: s.patients.length,
        status: 'Active',
      }],
      alerts: [{
        id: `a-${Date.now()}`,
        type: 'critical',
        title: 'SPECIAL EMERGENCY ACTIVATED',
        message: `Mass casualty event: ${type}. All hospitals on high alert.`,
        timestamp: now.toLocaleTimeString(),
        read: false,
      }, ...s.alerts],
    }));
  }, []);

  const deactivateEmergency = useCallback(() => {
    setState(s => ({
      ...s,
      isEmergencyActive: false,
      emergencyType: '',
      activatedAt: null,
      surgeScore: 45,
      emergencyEvents: s.emergencyEvents.map(e => e.status === 'Active' ? { ...e, status: 'Resolved' as const } : e),
    }));
  }, []);

  const processBatch = useCallback((count: number) => {
    setState(s => {
      const newPatients: Patient[] = [];
      const updatedHospitals = [...s.hospitals];

      for (let i = 0; i < count; i++) {
        const sev = generateSeverity();
        const id = `p-${counterRef.current++}`;
        const patient: Patient = {
          id,
          name: generatePatientName(),
          age: Math.floor(Math.random() * 60 + 18),
          gender: Math.random() > 0.5 ? 'M' : 'F',
          condition: sev.condition,
          severityScore: sev.score,
          survivalProbability: sev.survival,
          priority: sev.priority,
          status: 'Pending',
          arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const allocation = allocatePatient(patient, updatedHospitals);
        patient.assignedHospital = allocation.hospitalId;
        patient.status = 'Assigned';
        patient.eta = allocation.eta;

        const hIdx = updatedHospitals.findIndex(h => h.id === allocation.hospitalId);
        if (hIdx >= 0) {
          if (patient.priority === 'Critical' && updatedHospitals[hIdx].icuAvailable > 0) {
            updatedHospitals[hIdx] = { ...updatedHospitals[hIdx], icuAvailable: updatedHospitals[hIdx].icuAvailable - 1 };
          } else if (updatedHospitals[hIdx].generalAvailable > 0) {
            updatedHospitals[hIdx] = { ...updatedHospitals[hIdx], generalAvailable: updatedHospitals[hIdx].generalAvailable - 1 };
          }
          const h = updatedHospitals[hIdx];
          const usedICU = h.icuTotal - h.icuAvailable;
          const usedGen = h.generalTotal - h.generalAvailable;
          const newLoad = Math.round(((usedICU + usedGen) / (h.icuTotal + h.generalTotal)) * 100);
          updatedHospitals[hIdx] = {
            ...updatedHospitals[hIdx],
            loadPercent: newLoad,
            status: newLoad > 85 ? 'red' : newLoad > 65 ? 'yellow' : 'green',
          };
        }

        newPatients.push(patient);
      }

      const allPatients = [...s.patients, ...newPatients];
      const distributed = allPatients.filter(p => p.status !== 'Pending').length;
      const totalBeds = updatedHospitals.reduce((sum, h) => sum + h.icuAvailable + h.generalAvailable, 0);

      return {
        ...s,
        patients: allPatients,
        hospitals: updatedHospitals,
        totalIntake: allPatients.length,
        totalDistributed: distributed,
        networkBeds: totalBeds,
        surgeScore: Math.min(100, s.surgeScore + count * 0.5),
      };
    });
  }, []);

  const allocatePatientManually = useCallback((patientId: string, hospitalId: string) => {
    setState(s => ({
      ...s,
      patients: s.patients.map(p =>
        p.id === patientId ? { ...p, assignedHospital: hospitalId, status: 'Assigned' as const } : p
      ),
    }));
  }, []);

  const addAlert = useCallback((alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => {
    setState(s => ({
      ...s,
      alerts: [{ ...alert, id: `a-${Date.now()}`, timestamp: new Date().toLocaleTimeString(), read: false }, ...s.alerts],
    }));
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setState(s => ({ ...s, alerts: s.alerts.map(a => a.id === id ? { ...a, read: true } : a) }));
  }, []);

  const requestResourceTransfer = useCallback((transfer: Omit<ResourceTransfer, 'id' | 'status'>) => {
    setState(s => ({
      ...s,
      resourceTransfers: [...s.resourceTransfers, { ...transfer, id: `rt-${Date.now()}`, status: 'Requested' as const }],
    }));
  }, []);

  const updateThresholds = useCallback((t: Partial<EmergencyState['thresholds']>) => {
    setState(s => ({ ...s, thresholds: { ...s.thresholds, ...t } }));
  }, []);

  const addHospital = useCallback((h: Hospital) => {
    setState(s => ({ ...s, hospitals: [...s.hospitals, h] }));
  }, []);

  const removeHospital = useCallback((id: string) => {
    setState(s => ({ ...s, hospitals: s.hospitals.filter(h => h.id !== id) }));
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setState(s => {
        if (!s.isEmergencyActive) return s;
        // Simulate resource transfers progressing
        const updatedTransfers = s.resourceTransfers.map(t => {
          if (t.status === 'Requested') return { ...t, status: 'In Transit' as const };
          if (t.status === 'In Transit' && Math.random() > 0.7) return { ...t, status: 'Delivered' as const };
          return t;
        });
        // Simulate patients progressing
        const updatedPatients = s.patients.map(p => {
          if (p.status === 'Assigned' && Math.random() > 0.8) return { ...p, status: 'Transferred' as const };
          if (p.status === 'Transferred' && Math.random() > 0.7) return { ...p, status: 'Admitted' as const };
          return p;
        });
        return { ...s, resourceTransfers: updatedTransfers, patients: updatedPatients };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <EmergencyContext.Provider value={{
      ...state, activateEmergency, deactivateEmergency, processBatch,
      allocatePatientManually, addAlert, dismissAlert, requestResourceTransfer,
      updateThresholds, addHospital, removeHospital,
    }}>
      {children}
    </EmergencyContext.Provider>
  );
}
