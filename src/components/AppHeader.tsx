import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, Clock, Activity, X } from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

export default function AppHeader() {
  const { isEmergencyActive, emergencyType, activatedAt, alerts, patients, hospitals } = useEmergency();
  const { user } = useAuth();
  const unreadCount = alerts.filter(a => !a.read).length;
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeModal, setActiveModal] = useState<'profile' | 'system' | 'display' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const searchResults = searchQuery.length > 1
    ? patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const avgLoad = Math.round(hospitals.reduce((s, h) => s + h.loadPercent, 0) / hospitals.length);

  return (
    <header className="shrink-0">
      {isEmergencyActive && (
        <div className="emergency-gradient text-primary-foreground px-6 py-2.5 flex items-center justify-between animate-pulse-emergency">
          <div className="flex items-center gap-3">
            <span className="text-lg">🚨</span>
            <span className="font-bold text-sm tracking-wide uppercase">
              Special Emergency Activated – Mass Casualty Event
            </span>
            <span className="bg-primary-foreground/20 text-primary-foreground text-xs px-3 py-0.5 rounded-full font-semibold uppercase">
              {emergencyType || 'OTHER'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="font-medium">Since {activatedAt}</span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between px-6 py-3 bg-card border-b">
        {/* Search */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patients, conditions..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setShowSearch(false); }} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
          {showSearch && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-xl shadow-xl z-50 overflow-hidden animate-scale-in">
              {searchResults.map(p => (
                <button
                  key={p.id}
                  onClick={() => { navigate('/patients'); setSearchQuery(''); setShowSearch(false); }}
                  className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.condition} • {p.priority}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    p.priority === 'Critical' ? 'bg-emergency/10 text-emergency' : 'bg-primary/10 text-primary'
                  }`}>{p.severityScore}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-5">
          {/* Live clock */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-mono font-medium">{format(time, 'MMM dd, yyyy - hh:mm:ss a')}</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-emergency text-emergency-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-card border rounded-xl shadow-xl z-50 animate-scale-in overflow-hidden">
                <div className="px-4 py-3 border-b bg-secondary/50">
                  <p className="font-semibold text-sm">Notifications ({unreadCount})</p>
                </div>
                <div className="max-h-64 overflow-y-auto scrollbar-thin">
                  {alerts.filter(a => !a.read).slice(0, 5).map(a => (
                    <div key={a.id} className="px-4 py-3 border-b last:border-0 hover:bg-secondary/30 transition-colors">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{a.timestamp}</p>
                    </div>
                  ))}
                  {unreadCount === 0 && <p className="text-center text-muted-foreground text-sm py-6">All caught up!</p>}
                </div>
                <button onClick={() => { navigate('/alerts'); setShowNotifications(false); }} className="w-full py-2.5 text-sm text-primary font-medium hover:bg-secondary transition-colors border-t">
                  View All Alerts
                </button>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            {showSettings && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-card border rounded-xl shadow-xl z-50 animate-scale-in overflow-hidden">
                <div className="py-2">
                  <button onClick={() => { setActiveModal('profile'); setShowSettings(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors">Profile Settings</button>
                  <button onClick={() => { setActiveModal('system'); setShowSettings(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors">System Preferences</button>
                  <button onClick={() => { setActiveModal('display'); setShowSettings(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors">Display Modes</button>
                  <div className="h-px bg-border my-1" />
                  <button onClick={() => { navigate('/login'); }} className="w-full px-4 py-2 text-left text-sm text-emergency hover:bg-secondary transition-colors">Logout</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 pl-3 border-l">
            <div className="text-right">
              <div className="text-sm font-semibold">{user?.name || 'Unknown User'}</div>
              <div className="text-[10px] text-muted-foreground">@{user?.username || 'user'}</div>
            </div>
            <div className="w-9 h-9 rounded-xl primary-gradient text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md">
              {user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-[400px] border shadow-2xl rounded-2xl overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-secondary/50">
              <h2 className="font-semibold">
                {activeModal === 'profile' && 'Profile Settings'}
                {activeModal === 'system' && 'System Preferences'}
                {activeModal === 'display' && 'Display Modes'}
              </h2>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="p-6 space-y-4 text-left">
              {activeModal === 'profile' && (
                <div className="space-y-4 text-sm">
                  <div className="flex flex-col gap-1.5 justify-center items-center mb-6">
                    <div className="w-16 h-16 rounded-full primary-gradient text-primary-foreground flex items-center justify-center font-bold text-2xl shadow-md">
                      {user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                    </div>
                    <button className="text-primary text-xs font-semibold hover:underline">Change Avatar</button>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-medium block mb-1">Full Name</label>
                    <input type="text" defaultValue={user?.name || 'Unknown User'} className="w-full border rounded-lg px-3 py-2 bg-background outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-medium block mb-1">Username / ID</label>
                    <input type="text" defaultValue={user?.username || 'user'} disabled className="w-full border rounded-lg px-3 py-2 bg-secondary/50 text-muted-foreground cursor-not-allowed outline-none" />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-medium block mb-1">Email Address</label>
                    <input type="email" defaultValue={`${user?.username || 'user'}@urhealth.system`} className="w-full border rounded-lg px-3 py-2 bg-background outline-none focus:border-primary" />
                  </div>
                  <button onClick={() => setActiveModal(null)} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium mt-4 hover:opacity-90">Save Profile</button>
                </div>
              )}

              {activeModal === 'system' && (
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between p-3 border rounded-xl">
                    <div>
                      <h4 className="font-bold text-foreground">Auto-Refresh Dashboards</h4>
                      <p className="text-xs">Fetch live hospital data every 15s</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-xl">
                    <div>
                      <h4 className="font-bold text-foreground">High Priority Alerts</h4>
                      <p className="text-xs">Sound chimes on critical alerts</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-xl">
                    <div>
                      <h4 className="font-bold text-foreground">Data Encryption</h4>
                      <p className="text-xs">Require 2FA for patient records</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                  </div>
                  <button onClick={() => setActiveModal(null)} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium mt-4 hover:opacity-90">Apply Preferences</button>
                </div>
              )}

              {activeModal === 'display' && (
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex flex-col items-center gap-2 p-4 border-2 border-primary rounded-xl bg-primary/5 text-primary">
                       <span className="font-bold">Light Mode</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 border rounded-xl text-muted-foreground hover:bg-secondary transition-colors">
                       <span className="font-bold">Dark Mode</span>
                    </button>
                  </div>
                  <div className="mt-4">
                    <label className="text-muted-foreground text-xs font-medium block mb-2">UI Density</label>
                    <select className="w-full border rounded-lg px-3 py-2 bg-background outline-none focus:border-primary">
                      <option>Comfortable</option>
                      <option>Compact</option>
                    </select>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium mt-4 hover:opacity-90">Save Display Settings</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
