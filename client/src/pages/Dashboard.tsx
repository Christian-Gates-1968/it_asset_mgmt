import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { 
  Package, 
  AlertTriangle, 
  Phone, 
  TrendingUp,  
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { mockAssets, mockComplaints, mockCallLogs, mockPMReports } from '../data/mockData';

const Dashboard: React.FC = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const stats = {
    totalAssets: assets.length,
    assetsUnderRepair: assets.filter(a => a.status === 'In Repair' || a.status === 'Under Repair').length,
    activeAssets: assets.filter(a => a.status === 'Active').length,
    activeComplaints: mockComplaints.filter(c => c.status !== 'Resolved').length,
    callLogs: mockCallLogs.length,
    pmReports: mockPMReports.length,
    criticalComplaints: mockComplaints.filter(c => c.priority === 'Critical').length,
  };

  const recentComplaints = mockComplaints.slice(0, 5);
  const recentCallLogs = mockCallLogs.slice(0, 5);

 

  useEffect(() => {
  const fetchAssets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/assets');
      setAssets(res.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchAssets();
}, []);


  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    trend?: string;
  }> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your system overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Assets"
          value={stats.totalAssets}
          icon={Package}
          color="bg-blue-600"
          trend="+2.5% from last month"
        />
        <StatCard
          title="Active Complaints"
          value={stats.activeComplaints}
          icon={AlertTriangle}
          color="bg-red-600"
        />
        <StatCard
          title="Call Logs"
          value={stats.callLogs}
          icon={Phone}
          color="bg-green-600"
          trend="+12 today"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Asset Status</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {stats.activeAssets}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Under Repair</span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                {stats.assetsUnderRepair}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(stats.activeAssets / stats.totalAssets) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Complaint Priority</h3>
            <AlertCircle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Critical</span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                {stats.criticalComplaints}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">High</span>
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                {mockComplaints.filter(c => c.priority === 'High').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Medium</span>
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                {mockComplaints.filter(c => c.priority === 'Medium').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resolution Rate</h3>
            <CheckCircle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">85%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">This month</p>
            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Complaints</h3>
            <AlertTriangle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentComplaints.map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {complaint.assetName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {complaint.reportedBy}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    complaint.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Call Logs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Call Logs</h3>
            <Phone className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentCallLogs.map((call) => (
              <div key={call.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {call.contactPerson}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {call.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    call.status === 'Closed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    call.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {call.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;