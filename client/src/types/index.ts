export interface User {
  id: string;
  username: string;
  role: 'Admin' | 'Engineer';
  name: string;
  email: string;
}

export interface Asset {
  asset_id: number;
  asset_name: string;
  category: string;
  s_no: string;
  location: string;
  amc_or_war: string;
  status: string;
  stock_in: string;
  stock_out: string | null;
  inventory: number;
  vendor_name: string;
  dept_id: number;
}

export interface Complaint {
    status: 'In Progress',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  id: string;
  comp_id: number;
  asset_id: string;
  asset_name: string;
  description: string;
  raised_by: number;
  reported_by_username: string;
  issue: string;
  comp_status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  creation_time: string;
  eng_assigned?: number | null;
  assigned_to_username?: string | null;
  expected_res_date?: string | null;
  spare_req?: string | null;
  total_time_taken?: string | null;
  actual_res_date?: string | null;
  comp_type?: string | null;
  updated_at: string;
}



export interface CallLog {
  id: string;
  type: 'Phone' | 'Email' | 'Walk-in';
  contactPerson: string;
  contactNumber: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: string;
  complaintId?: string;
  handledBy: string;
}

export interface PMReport {
  id: string;
  assetId: string;
  assetName: string;
  reportType: 'Maintenance' | 'Inspection' | 'Repair';
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'Pending' | 'Reviewed' | 'Approved';
}