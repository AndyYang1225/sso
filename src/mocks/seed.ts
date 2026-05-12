import type { Member, Order, Product } from '@/types/admin'

export const seedProducts: Product[] = [
  { id: 'P001', name: '無線藍牙耳機 Pro', sku: 'AUD-BT-001', category: '音訊',   price: 2890, stock: 45,  status: 'active',   createdAt: '2025-10-12' },
  { id: 'P002', name: '機械式鍵盤 87鍵',  sku: 'KBD-MX-087', category: '周邊',   price: 3590, stock: 12,  status: 'active',   createdAt: '2025-11-02' },
  { id: 'P003', name: '人體工學滑鼠',    sku: 'MSE-ERG-01',  category: '周邊',   price: 1290, stock: 0,   status: 'active',   createdAt: '2025-11-18' },
  { id: 'P004', name: '4K 顯示器 27"',   sku: 'MON-4K-27',   category: '顯示器', price: 12900, stock: 8,  status: 'active',   createdAt: '2025-12-05' },
  { id: 'P005', name: 'USB-C 擴充基座',  sku: 'DCK-USBC-01', category: '周邊',   price: 2490, stock: 30,  status: 'draft',    createdAt: '2026-01-10' },
  { id: 'P006', name: '降噪耳機 Max',    sku: 'AUD-NC-MAX',  category: '音訊',   price: 8990, stock: 6,   status: 'active',   createdAt: '2026-02-14' },
  { id: 'P007', name: '筆電架 鋁合金',   sku: 'STD-ALU-01',  category: '配件',   price: 890,  stock: 88,  status: 'active',   createdAt: '2026-03-02' },
  { id: 'P008', name: '無線充電盤',      sku: 'CHG-WRL-01',  category: '配件',   price: 690,  stock: 52,  status: 'active',   createdAt: '2026-03-20' },
  { id: 'P009', name: '行動電源 20000',  sku: 'PWR-20K-01',  category: '配件',   price: 1190, stock: 4,   status: 'archived', createdAt: '2025-08-01' },
  { id: 'P010', name: 'Webcam 4K',       sku: 'CAM-4K-01',   category: '周邊',   price: 4290, stock: 15,  status: 'active',   createdAt: '2026-04-05' },
]

export const seedOrders: Order[] = [
  { id: 'O20260422001', customer: '王小明', total: 5780,  status: 'paid',      items: 2, createdAt: '2026-04-22 14:21' },
  { id: 'O20260422002', customer: '李美華', total: 12900, status: 'shipped',   items: 1, createdAt: '2026-04-22 11:03' },
  { id: 'O20260421005', customer: '陳大文', total: 890,   status: 'completed', items: 1, createdAt: '2026-04-21 19:45' },
  { id: 'O20260421004', customer: '林雅婷', total: 3580,  status: 'pending',   items: 2, createdAt: '2026-04-21 17:10' },
  { id: 'O20260421003', customer: '張志明', total: 21790, status: 'paid',      items: 3, createdAt: '2026-04-21 09:32' },
  { id: 'O20260420007', customer: '黃小琪', total: 690,   status: 'cancelled', items: 1, createdAt: '2026-04-20 22:18' },
  { id: 'O20260420006', customer: '吳俊傑', total: 8990,  status: 'completed', items: 1, createdAt: '2026-04-20 15:55' },
]

export const seedMembers: Member[] = [
  { id: 'M001', name: '王小明', email: 'wang@demo.local',  level: 'gold',   totalSpent: 45820, joinedAt: '2024-03-12' },
  { id: 'M002', name: '李美華', email: 'lee@demo.local',   level: 'vip',    totalSpent: 128900, joinedAt: '2023-11-05' },
  { id: 'M003', name: '陳大文', email: 'chen@demo.local',  level: 'silver', totalSpent: 12340, joinedAt: '2024-08-22' },
  { id: 'M004', name: '林雅婷', email: 'lin@demo.local',   level: 'bronze', totalSpent: 3580,  joinedAt: '2025-01-18' },
  { id: 'M005', name: '張志明', email: 'chang@demo.local', level: 'gold',   totalSpent: 62110, joinedAt: '2024-05-30' },
  { id: 'M006', name: '黃小琪', email: 'huang@demo.local', level: 'bronze', totalSpent: 690,   joinedAt: '2026-02-14' },
  { id: 'M007', name: '吳俊傑', email: 'wu@demo.local',    level: 'silver', totalSpent: 18990, joinedAt: '2024-12-01' },
]
