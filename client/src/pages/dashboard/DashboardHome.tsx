import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const DashboardHome: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('userDashboard.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">📊 {t('userDashboard.complaintStatus')}</h2>
            <p>{t('userDashboard.statusDescription')}</p>
            <div className="card-actions justify-end mt-4">
              <Link to="/dashboard/complaints" className="btn btn-primary btn-sm">
                View Complaints
              </Link>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">🔔 {t('userDashboard.notifications')}</h2>
            <div className="my-2">
              <div className="flex items-start gap-2 mb-2">
                <div className="badge badge-primary">New</div>
                <p className="text-sm">Your complaint #123 status has been updated to "In Progress"</p>
              </div>
              <div className="flex items-start gap-2 mb-2">
                <div className="badge badge-secondary">Update</div>
                <p className="text-sm">Department of Transportation responded to your complaint</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">✨ {t('userDashboard.quickActions')}</h2>
            <div className="flex flex-col gap-2 mt-2">
              <Link to="/dashboard/submit" className="btn btn-primary btn-sm">
                Submit New Complaint
              </Link>
              <Link to="/dashboard/complaints" className="btn btn-outline btn-sm">
                View Complaints
              </Link>
              <button className="btn btn-outline btn-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-10 p-6 bg-base-200 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Recent Complaints</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#123</td>
                <td>Roads & Infrastructure</td>
                <td className="max-w-xs truncate">Pothole on Main Street causing traffic issues</td>
                <td><div className="badge badge-warning">In Progress</div></td>
                <td>5 days ago</td>
                <td><Link to="/dashboard/complaints" className="btn btn-xs">View</Link></td>
              </tr>
              <tr>
                <td>#122</td>
                <td>Waste Management</td>
                <td className="max-w-xs truncate">Garbage not collected on scheduled day</td>
                <td><div className="badge badge-success">Resolved</div></td>
                <td>2 weeks ago</td>
                <td><Link to="/dashboard/complaints" className="btn btn-xs">View</Link></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};