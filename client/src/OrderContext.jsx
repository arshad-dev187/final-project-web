import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'greengrounds_cart';
const EMPTY_META = { order_type: 'dine_in', customer_name: '', table_number: '', contact: '' };

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { items: [], meta: EMPTY_META };
      const parsed = JSON.parse(raw);
      return {
        items: Array.isArray(parsed.items) ? parsed.items : [],
        meta: { ...EMPTY_META, ...(parsed.meta || {}) }
      };
    } catch {
      return { items: [], meta: EMPTY_META };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // storage unavailable — cart stays in memory for the session
    }
  }, [cart]);

  const itemKey = (productId, addons) => `${productId}:${addons.map(a => a.id).sort((a, b) => a - b).join('-')}`;

  const addItem = (product, addons = [], quantity = 1) => {
    const key = itemKey(product.id, addons);
    const basePrice = product.discount_price !== null && product.discount_price !== undefined && Number(product.discount_price) < Number(product.price) ? Number(product.discount_price) : Number(product.price);
    setCart(current => {
      const existing = current.items.find(item => item.key === key);
      if (existing) {
        return { ...current, items: current.items.map(item => item.key === key ? { ...item, qty: item.qty + quantity } : item) };
      }
      const addonTotal = addons.reduce((sum, a) => sum + Number(a.price || 0), 0);
      const unitPrice = basePrice + addonTotal;
      return {
        ...current,
        items: [...current.items, {
          key,
          productId: product.id,
          name: product.name,
          price: basePrice,
          originalPrice: Number(product.price),
          image: product.image || '',
          category_name: product.category_name || '',
          qty: quantity,
          addons: addons.map(a => ({ id: a.id, name: a.name, price: Number(a.price || 0) })),
          unitPrice
        }]
      };
    });
  };

  const updateQty = (key, delta) => {
    setCart(current => ({
      ...current,
      items: current.items.map(item => item.key === key ? { ...item, qty: Math.max(1, item.qty + delta) } : item)
    }));
  };

  const removeItem = key => setCart(current => ({ ...current, items: current.items.filter(item => item.key !== key) }));
  const clearCart = () => setCart({ items: [], meta: EMPTY_META });
  const setMeta = (field, value) => setCart(current => ({ ...current, meta: { ...current.meta, [field]: value } }));

  const summary = useMemo(() => {
    const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
    return { subtotal };
  }, [cart.items]);

  const count = cart.items.reduce((n, item) => n + item.qty, 0);

  const value = {
    items: cart.items,
    meta: cart.meta,
    summary,
    count,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    setMeta
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
}