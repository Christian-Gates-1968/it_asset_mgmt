import { Asset, Complaint, CallLog, PMReport } from '../types';

export const mockAssets: Asset[] = [
  {
    id: 'AST001',
    name: 'Dell Latitude 5520',
    category: 'Laptop',
    serialNumber: 'DL5520001',
    status: 'Active',
    assignedTo: 'John Smith',
    location: 'Floor 3, Desk 15',
    purchaseDate: '2023-01-15',
    warrantyExpiry: '2026-01-15'
  },
  {
    id: 'AST002',
    name: 'HP LaserJet Pro',
    category: 'Printer',
    serialNumber: 'HP4500002',
    status: 'Under Repair',
    assignedTo: 'IT Department',
    location: 'Floor 2, Print Room',
    purchaseDate: '2022-06-10',
    warrantyExpiry: '2025-06-10'
  },
  {
    id: 'AST003',
    name: 'Cisco Catalyst 2960',
    category: 'Router',
    serialNumber: 'CC2960003',
    status: 'Active',
    assignedTo: 'Network Team',
    location: 'Server Room A',
    purchaseDate: '2023-03-20',
    warrantyExpiry: '2028-03-20'
  },
  {
    id: 'AST004',
    name: 'Windows 11 Pro',
    category: 'OS',
    serialNumber: 'WIN11PRO004',
    status: 'Active',
    assignedTo: 'Multiple Users',
    location: 'Software Library',
    purchaseDate: '2023-05-01',
    warrantyExpiry: '2026-05-01'
  },
  {
    id: 'AST005',
    name: 'Microsoft Office 365',
    category: 'License',
    serialNumber: 'MS365005',
    status: 'Active',
    assignedTo: 'All Employees',
    location: 'Cloud License',
    purchaseDate: '2023-01-01',
    warrantyExpiry: '2024-01-01'
  }
];

export const mockComplaints: Complaint[] = [
  {
    id: 'CMP001',
    asset_id: 'AST001',
    asset_name: 'Dell Latitude 5520',
    reported_by_username: 'John Smith',
    description: 'Laptop screen flickering intermittently',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    assign: 'ech Engineer 1'
  },
  {
    id: 'CMP002',
    asset_id: 'AST002',
    asset_name: 'HP LaserJet Pro',
    reported_by_username: 'IT Department',
    description: 'Printer not responding, paper jam issues',
    status: 'Open',
    priority: 'High',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T09:15:00Z'
  },
  {
    id: 'CMP003',
    asset_id: 'AST003',
    asset_name: 'Cisco Catalyst 2960',
    reported_by_username: 'Network Team',
    description: 'Network connectivity issues in Building A',
    status: 'Resolved',
    priority: 'Critical',
    createdAt: '2024-01-14T08:00:00Z',
    updatedAt: '2024-01-15T16:30:00Z',
    assignedTo: 'Senior Network Engineer',
    resolution: 'Replaced faulty network cable and updated firmware'
  }
];

export const mockCallLogs: CallLog[] = [
  {
    id: 'CALL001',
    type: 'Phone',
    contactPerson: 'Sarah Johnson',
    contactNumber: '+1-555-0123',
    description: 'Unable to connect to company VPN',
    status: 'Closed',
    createdAt: '2024-01-16T11:00:00Z',
    handledBy: 'Tech Support Team'
  },
  {
    id: 'CALL002',
    type: 'Email',
    contactPerson: 'Mike Wilson',
    contactNumber: 'mike.wilson@company.com',
    description: 'Request for software installation - Adobe Creative Suite',
    status: 'In Progress',
    createdAt: '2024-01-16T13:30:00Z',
    handledBy: 'Software Installation Team'
  },
  {
    id: 'CALL003',
    type: 'Walk-in',
    contactPerson: 'Emily Davis',
    contactNumber: 'Ext: 4567',
    description: 'Keyboard and mouse replacement request',
    status: 'Open',
    createdAt: '2024-01-16T15:45:00Z',
    handledBy: 'Hardware Support Team'
  }
];

export const mockPMReports: PMReport[] = [
  {
    id: 'PM001',
    asset_id: 'AST001',
    asset_name: 'Dell Latitude 5520',
    reportType: 'Maintenance',
    fileName: 'laptop_maintenance_jan2024.pdf',
    fileSize: '2.3 MB',
    uploadedBy: 'Tech Engineer 1',
    uploadedAt: '2024-01-15T16:00:00Z',
    status: 'Approved'
  },
  {
    id: 'PM002',
    asset_id: 'AST002',
    asset_name: 'HP LaserJet Pro',
    reportType: 'Repair',
    fileName: 'printer_repair_report.xlsx',
    fileSize: '1.8 MB',
    uploadedBy: 'Hardware Specialist',
    uploadedAt: '2024-01-16T10:30:00Z',
    status: 'Pending'
  },
  {
    id: 'PM003',
    asset_id: 'AST003',
    asset_name: 'Cisco Catalyst 2960',
    reportType: 'Inspection',
    fileName: 'network_inspection_report.pdf',
    fileSize: '3.1 MB',
    uploadedBy: 'Senior Network Engineer',
    uploadedAt: '2024-01-14T14:20:00Z',
    status: 'Reviewed'
  }
];