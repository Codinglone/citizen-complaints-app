import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { DashboardHome } from './dashboard/DashboardHome';
import { MyComplaints } from './dashboard/MyComplaints';
import { SubmitComplaintForm } from './SubmitComplaintForm';
import { Settings } from './dashboard/Settings';

export const UserDashboard: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="complaints" element={<MyComplaints />} />
        <Route path="submit" element={<SubmitComplaintForm />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};