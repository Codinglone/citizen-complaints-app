import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
// Import your dashboard pages
import { DashboardHome } from './dashboard/DashboardHome';
import { MyComplaints } from './dashboard/MyComplaints';
import { SubmitComplaint } from './SubmitComplaint';
import { Settings } from './dashboard/Settings';
import { Analytics } from './dashboard/Analytics';

export const UserDashboard: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout isAdmin={false} />}>
          <Route index element={<DashboardHome />} />
          <Route path="complaints" element={<MyComplaints />} />
          <Route path="submit" element={<SubmitComplaint />} />
          <Route path="settings" element={<Settings />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Route>
    </Routes>
  );
};