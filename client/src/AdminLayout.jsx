import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { api } from './api';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/auth/me')
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => navigate('/admin/login', { replace: true }))
      .finally(() => setLoading(false));
  }, [navigate]);

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {});
    navigate('/admin/login', { replace: true });
  };

  if (loading) return <div className="loading full"><LoaderCircle className="spin" /></div>;

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <Link to="/" className="brand light"><span>GREEN</span><strong>GROUNDS</strong><small>ADMIN</small></Link>
      <nav aria-label="Admin navigation">
        <NavLink className={() => location.pathname === '/admin/dashboard' && !location.search ? 'active' : ''} to="/admin/dashboard">Dashboard</NavLink>
        <NavLink className={() => location.pathname === '/admin/manage' && location.search === '?tab=products' ? 'active' : ''} to="/admin/manage?tab=products">Products</NavLink>
        <NavLink className={() => location.pathname === '/admin/dashboard' && location.search === '?tab=orders' ? 'active' : ''} to="/admin/dashboard?tab=orders">Orders</NavLink>
        <NavLink className={() => location.pathname === '/admin/dashboard' && location.search === '?tab=categories' ? 'active' : ''} to="/admin/dashboard?tab=categories">Categories</NavLink>
        <NavLink className={() => location.pathname === '/admin/manage' && location.search === '?tab=gallery' ? 'active' : ''} to="/admin/manage?tab=gallery">Gallery</NavLink>
        <NavLink className={() => location.pathname === '/admin/manage' && location.search === '?tab=reviews' ? 'active' : ''} to="/admin/manage?tab=reviews">Reviews</NavLink>
        <NavLink className={() => location.pathname === '/admin/dashboard' && location.search === '?tab=messages' ? 'active' : ''} to="/admin/dashboard?tab=messages">Messages</NavLink>
        <NavLink className={() => location.pathname === '/admin/manage' && location.search === '?tab=team' ? 'active' : ''} to="/admin/manage?tab=team">Team Members</NavLink>
        <NavLink className={() => location.pathname === '/admin/manage' && location.search === '?tab=addons' ? 'active' : ''} to="/admin/manage?tab=addons">Add-ons</NavLink>
        <NavLink to="/admin/settings">Settings</NavLink>
      </nav>
      <div className="admin-user sidebar-user">{user?.name}<span>{user?.email}</span></div>
      <button className="logout" onClick={logout}>Log out</button>
    </aside>
    <Outlet />
  </div>;
}
