
import { User, Bug, Project, Dashboard, BugStatus, BugPriority, UserRole } from '@/types';

// Mock data store (will be replaced with PHP/MySQL later)
class MockDataStore {
  private users: User[] = [
    { 
      id: 'demo-user-1', 
      name: 'Demo User', 
      email: 'demo@example.com', 
      role: 'tester'
    },
    { 
      id: 'demo-user-2', 
      name: 'Demo Admin', 
      email: 'demo-admin@example.com', 
      role: 'admin' 
    },
    { 
      id: 'demo-user-3', 
      name: 'Demo Developer', 
      email: 'demo-dev@example.com', 
      role: 'developer' 
    }
  ];
  
  private projects: Project[] = [
    {
      id: 'proj-1',
      name: 'E-commerce Platform',
      description: 'Online shopping platform with product management and cart features',
      isActive: true,
      dashboards: []
    },
    {
      id: 'proj-2',
      name: 'CRM System',
      description: 'Customer relationship management system for sales teams',
      isActive: true,
      dashboards: []
    }
  ];
  
  private dashboards: Dashboard[] = [
    {
      id: 'dash-1',
      name: 'Products Dashboard',
      projectId: 'proj-1'
    },
    {
      id: 'dash-2',
      name: 'Sales Dashboard',
      projectId: 'proj-1'
    },
    {
      id: 'dash-3',
      name: 'Customer Dashboard',
      projectId: 'proj-2'
    }
  ];
  
  private bugs: Bug[] = [
    {
      id: 'bug-1',
      name: 'Checkout process fails',
      description: 'Users unable to complete checkout on mobile devices',
      projectId: 'proj-1',
      affectedDashboards: ['dash-1'],
      reporterId: 'demo-user-1',
      priority: 'high',
      status: 'pending',
      createdAt: new Date('2025-04-01'),
      updatedAt: new Date('2025-04-01')
    },
    {
      id: 'bug-2',
      name: 'Search results incorrect',
      description: 'Search returns unrelated products',
      projectId: 'proj-1',
      affectedDashboards: ['dash-1', 'dash-2'],
      reporterId: 'demo-user-1',
      assigneeId: 'demo-user-3',
      priority: 'medium',
      status: 'pending',
      createdAt: new Date('2025-04-02'),
      updatedAt: new Date('2025-04-03')
    },
    {
      id: 'bug-3',
      name: 'Customer data not loading',
      description: 'Customer profiles show blank data',
      projectId: 'proj-2',
      affectedDashboards: ['dash-3'],
      reporterId: 'demo-user-2',
      assigneeId: 'demo-user-3',
      priority: 'high',
      status: 'fixed',
      createdAt: new Date('2025-04-01'),
      updatedAt: new Date('2025-04-05')
    }
  ];
  
  private activities: any[] = [
    {
      id: 'act-1',
      type: 'bug_reported',
      userId: 'demo-user-1',
      description: 'Reported a new bug: "Checkout process fails"',
      projectId: 'proj-1',
      createdAt: new Date('2025-04-01')
    },
    {
      id: 'act-2',
      type: 'bug_assigned',
      userId: 'demo-user-2',
      description: 'Assigned bug "Search results incorrect" to a developer',
      projectId: 'proj-1',
      createdAt: new Date('2025-04-03')
    },
    {
      id: 'act-3',
      type: 'bug_fixed',
      userId: 'demo-user-3',
      description: 'Fixed bug: "Customer data not loading"',
      projectId: 'proj-2',
      createdAt: new Date('2025-04-05')
    }
  ];
  
  constructor() {
    // Link dashboards to projects
    this.projects = this.projects.map(project => ({
      ...project,
      dashboards: this.dashboards.filter(d => d.projectId === project.id)
    }));
    
    // Initialize from localStorage if available
    this.loadFromStorage();
  }
  
  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  
  private saveToStorage() {
    localStorage.setItem('mock_users', JSON.stringify(this.users));
    localStorage.setItem('mock_projects', JSON.stringify(this.projects));
    localStorage.setItem('mock_dashboards', JSON.stringify(this.dashboards));
    localStorage.setItem('mock_bugs', JSON.stringify(this.bugs));
    localStorage.setItem('mock_activities', JSON.stringify(this.activities));
  }
  
  private loadFromStorage() {
    try {
      const users = localStorage.getItem('mock_users');
      const projects = localStorage.getItem('mock_projects');
      const dashboards = localStorage.getItem('mock_dashboards');
      const bugs = localStorage.getItem('mock_bugs');
      const activities = localStorage.getItem('mock_activities');
      
      if (users) this.users = JSON.parse(users);
      if (projects) this.projects = JSON.parse(projects);
      if (dashboards) this.dashboards = JSON.parse(dashboards);
      if (bugs) {
        const parsedBugs = JSON.parse(bugs);
        this.bugs = parsedBugs.map((bug: any) => ({
          ...bug,
          createdAt: new Date(bug.createdAt),
          updatedAt: new Date(bug.updatedAt)
        }));
      }
      if (activities) {
        const parsedActivities = JSON.parse(activities);
        this.activities = parsedActivities.map((activity: any) => ({
          ...activity,
          createdAt: new Date(activity.createdAt)
        }));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }
  
  // Auth methods
  loginUser(email: string, password: string): Promise<{ user: User, token: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (user && (password || email.includes('demo'))) {
          // For demo purposes, any password works for demo accounts
          const token = `mock-token-${user.id}-${Date.now()}`;
          localStorage.setItem('current_user_id', user.id);
          resolve({ user, token });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500); // Simulate network delay
    });
  }
  
  registerUser(email: string, password: string, name: string, role: UserRole): Promise<{ user: User, token: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (existingUser) {
          reject(new Error('User with this email already exists'));
          return;
        }
        
        const newUser: User = {
          id: this.generateId('user'),
          email,
          name,
          role,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`
        };
        
        this.users.push(newUser);
        this.saveToStorage();
        
        const token = `mock-token-${newUser.id}-${Date.now()}`;
        localStorage.setItem('current_user_id', newUser.id);
        resolve({ user: newUser, token });
      }, 500);
    });
  }
  
  getCurrentUser(): User | null {
    const userId = localStorage.getItem('current_user_id');
    if (!userId) return null;
    
    return this.users.find(u => u.id === userId) || null;
  }
  
  logout(): void {
    localStorage.removeItem('current_user_id');
  }
  
  // Project methods
  getProjects(): Promise<Project[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...this.projects]);
      }, 300);
    });
  }
  
  // Dashboard methods
  getDashboards(): Promise<Dashboard[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...this.dashboards]);
      }, 300);
    });
  }
  
  // Bug methods
  getBugs(): Promise<Bug[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...this.bugs]);
      }, 300);
    });
  }
  
  addBug(bugData: Omit<Bug, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bug> {
    return new Promise(resolve => {
      setTimeout(() => {
        const now = new Date();
        const newBug: Bug = {
          ...bugData,
          id: this.generateId('bug'),
          createdAt: now,
          updatedAt: now,
          screenshots: bugData.screenshots || [],
          files: bugData.files || []
        };
        
        this.bugs.unshift(newBug);
        
        // Add activity
        this.addActivity({
          type: 'bug_reported',
          userId: bugData.reporterId,
          description: `Reported a new bug: "${bugData.name}"`,
          projectId: bugData.projectId
        });
        
        this.saveToStorage();
        resolve(newBug);
      }, 500);
    });
  }
  
  updateBugStatus(bugId: string, status: BugStatus): Promise<Bug> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bugIndex = this.bugs.findIndex(bug => bug.id === bugId);
        
        if (bugIndex === -1) {
          reject(new Error('Bug not found'));
          return;
        }
        
        const updatedBug = {
          ...this.bugs[bugIndex],
          status,
          updatedAt: new Date()
        };
        
        this.bugs[bugIndex] = updatedBug;
        
        // Add activity
        const statusAction = status === 'fixed' ? 'fixed' : status === 'declined' ? 'declined' : 'updated status of';
        this.addActivity({
          type: `bug_${status}`,
          userId: this.getCurrentUser()?.id || '',
          description: `${statusAction} bug: "${updatedBug.name}"`,
          projectId: updatedBug.projectId
        });
        
        this.saveToStorage();
        resolve(updatedBug);
      }, 500);
    });
  }
  
  updateBugAssignee(bugId: string, assigneeId: string): Promise<Bug> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bugIndex = this.bugs.findIndex(bug => bug.id === bugId);
        
        if (bugIndex === -1) {
          reject(new Error('Bug not found'));
          return;
        }
        
        const updatedBug = {
          ...this.bugs[bugIndex],
          assigneeId,
          updatedAt: new Date()
        };
        
        this.bugs[bugIndex] = updatedBug;
        
        // Add activity
        this.addActivity({
          type: 'bug_assigned',
          userId: this.getCurrentUser()?.id || '',
          description: `Assigned bug "${updatedBug.name}" to a developer`,
          projectId: updatedBug.projectId
        });
        
        this.saveToStorage();
        resolve(updatedBug);
      }, 500);
    });
  }
  
  // Activity methods
  getActivities(): Promise<any[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...this.activities]);
      }, 300);
    });
  }
  
  addActivity(activityData: { type: string; userId: string; description: string; projectId: string }): void {
    const newActivity = {
      ...activityData,
      id: this.generateId('act'),
      createdAt: new Date()
    };
    
    this.activities.unshift(newActivity);
    this.saveToStorage();
  }
  
  // User methods
  getUsers(): Promise<User[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...this.users]);
      }, 300);
    });
  }
}

export const mockDataStore = new MockDataStore();
