import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AdminMapView from './components/AdminMapView';
import AdminWorkerManager from './components/AdminWorkerManager';
import ComplaintsPage from './components/ComplaintsPage'; // create this if not yet

<Routes>
  {/* Other routes */}

  <Route path="/admin" element={<AdminDashboard />}>
    <Route path="map" element={<AdminMapView />} />
    <Route path="workers" element={<AdminWorkerManager />} />
    <Route path="complaints" element={<ComplaintsPage />} />
    <Route index element={<Navigate to="map" />} />
  </Route>
</Routes>
