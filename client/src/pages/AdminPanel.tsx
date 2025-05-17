import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { AdminHome } from './admin/AdminHome';
import { ManageComplaints } from './admin/ManageComplaints';
import { ManageUsers } from './admin/ManageUsers';
import { Analytics } from './admin/Analytics';

// Wrapper component that applies the DashboardLayout
const AdminDashboardLayout: React.FC = () => {
  return (
    <DashboardLayout isAdmin={true}>
      <Outlet />
    </DashboardLayout>
  );
};

export const AdminPanel: React.FC = () => {
  return (
    <Routes>
      <Route element={<AdminDashboardLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="complaints" element={<ManageComplaints />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
};