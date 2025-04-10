
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bug, BugPriority, BugStatus, Dashboard, Project } from '@/types';
import { toast } from "@/components/ui/use-toast";
import { mockDataStore } from '@/lib/mockData';
import { useAuth } from './AuthContext';

interface BugContextType {
  bugs: Bug[];
  projects: Project[];
  loading: boolean;
  addBug: (bug: Omit<Bug, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBugStatus: (bugId: string, status: BugStatus) => Promise<void>;
  updateBugAssignee: (bugId: string, assigneeId: string) => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  getDashboardById: (id: string) => Dashboard | undefined;
  getBugsByProject: (projectId: string) => Bug[];
  getBugsByAssignee: (userId: string) => Bug[];
  getBugsByReporter: (userId: string) => Bug[];
  refreshData: () => Promise<void>;
}

const BugContext = createContext<BugContextType | undefined>(undefined);

export const BugProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser]);

  const refreshData = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      await Promise.all([
        fetchProjects(),
        fetchBugs()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await mockDataStore.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  };

  const fetchBugs = async () => {
    try {
      const data = await mockDataStore.getBugs();
      setBugs(data);
    } catch (error) {
      console.error('Error fetching bugs:', error);
      throw error;
    }
  };

  const addBug = async (newBugData: Omit<Bug, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newBug = await mockDataStore.addBug(newBugData);
      setBugs([newBug, ...bugs]);
      
      toast({
        title: "Bug reported successfully",
        description: `Bug "${newBug.name}" has been created.`,
      });
    } catch (error) {
      console.error('Error adding bug:', error);
      toast({
        title: "Error",
        description: "Failed to add bug. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateBugStatus = async (bugId: string, status: BugStatus) => {
    try {
      const updatedBug = await mockDataStore.updateBugStatus(bugId, status);
      
      const updatedBugs = bugs.map(bug => 
        bug.id === bugId ? updatedBug : bug
      );
      
      setBugs(updatedBugs);
      
      toast({
        title: "Bug status updated",
        description: `Bug status changed to ${status}.`,
      });
    } catch (error) {
      console.error('Error updating bug status:', error);
      toast({
        title: "Error",
        description: "Failed to update bug status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateBugAssignee = async (bugId: string, assigneeId: string) => {
    try {
      const updatedBug = await mockDataStore.updateBugAssignee(bugId, assigneeId);
      
      const updatedBugs = bugs.map(bug => 
        bug.id === bugId ? updatedBug : bug
      );
      
      setBugs(updatedBugs);
      
      toast({
        title: "Bug assigned",
        description: `Bug has been assigned to a developer.`,
      });
    } catch (error) {
      console.error('Error assigning bug:', error);
      toast({
        title: "Error",
        description: "Failed to assign bug. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getProjectById = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  const getDashboardById = (id: string): Dashboard | undefined => {
    const allDashboards: Dashboard[] = [];
    
    projects.forEach(project => {
      if (project.dashboards) {
        allDashboards.push(...project.dashboards);
      }
    });
    
    return allDashboards.find(dashboard => dashboard.id === id);
  };

  const getBugsByProject = (projectId: string): Bug[] => {
    return bugs.filter(bug => bug.projectId === projectId);
  };

  const getBugsByAssignee = (userId: string): Bug[] => {
    return bugs.filter(bug => bug.assigneeId === userId);
  };

  const getBugsByReporter = (userId: string): Bug[] => {
    return bugs.filter(bug => bug.reporterId === userId);
  };

  const value = {
    bugs,
    projects,
    loading,
    addBug,
    updateBugStatus,
    updateBugAssignee,
    getProjectById,
    getDashboardById,
    getBugsByProject,
    getBugsByAssignee,
    getBugsByReporter,
    refreshData
  };

  return <BugContext.Provider value={value}>{children}</BugContext.Provider>;
};

export const useBugs = (): BugContextType => {
  const context = useContext(BugContext);
  if (context === undefined) {
    throw new Error('useBugs must be used within a BugProvider');
  }
  return context;
};
