
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  User as UserIcon, 
  Home, 
  Settings, 
  History, 
  ChevronRight, 
  Star, 
  MessageCircle, 
  LogOut, 
  CreditCard,
  QrCode,
  ShieldCheck,
  Store,
  ArrowLeft,
  Clock,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Truck,
  PlusCircle,
  BarChart3,
  Smartphone,
  Building2,
  Coins,
  Copy,
  ThumbsUp,
  X,
  Wallet,
  Check
} from 'lucide-react';
import { User, Role, Service, ServiceType, Order, OrderStatus } from './types';
import { MOCK_SERVICES } from './constants';

// --- Sub-components ---

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-white/95 flex items-center justify-center z-[100] backdrop-blur-sm">
    <div className="flex flex-col items-center">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-blue-600 font-bold text-sm tracking-tight animate-pulse uppercase">Memproses...</p>
    </div>
  </div>
);

const Navbar = ({ 
  user, 
  setView, 
  currentView, 
  handleLogout 
}: { 
  user: User | null; 
  setView: (v: string) => void; 
  currentView: string;
  handleLogout: () => void;
}) => (
  <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div 
          className="flex items-center cursor-pointer group" 
          onClick={() => setView('home')}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-200 group-hover:scale-105 transition-all">U</div>
          <div className="ml-3">
            <span className="text-lg font-black text-slate-900 tracking-tighter block leading-none mb-0.5">UniConnect</span>
            <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest leading-none">UIGM Palembang</p>
          </div>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <button onClick={() => setView('home')} className={`${currentView === 'home' ? 'text-blue-600 font-bold relative after:content-[""] after:absolute after:-bottom-5 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full' : 'text-slate-500 font-medium hover:text-blue-600'} text-sm transition-all`}>
            Beranda
          </button>
          
          {user?.role !== Role.MITRA && (
            <button onClick={() => setView('layanan')} className={`${currentView === 'layanan' ? 'text-blue-600 font-bold relative after:content-[""] after:absolute after:-bottom-5 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full' : 'text-slate-500 font-medium hover:text-blue-600'} text-sm transition-all`}>
              Layanan
            </button>
          )}

          {user?.role === Role.USER && (
            <button onClick={() => setView('riwayat')} className={`${currentView === 'riwayat' ? 'text-blue-600 font-bold relative after:content-[""] after:absolute after:-bottom-5 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full' : 'text-slate-500 font-medium hover:text-blue-600'} text-sm transition-all`}>
              Pesanan
            </button>
          )}

          {user?.role === Role.MITRA && (
            <button onClick={() => setView('mitra-dashboard')} className={`${currentView === 'mitra-dashboard' ? 'text-blue-600 font-bold relative after:content-[""] after:absolute after:-bottom-5 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full' : 'text-slate-500 font-medium hover:text-blue-600'} text-sm transition-all`}>
              Dashboard Mitra
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none mb-1">{user.name}</p>
                <p className={`text-[9px] font-black px-2 py-0.5 rounded tracking-widest uppercase shadow-sm ${user.role === Role.MITRA ? 'text-purple-600 bg-purple-50' : 'text-blue-600 bg-blue-50'}`}>
                  {user.role === Role.MITRA ? 'Mitra' : 'Mahasiswa'}
                </p>
              </div>
              <button onClick={() => setView('profile')} className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white border-2 border-white shadow-md hover:scale-105 transition-transform"><UserIcon size={16} /></button>
              <button onClick={handleLogout} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"><LogOut size={18} /></button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <button onClick={() => setView('login-user')} className="px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-all">Mahasiswa</button>
              <button onClick={() => setView('login-mitra')} className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all">Mitra Usaha</button>
            </div>
          )}
        </div>
      </div>
    </div>
  </nav>
);

const App: React.FC = () => {
  const [view, setView] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ojekPickup, setOjekPickup] = useState('');
  const [ojekDest, setOjekDest] = useState('');
  const [activeTab, setActiveTab] = useState<string>('Semua');
  const [serviceFilter, setServiceFilter] = useState<string>('Kantin');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QRIS' | 'BANK'>('CASH');
  const [mitraCategory, setMitraCategory] = useState<ServiceType>(ServiceType.KANTIN);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => prevOrders.map(order => {
        if (order.status === 'Disiapkan') return Math.random() > 0.8 ? { ...order, status: 'Siap Diambil' } : order;
        if (order.status === 'Driver Menuju Lokasi') return Math.random() > 0.8 ? { ...order, status: 'Dalam Perjalanan' } : order;
        if (order.status === 'Dalam Perjalanan' || order.status === 'Siap Diambil') return Math.random() > 0.9 ? { ...order, status: 'Selesai' } : order;
        return order;
      }));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (role: Role) => {
    setLoading(true);
    setTimeout(() => {
      const isMitra = role === Role.MITRA;
      let name = isMitra ? 'Kantin Mbak Sri (Official)' : 'Yesa Damayanti';
      if (isMitra) {
        if (mitraCategory === ServiceType.KOS) name = 'Manajemen Kos Melati';
        else if (mitraCategory === ServiceType.LAUNDRY) name = 'Owner Harum Laundry Hub';
        else if (mitraCategory === ServiceType.OJEK) name = 'Mitra Driver Ojek UIGM';
        else if (mitraCategory === ServiceType.FOTOKOPI) name = 'Fotokopi & Print Center Berkah';
      }
      
      const mockUser: User = {
        id: isMitra ? `mitra_${Date.now()}` : 'user_1',
        name: name,
        email: isMitra ? 'owner@mitra.uigm.ac.id' : '2023210127@students.uigm.ac.id',
        role: role,
        npm: isMitra ? undefined : '2023210127'
      };
      setUser(mockUser);
      setLoading(false);
      setView(isMitra ? 'mitra-dashboard' : 'home');
    }, 800);
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
  };

  const initiatePayment = (service: Service) => {
    if (!user) {
      alert("Akses SSO Diperlukan.");
      setView('login-user');
      return;
    }
    setSelectedService(service);
    setShowPayment(true);
  };

  const confirmPayment = () => {
    setLoading(true);
    setTimeout(() => {
      const billingCode = `UC-${Math.floor(100000 + Math.random() * 900000)}`;
      const taxRate = 0.05; 
      let basePrice = selectedService?.price || 0;
      const totalWithTax = basePrice * (1 + taxRate);
      
      let initialStatus: OrderStatus = 'Sukses';
      if (selectedService?.type === ServiceType.KANTIN) initialStatus = 'Disiapkan';
      if (selectedService?.type === ServiceType.OJEK) initialStatus = 'Driver Menuju Lokasi';

      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        serviceName: selectedService?.name || '',
        serviceType: selectedService?.type || ServiceType.KANTIN,
        amount: totalWithTax,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: initialStatus,
        billingCode: billingCode,
        pickup: ojekPickup,
        destination: ojekDest
      };

      setOrders([newOrder, ...orders]);
      setLoading(false);
      setShowPayment(false);
      setShowSuccess(true);
    }, 1200);
  };

  const finishAndGoToHistory = () => {
    setShowSuccess(false);
    setSelectedService(null);
    setView('riwayat');
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Disiapkan': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Siap Diambil': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Driver Menuju Lokasi': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Dalam Perjalanan': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Selesai': 
      case 'Sukses': return 'bg-green-50 text-green-700 border-green-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const filteredServices = useMemo(() => {
    return MOCK_SERVICES.filter(s => {
      const typeMatch = s.type === serviceFilter;
      const catMatch = activeTab === 'Semua' || s.category === activeTab || s.category === 'Semua';
      return typeMatch && catMatch;
    });
  }, [serviceFilter, activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-100 overflow-x-hidden">
      {loading && <LoadingOverlay />}
      <Navbar user={user} setView={setView} currentView={view} handleLogout={handleLogout} />

      <main className="flex-grow">
        {/* HOME VIEW */}
        {view === 'home' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-700">
            <section className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white py-16 md:py-24 px-4 relative overflow-hidden">
              <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-xl mb-8 border border-white/20 shadow-lg">
                  <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"></span>
                  <span className="text-[10px] font-black tracking-widest uppercase">Student Hub UIGM</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
                  UniConnect<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">UIGM Hub</span>
                </h1>
                <p className="text-sm md:text-lg text-blue-100/70 mb-12 max-w-2xl font-medium leading-relaxed">Ekosistem digital terpadu mahasiswa UIGM Palembang. Akses layanan UMKM terpercaya mulai dari Kantin hingga Kos-kosan.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setView('layanan')} className="bg-white text-blue-950 px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center group shadow-md">
                    Mulai Jelajah <ChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" size={18} />
                  </button>
                  <button onClick={() => setView('login-mitra')} className="bg-blue-600/20 border border-white/20 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-2 backdrop-blur-3xl shadow-md">
                    <Store size={18} /> Portal Mitra
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* LAYANAN VIEW */}
        {view === 'layanan' && (
          <div className="max-w-7xl mx-auto px-4 py-12 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="lg:w-1/4">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
                  <h3 className="text-base font-bold mb-6 text-slate-900">Kategori</h3>
                  <div className="space-y-2">
                    {Object.values(ServiceType).map(type => (
                      <button 
                        key={type}
                        onClick={() => setServiceFilter(type)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex justify-between items-center group active:scale-95 ${serviceFilter === type ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                      >
                        <span className="flex items-center gap-3">
                          {type === ServiceType.KANTIN && <Clock size={16} />}
                          {type === ServiceType.OJEK && <Navigation size={16} />}
                          {type === ServiceType.KOS && <Home size={16} />}
                          {type === ServiceType.LAUNDRY && <Truck size={16} />}
                          {type === ServiceType.FOTOKOPI && <History size={16} />}
                          {type}
                        </span>
                        {serviceFilter === type && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="lg:w-3/4">
                <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{serviceFilter} <span className="text-blue-600">Terbaik</span></h2>
                  <div className="flex bg-slate-200/50 p-1 rounded-xl shadow-inner backdrop-blur-md">
                    {['Semua', 'Putri', 'Putra'].map(cat => (
                      <button key={cat} onClick={() => setActiveTab(cat)} className={`px-6 py-2 text-[10px] font-black rounded-lg transition-all ${activeTab === cat ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{cat}</button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6">
                  {filteredServices.map(service => (
                    <div key={service.id} className="group bg-white hover:bg-blue-50/20 p-5 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer flex flex-col md:flex-row items-center gap-6" onClick={() => setSelectedService(service)}>
                      <div className="w-full md:w-48 h-40 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                        <img src={service.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex-grow text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                           <h4 className="font-bold text-slate-900 text-lg tracking-tight leading-none">{service.name}</h4>
                           <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center shadow-sm"><Star size={10} className="fill-current mr-1" /> {service.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-slate-500 font-medium mb-4 text-xs line-clamp-2 leading-relaxed opacity-80">{service.description}</p>
                        <div className="flex items-center justify-center md:justify-start gap-6 text-[10px] font-bold text-slate-400">
                          <span className="flex items-center"><MapPin size={14} className="mr-1.5 text-red-500" /> {service.distance}</span>
                          <span className="flex items-center"><Clock size={14} className="mr-1.5 text-blue-500" /> Siap Melayani</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-center md:text-right bg-slate-50/50 p-6 rounded-2xl border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all w-full md:w-auto">
                        <p className="text-[9px] font-bold uppercase tracking-widest mb-1 opacity-50">Mulai Dari</p>
                        <p className="text-xl font-black mb-4 tracking-tighter">Rp {service.price.toLocaleString('id-ID')}</p>
                        <button className="w-full px-6 py-2 bg-blue-600 text-white group-hover:bg-white group-hover:text-blue-600 text-xs font-bold rounded-lg transition-all shadow-md">Pesan</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RIWAYAT VIEW */}
        {view === 'riwayat' && (
          <div className="max-w-4xl mx-auto px-4 py-16 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black text-slate-900 mb-10 flex items-center tracking-tight leading-none">
              <History className="mr-4 text-blue-600" size={32} /> Riwayat Pesanan
            </h2>
            <div className="grid gap-6">
              {orders.length > 0 ? orders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${
                        order.serviceType === ServiceType.KANTIN ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {order.serviceType === ServiceType.KANTIN ? <Clock size={28} /> : <Navigation size={28} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {order.billingCode}</span>
                          <span className={`px-3 py-1 border rounded-lg text-[9px] font-black uppercase shadow-sm ${getStatusColor(order.status)}`}>{order.status}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-base tracking-tight leading-none">{order.serviceName}</h4>
                        <p className="text-xs text-slate-400 font-medium mt-1">{order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                      <p className="font-black text-blue-700 text-2xl tracking-tighter leading-none">Rp {order.amount.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100 shadow-inner">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                     <History size={32} className="text-slate-200" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Belum Ada Riwayat</h3>
                  <button onClick={() => setView('layanan')} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95">Pesan Sekarang</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LOGIN MITRA VIEW */}
        {view === 'login-mitra' && (
          <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-slate-100">
            <div className="bg-white w-full max-w-md rounded-[3rem] shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 p-10 text-center text-white relative">
                <h3 className="text-2xl font-black tracking-tight leading-none mb-2">Portal Mitra</h3>
                <p className="text-blue-100 text-xs font-medium opacity-80 leading-tight">Manajemen operasional bisnis UIGM.</p>
              </div>
              <div className="p-10">
                 <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Kategori Bisnis</label>
                      <select 
                        value={mitraCategory} 
                        onChange={(e) => setMitraCategory(e.target.value as ServiceType)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-slate-800 transition-all text-sm appearance-none cursor-pointer"
                      >
                        <option value={ServiceType.KANTIN}>Makanan (Kantin Mbak Sri)</option>
                        <option value={ServiceType.KOS}>Kos-Kosan</option>
                        <option value={ServiceType.LAUNDRY}>Laundry</option>
                        <option value={ServiceType.OJEK}>Ojek Kampus</option>
                        <option value={ServiceType.FOTOKOPI}>Fotokopi & Print</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Email Mitra</label>
                      <input type="email" placeholder="owner@mitra.uigm.ac.id" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-slate-800 transition-all text-sm" />
                    </div>
                    <button onClick={() => handleLogin(Role.MITRA)} className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-800 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                      <ShieldCheck size={20} /> Login Mitra
                    </button>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* MITRA DASHBOARD VIEW */}
        {view === 'mitra-dashboard' && user?.role === Role.MITRA && (
          <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4 leading-none mb-2">
                  <Store className="text-blue-600" size={36} /> {user.name}
                </h2>
                <p className="text-sm text-slate-500 font-medium">Panel kontrol operasional UMKM Anda.</p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-blue-700 shadow-md transition-all">
                <PlusCircle size={18} /> Update Produk
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
               {[
                 { label: 'Penjualan', val: 'Rp 1.4M', icon: <BarChart3 className="text-green-500" /> },
                 { label: 'Order Aktif', val: '18', icon: <Clock className="text-amber-500" /> },
                 { label: 'Pajak (5%)', val: 'Rp 72k', icon: <AlertCircle className="text-red-500" /> },
                 { label: 'Dompet', val: 'Rp 1.3M', icon: <Wallet className="text-blue-600" /> }
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                       <div className="p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
                    </div>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{stat.val}</p>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* LOGIN USER VIEW */}
        {view === 'login-user' && (
          <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50">
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
              <div className="md:w-1/2 bg-blue-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={128} /></div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight tracking-tight">Portal SSO<br />UIGM Student</h2>
                  <p className="text-blue-100 text-sm font-medium leading-relaxed opacity-80">Gunakan akun resmi portal akademik untuk akses seluruh layanan UniConnect.</p>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl border border-white/20 flex items-center gap-4 backdrop-blur-xl">
                  <ShieldCheck size={24} className="text-green-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Autentikasi Terintegrasi</p>
                </div>
              </div>
              <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
                <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Login Akun</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Username / NPM</label>
                    <input type="text" placeholder="2023210127" defaultValue="2023210127" className="w-full px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-slate-800 transition-all text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Password SSO</label>
                    <input type="password" placeholder="Password" defaultValue="password" className="w-full px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-slate-800 transition-all text-sm" />
                  </div>
                  <button onClick={() => handleLogin(Role.USER)} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md transition-all active:scale-95">Masuk Sekarang</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl mr-4 shadow-lg shadow-blue-100">U</div>
            <span className="font-black text-slate-900 text-2xl tracking-tighter">UniConnect</span>
          </div>
          <p className="text-slate-400 font-medium text-sm mb-12 max-w-2xl mx-auto leading-relaxed">Pusat layanan mahasiswa terpadu UIGM Palembang.</p>
          <p className="text-[9px] text-slate-300 font-black tracking-[0.4em] uppercase opacity-60">© 2025 UniConnect UIGM Palembang - Yesa Damayanti</p>
        </div>
      </footer>

      {/* MODAL: PAYMENT SELECTION */}
      {showPayment && selectedService && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[70] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 animate-in slide-in-from-bottom-8 duration-300 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-8">
               <button onClick={() => setShowPayment(false)} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"><ArrowLeft size={18}/></button>
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Pilih Bayar</h3>
               <button onClick={() => setShowPayment(false)} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all shadow-sm"><X size={18}/></button>
            </div>
            
            <div className="space-y-4 mb-8">
               {[
                 { id: 'CASH', label: 'Bayar Tunai', desc: 'Bayar saat tiba', icon: <Coins className="text-amber-500" size={24} /> },
                 { id: 'QRIS', label: 'QRIS Dinamis', desc: 'Scan E-Wallet', icon: <QrCode className="text-purple-600" size={24} /> },
                 { id: 'BANK', label: 'Transfer Bank', desc: 'Virtual Account', icon: <Building2 className="text-blue-600" size={24} /> }
               ].map((method) => (
                 <button 
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)} 
                  className={`w-full flex items-center justify-between p-6 rounded-2xl border-4 transition-all group ${paymentMethod === method.id ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-slate-50 hover:border-blue-100'}`}
                 >
                   <div className="flex items-center gap-4">
                     <div className="p-3 bg-white rounded-xl shadow-md">{method.icon}</div>
                     <div className="text-left">
                       <p className="font-bold text-slate-800 text-sm tracking-tight leading-none mb-1">{method.label}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{method.desc}</p>
                     </div>
                   </div>
                   {paymentMethod === method.id && <div className="bg-blue-600 text-white p-1 rounded-full"><Check size={14} /></div>}
                 </button>
               ))}
            </div>

            {paymentMethod === 'QRIS' && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 text-center animate-in zoom-in-95 duration-300">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Scan QRIS UniConnect</p>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 inline-block shadow-lg">
                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=UIGM-PAY-${selectedService.id}`} alt="QRIS" className="w-24 h-24" />
                </div>
              </div>
            )}

            {paymentMethod === 'BANK' && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 animate-in zoom-in-95 duration-300 text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">No. Virtual Account Mandiri</p>
                <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-lg">
                   <p className="text-xl font-bold text-blue-700 tracking-widest font-mono">889210049281</p>
                   <button className="p-2 text-blue-600 bg-blue-50 rounded-lg active:scale-90 shadow-sm"><Copy size={16} /></button>
                </div>
              </div>
            )}

            <div className="p-6 bg-blue-50 rounded-2xl mb-8 border border-blue-100 text-center shadow-inner">
              <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">Total (Pajak 5%)</p>
              <p className="text-3xl font-black text-blue-950 tracking-tighter leading-none">Rp {(selectedService.price * 1.05).toLocaleString('id-ID')}</p>
            </div>

            <div className="space-y-4">
               <button onClick={confirmPayment} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3">
                 <ShieldCheck size={20} /> Konfirmasi Bayar
               </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS ACTION VIEW */}
      {showSuccess && (
        <div className="fixed inset-0 bg-white z-[90] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="max-w-md w-full text-center relative z-10">
            <div className="relative w-32 h-32 mx-auto mb-12">
               <div className="absolute inset-0 bg-green-200 rounded-3xl animate-ping opacity-25"></div>
               <div className="relative w-full h-full bg-green-500 text-white rounded-3xl flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-500">
                  <ThumbsUp size={48} />
               </div>
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">
              Berhasil Dipesan!
            </h3>
            <p className="text-sm text-slate-400 font-medium mb-12 leading-relaxed px-8">Pembayaran telah diterima. Mitra UMKM sedang memproses layanan Anda.</p>
            
            <div className="space-y-4">
              <button 
                onClick={finishAndGoToHistory} 
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg transition-all active:scale-95"
              >
                Cek Pesanan Saya
              </button>
              <button 
                onClick={() => { setShowSuccess(false); setSelectedService(null); setView('home'); }} 
                className="w-full bg-slate-100 text-slate-500 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL */}
      {selectedService && !showPayment && !showSuccess && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-500 shadow-2xl my-8">
            <div className="relative h-64 md:h-80">
              <img src={selectedService.image} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedService(null)} className="absolute top-6 right-6 w-10 h-10 bg-black/30 hover:bg-black/60 backdrop-blur-xl rounded-xl flex items-center justify-center text-white transition-all text-xl border border-white/20 shadow-lg">
                <X size={20} />
              </button>
              <div className="absolute bottom-6 left-6">
                 <div className="bg-white/95 backdrop-blur-lg px-4 py-2 rounded-xl shadow-lg border border-white/50">
                   <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-1 leading-none">Layanan</p>
                   <p className="text-sm font-black text-slate-900 tracking-tight uppercase leading-none">{selectedService.type}</p>
                 </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-8">
                <div className="max-w-2xl">
                  <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-none">{selectedService.name}</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed opacity-80">{selectedService.description}</p>
                </div>
                <div className="text-right bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner min-w-[200px]">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tarif Dasar</p>
                  <p className="text-3xl font-black text-blue-700 tracking-tighter leading-none mb-1">Rp {selectedService.price.toLocaleString('id-ID')}</p>
                </div>
              </div>

              {selectedService.type === ServiceType.OJEK && (
                <div className="space-y-4 mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                  <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Navigation size={18} className="text-blue-600" /> Rute
                  </h4>
                  <div className="space-y-3">
                    <input type="text" placeholder="Titik Jemput" value={ojekPickup} onChange={e => setOjekPickup(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-slate-700 shadow-sm text-sm" />
                    <input type="text" placeholder="Tujuan" value={ojekDest} onChange={e => setOjekDest(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-slate-700 shadow-sm text-sm" />
                  </div>
                </div>
              )}

              <button 
                onClick={() => initiatePayment(selectedService)}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-4 group"
              >
                Pesan & Bayar <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Support Hub */}
      <button className="fixed bottom-8 right-8 bg-green-500 text-white w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center hover:scale-105 active:scale-90 transition-all z-30 border-4 border-white/40">
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

export default App;
