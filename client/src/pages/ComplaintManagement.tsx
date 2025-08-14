import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  User,
  Calendar,
  MessageSquare,
  Filter
} from 'lucide-react';
import { mockComplaints, mockAssets } from '../data/mockData'; 
import { Complaint } from '../types';

const ComplaintManagement: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Select Status');
  const [priorityFilter, setPriorityFilter] = useState<string>('Select Priority');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const statuses = ['All', 'Open', 'In Progress', 'Resolved'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Critical'];

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || complaint.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Open': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const AddComplaintModal: React.FC = () => {
    const [formData, setFormData] = useState({
      assetId: '',
      reportedBy: '',
      description: '',
      priority: 'Medium' as Complaint['priority']
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const selectedAsset = mockAssets.find(asset => String(asset.asset_id) === formData.assetId);
      if (!selectedAsset) return;

      const newComplaint: Complaint = {
        id: `CMP${String(complaints.length + 1).padStart(3, '0')}`,
        assetId: formData.assetId,
        assetName: selectedAsset.asset_name,
        reportedBy: formData.reportedBy,
        description: formData.description,
        status: 'Open',
        priority: formData.priority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setComplaints([newComplaint, ...complaints]);
      setShowAddModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Register New Complaint</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Asset
              </label>
              <select
                value={formData.assetId}
                onChange={(e) => setFormData({...formData, assetId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select an asset</option>
                {mockAssets.map(asset => (
                  <option key={asset.asset_id} value={asset.asset_id}>
                    {asset.asset_name} ({asset.asset_id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reported By
              </label>
              <input
                type="text"
                value={formData.reportedBy}
                onChange={(e) => setFormData({...formData, reportedBy: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as Complaint['priority']})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Register Complaint
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ComplaintDetailModal: React.FC<{ complaint: Complaint }> = ({ complaint }) => {
    const [updateStatus, setUpdateStatus] = useState(complaint.status);
    const [assignedTo, setAssignedTo] = useState(complaint.assignedTo || '');
    const [resolution, setResolution] = useState(complaint.resolution || '');

    const handleUpdate = () => {
      const updatedComplaint = {
        ...complaint,
        status: updateStatus,
        assignedTo: assignedTo || undefined,
        resolution: resolution || undefined,
        updatedAt: new Date().toISOString()
      };
      
      setComplaints(complaints.map(c => c.id === complaint.id ? updatedComplaint : c));
      setSelectedComplaint(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Complaint Details</h3>
            <button
              onClick={() => setSelectedComplaint(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Complaint ID
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{complaint.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Asset
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{complaint.assetName}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                {complaint.description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reported By
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{complaint.reportedBy}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                  {complaint.priority}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value as Complaint['status'])}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assigned To
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter engineer name"
              />
            </div>
            
            {updateStatus === 'Resolved' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resolution
                </label>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter resolution details"
                />
              </div>
            )}
            
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Update Complaint
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Complaint Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage asset complaints</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Select Status" disabled>Select Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Select Priority" disabled>Select Priority</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredComplaints.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => setSelectedComplaint(complaint)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {complaint.id}
                </span>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {complaint.assetName}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {complaint.description}
            </p>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>{complaint.reportedBy}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
              {complaint.assignedTo && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Assigned to: {complaint.assignedTo}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showAddModal && <AddComplaintModal />}
      {selectedComplaint && (
        <ComplaintDetailModal complaint={selectedComplaint} />
      )}
    </div>
  );
};

export default ComplaintManagement;