import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const location = useLocation();

  const navItemStyle = (path) => ({
    padding: '0.6rem 1.2rem',
    marginRight: '1rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 500,
    color: location.pathname === `/admin/${path}` ? '#fff' : '#333',
    backgroundColor: location.pathname === `/admin/${path}` ? '#670303ff' : '#f5f5f5',
    boxShadow: location.pathname === `/admin/${path}` ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
    transition: 'all 0.3s ease',
  });

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>Admin Panel</h1>

      <nav style={{ 
        marginBottom: '2rem', 
        display: 'flex', 
        backgroundColor: '#ffffff',
        padding: '1rem', 
        borderRadius: '10px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
      }}>
        <Link to="map" style={navItemStyle('map')}>Map</Link>
        <Link to="workers" style={navItemStyle('workers')}>Workers</Link>
        <Link to="houses" style={navItemStyle('houses')}>Houses</Link>
        <Link to="complaints" style={navItemStyle('complaints')}>Complaints</Link>
      </nav>

      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: '#fff', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)' 
      }}>
        <Outlet /> {/* Nested route content shows here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
