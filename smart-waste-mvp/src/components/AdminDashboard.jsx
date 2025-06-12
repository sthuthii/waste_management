import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const location = useLocation();

  const navItemStyle = (path) => ({
    padding: '0.5rem 1rem',
    marginRight: '1rem',
    borderRadius: '4px',
    textDecoration: 'none',
    color: location.pathname === path ? 'white' : '#333',
    backgroundColor: location.pathname === path ? '#2196F3' : '#eee',
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🧑‍⚕️ Admin Panel</h1>

      <nav style={{ marginBottom: '2rem', display: 'flex' }}>
        <Link to="/admin/map" style={navItemStyle('/admin/map')}>🗺️ Map</Link>
        <Link to="/admin/workers" style={navItemStyle('/admin/workers')}>👷 Workers</Link>
        <Link to="/admin/complaints" style={navItemStyle('/admin/complaints')}>📣 Complaints</Link>
      </nav>

      <Outlet /> {/* This is where subroutes render */}
    </div>
  );
};

export default AdminDashboard;
