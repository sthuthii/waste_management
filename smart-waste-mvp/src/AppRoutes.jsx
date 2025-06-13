import { Routes, Route, Navigate } from 'react-router-dom';
import WorkerDashboard from './components/WorkerDashboard';
import CitizenDashboard from './components/CitizenDashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminMapView from './components/AdminMapView';
import AdminWorkerManager from './components/AddWorkerForm';
import HouseManager from './components/HouseManager';
import ComplaintsPage from './components/Complaints';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    {/* Default entry point */}
    <Route path="/" element={<Navigate to="/signup" />} />

    {/* Public routes */}
    <Route path="/signup" element={<SignUp />} />
    <Route path="/login" element={<Login />} />

    {/* Protected: Worker */}
    <Route path="/worker" element={
      <ProtectedRoute allowedRoles={['worker']}>
        <WorkerDashboard />
      </ProtectedRoute>
    } />

    {/* Protected: Citizen */}
    <Route path="/citizen" element={
      <ProtectedRoute allowedRoles={['citizen']}>
        <CitizenDashboard />
      </ProtectedRoute>
    } />

    {/* Protected: Admin (Nested Dashboard) */}
    <Route path="/admin" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    }>
      <Route path="map" element={<AdminMapView />} />
      <Route path="workers" element={<AdminWorkerManager />} />
      <Route path="houses" element={<HouseManager />} />
      <Route path="complaints" element={<ComplaintsPage />} />
      <Route index element={<Navigate to="map" replace />} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<div style={{ padding: '2rem' }}>🚫 Page not found</div>} />
  </Routes>
);

export default AppRoutes;
