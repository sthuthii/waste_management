import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const location = useLocation();

  // Correct path check based on full URL
  const navItemStyle = (path) => ({
    padding: '0.5rem 1rem',
    marginRight: '1rem',
    borderRadius: '4px',
    textDecoration: 'none',
    color: location.pathname === `/admin/${path}` ? 'white' : '#333',
    backgroundColor: location.pathname === `/admin/${path}` ? '#2196F3' : '#eee',
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🧑‍⚕️ Admin Panel</h1>

      <nav style={{ marginBottom: '2rem', display: 'flex' }}>
        <Link to="map" style={navItemStyle('map')}>🗺️ Map</Link>
        <Link to="workers" style={navItemStyle('workers')}>👷 Workers</Link>
        <Link to="houses" style={navItemStyle('houses')}>🏠 Houses</Link>
        <Link to="complaints" style={navItemStyle('complaints')}>📣 Complaints</Link>
      </nav>

      <Outlet /> {/* Nested route content shows here */}
    </div>
  );
};

export default AdminDashboard;
