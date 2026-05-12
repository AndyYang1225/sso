export interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: 'active' | 'draft' | 'archived'
  image?: string
  createdAt: string
}

export interface Order {
  id: string
  customer: string
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  items: number
  createdAt: string
}

export interface Member {
  id: string
  name: string
  email: string
  level: 'bronze' | 'silver' | 'gold' | 'vip'
  totalSpent: number
  joinedAt: string
}
