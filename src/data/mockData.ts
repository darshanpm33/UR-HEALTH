export interface Hospital {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  distance: number;
  icuTotal: number;
  icuAvailable: number;
  generalTotal: number;
  generalAvailable: number;
  loadPercent: number;
  oxygen: number;
  ventilators: number;
  ambulances: number;
  staff: number;
  status: 'green' | 'yellow' | 'red';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  severityScore: number;
  survivalProbability: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  assignedHospital?: string;
  status: 'Pending' | 'Assigned' | 'Transferred' | 'Admitted' | 'Triaged';
  arrivalTime: string;
  eta?: string;
}

export interface ResourceTransfer {
  id: string;
  resource: string;
  quantity: number;
  from: string;
  to: string;
  route: string;
  status: 'Requested' | 'In Transit' | 'Delivered';
  eta: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface EmergencyEvent {
  id: string;
  timestamp: string;
  cause: string;
  type: string;
  patientsInvolved: number;
  status: 'Active' | 'Resolved';
}

export const hospitals: Hospital[] = [
  { id: 'h1', name: 'City General Hospital', location: 'Downtown District', lat: 40.7128, lng: -74.006, distance: 2.3, icuTotal: 160, icuAvailable: 64, generalTotal: 800, generalAvailable: 360, loadPercent: 68, oxygen: 85, ventilators: 12, ambulances: 6, staff: 120, status: 'green' },
  { id: 'h2', name: 'St. Mary Medical Center', location: 'North Heights', lat: 40.7282, lng: -73.9942, distance: 5.7, icuTotal: 120, icuAvailable: 24, generalTotal: 640, generalAvailable: 176, loadPercent: 42, oxygen: 60, ventilators: 8, ambulances: 4, staff: 85, status: 'green' },
  { id: 'h3', name: 'Memorial Healthcare', location: 'East Side', lat: 40.7489, lng: -73.9680, distance: 8.1, icuTotal: 200, icuAvailable: 16, generalTotal: 960, generalAvailable: 120, loadPercent: 87, oxygen: 40, ventilators: 15, ambulances: 8, staff: 150, status: 'red' },
  { id: 'h4', name: 'Riverside Medical', location: 'West Bank', lat: 40.7614, lng: -73.9776, distance: 4.5, icuTotal: 144, icuAvailable: 48, generalTotal: 720, generalAvailable: 280, loadPercent: 55, oxygen: 72, ventilators: 10, ambulances: 5, staff: 95, status: 'green' },
  { id: 'h5', name: 'Unity Health Center', location: 'South Quarter', lat: 40.6892, lng: -74.0445, distance: 6.2, icuTotal: 96, icuAvailable: 8, generalTotal: 480, generalAvailable: 64, loadPercent: 92, oxygen: 30, ventilators: 6, ambulances: 3, staff: 70, status: 'red' },
  { id: 'h6', name: 'Parkview Hospital', location: 'Central Park Area', lat: 40.7829, lng: -73.9654, distance: 3.8, icuTotal: 176, icuAvailable: 80, generalTotal: 880, generalAvailable: 400, loadPercent: 38, oxygen: 90, ventilators: 14, ambulances: 7, staff: 130, status: 'green' },
  { id: 'h7', name: 'Mercy Medical Clinic', location: 'Oakwood', lat: 40.8012, lng: -73.9510, distance: 7.2, icuTotal: 80, icuAvailable: 32, generalTotal: 400, generalAvailable: 160, loadPercent: 53, oxygen: 75, ventilators: 5, ambulances: 2, staff: 60, status: 'yellow' },
  { id: 'h8', name: 'Lakeside General', location: 'Lake District', lat: 40.6512, lng: -74.0110, distance: 9.1, icuTotal: 240, icuAvailable: 96, generalTotal: 1200, generalAvailable: 320, loadPercent: 71, oxygen: 88, ventilators: 18, ambulances: 10, staff: 200, status: 'yellow' },
  { id: 'h9', name: 'Hope Valley Healthcare', location: 'Valley Road', lat: 40.7100, lng: -73.9100, distance: 11.0, icuTotal: 64, icuAvailable: 8, generalTotal: 320, generalAvailable: 40, loadPercent: 88, oxygen: 45, ventilators: 4, ambulances: 2, staff: 40, status: 'red' },
  { id: 'h10', name: 'Pioneer Regional', location: 'Outer Belt', lat: 40.6120, lng: -73.8150, distance: 15.4, icuTotal: 112, icuAvailable: 40, generalTotal: 560, generalAvailable: 240, loadPercent: 58, oxygen: 80, ventilators: 7, ambulances: 4, staff: 85, status: 'yellow' },
  { id: 'h11', name: 'Evergreen Medical', location: 'Evergreen Hills', lat: 40.8520, lng: -73.8500, distance: 12.2, icuTotal: 160, icuAvailable: 56, generalTotal: 960, generalAvailable: 440, loadPercent: 55, oxygen: 92, ventilators: 11, ambulances: 5, staff: 140, status: 'green' },
  { id: 'h12', name: 'Summit Care Centre', location: 'Summit Peak', lat: 40.9120, lng: -73.9000, distance: 18.1, icuTotal: 96, icuAvailable: 0, generalTotal: 440, generalAvailable: 16, loadPercent: 97, oxygen: 20, ventilators: 6, ambulances: 3, staff: 65, status: 'red' },
  { id: 'h13', name: 'Horizon West Hospital', location: 'Western Frontier', lat: 40.6800, lng: -74.1500, distance: 14.5, icuTotal: 128, icuAvailable: 64, generalTotal: 720, generalAvailable: 320, loadPercent: 54, oxygen: 82, ventilators: 9, ambulances: 5, staff: 100, status: 'green' },
  { id: 'h14', name: 'Crossroads Emergency', location: 'Midtown Junction', lat: 40.7580, lng: -73.9855, distance: 1.5, icuTotal: 224, icuAvailable: 24, generalTotal: 1120, generalAvailable: 120, loadPercent: 89, oxygen: 50, ventilators: 16, ambulances: 9, staff: 180, status: 'red' },
  { id: 'h15', name: 'Oakridge Specialty', location: 'Oakridge Plaza', lat: 40.7300, lng: -73.9200, distance: 6.8, icuTotal: 120, icuAvailable: 48, generalTotal: 600, generalAvailable: 200, loadPercent: 65, oxygen: 78, ventilators: 8, ambulances: 4, staff: 90, status: 'yellow' },
];

export const initialPatients: Patient[] = [
  { id: 'p1', name: 'John Martinez', age: 45, gender: 'M', condition: 'Severe Trauma', severityScore: 92, survivalProbability: 67, priority: 'Critical', assignedHospital: 'h1', status: 'Admitted', arrivalTime: '08:15 AM' },
  { id: 'p2', name: 'Sarah Chen', age: 32, gender: 'F', condition: 'Respiratory Distress', severityScore: 78, survivalProbability: 82, priority: 'High', assignedHospital: 'h4', status: 'Transferred', arrivalTime: '08:22 AM' },
  { id: 'p3', name: 'Michael Brown', age: 58, gender: 'M', condition: 'Cardiac Arrest', severityScore: 95, survivalProbability: 45, priority: 'Critical', assignedHospital: 'h1', status: 'Admitted', arrivalTime: '08:30 AM' },
  { id: 'p4', name: 'Emily Davis', age: 28, gender: 'F', condition: 'Fractures', severityScore: 45, survivalProbability: 95, priority: 'Medium', assignedHospital: 'h2', status: 'Assigned', arrivalTime: '08:35 AM' },
  { id: 'p5', name: 'Robert Wilson', age: 67, gender: 'M', condition: 'Internal Bleeding', severityScore: 88, survivalProbability: 58, priority: 'Critical', status: 'Pending', arrivalTime: '08:40 AM' },
  { id: 'p6', name: 'Lisa Anderson', age: 41, gender: 'F', condition: 'Burns', severityScore: 72, survivalProbability: 78, priority: 'High', assignedHospital: 'h6', status: 'Transferred', arrivalTime: '08:42 AM' },
  { id: 'p7', name: 'James Taylor', age: 55, gender: 'M', condition: 'Head Injury', severityScore: 85, survivalProbability: 62, priority: 'Critical', assignedHospital: 'h1', status: 'Admitted', arrivalTime: '08:45 AM' },
  { id: 'p8', name: 'Maria Garcia', age: 36, gender: 'F', condition: 'Smoke Inhalation', severityScore: 60, survivalProbability: 88, priority: 'Medium', status: 'Pending', arrivalTime: '08:48 AM' },
  { id: 'p9', name: 'David Lee', age: 50, gender: 'M', condition: 'Crush Injury', severityScore: 80, survivalProbability: 70, priority: 'High', assignedHospital: 'h4', status: 'Assigned', arrivalTime: '08:50 AM' },
  { id: 'p10', name: 'Anna White', age: 22, gender: 'F', condition: 'Lacerations', severityScore: 35, survivalProbability: 97, priority: 'Low', assignedHospital: 'h2', status: 'Admitted', arrivalTime: '08:55 AM' },
];

export const initialAlerts: Alert[] = [
  { id: 'a1', type: 'critical', title: 'O-Negative Blood Critically Low', message: 'O-negative blood critically low (4 bags). Donor appeal may be required.', timestamp: '08:30 AM', read: false },
  { id: 'a2', type: 'critical', title: 'ICU Capacity Warning', message: 'Memorial Healthcare ICU at 92% capacity. Consider patient diversion.', timestamp: '08:25 AM', read: false },
  { id: 'a3', type: 'warning', title: 'Ventilator Supply Low', message: 'Unity Health Center down to 2 available ventilators.', timestamp: '08:20 AM', read: false },
  { id: 'a4', type: 'info', title: 'Staff Shift Change', message: 'Night shift ending at 09:00 AM. Ensure handover protocols.', timestamp: '08:15 AM', read: true },
  { id: 'a5', type: 'warning', title: 'Ambulance Shortage', message: 'Only 3 ambulances available across the downtown district.', timestamp: '08:10 AM', read: false },
  { id: 'a6', type: 'critical', title: 'Power Grid Fluctuation', message: 'Backup generators activated at Riverside Medical due to grid instability.', timestamp: '08:05 AM', read: false },
  { id: 'a7', type: 'info', title: 'Weather Advisory', message: 'Severe storm approaching. Review mass casualty incident protocols.', timestamp: '08:00 AM', read: true },
  { id: 'a8', type: 'critical', title: 'Surgical Team Required', message: 'Multiple trauma patients incoming. Immediate surgical team assembly required at City General.', timestamp: '07:55 AM', read: false },
  { id: 'a9', type: 'warning', title: 'Network Latency', message: 'Electronic Health Records (EHR) system experiencing high latency.', timestamp: '07:50 AM', read: false },
  { id: 'a10', type: 'info', title: 'Quarterly Drill', message: 'Reminder: Evacuation drill scheduled for 14:00 PM today.', timestamp: '07:45 AM', read: true },
];

export const resourceItems = [
  { id: 'r1', name: 'ICU Beds', category: 'Equipment', location: 'ICU Ward', stock: 50, maxStock: 200, unit: 'beds', minThreshold: 40, status: 'Sufficient' as const },
  { id: 'r2', name: 'Ambulances', category: 'Equipment', location: 'Parking Bay', stock: 60, maxStock: 100, unit: 'vehicles', minThreshold: 40, status: 'Sufficient' as const },
  { id: 'r3', name: 'Defibrillators', category: 'Equipment', location: 'Emergency', stock: 80, maxStock: 150, unit: 'units', minThreshold: 50, status: 'Sufficient' as const },
  { id: 'r4', name: 'Blood Bags (O-)', category: 'Supplies', location: 'Blood Bank', stock: 40, maxStock: 300, unit: 'bags', minThreshold: 100, status: 'Critical' as const },
  { id: 'r5', name: 'Surgical Gloves', category: 'Supplies', location: 'Central Store', stock: 8500, maxStock: 20000, unit: 'pairs', minThreshold: 2000, status: 'Sufficient' as const },
  { id: 'r6', name: 'Paracetamol 500mg', category: 'Medication', location: 'Pharmacy', stock: 12000, maxStock: 30000, unit: 'tablets', minThreshold: 5000, status: 'Sufficient' as const },
  { id: 'r7', name: 'Oxygen Cylinders', category: 'Equipment', location: 'Storage', stock: 120, maxStock: 500, unit: 'cylinders', minThreshold: 150, status: 'Low' as const },
  { id: 'r8', name: 'Ventilators', category: 'Equipment', location: 'ICU', stock: 30, maxStock: 200, unit: 'units', minThreshold: 50, status: 'Critical' as const },
  { id: 'r9', name: 'IV Fluid Sets', category: 'Supplies', location: 'Pharmacy', stock: 2000, maxStock: 5000, unit: 'sets', minThreshold: 500, status: 'Sufficient' as const },
  { id: 'r10', name: 'Morphine 10mg', category: 'Medication', location: 'Pharmacy', stock: 450, maxStock: 1000, unit: 'vials', minThreshold: 200, status: 'Sufficient' as const },
  { id: 'r11', name: 'Surgical Masks', category: 'Supplies', location: 'Central Store', stock: 30000, maxStock: 100000, unit: 'masks', minThreshold: 10000, status: 'Sufficient' as const },
  { id: 'r12', name: 'Stretchers', category: 'Equipment', location: 'Emergency', stock: 100, maxStock: 150, unit: 'units', minThreshold: 50, status: 'Sufficient' as const },
  { id: 'r13', name: 'Antibiotics IV', category: 'Medication', location: 'Pharmacy', stock: 800, maxStock: 2000, unit: 'vials', minThreshold: 300, status: 'Sufficient' as const },
  { id: 'r14', name: 'PPE Kits', category: 'Supplies', location: 'Central Store', stock: 1500, maxStock: 5000, unit: 'kits', minThreshold: 500, status: 'Sufficient' as const },
  { id: 'r15', name: 'Nurses', category: 'Personnel', location: 'All Wards', stock: 450, maxStock: 600, unit: 'staff', minThreshold: 300, status: 'Sufficient' as const },
];

export const emergencyInflow = [
  { time: '08 AM', count: 3 },
  { time: '09 AM', count: 8 },
  { time: '10 AM', count: 15 },
  { time: '11 AM', count: 18 },
  { time: '12 PM', count: 14 },
  { time: '01 PM', count: 16 },
  { time: '02 PM', count: 12 },
  { time: '03 PM', count: 15 },
  { time: '04 PM', count: 10 },
  { time: '05 PM', count: 8 },
  { time: '06 PM', count: 6 },
  { time: '07 PM', count: 5 },
];

export const bedOccupancy = [
  { ward: 'ICU', occupancy: 0.62 },
  { ward: 'Emergency', occupancy: 0.78 },
  { ward: 'General', occupancy: 0.45 },
  { ward: 'Pediatric', occupancy: 0.35 },
  { ward: 'Surgery', occupancy: 0.52 },
];

export function generatePatientName(): string {
  const firstNames = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Taylor', 'Quinn', 'Avery', 'Cameron', 'Drew', 'Sam', 'Chris', 'Pat', 'Jamie', 'Robin', 'Eli', 'Max', 'Leo', 'Mia', 'Zoe'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

export function generateSeverity(): { score: number; priority: Patient['priority']; condition: string; survival: number } {
  const conditions = [
    { condition: 'Severe Trauma', minScore: 80, maxScore: 98 },
    { condition: 'Cardiac Arrest', minScore: 85, maxScore: 99 },
    { condition: 'Internal Bleeding', minScore: 75, maxScore: 95 },
    { condition: 'Respiratory Failure', minScore: 70, maxScore: 90 },
    { condition: 'Burns (3rd Degree)', minScore: 65, maxScore: 88 },
    { condition: 'Head Injury', minScore: 60, maxScore: 92 },
    { condition: 'Crush Injury', minScore: 55, maxScore: 85 },
    { condition: 'Fractures', minScore: 30, maxScore: 55 },
    { condition: 'Lacerations', minScore: 20, maxScore: 40 },
    { condition: 'Smoke Inhalation', minScore: 40, maxScore: 70 },
    { condition: 'Concussion', minScore: 25, maxScore: 50 },
    { condition: 'Spinal Injury', minScore: 70, maxScore: 95 },
  ];
  const c = conditions[Math.floor(Math.random() * conditions.length)];
  const score = Math.floor(Math.random() * (c.maxScore - c.minScore) + c.minScore);
  const priority: Patient['priority'] = score >= 80 ? 'Critical' : score >= 60 ? 'High' : score >= 40 ? 'Medium' : 'Low';
  const survival = Math.max(20, Math.min(98, 100 - score + Math.floor(Math.random() * 30)));
  return { score, priority, condition: c.condition, survival };
}

export function allocatePatient(patient: Patient, hospitalList: Hospital[]): { hospitalId: string; confidence: number; eta: string } {
  const available = hospitalList.filter(h => {
    if (patient.priority === 'Critical') return h.icuAvailable > 0;
    return h.generalAvailable > 0;
  });

  if (available.length === 0) {
    const fallback = hospitalList.reduce((a, b) => a.loadPercent < b.loadPercent ? a : b);
    return { hospitalId: fallback.id, confidence: 40, eta: `${Math.floor(fallback.distance * 3)} min` };
  }

  const scored = available.map(h => {
    const distScore = Math.max(0, 100 - h.distance * 8);
    const loadScore = 100 - h.loadPercent;
    const capacityScore = patient.priority === 'Critical'
      ? (h.icuAvailable / h.icuTotal) * 100
      : (h.generalAvailable / h.generalTotal) * 100;
    const resourceScore = (h.oxygen + h.ventilators * 5) / 2;
    const total = distScore * 0.3 + loadScore * 0.25 + capacityScore * 0.25 + resourceScore * 0.2;
    return { hospital: h, score: total };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  const confidence = Math.min(98, Math.floor(best.score));
  const eta = `${Math.max(5, Math.floor(best.hospital.distance * 3))} min`;

  return { hospitalId: best.hospital.id, confidence, eta };
}

// --- DYNAMIC CONTEXT GENERATOR ---
let prngSeed = 1;

function seededRandom() {
  prngSeed = (prngSeed * 1664525 + 1013904223) | 0;
  return (prngSeed >>> 0) / 4294967296;
}

export function generateHospitalContext(username: string) {
  let h = 0;
  for (let i = 0; i < username.length; i++) {
    h = Math.imul(31, h) + username.charCodeAt(i) | 0;
  }
  prngSeed = h === 0 ? 1 : Math.abs(h);

  const baseHospitals = JSON.parse(JSON.stringify(hospitals)) as Hospital[];
  
  baseHospitals.forEach(hospital => {
    hospital.icuAvailable = Math.floor(seededRandom() * (hospital.icuTotal + 1));
    hospital.generalAvailable = Math.floor(seededRandom() * (hospital.generalTotal + 1));
    
    const usedICU = hospital.icuTotal - hospital.icuAvailable;
    const usedGen = hospital.generalTotal - hospital.generalAvailable;
    const newLoad = Math.round(((usedICU + usedGen) / (hospital.icuTotal + hospital.generalTotal)) * 100);
    hospital.loadPercent = newLoad;
    hospital.status = newLoad > 85 ? 'red' : newLoad > 65 ? 'yellow' : 'green';
  });

  // Generate anywhere from 150 to 450 distinct patients per hospital login to populate the grid
  const patientCount = 150 + Math.floor(seededRandom() * 300);
  const newPatients: Patient[] = [];
  
  const possibleConditions = [
    { condition: 'Severe Trauma', minScore: 80, maxScore: 98 },
    { condition: 'Cardiac Arrest', minScore: 85, maxScore: 99 },
    { condition: 'Internal Bleeding', minScore: 75, maxScore: 95 },
    { condition: 'Respiratory Failure', minScore: 70, maxScore: 90 },
    { condition: 'Burns (3rd Degree)', minScore: 65, maxScore: 88 },
    { condition: 'Head Injury', minScore: 60, maxScore: 92 },
    { condition: 'Crush Injury', minScore: 55, maxScore: 85 },
    { condition: 'Fractures', minScore: 30, maxScore: 55 },
    { condition: 'Lacerations', minScore: 20, maxScore: 40 },
    { condition: 'Smoke Inhalation', minScore: 40, maxScore: 70 },
    { condition: 'Concussion', minScore: 25, maxScore: 50 },
    { condition: 'Spinal Injury', minScore: 70, maxScore: 95 },
  ];

  for (let i = 0; i < patientCount; i++) {
    const c = possibleConditions[Math.floor(seededRandom() * possibleConditions.length)];
    const score = Math.floor(seededRandom() * (c.maxScore - c.minScore) + c.minScore);
    const priority = score >= 80 ? 'Critical' : score >= 60 ? 'High' : score >= 40 ? 'Medium' : 'Low';
    const survivalProb = Math.max(20, Math.min(98, 100 - score + Math.floor(seededRandom() * 30)));
    
    const assigned = baseHospitals[Math.floor(seededRandom() * baseHospitals.length)];
    
    newPatients.push({
      id: `dp-[${username}]-${i}`,
      name: generatePatientName(),
      age: Math.floor(seededRandom() * 60 + 18),
      gender: seededRandom() > 0.5 ? 'M' : 'F',
      condition: c.condition,
      severityScore: score,
      survivalProbability: survivalProb,
      priority,
      assignedHospital: assigned.id,
      status: seededRandom() > 0.5 ? 'Admitted' : 'Transferred',
      arrivalTime: `${Math.floor(seededRandom() * 12 + 1).toString().padStart(2, '0')}:${Math.floor(seededRandom() * 60).toString().padStart(2, '0')} ${seededRandom() > 0.5 ? 'AM' : 'PM'}`
    });
  }

  const generatedAlerts: Alert[] = [
    { id: `da-[${username}]-1`, type: 'critical', title: 'System Load Alert', message: `High volume traffic designated for node: ${username}.`, timestamp: '09:00 AM', read: false },
    { id: `da-[${username}]-2`, type: 'warning', title: 'O2 Supply', message: 'Oxygen levels fluctuating across main wards.', timestamp: '09:12 AM', read: false },
    { id: `da-[${username}]-3`, type: 'info', title: 'Incoming Transfer', message: '3 medium-priority patients en route from adjoining node.', timestamp: '09:15 AM', read: true },
    { id: `da-[${username}]-4`, type: 'critical', title: 'Code Blue', message: 'Cardiac arrest in Ward C. Resuscitation team deployed.', timestamp: '09:18 AM', read: false },
    { id: `da-[${username}]-5`, type: 'warning', title: 'Staffing Shortfall', message: 'Nursing ratio exceeds safe limits in ICU.', timestamp: '09:22 AM', read: false },
    { id: `da-[${username}]-6`, type: 'info', title: 'Supply Delivery', message: 'Scheduled PPE and medication delivery arriving in 10 mins.', timestamp: '09:25 AM', read: true },
    { id: `da-[${username}]-7`, type: 'critical', title: 'Security Breach', message: 'Unauthorized access attempt detected at Pharmacy wing.', timestamp: '09:30 AM', read: false },
  ];

  const totalBeds = baseHospitals.reduce((sum, h) => sum + h.icuAvailable + h.generalAvailable, 0);

  return {
    hospitals: baseHospitals,
    patients: newPatients,
    alerts: generatedAlerts,
    totalIntake: newPatients.length,
    totalDistributed: newPatients.filter(p => p.status !== 'Pending').length,
    networkBeds: totalBeds,
    surgeScore: 30 + Math.floor(seededRandom() * 40)
  };
}
