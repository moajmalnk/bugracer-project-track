
export type UserRole = 'admin' | 'developer' | 'tester';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  dashboards: Dashboard[];
}

export interface Dashboard {
  id: string;
  name: string;
  projectId: string;
}

export type BugPriority = 'high' | 'medium' | 'low';
export type BugStatus = 'fixed' | 'pending' | 'declined';

export interface Bug {
  id: string;
  name: string;
  description: string;
  projectId: string;
  affectedDashboards: string[]; // Dashboard IDs
  reporterId: string; // User ID of the tester who reported it
  assigneeId?: string; // User ID of the developer assigned to fix it
  priority: BugPriority;
  status: BugStatus;
  createdAt: Date;
  updatedAt: Date;
  screenshots: string[]; // URLs to screenshots
  files: string[]; // URLs to uploaded files
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  link?: string;
}
