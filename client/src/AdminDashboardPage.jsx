import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, FolderTree, Mail, Star, Users, Wallet, Loader, Gauge, ShoppingBag } from 'lucide-react';
import { api, jsonOptions } from './api';

const tabs = ['overview', 'categories', 'messages'];
const statCards = [
  { key: 'products', label: 'Products', icon: Box, color: 'forest' },
  { key: 'categories', label: 'Categories', icon: FolderTree, color: 'coffee' },
  { key: 'messages', label: 'Messages', icon: Mail, color: 'sage' },
  { key: 'team', label: 'Team Members', icon: Users, color: 'amber' },
  { key: 'reviews', label: 'Reviews', icon: Star, color: 'rose' }
];
const chartColors = ['#163d32', '#8f6045', '#9aaf8b', '#b8892c', '#a04433'];
const fmt = value => `Rs. ${Number(value || 0).toLocaleString()}`;
const pct = (current, previous) => {
  if (!previous) return current ? '+100%' : '0%';
  const diff = ((current - previous) / previous) * 100;
  return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
};
function LineChart({ data, categories }) {
  if (!data || !data.length) return <div className="chart-empty">No sales data yet.</div>;
  const width = 560, height = 220, pad = 34;
  const max = Math.max(...data.map(d => d.total), 1);
  const points = data.map((d, i) => ({ x: pad + (i * (width - pad * 2)) / Math.max(data.length - 1, 1), y: height - pad - (d.total / max) * (height - pad * 2) }));
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
  return <svg viewBox={`0 0 ${width} ${height}`} className="sales-chart" role="img" aria-label="Sales statistic line chart">
    {[0.25, 0.5, 0.75, 1].map(t => <line key={t} x1={pad} y1={height - pad - t * (height - pad * 2)} x2={width - pad} y2={height - pad - t * (height - pad * 2)} className="chart-grid" />)}
    <path d={path} fill="none" stroke="#163d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#163d32" />)}
    {data.map((d, i) => <text key={i} x={points[i].x} y={height - 8} textAnchor="middle" className="chart-label">{String(d.day || d.month || '').slice(5)}</text>)}
  </svg>;
}
function RadarChart({ items }) {
  if (!items || !items.length) return <div className="chart-empty">No product performance data yet.</div>;
  const size = 260, cx = size / 2, cy = size / 2, radius = 90;
  const max = Math.max(...items.map(i => i.orders), 1);
  const angle = (2 * Math.PI) / items.length;
  const point = (i, r) => ({ x: cx + r * Math.cos(-Math.PI / 2 + i * angle), y: cy + r * Math.sin(-Math.PI / 2 + i * angle) });
  const polygon = items.map((item, i) => { const p = point(i, (item.orders / max) * radius); return `${i ? 'L' : 'M'}${p.x},${p.y}`; }).join(' ');
  return <svg viewBox={`0 0 ${size} ${size}`} className="radar-chart" role="img" aria-label="Items performance radar chart">
    {[0.25, 0.5, 0.75, 1].map(t => <polygon key={t} points={items.map((_, i) => { const p = point(i, radius * t); return `${p.x},${p.y}`; }).join(' ')} fill="none" stroke="#dfe5da" strokeWidth="1" />)}
    {items.map((_, i) => { const p = point(i, radius); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#dfe5da" strokeWidth="1" />; })}
    <polygon points={polygon} fill="#163d3222" stroke="#163d32" strokeWidth="2" />
    {items.map((item, i) => { const p = point(i, (item.orders / max) * radius); return <circle key={i} cx={p.x} cy={p.y} r="3" fill="#163d32" />; })}
    {items.map((item, i) => { const p = point(i, radius + 18); return <text key={i} x={p.x} y={p.y} textAnchor="middle" className="chart-label">{item.name.length > 10 ? item.name.slice(0, 9) + '…' : item.name}</text>; })}
  </svg>;
}
function ScoreRing({ score, total }) {
  const r = 70, c = 2 * Math.PI * r, offset = c - (score / 100) * c;
  return <div className="score-ring"><svg viewBox="0 0 180 180" className="score-svg"><circle cx="90" cy="90" r={r} fill="none" stroke="#dfe5da" strokeWidth="12" /><circle cx="90" cy="90" r={r} fill="none" stroke="#163d32" strokeWidth="12" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} transform="rotate(-90 90 90)" /><text x="90" y="88" textAnchor="middle" className="score-value">{Math.round(score)}</text><text x="90" y="108" textAnchor="middle" className="score-unit">/ 100</text></svg><div className="score-meta"><strong>{total} / {total} Orders</strong><span>Complaints</span></div></div>;
}
export default function AdminDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab') || 'overview';
  const tab = tabs.includes(requestedTab) ? requestedTab : 'overview';
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [categories, setCategories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [salesRange, setSalesRange] = useState('day');
  const refresh = async () => { try { const [summary, analyticsRows, categoryRows, messageRows] = await Promise.all([api('/dashboard/stats'), api('/dashboard/analytics'), api('/categories'), api('/messages')]); setStats(summary); setAnalytics(analyticsRows); setCategories(categoryRows); setMessages(messageRows); } catch (err) { setError(err.message); } };
  useEffect(() => { refresh(); }, []);
  const remove = async (type, id) => { if (!window.confirm('Delete this item permanently?')) return; try { await api(`/${type}/${id}`, { method: 'DELETE' }); setNotice('Deleted successfully.'); await refresh(); } catch (err) { setError(err.message); } };
  const addCategory = async event => { event.preventDefault(); const body = Object.fromEntries(new FormData(event.currentTarget)); try { await api('/categories', jsonOptions(body)); event.currentTarget.reset(); setNotice('Category added successfully.'); await refresh(); } catch (err) { setError(err.message); } };
  const toggleMessage = async message => { try { await api(`/messages/${message.id}`, jsonOptions({ status: message.status === 'read' ? 'unread' : 'read' }, 'PUT')); await refresh(); } catch (err) { setError(err.message); } };
  const salesData = salesRange === 'month' ? analytics?.salesByMonth : analytics?.salesByDay;
  const salesCategories = [...new Set((salesData || []).map(d => d.category))];
  const score = analytics ? Math.min(100, Math.round(((analytics.completed || 0) / Math.max(analytics.totalOrders || 1, 1)) * 60 + (analytics.avgRating || 0) * 8)) : 0;
  return <section className="admin-main"><div className="admin-top"><div><span className="eyebrow">Green Grounds Cafe</span><h1>Dashboard</h1></div></div>{notice && <div className="notice">{notice}</div>}{error && <div className="form-error notice-error">{error}</div>}<div className="admin-tabs">{tabs.map(item => <button type="button" className={tab === item ? 'active' : ''} onClick={() => setSearchParams(item === 'overview' ? {} : { tab: item })} key={item}>{item}</button>)}</div>{tab === 'overview' && <><div className="overview-welcome"><div><span className="eyebrow">Welcome back</span><h2>Here's what's happening at Green Grounds.</h2><p>Track your menu, orders, team and customer feedback at a glance.</p></div><div className="overview-live"><span className="live-dot" />Live from MySQL</div></div><div className="summary-grid"><div className="summary-card forest"><div className="summary-icon"><Wallet size={22} /></div><div className="summary-body"><span>Total Revenue</span><strong>{fmt(analytics?.revenue)}</strong><small className="summary-trend">{pct(analytics?.todayRevenue, analytics?.yesterdayRevenue)}</small></div></div><div className="summary-card coffee"><div className="summary-icon"><Loader size={22} /></div><div className="summary-body"><span>On Progress</span><strong>{analytics?.progress ?? '—'}</strong><small>Orders</small></div></div><div className="summary-card sage"><div className="summary-icon"><Gauge size={22} /></div><div className="summary-body"><span>Performance</span><strong>{score ? `${score}%` : '—'}</strong><small>{analytics?.completed ?? 0} / {analytics?.totalOrders ?? 0} Orders</small></div></div><div className="summary-card amber"><div className="summary-icon"><ShoppingBag size={22} /></div><div className="summary-body"><span>Today's Sales</span><strong>{analytics?.today ?? '—'}</strong><small>Orders · {pct(analytics?.today, analytics?.yesterday)}</small></div></div></div><div className="stat-grid overview-stat-grid">{[['Products', stats?.totals.products, 'products'], ['Categories', stats?.totals.categories, 'categories'], ['Messages', stats?.totals.messages, 'messages'], ['Team members', stats?.totals.team, 'team'], ['Reviews', stats?.totals.reviews, 'reviews']].map(([label, value, key]) => { const card = statCards.find(c => c.key === key); const Icon = card.icon; return <div className={`stat-card overview-stat-card ${card.color}`} key={label}><div className="stat-card-icon"><Icon size={22} /></div><div className="stat-card-body"><span>{label}</span><strong>{value ?? '—'}</strong><small>Live from MySQL</small></div></div>; })}</div><div className="analytics-grid"><div className="analytics-panel sales-panel"><div className="panel-heading"><h2>Sales Statistic</h2><div className="sales-legend">{salesCategories.map((cat, i) => <span key={cat}><i className="legend-dot" style={{ background: chartColors[i % chartColors.length] }} />{cat}</span>)}</div></div><div className="sales-filters">{['day', 'month', 'year', 'all', 'custom'].map(r => <button type="button" key={r} className={salesRange === r ? 'filter active' : 'filter'} onClick={() => setSalesRange(r)}>{r}</button>)}</div><LineChart data={salesData} categories={salesCategories} /></div><div className="analytics-panel score-panel"><div className="panel-heading"><h2>Score</h2></div><ScoreRing score={score} total={analytics?.totalOrders ?? 0} /></div></div><div className="analytics-grid lower"><div className="analytics-panel radar-panel"><div className="panel-heading"><h2>Items Performance</h2></div><RadarChart items={analytics?.productPerformance} /></div><div className="analytics-panel transactions-panel"><div className="panel-heading"><h2>Recent Transactions</h2><span className="panel-badge">{analytics?.recentOrders?.length ?? 0} orders</span></div><div className="transactions-table"><table><thead><tr><th>Customer</th><th>Email</th><th>Phone</th><th>Items</th><th>Value</th></tr></thead><tbody>{(analytics?.recentOrders || []).map(order => <tr key={order.id}><td>{order.customer_name}</td><td>{order.contact || '—'}</td><td>{order.contact || '—'}</td><td>{order.items.map(i => `${i.product_name_snapshot} ×${i.quantity}`).join(', ') || '—'}</td><td>{fmt(order.total)}</td></tr>)}{!analytics?.recentOrders?.length && <tr><td colSpan="5" className="table-empty">No transactions yet.</td></tr>}</tbody></table></div></div></div></>}{tab === 'categories' && <div className="admin-columns"><div className="admin-panel"><h2>Add category</h2><form className="compact-form" onSubmit={addCategory}><input name="name" placeholder="Category name" required /><input name="description" placeholder="Short description" /><button className="button">Add category</button></form></div><div className="admin-panel"><h2>Categories</h2>{categories.map(item => <div className="admin-list" key={item.id}><span>{item.name}<small>{item.description}</small></span><button className="danger" onClick={() => remove('categories', item.id)}>Delete</button></div>)}</div></div>}{tab === 'messages' && <div className="admin-panel"><h2>Contact messages</h2>{messages.map(item => <div className="message-row" key={item.id}><div><strong>{item.subject}</strong><span>{item.name} · {item.email}</span><p>{item.message}</p></div><div className="message-actions"><button onClick={() => toggleMessage(item)}>{item.status === 'read' ? 'Mark unread' : 'Mark read'}</button><button className="danger" onClick={() => remove('messages', item.id)}>Delete</button></div></div>)}</div>}</section>;
}