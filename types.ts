
export enum Role {
  USER = 'USER',
  MITRA = 'MITRA',
  GUEST = 'GUEST'
}

export enum ServiceType {
  KOS = 'Kos',
  LAUNDRY = 'Laundry',
  OJEK = 'Ojek',
  KANTIN = 'Kantin',
  FOTOKOPI = 'Fotokopi'
}

export type OrderStatus = 'Sukses' | 'Pending' | 'Gagal' | 'Disiapkan' | 'Siap Diambil' | 'Driver Menuju Lokasi' | 'Dalam Perjalanan' | 'Selesai';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  npm?: string;
}

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  price: number;
  distance: string;
  description: string;
  rating: number;
  image: string;
  category: 'Semua' | 'Putri' | 'Putra';
}

export interface Order {
  id: string;
  serviceName: string;
  serviceType: ServiceType;
  amount: number;
  date: string;
  status: OrderStatus;
  billingCode: string;
  pickup?: string;
  destination?: string;
}
