import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Member, Order, Product } from '@/types/admin'
import { seedMembers, seedOrders, seedProducts } from '@/mocks/seed'

export const useAdminStore = defineStore(
  'admin',
  () => {
    const products = ref<Product[]>([...seedProducts])
    const orders = ref<Order[]>([...seedOrders])
    const members = ref<Member[]>([...seedMembers])

    const productCount = computed(() => products.value.length)
    const activeProductCount = computed(
      () => products.value.filter((p) => p.status === 'active').length,
    )
    const lowStockCount = computed(
      () => products.value.filter((p) => p.stock > 0 && p.stock < 10).length,
    )
    const outOfStockCount = computed(
      () => products.value.filter((p) => p.stock === 0).length,
    )
    const revenue = computed(() =>
      orders.value
        .filter((o) => o.status === 'paid' || o.status === 'shipped' || o.status === 'completed')
        .reduce((sum, o) => sum + o.total, 0),
    )
    const pendingOrderCount = computed(
      () => orders.value.filter((o) => o.status === 'pending').length,
    )

    function nextProductId() {
      const maxNum = products.value
        .map((p) => parseInt(p.id.replace(/^P/, ''), 10))
        .reduce((a, b) => Math.max(a, b), 0)
      return 'P' + String(maxNum + 1).padStart(3, '0')
    }

    function addProduct(p: Omit<Product, 'id' | 'createdAt'>) {
      products.value.unshift({
        ...p,
        id: nextProductId(),
        createdAt: new Date().toISOString().slice(0, 10),
      })
    }

    function updateProduct(id: string, patch: Partial<Product>) {
      const idx = products.value.findIndex((p) => p.id === id)
      if (idx >= 0) products.value[idx] = { ...products.value[idx], ...patch }
    }

    function removeProduct(id: string) {
      products.value = products.value.filter((p) => p.id !== id)
    }

    return {
      products,
      orders,
      members,
      productCount,
      activeProductCount,
      lowStockCount,
      outOfStockCount,
      revenue,
      pendingOrderCount,
      addProduct,
      updateProduct,
      removeProduct,
    }
  },
)
