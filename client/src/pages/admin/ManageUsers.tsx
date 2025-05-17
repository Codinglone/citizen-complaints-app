import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ManageUsers: React.FC = () => {
  const { t } = useTranslation();
  const [filterRole, setFilterRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<null | any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  
  // Mock data for users
  const usersData = [
    {
      id: 'U-1001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'admin',
      department: 'IT',
      status: 'active',
      dateJoined: '2024-03-15T10:00:00Z',
      lastLogin: '2025-05-16T08:45:00Z',
      phone: '555-123-4567',
      address: '123 Admin St, Anytown',
      permissions: ['manage_users', 'manage_complaints', 'manage_departments', 'view_analytics']
    },
    {
      id: 'U-1002',
      name: 'Sarah Johnson',
      email: 'sarah.j@publicworks.gov',
      role: 'department_manager',
      department: 'Public Works',
      status: 'active',
      dateJoined: '2024-06-10T14:30:00Z',
      lastLogin: '2025-05-15T16:20:00Z',
      phone: '555-234-5678',
      address: '456 Manager Ave, Anytown',
      permissions: ['manage_department_complaints', 'assign_tasks', 'view_department_analytics']
    },
    {
      id: 'U-1003',
      name: 'Michael Brown',
      email: 'michael.b@transport.gov',
      role: 'department_staff',
      department: 'Transportation',
      status: 'active',
      dateJoined: '2024-07-25T09:15:00Z',
      lastLogin: '2025-05-16T10:30:00Z',
      phone: '555-345-6789',
      address: '789 Transportation Blvd, Anytown',
      permissions: ['view_assigned_complaints', 'update_complaint_status']
    },
    {
      id: 'U-1004',
      name: 'Emily Wilson',
      email: 'emily.w@example.com',
      role: 'citizen',
      department: null,
      status: 'active',
      dateJoined: '2025-01-05T11:20:00Z',
      lastLogin: '2025-05-15T19:45:00Z',
      phone: '555-456-7890',
      address: '321 Citizen Rd, Anytown',
      permissions: ['submit_complaints', 'view_own_complaints']
    },
    {
      id: 'U-1005',
      name: 'David Chen',
      email: 'david.c@environment.gov',
      role: 'department_staff',
      department: 'Environmental Protection',
      status: 'inactive',
      dateJoined: '2024-08-12T13:10:00Z',
      lastLogin: '2025-04-30T14:20:00Z',
      phone: '555-567-8901',
      address: '654 Environmental Way, Anytown',
      permissions: ['view_assigned_complaints', 'update_complaint_status']
    },
    {
      id: 'U-1006',
      name: 'Jessica Martinez',
      email: 'jessica.m@example.com',
      role: 'citizen',
      department: null,
      status: 'active',
      dateJoined: '2025-02-18T10:30:00Z',
      lastLogin: '2025-05-14T20:15:00Z',
      phone: '555-678-9012',
      address: '987 Maple St, Anytown',
      permissions: ['submit_complaints', 'view_own_complaints']
    },
    {
      id: 'U-1007',
      name: 'Robert Taylor',
      email: 'robert.t@sanitation.gov',
      role: 'department_manager',
      department: 'Sanitation',
      status: 'active',
      dateJoined: '2024-05-20T08:45:00Z',
      lastLogin: '2025-05-16T09:10:00Z',
      phone: '555-789-0123',
      address: '246 Sanitation Dr, Anytown',
      permissions: ['manage_department_complaints', 'assign_tasks', 'view_department_analytics']
    }
  ];
  
  // Filter and search users
  const filteredUsers = usersData.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesSearch = searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesRole && matchesSearch;
  });
  
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <div className="badge badge-success gap-2">Active</div>
      : <div className="badge badge-error gap-2">Inactive</div>;
  };
  
  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin':
        return <div className="badge badge-primary">Admin</div>;
      case 'department_manager':
        return <div className="badge badge-secondary">Department Manager</div>;
      case 'department_staff':
        return <div className="badge badge-accent">Department Staff</div>;
      case 'citizen':
        return <div className="badge badge-ghost">Citizen</div>;
      default:
        return <div className="badge">Unknown</div>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('adminPanel.manageUsers')}</h1>
        <button className="btn btn-primary" onClick={() => setIsAddUserModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>
      
      {/* Filters and search */}
      <div className="bg-base-200 p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Search</span>
            </label>
            <input 
              type="text" 
              placeholder="Search by name, email, or department..." 
              className="input input-bordered w-full" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <select 
              className="select select-bordered w-full" 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="department_manager">Department Manager</option>
              <option value="department_staff">Department Staff</option>
              <option value="citizen">Citizen</option>
            </select>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Actions</span>
            </label>
            <div className="flex gap-2">
              <button className="btn btn-outline flex-1">Export Users</button>
              <button className="btn btn-ghost flex-1" onClick={() => {
                setFilterRole('all');
                setSearchQuery('');
              }}>Reset</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-base-100 rounded-box shadow-md overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{getRoleBadge(user.role)}</td>
                <td>{user.department || 'N/A'}</td>
                <td>{getStatusBadge(user.status)}</td>
                <td>{new Date(user.lastLogin).toLocaleString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-xs btn-primary"
                      onClick={() => handleViewUser(user)}
                    >
                      View
                    </button>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-xs btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                      </label>
                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a>Edit User</a></li>
                        <li><a>Change Role</a></li>
                        <li><a>{user.status === 'active' ? 'Deactivate' : 'Activate'}</a></li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div>
          Showing <span className="font-bold">{filteredUsers.length}</span> of <span className="font-bold">{usersData.length}</span> users
        </div>
        <div className="join">
          <button className="join-item btn">«</button>
          <button className="join-item btn btn-active">1</button>
          <button className="join-item btn">2</button>
          <button className="join-item btn">»</button>
        </div>
      </div>
      
      {/* User Detail Modal */}
      {selectedUser && (
        <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
          <div className="modal-box max-w-3xl">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setIsModalOpen(false)}>✕</button>
            </form>
            <h3 className="font-bold text-lg mb-4">{selectedUser.name}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold mb-2">Basic Information</h4>
                <div className="bg-base-200 p-4 rounded-lg">
                  <p><span className="font-semibold">ID:</span> {selectedUser.id}</p>
                  <p><span className="font-semibold">Email:</span> {selectedUser.email}</p>
                  <p><span className="font-semibold">Role:</span> {getRoleBadge(selectedUser.role)}</p>
                  <p><span className="font-semibold">Status:</span> {getStatusBadge(selectedUser.status)}</p>
                  <p><span className="font-semibold">Department:</span> {selectedUser.department || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-2">Contact & Activity</h4>
                <div className="bg-base-200 p-4 rounded-lg">
                  <p><span className="font-semibold">Phone:</span> {selectedUser.phone}</p>
                  <p><span className="font-semibold">Address:</span> {selectedUser.address}</p>
                  <p><span className="font-semibold">Joined:</span> {new Date(selectedUser.dateJoined).toLocaleDateString()}</p>
                  <p><span className="font-semibold">Last Login:</span> {new Date(selectedUser.lastLogin).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-bold mb-2">Permissions</h4>
              <div className="flex flex-wrap gap-2">
                {selectedUser.permissions.map((permission: string, index: number) => (
                  <div key={index} className="badge badge-outline p-3">
                    {permission.replace(/_/g, ' ')}
                  </div>
                ))}
              </div>
            </div>
            
            {selectedUser.role === 'citizen' && (
              <div className="mb-6">
                <h4 className="font-bold mb-2">Complaint History</h4>
                <div className="overflow-x-auto">
                  <table className="table table-xs table-zebra w-full">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>C-2025-1420</td>
                        <td>Pothole on Elm Street</td>
                        <td><div className="badge badge-primary badge-sm">In Progress</div></td>
                        <td>May 15, 2025</td>
                      </tr>
                      <tr>
                        <td>C-2025-1398</td>
                        <td>Graffiti on Public Building</td>
                        <td><div className="badge badge-success badge-sm">Resolved</div></td>
                        <td>May 10, 2025</td>
                      </tr>
                      <tr>
                        <td>C-2025-1345</td>
                        <td>Broken Playground Equipment</td>
                        <td><div className="badge badge-success badge-sm">Resolved</div></td>
                        <td>Apr 28, 2025</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Update Role</span>
                </label>
                <select className="select select-bordered w-full">
                  <option disabled selected>{selectedUser.role.replace(/_/g, ' ')}</option>
                  <option>admin</option>
                  <option>department_manager</option>
                  <option>department_staff</option>
                  <option>citizen</option>
                </select>
              </div>
              
              {(selectedUser.role === 'department_manager' || selectedUser.role === 'department_staff') && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Change Department</span>
                  </label>
                  <select className="select select-bordered w-full">
                    <option disabled selected>{selectedUser.department}</option>
                    <option>Public Works</option>
                    <option>Transportation</option>
                    <option>Environmental Protection</option>
                    <option>Sanitation</option>
                    <option>Water Authority</option>
                    <option>IT</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="modal-action">
              <button className="btn btn-error">
                {selectedUser.status === 'active' ? 'Deactivate User' : 'Activate User'}
              </button>
              <button className="btn btn-primary">Save Changes</button>
              <button className="btn" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
            <button>close</button>
          </form>
        </dialog>
      )}
      
      {/* Add User Modal */}
      <dialog className={`modal ${isAddUserModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-3xl">
          <form method="dialog">
            <button 
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" 
              onClick={() => setIsAddUserModalOpen(false)}
            >✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4">Add New User</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input type="text" placeholder="Full Name" className="input input-bordered w-full" />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" placeholder="Email" className="input input-bordered w-full" />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select className="select select-bordered w-full">
                <option disabled selected>Select Role</option>
                <option value="admin">Admin</option>
                <option value="department_manager">Department Manager</option>
                <option value="department_staff">Department Staff</option>
                <option value="citizen">Citizen</option>
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Department</span>
              </label>
              <select className="select select-bordered w-full">
                <option disabled selected>Select Department</option>
                <option>Public Works</option>
                <option>Transportation</option>
                <option>Environmental Protection</option>
                <option>Sanitation</option>
                <option>Water Authority</option>
                <option>IT</option>
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input type="tel" placeholder="Phone Number" className="input input-bordered w-full" />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <input type="text" placeholder="Address" className="input input-bordered w-full" />
            </div>
          </div>
          
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Permissions</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox" />
                <span className="label-text">Manage Users</span>
              </label>
              <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox" />
                <span className="label-text">Manage Complaints</span>
              </label>
              <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox" />
                <span className="label-text">View Analytics</span>
              </label>
              <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox" />
                <span className="label-text">Assign Tasks</span>
              </label>
              <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox" />
                <span className="label-text">Update Status</span>
              </label>
              <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox" />
                <span className="label-text">Submit Complaints</span>
              </label>
            </div>
          </div>
          
          <div className="divider">Temporary Password</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input type="password" placeholder="Temporary Password" className="input input-bordered w-full" />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input type="password" placeholder="Confirm Password" className="input input-bordered w-full" />
            </div>
          </div>
          
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input type="checkbox" className="checkbox" />
              <span className="label-text">Require password change on first login</span>
            </label>
            <label className="label cursor-pointer justify-start gap-2">
              <input type="checkbox" className="checkbox" />
              <span className="label-text">Send welcome email with login details</span>
            </label>
          </div>
          
          <div className="modal-action">
            <button className="btn btn-primary">Create User</button>
            <button className="btn" onClick={() => setIsAddUserModalOpen(false)}>Cancel</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={() => setIsAddUserModalOpen(false)}>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};