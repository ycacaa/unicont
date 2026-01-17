
import { Service, ServiceType } from './types';

const generateMockData = () => {
  const data: Service[] = [];

  // 15 KANTIN (Food & Drink)
  const foods = [
    'Kantin Mbak Sri', 'Geprek Juara UIGM', 'Pempek Cek Siti', 'Tekwan Mang Ujang', 
    'Mie Ayam Mas Bro', 'Bakso Granat Kampus', 'Nasi Goreng Gila', 'Sate Madura UIGM', 
    'Martabak Bangka 88', 'Batagor Bandung', 'Bubur Ayam Cirebon', 'Nasi Uduk Mpok', 
    'Gado-Gado Siram', 'Soto Ayam Lamongan', 'Kebab Turki Express'
  ];
  foods.forEach((name, i) => {
    data.push({
      id: `food_${i}`,
      name: name,
      type: ServiceType.KANTIN,
      price: 15000 + (i * 1000),
      distance: `${(0.1 + i * 0.05).toFixed(2)} km`,
      description: `Sajian favorit mahasiswa UIGM. ${name} menyajikan hidangan segar, nikmat, dan sangat bersahabat dengan kantong mahasiswa. Higienis terjamin.`,
      rating: 4.5 + (Math.random() * 0.5),
      image: `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400&h=300&sig=food${i}`,
      category: 'Semua'
    });
  });

  // 15 KOS (Boarding Houses)
  const kosNames = [
    'Kos Melati', 'Kos Mawar Putih', 'Kos Elit UIGM', 'Kos Bahagia', 'Kos Barokah', 
    'Kos Anggrek Biru', 'Kos Cempaka', 'Kos Kenanga', 'Kos Wijaya Kusuma', 'Kos Permata', 
    'Kos Syariah UIGM', 'Kos Modern', 'Kos Nyaman', 'Kos Hemat Mahasiswa', 'Kos Strategis'
  ];
  kosNames.forEach((name, i) => {
    data.push({
      id: `kos_${i}`,
      name: name,
      type: ServiceType.KOS,
      price: 650000 + (i * 50000),
      distance: `${(0.3 + i * 0.1).toFixed(1)} km`,
      description: `Hunian nyaman dengan fasilitas lengkap untuk mahasiswa: WiFi kencang, Kamar Mandi Dalam, Kasur, Lemari, dan lingkungan aman 24 jam.`,
      rating: 4.2 + (Math.random() * 0.8),
      image: `https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400&h=300&sig=room${i}`,
      category: i % 2 === 0 ? 'Putri' : 'Putra'
    });
  });

  // 15 LAUNDRY (Cleaning Services)
  const laundryNames = [
    'Bersih Laundry', 'Express Clean UIGM', 'Harum Laundry', 'Wangi Laundry', 
    'Kilat Laundry', 'Washing Station', 'Bubble Wash', 'Fresh Laundry', 
    'Smart Wash', 'Clean & Go', 'Laundry Barokah', 'Super Clean', 
    'Daily Wash', 'Eco Laundry', 'UIGM Clean Service'
  ];
  laundryNames.forEach((name, i) => {
    data.push({
      id: `laundry_${i}`,
      name: name,
      type: ServiceType.LAUNDRY,
      price: 6000 + (i * 500),
      distance: `${(0.2 + i * 0.1).toFixed(1)} km`,
      description: `Cuci kering gosok harum semerbak, selesai dalam 24 jam. Pakaian Anda kami jaga dengan deterjen premium agar warna tetap awet.`,
      rating: 4.0 + (Math.random() * 1.0),
      image: `https://images.unsplash.com/photo-1545173153-5dd9215c6f3d?auto=format&fit=crop&q=80&w=400&h=300&sig=laundry${i}`,
      category: 'Semua'
    });
  });

  // 15 FOTOKOPI (Printing & Stationery)
  const printNames = [
    'Jaya Copy Center', 'UIGM Print', 'Digital Copy', 'Smart Print Hub', 
    'Berkah Fotokopi', 'Abadi Printing', 'Flash Copy', 'Laser Print UIGM', 
    'Sahabat Print', 'Media Copy', 'Dunia Printing', 'Global Copy', 
    'Indo Print Hub', 'Mandiri Copy', 'Sukses Printing'
  ];
  printNames.forEach((name, i) => {
    data.push({
      id: `print_${i}`,
      name: name,
      type: ServiceType.FOTOKOPI,
      price: 500 + (i * 50),
      distance: `${(0.1 + i * 0.05).toFixed(2)} km`,
      description: `Print tugas, skripsi, dan fotokopi murah berkualitas tinggi. Hasil cetak tajam, jilid rapi, dan pengerjaan kilat untuk deadline.`,
      rating: 4.4 + (Math.random() * 0.6),
      image: `https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=400&h=300&sig=print${i}`,
      category: 'Semua'
    });
  });

  // 15 OJEK (Transportation)
  const ojekNames = [
    'Ojek Kampus Express', 'Driver UIGM Hub', 'Ojek Kilat', 'Sahabat Driver', 
    'Bang Kurir UIGM', 'Ojek Mahasiswa', 'Motor Santai', 'Driver Handal', 
    'UIGM Ride', 'Palembang Bike', 'Cepat Sampai', 'Mitra Go UIGM', 
    'Bike Hub', 'Ojek Barokah', 'Kampus Ride'
  ];
  ojekNames.forEach((name, i) => {
    data.push({
      id: `ojek_${i}`,
      name: name,
      type: ServiceType.OJEK,
      price: 5000 + (i * 200),
      distance: '0.0 km (Standby)',
      description: `Antar jemput mahasiswa area UIGM dan sekitarnya dengan aman, nyaman, dan driver yang sudah terverifikasi kampus. Helm bersih.`,
      rating: 4.8 + (Math.random() * 0.2),
      image: `https://images.unsplash.com/photo-1558981403-c5f91cbba527?auto=format&fit=crop&q=80&w=400&h=300&sig=bike${i}`,
      category: 'Semua'
    });
  });

  return data;
};

export const MOCK_SERVICES: Service[] = generateMockData();
