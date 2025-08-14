import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  Users, CheckCircle, Clock, Target
} from 'lucide-react';

interface Asset {
  asset_id: number;
  asset_name: string;
  category: string;
  status: string;
}

export default function Analytics() {
  const performanceData = [
    { name: 'Rajesh Kumar', resolved: 45, pending: 8, rating: 4.8 },
    { name: 'Amit Singh', resolved: 38, pending: 12, rating: 4.6 },
    { name: 'Ravi Patel', resolved: 42, pending: 6, rating: 4.9 },
    { name: 'Priya Sharma', resolved: 35, pending: 10, rating: 4.5 },
    { name: 'Suresh Kumar', resolved: 40, pending: 7, rating: 4.7 },
  ];

  const monthlyTrends = [
    { month: 'Jul', complaints: 65, resolved: 58, calls: 120 },
    { month: 'Aug', complaints: 72, resolved: 68, calls: 135 },
    { month: 'Sep', complaints: 58, resolved: 55, calls: 110 },
    { month: 'Oct', complaints: 81, resolved: 75, calls: 145 },
    { month: 'Nov', complaints: 69, resolved: 64, calls: 128 },
    { month: 'Dec', complaints: 77, resolved: 71, calls: 142 },
    { month: 'Jan', complaints: 63, resolved: 59, calls: 118 },
  ];

  const categoryDistribution = [
    { name: 'IT Infrastructure', value: 35, color: '#3B82F6' },
    { name: 'Office Equipment', value: 25, color: '#EF4444' },
    { name: 'HVAC', value: 20, color: '#10B981' },
    { name: 'Electrical', value: 12, color: '#F59E0B' },
    { name: 'Other', value: 8, color: '#8B5CF6' },
  ];

  const [assets, setAssets] = useState<any[]>([]);
const [categoryCounts, setCategoryCounts] = useState<{ category: string, count: number }[]>([]);
 useEffect(() => {
  const fetchAssets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/assets');
      setAssets(res.data);

      // Group assets by category
      const counts: { [key: string]: number } = {};
      res.data.forEach((asset: any) => {
        const cat = asset.category || 'Other';
        counts[cat] = (counts[cat] || 0) + 1;
      });

      const categoryData = Object.keys(counts).map(key => ({
        category: key,
        count: counts[key],
      }));

      setCategoryCounts(categoryData);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  fetchAssets();
}, []);
 const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
const [statusData, setStatusData] = useState<{ status: string, count: number }[]>([]);

const handleBarClick = (category: string) => {
  setSelectedCategory(category);

  // Filter assets of this category
  const filtered = assets.filter(a => a.category === category);

  // Count statuses
  const statusCounts: { [key: string]: number } = {};
  filtered.forEach(a => {
    const status = a.status || 'Unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  // Convert to array for chart
  const data = Object.keys(statusCounts).map(key => ({
    status: key,
    count: statusCounts[key],
  }));

  setStatusData(data);
};



 

  const kpiData = [
    {
      title: 'Resolution Rate', value: '92.3%', change: '+2.1%', changeType: 'positive',
      icon: CheckCircle, color: 'text-green-600'
    },
    {
      title: 'Avg Response Time', value: '18 min', change: '-5 min', changeType: 'positive',
      icon: Clock, color: 'text-blue-600'
    },
    {
      title: 'Customer Satisfaction', value: '4.7/5', change: '+0.2', changeType: 'positive',
      icon: Target, color: 'text-purple-600'
    },
    {
      title: 'Active Engineers', value: '12', change: '+2', changeType: 'positive',
      icon: Users, color: 'text-orange-600'
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Performance insights and engineer analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2 dark:text-white">{kpi.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${kpi.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                    {kpi.change}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trends */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} labelStyle={{ color: '#fff' }} />
              <Line type="monotone" dataKey="complaints" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="calls" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Assets by Category Chart */}
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Assets by Category</h3>
    <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={categoryCounts}
      layout="vertical"
      margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis type="number" stroke="#9ca3af" />
      <YAxis dataKey="category" type="category" stroke="#9ca3af" />
      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} labelStyle={{ color: '#fff' }} />
      <Bar
     dataKey="count"
      fill="#3B82F6"
      animationDuration={1500}
      onClick={(data, index) => handleBarClick(categoryCounts[index].category)}
     cursor="pointer"
     />
     </BarChart>
        </ResponsiveContainer>
       </div>
        {/* Status Chart */}
      {selectedCategory && (
        <div className="bg-white dark:bg-gray-800 p-6 mt-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Status breakdown for {selectedCategory}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={statusData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="status" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} labelStyle={{ color: '#fff' }} />
              <Bar dataKey="count" animationDuration={1500}>
                {statusData.map((entry, index) => {
                  let color = '#3B82F6'; // Default blue
                  if (entry.status.toLowerCase() === 'active') {
                    color = '#10B981'; // Green
                  } else if (entry.status.toLowerCase() === 'in repair') {
                    color = '#FF0000'; // Red
                  }
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <button
            onClick={() => setSelectedCategory(null)}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Clear Selection
          </button>
        </div>
      )}
      
       </div>

      {/* Engineer Performance and Response Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Engineer Performance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Engineer Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} labelStyle={{ color: '#fff' }} />
              <Bar dataKey="resolved" fill="#10B981" />
              <Bar dataKey="pending" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
       

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Complaint Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} labelStyle={{ color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
      </div>

      {/* Engineer Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Detailed Engineer Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Engineer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Resolved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pending</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Resolution Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Avg Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {performanceData.map((engineer, index) => {
                const total = engineer.resolved + engineer.pending;
                const resolutionRate = ((engineer.resolved / total) * 100).toFixed(1);
                const performance =
                  engineer.rating >= 4.8 ? 'Excellent' : engineer.rating >= 4.5 ? 'Good' : 'Average';
                const performanceColor =
                  engineer.rating >= 4.8 ? 'text-green-600' : engineer.rating >= 4.5 ? 'text-blue-600' : 'text-yellow-600';

                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {engineer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{engineer.resolved}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{engineer.pending}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{resolutionRate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center">
                        <span>{engineer.rating}</span>
                        <div className="ml-2 flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < Math.floor(engineer.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${performanceColor}`}>
                        {performance}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
