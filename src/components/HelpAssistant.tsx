import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HelpCircle, X, ArrowRight, Search, Keyboard, Zap } from 'lucide-react';
import { LayoutDashboard, BedDouble, Users, Package, Brain, Bell, AlertTriangle } from 'lucide-react';

const features = [
  { icon: LayoutDashboard, label: 'Dashboard', desc: 'Hospital operations overview', path: '/', shortcut: '1' },
  { icon: Zap, label: 'Emergency Triage', desc: 'AI-prioritized patient queue', path: '/emergency-triage', shortcut: '2' },
  { icon: BedDouble, label: 'ICU & Beds', desc: 'Bed availability & reservations', path: '/icu-beds', shortcut: '3' },
  { icon: Users, label: 'Patients', desc: 'Records, assignments & tracking', path: '/patients', shortcut: '4' },
  { icon: Package, label: 'Resources', desc: 'Equipment & supply management', path: '/resources', shortcut: '5' },
  { icon: Brain, label: 'AI Predictions', desc: 'Surge forecasting & risk zones', path: '/ai-predictions', shortcut: '6' },
  { icon: Bell, label: 'Alerts Center', desc: 'Notifications & system alerts', path: '/alerts', shortcut: '7' },
  { icon: AlertTriangle, label: 'Special Emergency', desc: 'Mass casualty coordination', path: '/special-emergency', shortcut: '8' },
];

const tips = [
  'Use the Bulk Intake Processor to simulate mass casualty events',
  'Monitor the AI Predictions page for surge forecasting',
  'Dismiss alerts individually or use the bulk dismiss option',
  'Resource stocks can be restocked directly from the Resources page',
  'The triage page sorts patients by severity automatically',
];

export default function HelpAssistant() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'contact' | 'nav' | 'tips'>('contact');
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const filtered = search
    ? features.filter(f => f.label.toLowerCase().includes(search.toLowerCase()) || f.desc.toLowerCase().includes(search.toLowerCase()))
    : features;

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-6 w-96 bg-card border rounded-2xl shadow-2xl z-50 animate-slide-up overflow-hidden">
          <div className="primary-gradient px-5 py-4 flex items-center justify-between">
            <div>
              <span className="text-primary-foreground font-bold text-sm">HealSoon Assistant</span>
              <p className="text-primary-foreground/70 text-[10px]">Quick navigation & help</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground bg-primary-foreground/10 rounded-lg p-1.5">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 pt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search features..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-4 pt-3">
            <button onClick={() => setTab('contact')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === 'contact' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}>
              Contact
            </button>
            <button onClick={() => setTab('tips')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === 'tips' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}>
              Quick Tips
            </button>
            <button onClick={() => setTab('nav')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === 'nav' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}>
              Navigation
            </button>
          </div>

          <div className="p-3 max-h-80 overflow-auto scrollbar-thin">
            {tab === 'contact' ? (
              <div className="space-y-3 p-2 animate-fade-in-up">
                <div className="bg-secondary/50 rounded-xl p-4 border flex flex-col gap-3">
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">📞 Phone Support</h3>
                    <p className="text-sm font-medium text-primary mt-1">+1 (800) 123-HELP</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Available 24/7 for urgent hospital system queries.</p>
                  </div>
                  <div className="h-px bg-border w-full" />
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">✉️ Email Support</h3>
                    <p className="text-sm font-medium text-primary mt-1">support@urhealth.system</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">We typically reply within 1 hour to IT requests.</p>
                  </div>
                </div>
              </div>
            ) : tab === 'nav' ? (
              <div className="space-y-1 animate-fade-in-up">
                {filtered.map(f => {
                  const isActive = location.pathname === f.path;
                  return (
                    <button
                      key={f.path}
                      onClick={() => goTo(f.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left group ${
                        isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-secondary'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                      }`}>
                        <f.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{f.label}</div>
                        <div className="text-[10px] text-muted-foreground">{f.desc}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isActive && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Current</span>}
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  );
                })}
                {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-4">No matching features</p>}
              </div>
            ) : (
              <div className="space-y-2 animate-fade-in-up">
                {tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-secondary/50">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 border-t bg-secondary/30 flex items-center gap-2 text-[10px] text-muted-foreground">
            <Keyboard className="w-3 h-3" />
            Press <kbd className="px-1 py-0.5 rounded bg-secondary text-[9px] font-mono">?</kbd> for quick help
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center z-50 ${
          open ? 'bg-secondary text-foreground' : 'primary-gradient text-primary-foreground'
        }`}
      >
        {open ? <X className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
      </button>
    </>
  );
}
