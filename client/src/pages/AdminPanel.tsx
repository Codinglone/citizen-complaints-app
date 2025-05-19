import React from "react";
import { Routes, Route } from "react-router-dom";
import { AdminProtectedRoute } from "../components/AdminProtectedRoute";
import { DashboardLayout } from "../components/DashboardLayout";
import { AIRoutingDashboard } from "./admin/AIRoutingDashboard";

// Import admin pages
import { AdminHome } from "./admin/AdminHome";
import { ManageComplaints } from "./admin/ManageComplaints";
import { ManageUsers } from "./admin/ManageUsers";
import { Analytics } from "./admin/Analytics";
import { Settings } from "./dashboard/Settings";

export const AdminPanel: React.FC = () => {
  return (
    <Routes>
      <Route element={<AdminProtectedRoute />}>
        <Route element={<DashboardLayout isAdmin={true} />}>
          <Route index element={<AdminHome />} />
          <Route path="complaints" element={<ManageComplaints />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="ai-dashboard" element={<AIRoutingDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};
