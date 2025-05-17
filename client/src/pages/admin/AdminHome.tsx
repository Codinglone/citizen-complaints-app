import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const AdminHome: React.FC = () => {
  const { t } = useTranslation();
  
  // Mock data for dashboard
  const stats = {
    totalComplaints: 256,
    pendingComplaints: 42,
    resolvedComplaints: 214,
    resolutionRate: 83.6,
    increasedBy: 14,
    newUsers: 87
  };
  
  // Recent complaints for quick view
  const recentComplaints = [
    {
      id: 'C-2025-1423',
      title: 'Street Light Outage on Main St',
      category: 'Infrastructure',
      status: 'pending',
      priority: 'medium',
      submittedBy: 'John Doe',
      date: '2025-05-16T14:22:00Z',
    },
    {
      id: 'C-2025-1422',
      title: 'Noise Complaint from Construction Site',
      category: 'Noise',
      status: 'in-progress',
      priority: 'high',
      submittedBy: 'Jane Smith',
      date: '2025-05-16T10:45:00Z',
    },
    {
      id: 'C-2025-1421',
      title: 'Garbage Collection Missed',
      category: 'Waste',
      status: 'assigned',
      priority: 'medium',
      submittedBy: 'Robert Johnson',
      date: '2025-05-16T09:30:00Z',
    },
    {
      id: 'C-2025-1420',
      title: 'Pothole on Elm Street',
      category: 'Roads',
      status: 'in-progress',
      priority: 'high',
      submittedBy: 'Emily Wilson',
      date: '2025-05-15T16:20:00Z',
    }
  ];
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <div className="badge badge-warning gap-2">Pending</div>;
      case 'assigned':
        return <div className="badge badge-info gap-2">Assigned</div>;
      case 'in-progress':
        return <div className="badge badge-primary gap-2">In Progress</div>;
      case 'resolved':
        return <div className="badge badge-success gap-2">Resolved</div>;
      default:
        return <div className="badge">Unknown</div>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'low':
        return <div className="badge badge-ghost">Low</div>;
      case 'medium':
        return <div className="badge badge-info">Medium</div>;
      case 'high':
        return <div className="badge badge-error">High</div>;
      default:
        return <div className="badge">Unknown</div>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('adminPanel.title')}</h1>
      
      {/* Stats Overview */}
      <div className="stats shadow w-full bg-base-200">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div className="stat-title">{t('adminPanel.totalComplaints')}</div>
          <div className="stat-value text-primary">{stats.totalComplaints}</div>
          <div className="stat-desc">{t('adminPanel.thisMonth')}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-warning">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          </div>
          <div className="stat-title">{t('adminPanel.pendingComplaints')}</div>
          <div className="stat-value text-warning">{stats.pendingComplaints}</div>
          <div className="stat-desc">{t('adminPanel.needsAction')}</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-success">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
          </div>
          <div className="stat-title">{t('adminPanel.resolutionRate')}</div>
          <div className="stat-value text-success">{stats.resolutionRate}%</div>
          <div className="stat-desc">{t('adminPanel.increasedBy')} {stats.increasedBy}%</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="avatar online">
              <div className="w-16 rounded-full">
                <img src="https://placehold.co/200/4f46e5/ffffff?text=Users" alt="Users" />
              </div>
            </div>
          </div>
          <div className="stat-value">{stats.newUsers}</div>
          <div className="stat-title">New Users</div>
          <div className="stat-desc text-secondary">↗︎ 22% this month</div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-primary text-primary-content">
          <div className="card-body">
            <h2 className="card-title">Manage Complaints</h2>
            <p>View and handle all citizen complaints</p>
            <div className="card-actions justify-end">
              <Link to="/admin/complaints" className="btn btn-sm">View All</Link>
            </div>
          </div>
        </div>
        
        <div className="card bg-secondary text-secondary-content">
          <div className="card-body">
            <h2 className="card-title">User Management</h2>
            <p>Manage department staff and citizens</p>
            <div className="card-actions justify-end">
              <Link to="/admin/users" className="btn btn-sm">Manage Users</Link>
            </div>
          </div>
        </div>
        
        <div className="card bg-accent text-accent-content">
          <div className="card-body">
            <h2 className="card-title">Analytics</h2>
            <p>View detailed reports and analytics</p>
            <div className="card-actions justify-end">
              <Link to="/admin/analytics" className="btn btn-sm">View Reports</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Complaints */}
      <div className="bg-base-100 rounded-box shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Complaints</h2>
          <Link to="/admin/complaints" className="btn btn-sm btn-ghost">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Complaint</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentComplaints.map(complaint => (
                <tr key={complaint.id}>
                  <td>{complaint.id}</td>
                  <td>{complaint.title}</td>
                  <td>{complaint.category}</td>
                  <td>{getStatusBadge(complaint.status)}</td>
                  <td>{getPriorityBadge(complaint.priority)}</td>
                  <td>{new Date(complaint.date).toLocaleString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-xs btn-primary">View</button>
                      <button className="btn btn-xs">Assign</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Activity Timeline */}
      <div className="bg-base-100 rounded-box shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
          <li>
            <div className="timeline-middle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
            </div>
            <div className="timeline-start md:text-end mb-10">
              <time className="font-mono italic">Just now</time>
              <div className="text-lg font-black">Complaint #C-2025-1423 assigned to Department of Transportation</div>
              Assigned by Admin User
            </div>
            <hr/>
          </li>
          <li>
            <hr/>
            <div className="timeline-middle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
            </div>
            <div className="timeline-end mb-10">
              <time className="font-mono italic">2 hours ago</time>
              <div className="text-lg font-black">Complaint #C-2025-1420 status updated to In Progress</div>
              Updated by Department Manager
            </div>
            <hr/>
          </li>
          <li>
            <hr/>
            <div className="timeline-middle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
            </div>
            <div className="timeline-start md:text-end mb-10">
              <time className="font-mono italic">4 hours ago</time>
              <div className="text-lg font-black">New user registered: Sarah Johnson</div>
              Citizen account created
            </div>
            <hr/>
          </li>
          <li>
            <hr/>
            <div className="timeline-middle">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
            </div>
            <div className="timeline-end mb-10">
              <time className="font-mono italic">Yesterday</time>
              <div className="text-lg font-black">Complaint #C-2025-1419 resolved</div>
              Resolved by Waste Management Department
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};