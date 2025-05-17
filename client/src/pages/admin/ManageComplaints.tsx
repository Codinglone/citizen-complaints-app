import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ManageComplaints: React.FC = () => {
  const { t } = useTranslation();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<null | any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock data for complaints
  const complaintsData = [
    {
      id: 'C-2025-1423',
      title: 'Street Light Outage on Main St',
      description: 'Several street lights are not working on Main Street between Oak Avenue and Pine Street. This has created a safety hazard for pedestrians and drivers at night.',
      category: 'Infrastructure',
      status: 'pending',
      priority: 'medium',
      submittedBy: 'John Doe',
      email: 'john.doe@example.com',
      phone: '555-123-4567',
      department: 'Public Works',
      location: '123 Main St, Anytown',
      date: '2025-05-16T14:22:00Z',
      attachments: ['photo1.jpg', 'document.pdf'],
      updates: [
        { date: '2025-05-16T14:22:00Z', message: 'Complaint submitted', author: 'System' }
      ]
    },
    {
      id: 'C-2025-1422',
      title: 'Noise Complaint from Construction Site',
      description: 'Construction work at the new apartment building site is happening outside of permitted hours (before 7am and after 7pm). The noise is disruptive to the entire neighborhood.',
      category: 'Noise',
      status: 'in-progress',
      priority: 'high',
      submittedBy: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '555-987-6543',
      department: 'Environmental Protection',
      location: '456 Oak Ave, Anytown',
      date: '2025-05-16T10:45:00Z',
      attachments: ['recording.mp3'],
      updates: [
        { date: '2025-05-16T10:45:00Z', message: 'Complaint submitted', author: 'System' },
        { date: '2025-05-16T11:30:00Z', message: 'Assigned to Environmental Protection Department', author: 'Admin' },
        { date: '2025-05-16T13:15:00Z', message: 'Inspector scheduled to visit site tomorrow morning', author: 'David Chen, Environmental Protection' }
      ]
    },
    {
      id: 'C-2025-1421',
      title: 'Garbage Collection Missed',
      description: 'Our scheduled garbage collection on Elm Street was missed this week. Bins are overflowing and creating an unsanitary condition.',
      category: 'Waste',
      status: 'assigned',
      priority: 'medium',
      submittedBy: 'Robert Johnson',
      email: 'robert.j@example.com',
      phone: '555-333-2222',
      department: 'Sanitation',
      location: '789 Elm St, Anytown',
      date: '2025-05-16T09:30:00Z',
      attachments: ['photo.jpg'],
      updates: [
        { date: '2025-05-16T09:30:00Z', message: 'Complaint submitted', author: 'System' },
        { date: '2025-05-16T10:15:00Z', message: 'Assigned to Sanitation Department', author: 'Admin' }
      ]
    },
    {
      id: 'C-2025-1420',
      title: 'Pothole on Elm Street',
      description: 'Large pothole approximately 2 feet wide has formed on Elm Street near the intersection with Maple Avenue. It poses a hazard to vehicles and has already caused damage to my car.',
      category: 'Roads',
      status: 'in-progress',
      priority: 'high',
      submittedBy: 'Emily Wilson',
      email: 'emily.w@example.com',
      phone: '555-444-5555',
      department: 'Transportation',
      location: '321 Elm St, Anytown',
      date: '2025-05-15T16:20:00Z',
      attachments: ['pothole.jpg', 'damage.jpg'],
      updates: [
        { date: '2025-05-15T16:20:00Z', message: 'Complaint submitted', author: 'System' },
        { date: '2025-05-15T17:00:00Z', message: 'Assigned to Transportation Department', author: 'Admin' },
        { date: '2025-05-16T09:00:00Z', message: 'Repair crew scheduled for May 17', author: 'Michael Brown, Transportation' }
      ]
    },
    {
      id: 'C-2025-1419',
      title: 'Water Main Break',
      description: 'Water bubbling up from street and flooding the sidewalk and part of the road. Appears to be a water main break.',
      category: 'Water',
      status: 'resolved',
      priority: 'high',
      submittedBy: 'Thomas Miller',
      email: 'thomas.m@example.com',
      phone: '555-777-8888',
      department: 'Water Authority',
      location: '555 Cedar Blvd, Anytown',
      date: '2025-05-14T08:10:00Z',
      attachments: ['water1.jpg', 'water2.jpg'],
      updates: [
        { date: '2025-05-14T08:10:00Z', message: 'Complaint submitted', author: 'System' },
        { date: '2025-05-14T08:15:00Z', message: 'Assigned to Water Authority with high priority', author: 'Admin' },
        { date: '2025-05-14T09:30:00Z', message: 'Emergency crew dispatched', author: 'Sarah Williams, Water Authority' },
        { date: '2025-05-14T12:45:00Z', message: 'Water main repaired, cleanup in progress', author: 'Sarah Williams, Water Authority' },
        { date: '2025-05-14T15:20:00Z', message: 'Site cleaned and restored. Issue resolved.', author: 'Sarah Williams, Water Authority' }
      ]
    },
    {
      id: 'C-2025-1419',
      title: 'Water Main Break',
      description: 'Water bubbling up from street and flooding the sidewalk and part of the road. Appears to be a water main break.',
      category: 'Water',
      status: 'resolved',
      priority: 'high',
      submittedBy: 'Thomas Miller',
      email: 'thomas.m@example.com',
      phone: '555-777-8888',
      department: 'Water Authority',
      location: '555 Cedar Blvd, Anytown',
      date: '2025-05-14T08:10:00Z',
      attachments: ['water1.jpg', 'water2.jpg'],
      updates: [
        { date: '2025-05-14T08:10:00Z', message: 'Complaint submitted', author: 'System' },
        { date: '2025-05-14T08:15:00Z', message: 'Assigned to Water Authority with high priority', author: 'Admin' },
        { date: '2025-05-14T09:30:00Z', message: 'Emergency crew dispatched', author: 'Sarah Williams, Water Authority' },
        { date: '2025-05-14T12:45:00Z', message: 'Water main repaired, cleanup in progress', author: 'Sarah Williams, Water Authority' },
        { date: '2025-05-14T15:20:00Z', message: 'Site cleaned and restored. Issue resolved.', author: 'Sarah Williams, Water Authority' }
      ]
    }
  ];
  
  // Filter and search complaints
  const filteredComplaints = complaintsData.filter(complaint => {
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || complaint.category === filterCategory;
    const matchesSearch = searchQuery === '' || 
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  });
  
  // Unique categories for filter
  const categories = Array.from(new Set(complaintsData.map(c => c.category)));
  
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
  
  const handleViewComplaint = (complaint: any) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('adminPanel.manageComplaints')}</h1>
      
      {/* Filters and search */}
      <div className="bg-base-200 p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Search</span>
            </label>
            <input 
              type="text" 
              placeholder="Search by ID, title, or name..." 
              className="input input-bordered w-full" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select 
              className="select select-bordered w-full" 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select 
              className="select select-bordered w-full" 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Actions</span>
            </label>
            <div className="flex gap-2">
              <button className="btn btn-primary flex-1">Export</button>
              <button className="btn btn-ghost flex-1">Reset</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Complaints Table */}
      <div className="bg-base-100 rounded-box shadow-md overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Submitted By</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map(complaint => (
              <tr key={complaint.id}>
                <td>{complaint.id}</td>
                <td>{complaint.title}</td>
                <td>{complaint.category}</td>
                <td>{getStatusBadge(complaint.status)}</td>
                <td>{getPriorityBadge(complaint.priority)}</td>
                <td>{complaint.submittedBy}</td>
                <td>{new Date(complaint.date).toLocaleDateString().substring(0, 10)}</td>
                <td>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-xs btn-primary"
                      onClick={() => handleViewComplaint(complaint)}
                    >
                      View
                    </button>
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
          Showing <span className="font-bold">{filteredComplaints.length}</span> of <span className="font-bold">{complaintsData.length}</span> complaints
        </div>
        <div className="join">
          <button className="join-item btn">«</button>
          <button className="join-item btn">1</button>
          <button className="join-item btn btn-active">2</button>
          <button className="join-item btn">3</button>
          <button className="join-item btn">»</button>
        </div>
      </div>
      
      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
          <div className="modal-box max-w-3xl">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setIsModalOpen(false)}>✕</button>
            </form>
            <h3 className="font-bold text-lg mb-4">{selectedComplaint.title}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p><span className="font-bold">ID:</span> {selectedComplaint.id}</p>
                <p><span className="font-bold">Category:</span> {selectedComplaint.category}</p>
                <p><span className="font-bold">Status:</span> {getStatusBadge(selectedComplaint.status)}</p>
                <p><span className="font-bold">Priority:</span> {getPriorityBadge(selectedComplaint.priority)}</p>
              </div>
              <div>
                <p><span className="font-bold">Submitted By:</span> {selectedComplaint.submittedBy}</p>
                <p><span className="font-bold">Date:</span> {new Date(selectedComplaint.date).toLocaleString()}</p>
                <p><span className="font-bold">Location:</span> {selectedComplaint.location}</p>
                <p><span className="font-bold">Department:</span> {selectedComplaint.department}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-bold mb-2">Description</h4>
              <div className="bg-base-200 p-3 rounded">{selectedComplaint.description}</div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-bold mb-2">Contact Information</h4>
              <p><span className="font-semibold">Email:</span> {selectedComplaint.email}</p>
              <p><span className="font-semibold">Phone:</span> {selectedComplaint.phone}</p>
            </div>
            
            {selectedComplaint.attachments.length > 0 && (
              <div className="mb-4">
                <h4 className="font-bold mb-2">Attachments</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedComplaint.attachments.map((attachment: string, index: number) => (
                    <div key={index} className="badge badge-outline p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                      </svg>
                      {attachment}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <h4 className="font-bold mb-2">Updates & Activity</h4>
              <ul className="timeline timeline-vertical">
                {selectedComplaint.updates.map((update: any, index: number) => (
                  <li key={index}>
                    {index > 0 && <hr />}
                    <div className="timeline-start">{new Date(update.date).toLocaleString()}</div>
                    <div className="timeline-middle">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                    </div>
                    <div className="timeline-end">
                      <div className="font-semibold">{update.message}</div>
                      <div className="text-sm opacity-70">by {update.author}</div>
                    </div>
                    {index < selectedComplaint.updates.length - 1 && <hr />}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="divider"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Update Status</span>
                </label>
                <select className="select select-bordered w-full">
                  <option disabled selected>Current: {selectedComplaint.status}</option>
                  <option>pending</option>
                  <option>assigned</option>
                  <option>in-progress</option>
                  <option>resolved</option>
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Assign Department</span>
                </label>
                <select className="select select-bordered w-full">
                  <option disabled selected>Current: {selectedComplaint.department}</option>
                  <option>Public Works</option>
                  <option>Transportation</option>
                  <option>Environmental Protection</option>
                  <option>Sanitation</option>
                  <option>Water Authority</option>
                </select>
              </div>
            </div>
            
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Add Note/Update</span>
              </label>
              <textarea className="textarea textarea-bordered h-24" placeholder="Enter update or notes..."></textarea>
            </div>
            
            <div className="modal-action">
              <button className="btn btn-error">Delete</button>
              <button className="btn btn-primary">Save Changes</button>
              <button className="btn" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};