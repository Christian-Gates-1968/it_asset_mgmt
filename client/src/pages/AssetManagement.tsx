import React, { useEffect , useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import the xlsx library
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  Monitor,
  Printer,
  Router,
  HardDrive,
  FileKey,
  Grid3X3,
  List
} from 'lucide-react';

// Asset interface
interface Asset {
 asset_id: number;
  asset_name: string;
  category: string;
  s_no: string;
  location: string;
  amc_or_war: string;
  status: string;
  purchase_date: string;
  warranty_expiry: string;
  inventory: number;
  vendor_name: string;
  dept_id: number;
  dept_name: string;
}

const AssetManagement = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const [selectedStatus, setSelectedStatus] = useState('Select Status');
  const [selectedDateFilter, setSelectedDateFilter] = useState('Asset In Time');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [assetBeingEdited, setAssetBeingEdited] = useState<Asset | null>(null);

  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  

  const categories = ['All','PC/CPU' ,'Printer', 'Router', 'OS', 'License', 'Storage'];
  const statuses = [ 'All','Active', 'In Repair'];
  const dateFilters = [
    'All Time',
    'Today',
    'Last 7 days',
    'Last 30 days',
    'Last 3 months',
    'Last 6 months',
    'This Year'
  ];
  
  // Fetch assets from the server
  const fetchAssets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/assets');
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  // Handle delete asset

  const handleDelete = async (asset_id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/assets/${asset_id}`);
      toast.success(`🗑️ Asset (ID: ${asset_id}) deleted successfully!`, {
      icon: "✅",
      style: {
        background: "#dc2626", // Tailwind red-600
        color: "#fff",
        fontWeight: "600",
        borderRadius: "8px",
      },
    });
      console.log('Asset deleted:', asset_id);
      fetchAssets(); // Refresh asset list
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error(`❌ Failed to delete asset (ID: ${asset_id}). Please try again.`, {
      icon: "⚠️",
      style: {
        background: "#b91c1c", // Darker red for error
        color: "#fff",
        fontWeight: "600",
        borderRadius: "8px",
      },
    });
    }
  };

  
  useEffect(() => {
    fetchAssets();
    }, []);


 //handle file upload 

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
       const worksheet = workbook.SheetNames[0];
       const sheet = workbook.Sheets[worksheet];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log('Excel Data:', jsonData);
        // Update frontend assets list
        const convertedData = (jsonData as any[]).map(item => ({
           
          asset_name: item["Asset"] || '',
          category: item["Category"] || '',
          s_no: item["Serial Number"] || '',
          status: item["Status "] || '',
          dept_name: item["Department"] || '',
          location: item["Location"] || '',
          purchase_date: item["Purchase Date"] || '',
          warranty_expiry: item["Warranty Expiry"] || '',
          amc_or_war: item["AMC/Warranty"] || '',
          inventory: item["Inventory"] || '',
         vendor_name: item["Vendor Name"] || '',
}));

    setAssets(prevAssets => [...prevAssets, ...convertedData as Asset[]]);
    //send data to backend
    try {
       await axios.post('http://localhost:5000/api/assets/bulk-upload', jsonData);
      alert('Assets uploaded successfully!');
      fetchAssets(); // Re-fetch from backend if needed
    } catch (error) {
      console.error('Error uploading assets:', error);
      alert('Failed to upload assets');
    }
  };

  reader.readAsBinaryString(file);
};}


  const getDateRange = (filter: string) => {
    const today = new Date();

    switch (filter) {
      case 'Today': {
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return { start: startOfDay, end: today };
      }
      case 'Last 7 days': {
        const start = new Date(today);
        start.setDate(today.getDate() - 7);
        return { start, end: today };
      }
      case 'Last 30 days': {
        const start = new Date(today);
        start.setDate(today.getDate() - 30);
        return { start, end: today };
      }
      case 'Last 3 months': {
        const start = new Date(today);
        start.setMonth(today.getMonth() - 3);
        return { start, end: today };
      }
      case 'Last 6 months': {
        const start = new Date(today);
        start.setMonth(today.getMonth() - 6);
        return { start, end: today };
      }
      case 'This Year': {
        const start = new Date(today.getFullYear(), 0, 1);
        return { start, end: today };
      }
      default:
        return null;
    }
  };

  const filteredAssets = assets.filter(asset => {
  const matchesSearch =
    asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.s_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (asset.dept_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === 'All' ||
    selectedCategory === 'Category' ||
    selectedCategory === 'Select Category' ||
    asset.category === selectedCategory;

  const matchesStatus =
    selectedStatus === 'All' ||
    selectedStatus === 'Status' ||
    selectedStatus === 'Select Status' ||
    asset.status === selectedStatus;

  let matchesDate = true;
  if (selectedDateFilter !== 'All Time') {
    const dateRange = getDateRange(selectedDateFilter);
    if (dateRange) {
      const assetDate = new Date(asset.purchase_date);
      matchesDate = assetDate >= dateRange.start && assetDate <= dateRange.end;
    }
  }

  return matchesSearch && matchesCategory && matchesStatus && matchesDate;
});


  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PC/Laptop': return Monitor;
      case 'Printer': return Printer;
      case 'Router': return Router;
      case 'OS': return HardDrive;
      case 'License': return FileKey;
      default: return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Under Repair': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Add Asset Modal Component

   const departments = [
  { id: 1, name: 'IS' },
  { id: 2, name: 'Finance' },
  { id: 3, name: 'LPG' },
  { id: 4, name: 'HR' },
  { id: 5, name: 'Operations' },
  { id: 6, name: 'Marketing' },
  { id: 7, name: 'Customer Service' },
  { id: 8, name: 'Engineering' },
  { id: 9, name: 'Legal' },
  { id: 10, name: 'Security' },
];


   const AddAssetModal = () => {
  const [formData, setFormData] = useState({
    asset_name: '',
    category: 'Select Category',
    s_no: '',
    status: 'Select Status',
    dept_id: '',
    location: '',
    purchase_date: '',
    warranty_expiry: '',
    amc_or_war: '',
    inventory: '',
    vendor_name: ''
  });
  //post handler
  const handleSubmit = async () => {
    try {
      const submitData = { ...formData, dept_id: Number(formData.dept_id) };

      // Format dates to YYYY-MM-DD
      if (formData.purchase_date) {
        const d = new Date(formData.purchase_date);
        submitData.purchase_date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }
      if (formData.warranty_expiry) {
        const d = new Date(formData.warranty_expiry);
        submitData.warranty_expiry = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }

      await axios.post('http://localhost:5000/api/assets', submitData);

          const departmentName = departments.find(d => d.id === Number(formData.dept_id))?.name || 'Unknown Department';
           toast.success(`✅ Asset "${formData.asset_name}" added successfully to ${departmentName}!`, {
           icon: "🎉",
          style: {
          background: "#2563eb", // Tailwind blue-600
          color: "#fff",
          fontWeight: "600",
          borderRadius: "8px",
      },
    });

      console.log('Asset added successfully');
      fetchAssets(); 
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding asset:', error);
      toast.error('❌ Failed to add asset. Please try again.', {
      icon: "⚠️",
      style: {
        background: "#dc2626", // Tailwind red-600
        color: "#fff",
        fontWeight: "600",
        borderRadius: "8px",
      },
    });
    }
  };
  
   return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Asset</h3>
        <div className="space-y-4">
          {[
            { label: 'Asset Name', key: 'asset_name' },
            { label: 'Serial Number', key: 's_no' },
            { label: 'Location', key: 'location' },
            { label: 'Purchase Date', key: 'purchase_date', type: 'date' },
            { label: 'Warranty Expiry', key: 'warranty_expiry', type: 'date' },
            { label: 'Inventory', key: 'inventory' },
            { label: 'Vendor Name', key: 'vendor_name' }
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input
                type={type || 'text'}
                value={(formData as any)[key]}
                onChange={(e) => {
                  const value = ['inventory'].includes(key) ? Number(e.target.value) : e.target.value;
                  setFormData({ ...formData, [key]: value });
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          ))}

          {/* Department Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
            <select
              value={formData.dept_id}
              onChange={(e) => setFormData({ ...formData, dept_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="" disabled>Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* AMC / Warranty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AMC / Warranty</label>
            <select
              value={formData.amc_or_war}
              onChange={(e) => setFormData({ ...formData, amc_or_war: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="" disabled>Select Option</option>
              <option value="AMC">AMC</option>
              <option value="Warranty">Warranty</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Select Category" disabled>Select Category</option>
              <option value='PC/CPU'>PC/CPU</option>
              <option value="Printer">Printer</option>
              <option value="Router">Router</option>
              <option value="OS">OS</option>
              <option value="License">License</option>
              <option value='Storage'>Storage</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Select Status" disabled>Select Status</option>
              <option value="Active">Active</option>
              <option value="In Repair">In Repair</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

  
// Edit Asset Modal Component



const EditAssetModal = ({
  asset,
  fetchAssets,
  onClose,
}: {
  asset: Asset;
  fetchAssets: () => Promise<void>;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({ ...asset });

  useEffect(() => {
    setFormData({ ...asset });
  }, [asset]);

 
  const toDateOnly = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().slice(0, 10);
  };
// Update asset handler
 const handleUpdate = async () => {
  try {
    const updateData: any = { ...formData };

    // Format purchase_date
    if (formData.purchase_date) {
      const d = new Date(formData.purchase_date);
      updateData.purchase_date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    // Format warranty_expiry
    if (formData.warranty_expiry) {
      const d = new Date(formData.warranty_expiry);
      updateData.warranty_expiry = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    await axios.put(`http://localhost:5000/api/assets/${asset.asset_id}`, updateData);
    toast.success(`🔄 Asset "${formData.asset_name}" updated successfully!`, {
      icon: "✅",
      style: {
        background: "#16a34a", // Tailwind green-600
        color: "#fff",
        fontWeight: "600",
        borderRadius: "8px",
      },
    });
    console.log('Asset updated successfully');
    await fetchAssets();
    onClose();
  } catch (error) {
    console.error('Error updating asset:', error);
    alert('Failed to update asset. Please try again.');
    toast.error(`❌ Failed to update asset "${formData.asset_name}". Please try again.`, {
      icon: "⚠️",
      style: {
        background: "#b91c1c", // Darker red for error
        color: "#fff",
        fontWeight: "600",
        borderRadius: "8px",
      },
    });
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Asset</h3>
        <div className="space-y-4">
          {/* Asset Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asset Name</label>
            <input
              type="text"
              value={formData.asset_name}
              onChange={(e) => setFormData({ ...formData, asset_name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Serial Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serial Number</label>
            <input
              type="text"
              value={formData.s_no}
              onChange={(e) => setFormData({ ...formData, s_no: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Purchase Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase Date</label>
            <input
              type="date"
              value={toDateOnly(formData.purchase_date)}
              onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Warranty Expiry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Warranty Expiry</label>
            <input
              type="date"
              value={toDateOnly(formData.warranty_expiry)}
              onChange={(e) => setFormData({ ...formData, warranty_expiry: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Vendor Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor Name</label>
            <input
              type="text"
              value={formData.vendor_name}
              onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Inventory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Inventory</label>
            <input
              type="number"
              value={formData.inventory}
              onChange={(e) => setFormData({ ...formData, inventory: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Department Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
            <select
              value={formData.dept_id}
              onChange={(e) => setFormData({ ...formData, dept_id: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="" disabled>Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>


          {/* AMC or Warranty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AMC / Warranty</label>
            <select
              value={formData.amc_or_war}
              onChange={(e) => setFormData({ ...formData, amc_or_war: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="" disabled>Select Option</option>
              <option value="AMC">AMC</option>
              <option value="Warranty">Warranty</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Select Category" disabled>Select Category</option>
              <option value="PC/CPU">PC/CPU</option>
              <option value="Printer">Printer</option>
              <option value="Router">Router</option>
              <option value="OS">OS</option>
              <option value="License">License</option>
              <option value="Storage">Storage</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Select Status" disabled>Select Status</option>
              <option value="Active">Active</option>
              <option value="In Repair">In Repair</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};





  // Table View Component
  const TableView = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {[
              'Asset', 'Category', 'Serial Number', 'Status', 'Department',
              'Location', 'Purchase Date', 'Warranty Expiry','AMC/Warranty','Inventory','Vendor Name', 'Actions'
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {filteredAssets.map((asset) => {
            const IconComponent = getCategoryIcon(asset.category);
            return (
              <tr key={asset.asset_id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{asset.asset_name}</div>
                      <div className="hidden">{asset.asset_id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {asset.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {asset.s_no}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {asset.dept_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {asset.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Date(asset.purchase_date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                   
          })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Date(asset.warranty_expiry).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td> 
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {asset.amc_or_war}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {asset.inventory}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {asset.vendor_name}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setAssetBeingEdited(asset);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(asset.asset_id)}
                   className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);


  // Card View Component
  const CardView = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {filteredAssets.map((asset) => {
      const IconComponent = getCategoryIcon(asset.category);
      return (
        <div
          key={asset.asset_id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {asset.asset_name}
                </h3>
                <p className="hidden">{asset.asset_id}</p> {/* Hidden but accessible */}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setAssetBeingEdited(asset);
                  setShowEditModal(true);
                }}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(asset.asset_id)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Category</span>
              <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                {asset.category}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
                {asset.status}
              </span>
            </div>

            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Serial Number</span>
              <p className="font-mono text-gray-900 dark:text-white">{asset.s_no}</p>
            </div>

            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Department</span>
              <p className="text-gray-900 dark:text-white">{asset.dept_name}</p>
            </div>

            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Location</span>
              <p className="text-gray-900 dark:text-white">{asset.location}</p>
            </div>

            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Purchase Date</span>
              <p className="text-gray-900 dark:text-white">
                {new Date(asset.purchase_date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Warranty Expiry</span>
              <p className="text-gray-900 dark:text-white">
                {new Date(asset.warranty_expiry).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">AMC / Warranty</span>
              <p className="text-gray-900 dark:text-white">{asset.amc_or_war}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Inventory</span>
              <p className="text-gray-900 dark:text-white">{asset.inventory}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Vendor Name</span>
              <p className="text-gray-900 dark:text-white">{asset.vendor_name}</p>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);
    
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Asset Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track all IT assets</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                viewMode === 'card'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Cards</span>
            </button>
          </div>

          {/* Add Asset */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Asset</span>
          </button>

          {/* Bulk Upload */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <span className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
              Upload Bulk Assets
            </span>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        
      

          {/*Template hyperlink*/}
          <a
          href="/templates/bulk_asset_template.xlsx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm mt-1"
          >
          Template
         </a>
        </div>
      </div>


      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Select Category" disabled>Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Select Status" disabled>Select Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Asset In Time" disabled>Asset In Time</option>
              {dateFilters.map(filter => (
                <option key={filter} value={filter}>{filter}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic View */}
      {viewMode === 'table' ? <TableView /> : <CardView />}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {filteredAssets.length} of {assets.length} assets
        </div>
        <div className="flex items-center justify-center space-x-2">
          <button className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
            Previous
          </button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200">
            1
          </button>
          <button className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {showAddModal && <AddAssetModal />}
      {showEditModal && assetBeingEdited && (
        <EditAssetModal
          asset={assetBeingEdited}
          fetchAssets={fetchAssets}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default AssetManagement;

