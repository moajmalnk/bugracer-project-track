export type Project = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
};

export type Bug = {
  id: string;
  title: string;
  description: string;
  project_id: string;
  reported_by: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'fixed' | 'declined' | 'rejected';
  created_at: string;
  updated_at: string;
  screenshots?: Array<{
    id: string;
    name: string;
    path: string;
    type: string;
  }>;
  files?: Array<{
    id: string;
    name: string;
    path: string;
    type: string;
  }>;
};

export type BugPriority = 'low' | 'medium' | 'high';
export type BugStatus = 'pending' | 'in_progress' | 'fixed' | 'rejected' | 'declined';

export type UserRole = 'admin' | 'developer' | 'tester';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  created_at?: string;
}
