
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bug, BugPriority, BugStatus, Dashboard, Project } from '@/types';
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
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
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
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
        fetchDashboards(),
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
    const { data, error } = await supabase
      .from('projects')
      .select('*');
    
    if (error) throw error;
    
    if (data) {
      const formattedProjects: Project[] = data.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        isActive: project.is_active,
        dashboards: [] // Will be populated after dashboards are fetched
      }));
      setProjects(formattedProjects);
    }
  };

  const fetchDashboards = async () => {
    const { data, error } = await supabase
      .from('dashboards')
      .select('*');
    
    if (error) throw error;
    
    if (data) {
      const formattedDashboards: Dashboard[] = data.map(dashboard => ({
        id: dashboard.id,
        name: dashboard.name,
        projectId: dashboard.project_id
      }));
      setDashboards(formattedDashboards);
    }
  };

  const fetchBugs = async () => {
    const { data, error } = await supabase
      .from('bugs')
      .select('*');
    
    if (error) throw error;
    
    if (data) {
      const formattedBugs: Bug[] = data.map(bug => ({
        id: bug.id,
        name: bug.name,
        description: bug.description,
        projectId: bug.project_id,
        affectedDashboards: bug.affected_dashboards || [],
        reporterId: bug.reporter_id,
        assigneeId: bug.assignee_id || undefined,
        priority: bug.priority as BugPriority,
        status: bug.status as BugStatus,
        createdAt: new Date(bug.created_at),
        updatedAt: new Date(bug.updated_at),
        screenshots: bug.screenshots || [],
        files: bug.files || []
      }));
      setBugs(formattedBugs);
    }
  };

  // Update projects with their dashboards
  useEffect(() => {
    if (projects.length && dashboards.length) {
      const updatedProjects = projects.map(project => ({
        ...project,
        dashboards: dashboards.filter(d => d.projectId === project.id)
      }));
      setProjects(updatedProjects);
    }
  }, [dashboards]);

  const addBug = async (newBugData: Omit<Bug, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('bugs')
        .insert({
          name: newBugData.name,
          description: newBugData.description,
          project_id: newBugData.projectId,
          affected_dashboards: newBugData.affectedDashboards,
          reporter_id: newBugData.reporterId,
          assignee_id: newBugData.assigneeId || null,
          priority: newBugData.priority,
          status: newBugData.status || 'pending',
          created_at: now,
          updated_at: now,
          screenshots: newBugData.screenshots || [],
          files: newBugData.files || []
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newBug: Bug = {
          id: data.id,
          name: data.name,
          description: data.description,
          projectId: data.project_id,
          affectedDashboards: data.affected_dashboards || [],
          reporterId: data.reporter_id,
          assigneeId: data.assignee_id || undefined,
          priority: data.priority as BugPriority,
          status: data.status as BugStatus,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          screenshots: data.screenshots || [],
          files: data.files || []
        };
        
        setBugs([newBug, ...bugs]);
        
        // Add activity record
        await recordActivity('bug_reported', currentUser?.id || '', `Reported a new bug: "${newBug.name}"`, newBug.projectId);
        
        toast({
          title: "Bug reported successfully",
          description: `Bug "${newBug.name}" has been created.`,
        });
      }
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
      const { error } = await supabase
        .from('bugs')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bugId);
      
      if (error) throw error;
      
      const updatedBugs = bugs.map(bug => 
        bug.id === bugId 
          ? { ...bug, status, updatedAt: new Date() } 
          : bug
      );
      
      setBugs(updatedBugs);
      
      const bug = bugs.find(b => b.id === bugId);
      if (bug) {
        const statusAction = status === 'fixed' ? 'fixed' : status === 'declined' ? 'declined' : 'updated status of';
        await recordActivity(`bug_${status}`, currentUser?.id || '', `${statusAction} bug: "${bug.name}"`, bug.projectId);
      }
      
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
      const { error } = await supabase
        .from('bugs')
        .update({ 
          assignee_id: assigneeId,
          updated_at: new Date().toISOString()
        })
        .eq('id', bugId);
      
      if (error) throw error;
      
      const updatedBugs = bugs.map(bug => 
        bug.id === bugId 
          ? { ...bug, assigneeId, updatedAt: new Date() } 
          : bug
      );
      
      setBugs(updatedBugs);
      
      const bug = bugs.find(b => b.id === bugId);
      if (bug) {
        await recordActivity('bug_assigned', currentUser?.id || '', `Assigned bug "${bug.name}" to a developer`, bug.projectId);
      }
      
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

  const recordActivity = async (type: string, userId: string, description: string, projectId: string) => {
    try {
      await supabase
        .from('activities')
        .insert({
          type,
          user_id: userId,
          description,
          project_id: projectId,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  };

  const getProjectById = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  const getDashboardById = (id: string): Dashboard | undefined => {
    return dashboards.find(dashboard => dashboard.id === id);
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
