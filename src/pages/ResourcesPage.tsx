import { useState } from 'react';
import { Package, CheckCircle, AlertTriangle, XCircle, RefreshCw, Plus, TrendingDown, ShoppingCart, Search } from 'lucide-react';
import { resourceItems as defaultResources } from '@/data/mockData';
import { useEmergency } from '@/context/EmergencyContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ResourcesPage() {
  const { addAlert } = useEmergency();
  const [resources, setResources] = useState(defaultResources);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [search, setSearch] = useState('');
  const [showOrder, setShowOrder] = useState<string | null>(null);
  const [orderQty, setOrderQty] = useState(10);

  const sufficient = resources.filter(r => r.status === 'Sufficient').length;
  const low = resources.filter(r => r.status === 'Low').length;
  const critical = resources.filter(r => r.status === 'Critical').length;
  const utilization = Math.round((resources.reduce((s, r) => s + r.stock, 0) / resources.reduce((s, r) => s + r.maxStock, 0)) * 100);

  const filtered = resources
    .filter(r => categoryFilter === 'All' || r.category === categoryFilter)
    .filter(r => statusFilter === 'All Status' || r.status === statusFilter)
    .filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()));

  const chartData = resources.slice(0, 8).map(r => ({
    name: r.name.split(' ')[0],
    stock: Math.round((r.stock / r.maxStock) * 100),
  }));

  const statusIcon = (s: string) => {
    if (s === 'Sufficient') return <CheckCircle className="w-5 h-5 text-success" />;
    if (s === 'Low') return <AlertTriangle className="w-5 h-5 text-warning" />;
    return <XCircle className="w-5 h-5 text-emergency" />;
  };

  const handleRestock = (id: string, amount?: number) => {
    setResources(prev => prev.map(r => {
      if (r.id !== id) return r;
      const newStock = Math.min(r.maxStock, r.stock + (amount || Math.floor(r.maxStock * 0.2)));
      const pct = newStock / r.maxStock;
      const status = pct < 0.2 ? 'Critical' as const : pct < 0.4 ? 'Low' as const : 'Sufficient' as const;
      return { ...r, stock: newStock, status };
    }));
    const resource = resources.find(r => r.id === id);
    addAlert({
      type: 'info',
      title: 'Resource Restocked',
      message: `${resource?.name} restocked with ${amount || 'standard'} units.`,
    });
    setShowOrder(null);
  };

  const handleUseResource = (id: string) => {
    setResources(prev => prev.map(r => {
      if (r.id !== id) return r;
      const newStock = Math.max(0, r.stock - Math.floor(r.maxStock * 0.05));
      const pct = newStock / r.maxStock;
      const status = pct < 0.2 ? 'Critical' as const : pct < 0.4 ? 'Low' as const : 'Sufficient' as const;
      if (status === 'Critical' && r.status !== 'Critical') {
        addAlert({ type: 'critical', title: `${r.name} Critical`, message: `${r.name} stock is critically low!` });
      }
      return { ...r, stock: newStock, status };
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl success-gradient flex items-center justify-center">
            <Package className="w-4 h-4 text-primary-foreground" />
          </div>
          Resource Management
        </h1>
        <p className="text-muted-foreground text-sm">Hospital supply and equipment monitoring</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-2xl p-5 border-l-4 border-l-success card-hover">
          <p className="text-3xl font-bold text-success">{sufficient}</p>
          <p className="text-sm text-muted-foreground font-medium">Sufficient</p>
        </div>
        <div className="bg-card border rounded-2xl p-5 border-l-4 border-l-warning card-hover">
          <p className="text-3xl font-bold text-warning">{low}</p>
          <p className="text-sm text-muted-foreground font-medium">Low Stock</p>
        </div>
        <div className="bg-card border rounded-2xl p-5 border-l-4 border-l-emergency card-hover">
          <p className="text-3xl font-bold text-emergency">{critical}</p>
          <p className="text-sm text-muted-foreground font-medium">Critical</p>
        </div>
        <div className="bg-card border rounded-2xl p-5 card-hover">
          <p className="text-3xl font-bold">{utilization}%</p>
          <p className="text-sm text-muted-foreground font-medium">Utilization</p>
        </div>
      </div>

      {/* Stock chart */}
      <div className="bg-card border rounded-2xl p-5">
        <h2 className="font-semibold text-sm mb-4">Stock Levels Overview</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))' }} />
            <Bar dataKey="stock" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Stock %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-4 py-1.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring w-48" />
        </div>
        {['All', 'Equipment', 'Supplies', 'Medication', 'Personnel'].map(c => (
          <button key={c} onClick={() => setCategoryFilter(c)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${categoryFilter === c ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary hover:bg-secondary/80'}`}>{c}</button>
        ))}
        <span className="w-px h-6 bg-border mx-1" />
        {['All Status', 'Sufficient', 'Low', 'Critical'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${statusFilter === s ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary hover:bg-secondary/80'}`}>{s}</button>
        ))}
      </div>

      {/* Resource cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(r => {
          const pct = Math.round((r.stock / r.maxStock) * 100);
          return (
            <div key={r.id} className={`bg-card border rounded-2xl p-5 card-hover transition-all ${r.status === 'Critical' ? 'border-emergency/30 bg-emergency/5' : r.status === 'Low' ? 'border-warning/30 bg-warning/5' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  {statusIcon(r.status)}
                  <div>
                    <h3 className="font-semibold text-sm">{r.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{r.category} — {r.location}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${r.status === 'Sufficient' ? 'bg-success/10 text-success' : r.status === 'Low' ? 'bg-warning/10 text-warning' : 'bg-emergency/10 text-emergency'}`}>
                  {r.status}
                </span>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span>Stock: {r.stock} / {r.maxStock} {r.unit}</span>
                <span className="font-bold">{pct}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5 mb-2">
                <div className={`h-2.5 rounded-full transition-all ${r.status === 'Critical' ? 'bg-emergency' : r.status === 'Low' ? 'bg-warning' : 'bg-success'}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground mb-3">Min threshold: {r.minThreshold} {r.unit}</p>

              {showOrder === r.id ? (
                <div className="space-y-2 animate-fade-in-up">
                  <div className="flex items-center gap-2">
                    <input type="number" value={orderQty} onChange={e => setOrderQty(+e.target.value)} min={1} className="flex-1 border rounded-lg px-3 py-1.5 text-sm" />
                    <span className="text-xs text-muted-foreground">{r.unit}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleRestock(r.id, orderQty)} className="flex-1 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">Confirm</button>
                    <button onClick={() => setShowOrder(null)} className="flex-1 py-1.5 border rounded-lg text-xs font-medium hover:bg-secondary">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setShowOrder(r.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-medium hover:opacity-90 transition-opacity">
                    <Plus className="w-3.5 h-3.5" /> Restock
                  </button>
                  <button onClick={() => handleUseResource(r.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 border rounded-xl text-xs font-medium hover:bg-secondary transition-colors">
                    <TrendingDown className="w-3.5 h-3.5" /> Use
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
