import { useEffect, useMemo, useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, Check } from 'lucide-react';
import { api, assetUrl, jsonOptions } from './api';
import { useOrder } from './OrderContext';
import { SectionTitle, stockImages, Shell } from './App';

const fmt = value => `PKR ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
const orderTypeLabels = { dine_in: 'Dine In', take_away: 'Take Away', online: 'Order Online' };
const hasDiscount = product => !!(product && product.discount_price !== null && product.discount_price !== undefined && Number(product.discount_price) < Number(product.price));
const effectivePrice = product => product ? (hasDiscount(product) ? Number(product.discount_price) : Number(product.price || 0)) : 0;

export default function OrderPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedQty, setSelectedQty] = useState(1);
  const [addons, setAddons] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const { items, meta, summary, count, addItem, updateQty, removeItem, clearCart, setMeta } = useOrder();

  useEffect(() => {
    api('/products').then(setProducts).catch(() => setProducts([]));
    api('/categories').then(setCategories).catch(() => setCategories([]));
  }, []);

  const visible = useMemo(() => products.filter(p => category === 'All' || p.category_name === category), [products, category]);

  const openCustomize = async product => {
    setSelected(product);
    setSelectedAddons([]);
    setSelectedQty(1);
    try {
      const rows = await api(`/products/${product.id}/addons`);
      setAddons(current => ({ ...current, [product.id]: rows }));
    } catch {
      setAddons(current => ({ ...current, [product.id]: [] }));
    }
  };

  const productAddons = selected ? addons[selected.id] || [] : [];
  const selectedPrice = selected ? effectivePrice(selected) + selectedAddons.reduce((s, a) => s + Number(a.price), 0) : 0;

  const toggleAddon = addon => {
    setSelectedAddons(current => current.some(a => a.id === addon.id) ? current.filter(a => a.id !== addon.id) : [...current, addon]);
  };

  const confirmAdd = () => {
    if (!selected) return;
    addItem(selected, selectedAddons, selectedQty);
    setSelected(null);
    
  };

  const placeOrder = async event => {
    event.preventDefault();
    setPlacing(true);
    setError('');
    try {
      if (items.length === 0) throw new Error('Your cart is empty.');
      if (!meta.customer_name.trim()) throw new Error('Your name is required.');
      if (meta.order_type === 'dine_in' && !meta.table_number) throw new Error('Table number is required for dine-in orders.');
      if (meta.order_type === 'online' && !meta.contact) throw new Error('Contact information is required for online orders.');

      const body = {
        customer_name: meta.customer_name.trim(),
        order_type: meta.order_type,
        table_number: meta.order_type === 'dine_in' ? meta.table_number.trim() || null : undefined,
        contact: meta.order_type !== 'dine_in' ? (meta.contact || '').trim() || null : undefined,
        items: items.map(item => ({ product_id: item.productId, quantity: item.qty, addon_ids: item.addons.map(a => a.id) }))
      };
      const order = await api('/orders', jsonOptions(body));
      setConfirmation(order);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (confirmation) return <Shell><div className="order-confirmation page"><SectionTitle eyebrow="Green Grounds Cafe" title="Order confirmed!" text={`Thank you ${confirmation.customer_name}, your order has been received.`}/><div className="confirmation-card"><div className="confirmation-head"><span className="eyebrow">Order #{confirmation.order_number}</span><h3>{orderTypeLabels[confirmation.order_type] || confirmation.order_type}</h3>{confirmation.order_type === 'dine_in' && <p>Table: {confirmation.table_number}</p>}</div><div className="confirmation-items">{confirmation.items.map(item => <div className="confirmation-item" key={item.id}><span className="confirmation-qty">×{item.quantity}</span><div><strong>{item.product_name_snapshot}</strong>{item.addons.map(a => <small key={a.id}>+ {a.addon_name_snapshot} ({fmt(a.addon_price_snapshot)})</small>)}</div><span>{fmt(item.line_total)}</span></div>)}</div><div className="confirmation-totals"><span>Subtotal</span><strong>{fmt(confirmation.subtotal)}</strong><span>Tax ({confirmation.tax_rate}%)</span><strong>{fmt(confirmation.tax_amount)}</strong><span>Total</span><strong>{fmt(confirmation.total)}</strong></div><div className="confirmation-meta"><span>Status</span><b className="status">{confirmation.status}</b><span>Date</span><b>{new Date(confirmation.created_at).toLocaleString()}</b></div><button className="button" onClick={() => { setConfirmation(null); setCartOpen(false); }}>Order something else <Check size={17}/></button></div></div></Shell>;

  return (
    <Shell><div className="order-page">
      <div className="order-hero">
        <SectionTitle eyebrow="Green Grounds Ordering" title="Order your table favourites." text="Browse the menu, customise to taste, and we will handle the rest." />
      </div>
      <div className="order-toolbar">
        <div className="filter-row">{['All', ...categories.map(c => c.name)].map(name => <button className={category === name ? 'filter active' : 'filter'} key={name} onClick={() => setCategory(name)}>{name}</button>)}</div>
        <button className="button outline order-cart-toggle" type="button" onClick={() => setCartOpen(true)}><ShoppingBag size={17}/> Cart {count > 0 && <span className="cart-badge">{count}</span>}</button>
      </div>

      <div className="order-layout">
        <div className="order-products">
          <div className="product-grid">{visible.map(product => <button type="button" className="product-card order-product-card" key={product.id} onClick={() => openCustomize(product)}><div className="product-image"><img src={assetUrl(product.image) || stockImages[product.category_name === 'Breakfast' ? 'breakfast' : product.category_name === 'Fast Food' ? 'burger' : product.category_name === 'Desserts' ? 'dessert' : 'coffee']} alt={product.name} onError={event => { event.currentTarget.style.visibility = 'hidden'; }} /><span>{product.category_name}</span>{product.available === 0 && <span className="product-unavailable-tag">Unavailable</span>}</div><div className="product-info"><div><h3>{product.name}</h3><p>{product.description}</p></div>{hasDiscount(product) ? <span className="price-sale"><s>{fmt(product.price)}</s><strong>{fmt(product.discount_price)}</strong></span> : <strong>{fmt(product.price)}</strong>}</div><span className="order-add-hint"><Plus size={14}/> Add</span></button>)}{!visible.length && <div className="empty-state">No dishes in this category yet.</div>}</div>
      </div>

      <div className="order-cart-panel">
        <div className="order-cart-head"><h3>Your Order</h3><span>{count} item{count === 1 ? '' : 's'}</span></div>
        {items.length === 0 ? <div className="empty-state compact">Your cart is empty. Add something delicious!</div> : <><div className="order-cart-items">{items.map(item => <div className="order-cart-item" key={item.key}><div className="order-cart-item-info"><strong>{item.name}</strong>{item.addons.map(a => <small key={a.id}>+ {a.name} ({fmt(a.price)})</small>)}<span className="cart-line-price">{item.originalPrice && item.originalPrice > item.price ? <span className="price-sale"><s>{fmt(item.originalPrice)}</s> {fmt(item.price)}</span> : fmt(item.price)} × {item.qty}</span></div><div className="cart-qty"><button type="button" onClick={() => updateQty(item.key, -1)} aria-label="Decrease quantity"><Minus size={13}/></button><span>{item.qty}</span><button type="button" onClick={() => updateQty(item.key, 1)} aria-label="Increase quantity"><Plus size={13}/></button></div><span className="cart-line-total">{fmt(item.unitPrice * item.qty)}</span><button className="danger cart-remove" type="button" onClick={() => removeItem(item.key)} aria-label="Remove item"><Trash2 size={14}/></button></div>)}</div>
        <div className="order-cart-summary"><span>Subtotal</span><strong>{fmt(summary.subtotal)}</strong></div>
        <button className="button order-checkout-btn" type="button" onClick={() => setCartOpen(true)}>Checkout <ShoppingBag size={17}/></button></>}
      </div>
      </div>

      {selected && (
        <div className="customize-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <div className="customize-modal" role="dialog" aria-modal="true" aria-label={`Customize ${selected.name}`} onClick={event => event.stopPropagation()}>
            <button type="button" className="icon-button customize-close" onClick={() => setSelected(null)} aria-label="Close"><X size={18}/></button>
            <div className="customize-body">
              <div className="customize-title"><span className="eyebrow">{selected.category_name}</span><h3>{selected.name}</h3><p>{selected.description}</p><strong className="customize-base-price">Base: {hasDiscount(selected) ? <span className="price-sale"><s>{fmt(selected.price)}</s> {fmt(selected.discount_price)}</span> : fmt(selected.price)}</strong></div>
              {productAddons.length > 0 ? <>
                <h4>Customize your order</h4>
                <div className="addon-list">{productAddons.map(addon => <label className="addon-option" key={addon.id}><span><strong>{addon.name}</strong>{addon.price > 0 && <small>+ {fmt(addon.price)}</small>}</span><input type="checkbox" checked={selectedAddons.some(a => a.id === addon.id)} onChange={() => toggleAddon(addon)} /></label>)}</div>
              </> : <p className="addon-none">This item has no optional extras.</p>}
              <div className="customize-qty-row"><span>Quantity</span><div className="cart-qty large"><button type="button" onClick={() => setSelectedQty(q => Math.max(1, q - 1))} aria-label="Decrease"><Minus size={14}/></button><span>{selectedQty}</span><button type="button" onClick={() => setSelectedQty(q => Math.min(99, q + 1))} aria-label="Increase"><Plus size={14}/></button></div><strong className="customize-total">{fmt(selectedPrice * selectedQty)}</strong></div>
              <button className="button customize-add" type="button" onClick={confirmAdd}><Plus size={16}/> Add to Cart</button>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="cart-backdrop" role="presentation" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" role="dialog" aria-modal="true" aria-label="Cart and checkout" onClick={event => event.stopPropagation()}>
            <button type="button" className="icon-button cart-close" onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={18}/></button>
            <h3>Your Order</h3>
            {items.length === 0 ? <div className="empty-state compact">Your cart is empty.</div> : <>
              <div className="order-cart-items drawer">{items.map(item => <div className="order-cart-item" key={item.key}><div><strong>{item.name}</strong>{item.addons.map(a => <small key={a.id}>+ {a.name} ({fmt(a.price)})</small>)}<span className="cart-line-price">{item.originalPrice && item.originalPrice > item.price ? <span className="price-sale"><s>{fmt(item.originalPrice)}</s> {fmt(item.price)}</span> : fmt(item.price)} × {item.qty}</span></div><div className="cart-qty"><button type="button" onClick={() => updateQty(item.key, -1)}><Minus size={13}/></button><span>{item.qty}</span><button type="button" onClick={() => updateQty(item.key, 1)}><Plus size={13}/></button></div><span className="cart-line-total">{fmt(item.unitPrice * item.qty)}</span><button className="cart-remove danger" type="button" onClick={() => removeItem(item.key)} aria-label="Remove"><Trash2 size={14}/></button></div>)}</div>
              <form className="checkout-form" onSubmit={placeOrder}>
                <div className="order-type-tabs">{[['dine_in', 'Dine In'], ['take_away', 'Take Away'], ['online', 'Order Online']].map(([value, label]) => <button type="button" key={value} className={meta.order_type === value ? 'order-type active' : 'order-type'} onClick={() => setMeta('order_type', value)}>{label}</button>)}</div>
                <label>Your name<input required minLength="2" value={meta.customer_name} onChange={event => setMeta('customer_name', event.target.value)} /></label>
                {meta.order_type === 'dine_in' && <label>Table number<input required maxLength="20" value={meta.table_number} onChange={event => setMeta('table_number', event.target.value)} /></label>}
                {meta.order_type === 'online' && <label>Phone / email<input required maxLength="190" value={meta.contact} onChange={event => setMeta('contact', event.target.value)} /></label>}
                {meta.order_type === 'take_away' && <label>Phone (optional)<input maxLength="190" value={meta.contact} onChange={event => setMeta('contact', event.target.value)} /></label>}
                <div className="order-cart-summary"><span>Subtotal</span><strong>{fmt(summary.subtotal)}</strong><span>Tax</span><strong>PKR 0</strong><span>Total</span><strong className="grand-total">{fmt(summary.subtotal)}</strong></div>
                {error && <p className="form-error">{error}</p>}
                <button className="button" type="submit" disabled={placing || items.length === 0}>{placing ? 'Placing order...' : 'Place Order'}</button>
              </form>
            </>}
          </div>
        </div>
      )}
    </div></Shell>
  );
}