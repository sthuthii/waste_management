import { Routes, Route, Navigate } from 'react-router-dom';
import WorkerDashboard from './components/WorkerDashboard';
import CitizenDashboard from './components/CitizenDashboard';
import AdminDashboard from './components/AdminDashboard';
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

    {/* Protected role-specific routes */}
    <Route path="/worker" element={
      <ProtectedRoute allowedRoles={['worker']}>
        <WorkerDashboard />
      </ProtectedRoute>
    } />

    <Route path="/citizen" element={
      <ProtectedRoute allowedRoles={['citizen']}>
        <CitizenDashboard />
      </ProtectedRoute>
    } />

    <Route path="/admin" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    } />
  </Routes>
);

export default AppRoutes;
