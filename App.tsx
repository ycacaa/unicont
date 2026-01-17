
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
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-8 border-blue-50 rounded-full"></div>
        <div className="absolute inset-0 border-8 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-blue-600 font-black text-2xl tracking-tighter animate-pulse uppercase">Memproses Transaksi...</p>
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
      <div className="flex justify-between h-20 items-center">
        <div 
          className="flex items-center cursor-pointer group" 
          onClick={() => setView('home')}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-200 group-hover:scale-110 group-active:scale-95 transition-all">U</div>
          <div className="ml-4">
            <span className="text-2xl font-black text-slate-900 tracking-tighter block leading-none mb-1">UniConnect</span>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest leading-none">UIGM Palembang</p>
          </div>
        </div>
        
        <div className="hidden md:flex space-x-12">
          <button onClick={() => setView('home')} className={`${currentView === 'home' ? 'text-blue-600 font-black relative after:content-[""] after:absolute after:-bottom-7 after:left-0 after:w-full after:h-1 after:bg-blue-600 after:rounded-full' : 'text-slate-500 font-bold hover:text-blue-600'} text-sm transition-all`}>
            Beranda
          </button>
          
          {user?.role !== Role.MITRA && (
            <button onClick={() => setView('layanan')} className={`${currentView === 'layanan' ? 'text-blue-600 font-black relative after:content-[""] after:absolute after:-bottom-7 after:left-0 after:w-full after:h-1 after:bg-blue-600 after:rounded-full' : 'text-slate-500 font-bold hover:text-blue-600'} text-sm transition-all`}>
              Layanan
            </button>
          )}

          {user?.role === Role.USER && (
            <button onClick={() => setView('riwayat')} className={`${currentView === 'riwayat' ? 'text-blue-600 font-black relative after:content-[""] after:absolute after:-bottom-7 after:left-0 after:w-full after:h-1 after:bg-blue-600 after:rounded-full' : 'text-slate-500 font-bold hover:text-blue-600'} text-sm transition-all`}>
              Pesanan
            </button>
          )}

          {user?.role === Role.MITRA && (
            <button onClick={() => setView('mitra-dashboard')} className={`${currentView === 'mitra-dashboard' ? 'text-blue-600 font-black relative after:content-[""] after:absolute after:-bottom-7 after:left-0 after:w-full after:h-1 after:bg-blue-600 after:rounded-full' : 'text-slate-500 font-bold hover:text-blue-600'} text-sm transition-all`}>
              Dashboard Mitra
            </button>
          )}
        </div>

        <div className="flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none mb-1">{user.name}</p>
                <p className={`text-[10px] font-black px-3 py-1 rounded-lg tracking-widest uppercase shadow-sm ${user.role === Role.MITRA ? 'text-purple-600 bg-purple-50' : 'text-blue-600 bg-blue-50'}`}>
                  {user.role === Role.MITRA ? 'Mitra UMKM' : 'SSO Student'}
                </p>
              </div>
              <button onClick={() => setView('profile')} className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white border-4 border-white shadow-2xl hover:scale-105 transition-transform"><UserIcon size={22} /></button>
              <button onClick={handleLogout} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><LogOut size={24} /></button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <button onClick={() => setView('login-user')} className="px-7 py-3 text-sm font-black text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">Mahasiswa</button>
              <button onClick={() => setView('login-mitra')} className="px-7 py-3 text-sm font-black bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-2xl shadow-blue-100 transition-all active:scale-95">Mitra Usaha</button>
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

  // Simulation of order status updates
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
      let name = 'Mahasiswa UIGM';
      if (isMitra) {
        // Updated names based on user feedback
        if (mitraCategory === ServiceType.KANTIN) name = 'Kantin Mbak Sri (Official)';
        else if (mitraCategory === ServiceType.KOS) name = 'Manajemen Kos Melati';
        else if (mitraCategory === ServiceType.LAUNDRY) name = 'Owner Harum Laundry Hub';
        else if (mitraCategory === ServiceType.OJEK) name = 'Mitra Driver Ojek UIGM';
        else if (mitraCategory === ServiceType.FOTOKOPI) name = 'Fotokopi & Print Center Berkah';
      } else {
        name = 'Yesa Damayanti';
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
    }, 1000);
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
  };

  const initiatePayment = (service: Service) => {
    if (!user) {
      alert("Akses SSO Diperlukan: Silakan login sebagai Mahasiswa terlebih dahulu.");
      setView('login-user');
      return;
    }
    setSelectedService(service);
    setShowPayment(true);
  };

  const confirmPayment = () => {
    setLoading(true);
    // Fixed payment flow logic to ensure clear transition
    setTimeout(() => {
      const billingCode = `UC-${Math.floor(100000 + Math.random() * 900000)}`;
      const taxRate = 0.05; 
      
      let basePrice = selectedService?.price || 0;
      if (selectedService?.type === ServiceType.OJEK) {
        const simulatedDistKm = Math.floor(Math.random() * 3) + 1;
        basePrice = 5000 + (simulatedDistKm * 2000);
      }

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
    }, 1500);
  };

  const finishAndGoToHistory = () => {
    setShowSuccess(false);
    setSelectedService(null);
    setOjekPickup('');
    setOjekDest('');
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
          <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
            <section className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white py-24 md:py-40 px-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[140px] -mr-48 -mt-48 animate-pulse"></div>
              <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                <div className="flex items-center space-x-3 px-7 py-3.5 bg-white/10 rounded-full backdrop-blur-3xl mb-12 border border-white/20 animate-bounce shadow-2xl">
                  <span className="w-3.5 h-3.5 bg-green-400 rounded-full shadow-[0_0_20px_#4ade80]"></span>
                  <span className="text-sm font-black tracking-[0.3em] uppercase">Student Hub UIGM Palembang</span>
                </div>
                <h1 className="text-7xl md:text-[11rem] font-black mb-14 leading-[0.8] tracking-tighter">
                  UniConnect<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-indigo-300">UIGM Hub</span>
                </h1>
                <p className="text-xl md:text-3xl text-blue-100/70 mb-20 max-w-5xl font-medium leading-relaxed">Ekosistem digital terpadu mahasiswa UIGM Palembang. Akses 75+ layanan UMKM terpercaya mulai dari Kantin Mbak Sri hingga Manajemen Kos.</p>
                <div className="flex flex-col sm:flex-row gap-8">
                  <button onClick={() => setView('layanan')} className="bg-white text-blue-950 px-16 py-8 rounded-[3.5rem] font-black text-3xl hover:shadow-[0_30px_90px_rgba(255,255,255,0.3)] hover:-translate-y-2 active:scale-95 transition-all flex items-center justify-center group shadow-2xl">
                    Mulai Jelajah <ChevronRight className="ml-2 group-hover:translate-x-3 transition-transform" size={40} />
                  </button>
                  <button onClick={() => setView('login-mitra')} className="bg-blue-600/20 border border-white/30 text-white px-16 py-8 rounded-[3.5rem] font-black text-3xl hover:bg-blue-600 transition-all flex items-center justify-center gap-5 backdrop-blur-3xl active:scale-95 shadow-2xl">
                    <Store size={40} /> Portal Mitra
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* LAYANAN VIEW */}
        {view === 'layanan' && (
          <div className="max-w-7xl mx-auto px-4 py-24 animate-in slide-in-from-bottom-12 duration-700">
            <div className="flex flex-col lg:flex-row gap-16">
              <aside className="lg:w-1/4">
                <div className="bg-white p-12 rounded-[4.5rem] shadow-sm border border-slate-100 sticky top-32">
                  <h3 className="text-3xl font-black mb-14 text-slate-900 tracking-tighter">Kategori</h3>
                  <div className="space-y-4">
                    {Object.values(ServiceType).map(type => (
                      <button 
                        key={type}
                        onClick={() => setServiceFilter(type)}
                        className={`w-full text-left px-10 py-7 rounded-[2.5rem] text-sm font-black transition-all flex justify-between items-center group active:scale-95 ${serviceFilter === type ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                      >
                        <span className="flex items-center gap-5">
                          {type === ServiceType.KANTIN && <Clock size={24} />}
                          {type === ServiceType.OJEK && <Navigation size={24} />}
                          {type === ServiceType.KOS && <Home size={24} />}
                          {type === ServiceType.LAUNDRY && <Truck size={24} />}
                          {type === ServiceType.FOTOKOPI && <History size={24} />}
                          {type}
                        </span>
                        {serviceFilter === type && <Check size={20} />}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="lg:w-3/4">
                <div className="mb-20 flex flex-col md:flex-row items-center justify-between gap-12">
                  <h2 className="text-7xl font-black text-slate-900 tracking-tighter leading-none">{serviceFilter} <span className="text-blue-600">UIGM</span></h2>
                  <div className="flex bg-slate-200/60 p-2.5 rounded-[2.5rem] shadow-inner backdrop-blur-md">
                    {['Semua', 'Putri', 'Putra'].map(cat => (
                      <button key={cat} onClick={() => setActiveTab(cat)} className={`px-14 py-4 text-xs font-black rounded-[2rem] transition-all shadow-sm ${activeTab === cat ? 'bg-white text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}>{cat}</button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-12">
                  {filteredServices.map(service => (
                    <div key={service.id} className="group bg-white hover:bg-blue-50/20 p-10 rounded-[4.5rem] border border-slate-100 hover:border-blue-200 hover:shadow-2xl transition-all cursor-pointer flex flex-col md:flex-row items-center gap-14" onClick={() => setSelectedService(service)}>
                      <div className="w-full md:w-72 h-64 rounded-[3.5rem] overflow-hidden flex-shrink-0 shadow-2xl group-hover:scale-105 transition-all">
                        <img src={service.image} className="w-full h-full object-cover group-hover:rotate-1 transition-transform duration-1000" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-5 mb-5">
                           <h4 className="font-black text-slate-900 text-4xl tracking-tight leading-none">{service.name}</h4>
                           <span className="bg-amber-100 text-amber-700 text-xs px-5 py-2 rounded-full font-black flex items-center shadow-sm"><Star size={16} className="fill-current mr-1.5" /> {service.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-slate-500 font-medium mb-10 text-2xl line-clamp-2 leading-relaxed opacity-80">{service.description}</p>
                        <div className="flex items-center gap-12 text-sm font-black text-slate-400">
                          <span className="flex items-center"><MapPin size={24} className="mr-3 text-red-500" /> {service.distance}</span>
                          <span className="flex items-center"><Clock size={24} className="mr-3 text-blue-500" /> Siap Melayani</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-center md:text-right bg-slate-50/50 p-12 rounded-[3.5rem] border border-slate-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-50">Mulai Dari</p>
                        <p className="text-5xl font-black mb-8 tracking-tighter">Rp {service.price.toLocaleString('id-ID')}</p>
                        <button className="w-full px-12 py-5 bg-blue-600 text-white group-hover:bg-white group-hover:text-blue-600 text-sm font-black rounded-[1.5rem] transition-all shadow-xl active:scale-95">Pesan Sekarang</button>
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
          <div className="max-w-6xl mx-auto px-4 py-28 animate-in fade-in duration-700">
            <h2 className="text-7xl font-black text-slate-900 mb-20 flex items-center tracking-tighter leading-none">
              <History className="mr-10 text-blue-600" size={80} /> Riwayat Pesanan
            </h2>
            <div className="grid gap-14">
              {orders.length > 0 ? orders.map(order => (
                <div key={order.id} className="bg-white p-14 rounded-[5.5rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-2xl transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-14 mb-16">
                    <div className="flex items-center gap-12">
                      <div className={`w-32 h-32 rounded-[3rem] flex items-center justify-center shadow-inner ${
                        order.serviceType === ServiceType.KANTIN ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {order.serviceType === ServiceType.KANTIN ? <Clock size={64} /> : <Navigation size={64} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-5 mb-5">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">ID: {order.billingCode}</span>
                          <span className={`px-7 py-2.5 border rounded-full text-xs font-black uppercase shadow-sm tracking-[0.1em] ${getStatusColor(order.status)}`}>{order.status}</span>
                        </div>
                        <h4 className="font-black text-slate-900 text-5xl tracking-tight leading-none">{order.serviceName}</h4>
                        <p className="text-2xl text-slate-400 font-bold mt-4">{order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Akhir</p>
                      <p className="font-black text-blue-700 text-7xl tracking-tighter leading-none">Rp {order.amount.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-48 text-center bg-white rounded-[6rem] border-4 border-dashed border-slate-100 shadow-inner">
                  <div className="w-36 h-36 bg-slate-50 rounded-[3rem] flex items-center justify-center mx-auto mb-12">
                     <History size={72} className="text-slate-200" />
                  </div>
                  <h3 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-none">Belum Ada Riwayat</h3>
                  <button onClick={() => setView('layanan')} className="bg-blue-600 text-white px-16 py-7 rounded-[3rem] font-black text-2xl hover:shadow-2xl transition-all active:scale-95">Pesan Sekarang</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LOGIN MITRA VIEW */}
        {view === 'login-mitra' && (
          <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-100">
            <div className="bg-white w-full max-w-2xl rounded-[6rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.18)] overflow-hidden animate-in zoom-in-95 duration-700">
              <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 p-20 text-center text-white relative">
                <div className="absolute top-0 right-0 p-12 opacity-10"><Store size={200} /></div>
                <h3 className="text-6xl font-black tracking-tighter leading-none mb-4">Portal Mitra</h3>
                <p className="text-blue-100 text-2xl font-medium opacity-80 leading-tight">Manajemen operasional bisnis UIGM.</p>
              </div>
              <div className="p-20">
                 <div className="space-y-12">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4">Kategori Bisnis</label>
                      <select 
                        value={mitraCategory} 
                        onChange={(e) => setMitraCategory(e.target.value as ServiceType)}
                        className="w-full px-12 py-8 bg-slate-50 border border-slate-100 rounded-[3rem] focus:ring-4 focus:ring-blue-100 outline-none font-black text-slate-800 transition-all text-xl shadow-sm"
                      >
                        <option value={ServiceType.KANTIN}>Makanan & Minuman (Kantin Mbak Sri)</option>
                        <option value={ServiceType.KOS}>Properti & Kos-Kosan</option>
                        <option value={ServiceType.LAUNDRY}>Jasa Cuci & Laundry</option>
                        <option value={ServiceType.OJEK}>Layanan Ojek Kampus</option>
                        <option value={ServiceType.FOTOKOPI}>Fotokopi & Print Center</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4">Email Terdaftar</label>
                      <input type="email" placeholder="owner@mitra.uigm.ac.id" className="w-full px-12 py-8 bg-slate-50 border border-slate-100 rounded-[3rem] focus:ring-4 focus:ring-blue-100 outline-none font-black text-slate-800 transition-all text-xl shadow-sm" />
                    </div>
                    <button onClick={() => handleLogin(Role.MITRA)} className="w-full bg-blue-700 text-white py-9 rounded-[3.5rem] font-black text-3xl hover:bg-blue-800 shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-6">
                      <ShieldCheck size={40} /> Login Mitra
                    </button>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* MITRA DASHBOARD VIEW */}
        {view === 'mitra-dashboard' && user?.role === Role.MITRA && (
          <div className="max-w-7xl mx-auto px-4 py-28 animate-in fade-in duration-700">
            <h2 className="text-8xl font-black text-slate-900 tracking-tighter flex items-center gap-10 leading-none mb-16">
              <Store className="text-blue-600" size={96} /> {user.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
               {[
                 { label: 'Penjualan Kotor', val: 'Rp 1.450.000', icon: <BarChart3 className="text-green-500" /> },
                 { label: 'Pesanan Aktif', val: '18 Order', icon: <Clock className="text-amber-500" /> },
                 { label: 'Pajak UniConnect (5%)', val: 'Rp 72.500', icon: <AlertCircle className="text-red-500" /> },
                 { label: 'Saldo Dompet', val: 'Rp 1.377.500', icon: <Wallet className="text-blue-600" /> }
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-14 rounded-[4.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
                    <div className="flex items-center justify-between mb-8">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{stat.label}</p>
                       <div className="p-4 bg-slate-50 rounded-[1.5rem]">{stat.icon}</div>
                    </div>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{stat.val}</p>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* LOGIN USER VIEW */}
        {view === 'login-user' && (
          <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50">
            <div className="bg-white w-full max-w-6xl rounded-[6rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-700">
              <div className="md:w-1/2 bg-blue-800 p-24 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-16 opacity-10 scale-[2.5]"><ShieldCheck size={256} /></div>
                <h2 className="text-7xl font-black mb-12 leading-[0.85] tracking-tighter">Login SSO<br />UIGM Student</h2>
                <div className="bg-white/10 p-10 rounded-[3rem] border border-white/20 flex items-center gap-10 backdrop-blur-2xl">
                  <ShieldCheck size={64} className="text-green-400" />
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.4em]">Autentikasi Aman</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-24 flex flex-col justify-center bg-white">
                <h3 className="text-6xl font-black text-slate-900 mb-16 tracking-tighter leading-none">Login Akun</h3>
                <div className="space-y-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-5">Username / NPM Mahasiswa</label>
                    <input type="text" placeholder="2023210127" defaultValue="2023210127" className="w-full px-14 py-8 bg-slate-50 border border-slate-100 rounded-[3.5rem] focus:ring-4 focus:ring-blue-100 outline-none font-black text-slate-800 transition-all text-2xl shadow-sm" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-5">Sandi SSO Portal</label>
                    <input type="password" placeholder="Password" defaultValue="password" className="w-full px-14 py-8 bg-slate-50 border border-slate-100 rounded-[3.5rem] focus:ring-4 focus:ring-blue-100 outline-none font-black text-slate-800 transition-all text-2xl shadow-sm" />
                  </div>
                  <button onClick={() => handleLogin(Role.USER)} className="w-full bg-blue-600 text-white py-9 rounded-[3.5rem] font-black text-4xl hover:bg-blue-700 shadow-2xl transition-all active:scale-95">Masuk Sekarang</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: PAYMENT SELECTION */}
      {showPayment && selectedService && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl z-[70] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[6rem] p-16 animate-in slide-in-from-bottom-32 duration-500 shadow-2xl my-12">
            <div className="flex items-center justify-between mb-16">
               <button onClick={() => setShowPayment(false)} className="w-16 h-16 bg-slate-50 text-slate-400 rounded-[1.5rem] flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 shadow-sm"><ArrowLeft size={36}/></button>
               <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Pilih Bayar</h3>
               <div className="w-16 h-16"></div>
            </div>
            
            <div className="space-y-6 mb-16">
               {[
                 { id: 'CASH', label: 'Bayar Tunai', desc: 'Bayar saat pesanan tiba', icon: <Coins className="text-amber-500" size={40} /> },
                 { id: 'QRIS', label: 'QRIS Dinamis', desc: 'Scan OVO, Dana, Gopay', icon: <QrCode className="text-purple-600" size={40} /> },
                 { id: 'BANK', label: 'Virtual Account', desc: 'Transfer Mandiri / BCA', icon: <Building2 className="text-blue-600" size={40} /> }
               ].map((method) => (
                 <button 
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)} 
                  className={`w-full flex items-center justify-between p-12 rounded-[3.5rem] border-[5px] transition-all group active:scale-[0.98] ${paymentMethod === method.id ? 'border-blue-600 bg-blue-50/50 shadow-2xl' : 'border-slate-50 hover:border-blue-100'}`}
                 >
                   <div className="flex items-center gap-10">
                     <div className="p-6 bg-white rounded-[2rem] shadow-xl">{method.icon}</div>
                     <div className="text-left">
                       <p className="font-black text-slate-800 text-3xl tracking-tight leading-none mb-2">{method.label}</p>
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{method.desc}</p>
                     </div>
                   </div>
                   {paymentMethod === method.id && <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg"><Check size={28} /></div>}
                 </button>
               ))}
            </div>

            {/* DYNAMIC PAYMENT DETAILS */}
            {paymentMethod === 'QRIS' && (
              <div className="bg-slate-50/80 p-14 rounded-[4rem] border-2 border-slate-100 mb-14 text-center animate-in zoom-in-95 duration-500">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10">Pindai QRIS UniConnect</p>
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 inline-block shadow-3xl">
                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=UIGM-PAYMENT-${selectedService.id}`} alt="QRIS" className="w-56 h-56" />
                </div>
                <p className="mt-12 text-sm font-black text-slate-500 italic opacity-50 px-10">"Scan menggunakan aplikasi Mobile Banking atau E-Wallet Anda"</p>
              </div>
            )}

            {paymentMethod === 'BANK' && (
              <div className="bg-slate-50/80 p-14 rounded-[4rem] border-2 border-slate-100 mb-14 animate-in zoom-in-95 duration-500 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10">Nomor Virtual Account</p>
                <div className="flex items-center justify-between bg-white px-12 py-10 rounded-[2.5rem] border border-slate-200 shadow-2xl">
                   <p className="text-5xl font-black text-blue-700 tracking-[0.2em] font-mono">889210049281</p>
                   <button className="p-5 text-blue-600 bg-blue-50 rounded-2xl active:scale-90 shadow-sm"><Copy size={32} /></button>
                </div>
                <p className="mt-12 text-[10px] font-black text-slate-400 leading-relaxed uppercase tracking-[0.4em] opacity-60">A/N UniConnect UIGM Palembang</p>
              </div>
            )}

            <div className="p-14 bg-blue-50/80 rounded-[4.5rem] mb-16 border-2 border-blue-100 text-center">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">Total (Incl. Pajak 5%)</p>
              <p className="text-7xl font-black text-blue-950 tracking-tighter leading-none">Rp {(selectedService.price * 1.05).toLocaleString('id-ID')}</p>
            </div>

            <div className="space-y-6">
               <button onClick={confirmPayment} className="w-full bg-blue-600 text-white py-10 rounded-[3.5rem] font-black text-4xl hover:bg-blue-700 shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-6 group">
                 <ShieldCheck size={44} className="group-hover:scale-110 transition-transform" /> Konfirmasi Bayar
               </button>
               <button onClick={() => setShowPayment(false)} className="w-full text-slate-400 font-black py-5 text-sm hover:text-red-500 transition-colors uppercase tracking-[0.5em] text-center">Batalkan</button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS ACTION VIEW */}
      {showSuccess && (
        <div className="fixed inset-0 bg-white z-[90] flex items-center justify-center p-10 animate-in fade-in duration-500">
          <div className="max-w-2xl w-full text-center relative z-10">
            <div className="relative w-64 h-64 mx-auto mb-20">
               <div className="absolute inset-0 bg-green-200 rounded-[5.5rem] animate-ping opacity-25"></div>
               <div className="relative w-full h-full bg-green-500 text-white rounded-[5.5rem] flex items-center justify-center shadow-2xl animate-in zoom-in-50 duration-700">
                  <ThumbsUp size={128} />
               </div>
            </div>
            
            <h3 className="text-8xl font-black text-slate-900 mb-10 tracking-tighter leading-[0.85]">
              Berhasil<br /><span className="text-green-500">Dipesan!</span>
            </h3>
            <p className="text-3xl text-slate-400 font-medium mb-20 leading-relaxed px-16">Terima kasih! Pembayaran Anda telah diterima. Mitra UMKM sedang memproses layanan Anda sekarang.</p>
            
            <div className="space-y-8">
              <button 
                onClick={finishAndGoToHistory} 
                className="w-full bg-blue-600 text-white py-10 rounded-[3.5rem] font-black text-4xl hover:bg-blue-700 shadow-2xl transition-all flex items-center justify-center gap-7 active:scale-95"
              >
                Cek Pesanan Saya <ChevronRight size={48} />
              </button>
              <button 
                onClick={() => { setShowSuccess(false); setSelectedService(null); setView('home'); }} 
                className="w-full bg-slate-100 text-slate-500 py-8 rounded-[3.5rem] font-black text-3xl hover:bg-slate-200 transition-all flex items-center justify-center gap-5 active:scale-95"
              >
                <ArrowLeft size={36} /> Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL */}
      {selectedService && !showPayment && !showSuccess && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-3xl z-[60] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-[6rem] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-12 duration-700 shadow-2xl my-12">
            <div className="relative h-[550px]">
              <img src={selectedService.image} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedService(null)} className="absolute top-14 right-14 w-20 h-20 bg-black/30 hover:bg-black/60 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center text-white transition-all text-3xl border border-white/20 shadow-2xl active:scale-90">
                <X size={44} />
              </button>
              <div className="absolute bottom-14 left-14">
                 <div className="bg-white/95 backdrop-blur-3xl px-12 py-5 rounded-[2.5rem] shadow-3xl border border-white/50">
                   <p className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">{selectedService.type}</p>
                 </div>
              </div>
            </div>
            
            <div className="p-20">
              <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-14">
                <div className="max-w-3xl">
                  <h3 className="text-8xl font-black text-slate-900 mb-10 tracking-tighter leading-[0.8]">{selectedService.name}</h3>
                  <p className="text-slate-500 font-medium text-4xl leading-relaxed opacity-80">{selectedService.description}</p>
                </div>
                <div className="text-right bg-slate-50 p-14 rounded-[4rem] border border-slate-100 shadow-inner flex flex-col items-end min-w-[300px]">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5">Tarif Dasar</p>
                  <p className="text-7xl font-black text-blue-700 tracking-tighter leading-none mb-3">Rp {selectedService.price.toLocaleString('id-ID')}</p>
                </div>
              </div>

              {selectedService.type === ServiceType.OJEK && (
                <div className="space-y-8 mb-16 bg-slate-50 p-14 rounded-[5rem] border border-slate-100 shadow-inner relative">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-[0.5em] mb-12 flex items-center gap-6 relative z-10">
                    <Navigation size={36} className="text-blue-600" /> Tentukan Rute Perjalanan
                  </h4>
                  <div className="space-y-6 relative z-10">
                    <input type="text" placeholder="Titik Jemput (Contoh: Lobi Utama UIGM)" value={ojekPickup} onChange={e => setOjekPickup(e.target.value)} className="w-full px-12 py-8 bg-white border-2 border-slate-100 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-blue-100 font-black text-slate-700 shadow-sm text-2xl transition-all" />
                    <input type="text" placeholder="Tujuan Anda (Contoh: Kos Melati)" value={ojekDest} onChange={e => setOjekDest(e.target.value)} className="w-full px-12 py-8 bg-white border-2 border-slate-100 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-blue-100 font-black text-slate-700 shadow-sm text-2xl transition-all" />
                  </div>
                </div>
              )}

              {selectedService.type === ServiceType.KANTIN && (
                <div className="mb-16 flex items-center justify-between bg-amber-50/50 p-14 rounded-[5rem] border border-amber-100 group shadow-inner">
                  <div className="flex items-center gap-12">
                    <div className="p-10 bg-white rounded-[3rem] text-amber-500 shadow-2xl group-hover:scale-110 transition-transform"><Clock size={64} /></div>
                    <div>
                      <p className="text-5xl font-black text-amber-600 tracking-tighter leading-none">Estimasi Siap 15 Menit</p>
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={() => initiatePayment(selectedService)}
                className="w-full bg-blue-600 text-white py-12 rounded-[4rem] font-black text-[3.5rem] hover:bg-blue-700 shadow-[0_35px_100px_rgba(59,130,246,0.35)] transition-all active:scale-95 flex items-center justify-center gap-10 group shadow-2xl"
              >
                Pesan & Bayar <ChevronRight size={64} className="group-hover:translate-x-5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
