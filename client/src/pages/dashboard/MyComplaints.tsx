import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const MyComplaints: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data for complaints
  const mockComplaints = [
    {
      id: '123',
      category: 'Roads & Infrastructure',
      description: 'Pothole on Main Street causing traffic issues and potential damage to vehicles.',
      status: 'in-progress',
      date: '2025-05-12',
      department: 'Transportation',
      updates: [
        { date: '2025-05-12', content: 'Complaint submitted' },
        { date: '2025-05-14', content: 'Assigned to Department of Transportation' },
        { date: '2025-05-15', content: 'Status changed to In Progress' }
      ]
    },
    {
      id: '122',
      category: 'Waste Management',
      description: 'Garbage not collected on scheduled day, creating unsanitary conditions.',
      status: 'resolved',
      date: '2025-05-03',
      department: 'Sanitation',
      updates: [
        { date: '2025-05-03', content: 'Complaint submitted' },
        { date: '2025-05-04', content: 'Assigned to Department of Sanitation' },
        { date: '2025-05-05', content: 'Status changed to In Progress' },
        { date: '2025-05-07', content: 'Status changed to Resolved' }
      ]
    },
    {
      id: '121',
      category: 'Noise Pollution',
      description: 'Construction site operating outside of permitted hours creating excessive noise.',
      status: 'pending',
      date: '2025-05-16',
      department: 'Environmental Protection',
      updates: [
        { date: '2025-05-16', content: 'Complaint submitted' },
        { date: '2025-05-16', content: 'Pending review' }
      ]
    }
  ];

  const filteredComplaints = activeTab === 'all' 
    ? mockComplaints 
    : mockComplaints.filter(complaint => complaint.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <div className="badge badge-neutral">Pending</div>;
      case 'in-progress':
        return <div className="badge badge-warning">In Progress</div>;
      case 'resolved':
        return <div className="badge badge-success">Resolved</div>;
      default:
        return <div className="badge">Unknown</div>;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('userDashboard.myComplaints')}</h1>
      
      <div className="tabs tabs-boxed mb-6">
        <a 
          className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </a>
        <a 
          className={`tab ${activeTab === 'pending' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </a>
        <a 
          className={`tab ${activeTab === 'in-progress' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('in-progress')}
        >
          In Progress
        </a>
        <a 
          className={`tab ${activeTab === 'resolved' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('resolved')}
        >
          Resolved
        </a>
      </div>
      
      <div className="space-y-8">
        {filteredComplaints.map(complaint => (
          <div key={complaint.id} className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="card-title">#{complaint.id} - {complaint.category}</h2>
                  <p className="text-sm text-gray-500">Submitted on {new Date(complaint.date).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-end">
                  {getStatusBadge(complaint.status)}
                  <span className="text-sm mt-1">{complaint.department}</span>
                </div>
              </div>
              
              <p className="my-4">{complaint.description}</p>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Updates</h3>
                <ul className="timeline timeline-vertical timeline-compact">
                  {complaint.updates.map((update, index) => (
                    <li key={index}>
                      <div className="timeline-start text-xs">{new Date(update.date).toLocaleDateString()}</div>
                      <div className="timeline-middle">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="timeline-end timeline-box">{update.content}</div>
                      {index < complaint.updates.length - 1 && <hr/>}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm btn-primary">Contact Department</button>
                {complaint.status !== 'resolved' && (
                  <button className="btn btn-sm btn-outline">Add Comment</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};