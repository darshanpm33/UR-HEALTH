import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Zap, BedDouble, Users, Package, Brain, Bell, AlertTriangle, Activity, Shield, LogOut } from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', desc: 'Overview' },
  { to: '/emergency-triage', icon: Zap, label: 'Emergency Triage', desc: 'Patient priority' },
  { to: '/icu-beds', icon: BedDouble, label: 'ICU & Beds', desc: 'Bed management' },
  { to: '/patients', icon: Users, label: 'Patients', desc: 'All records' },
  { to: '/resources', icon: Package, label: 'Resources', desc: 'Supply tracking' },
  { to: '/ai-predictions', icon: Brain, label: 'AI Predictions', desc: 'Forecasting' },
  { to: '/alerts', icon: Bell, label: 'Alerts Center', badge: true, desc: 'Notifications' },
  { to: '/special-emergency', icon: AlertTriangle, label: 'Special Emergency', emergency: true, desc: 'Mass casualty' },
];

export default function AppSidebar() {
  const location = useLocation();
  const { alerts, isEmergencyActive, patients, hospitals } = useEmergency();
  const { logout } = useAuth();
  const unreadAlerts = alerts.filter(a => !a.read).length;

  return (
    <aside className="w-[270px] h-screen sticky top-0 bg-primary flex flex-col shrink-0 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary-foreground blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-primary-foreground blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center shadow-lg">
          <Shield className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <span className="text-xl font-bold text-primary-foreground tracking-tight">UrHealth</span>
          <p className="text-[10px] text-primary-foreground/60 font-medium tracking-wider uppercase">Command Center</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-1 space-y-0.5 relative z-10 overflow-y-auto scrollbar-thin">
        <p className="text-[10px] text-primary-foreground/40 uppercase font-semibold tracking-wider px-4 mb-2">Navigation</p>
        {navItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-foreground text-primary shadow-lg shadow-primary-foreground/20'
                  : item.emergency
                  ? `text-primary-foreground/90 hover:bg-primary-foreground/10 border border-primary-foreground/20 ${isEmergencyActive ? 'bg-primary-foreground/5' : ''}`
                  : 'text-primary-foreground/75 hover:bg-primary-foreground/10 hover:text-primary-foreground'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isActive ? 'bg-primary/10' : 'bg-primary-foreground/10'
              }`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block truncate">{item.label}</span>
                {!isActive && <span className="text-[10px] opacity-50">{item.desc}</span>}
              </div>
              {item.badge && unreadAlerts > 0 && (
                <span className="bg-emergency text-emergency-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold animate-pulse">
                  {unreadAlerts}
                </span>
              )}
              {item.emergency && isEmergencyActive && (
                <span className="w-2.5 h-2.5 rounded-full bg-emergency animate-blink shadow-lg shadow-emergency/50" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Emergency status footer */}
      <div className="px-4 py-3 relative z-10 border-t border-primary-foreground/10 flex flex-col gap-2">
        {isEmergencyActive ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emergency/20">
            <Activity className="w-4 h-4 text-emergency-foreground animate-pulse" />
            <div>
              <p className="text-xs font-bold text-primary-foreground">EMERGENCY ACTIVE</p>
              <p className="text-[10px] text-primary-foreground/60">All systems on alert</p>
            </div>
          </div>
        ) : (
          <p className="text-primary-foreground/40 text-xs text-center pt-2">UrHealth v2.0 — AI Powered</p>
        )}
        <button 
          onClick={logout}
          className="w-full py-2 text-xs font-bold text-red-600 bg-white hover:bg-gray-100 rounded-lg shadow-md transition-colors flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log out
        </button>
      </div>
    </aside>
  );
}
