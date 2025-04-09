
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Bug, BugPriority, BugStatus, Dashboard, Project } from '@/types';
import { toast } from "@/components/ui/use-toast";

// Sample data for demo purposes
const DEMO_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'MedocSuite',
    description: 'Healthcare management system',
    isActive: true,
    dashboards: [
      { id: '1', name: 'Doctor', projectId: '1' },
      { id: '2', name: 'Nurse', projectId: '1' },
      { id: '3', name: 'Admin', projectId: '1' },
    ],
  },
  {
    id: '2',
    name: 'Albedo Educator',
    description: 'Educational platform for schools',
    isActive: true,
    dashboards: [
      { id: '4', name: 'Teacher', projectId: '2' },
      { id: '5', name: 'Student', projectId: '2' },
      { id: '6', name: 'Assistant Admin', projectId: '2' },
      { id: '7', name: 'Mentor', projectId: '2' },
    ],
  },
];

// Sample bugs
const DEMO_BUGS: Bug[] = [
  {
    id: '1',
    name: 'Login page not responsive on mobile',
    description: 'The login page breaks on small screens and buttons overlap',
    projectId: '1',
    affectedDashboards: ['1', '3'],
    reporterId: '3', // tester
    assigneeId: '2', // developer
    priority: 'high',
    status: 'pending',
    createdAt: new Date('2024-04-08'),
    updatedAt: new Date('2024-04-08'),
    screenshots: [],
    files: [],
  },
  {
    id: '2',
    name: 'PDF export fails for large reports',
    description: 'When exporting reports with more than 50 pages, the system crashes',
    projectId: '1',
    affectedDashboards: ['1', '2'],
    reporterId: '3', // tester
    assigneeId: '2', // developer
    priority: 'medium',
    status: 'fixed',
    createdAt: new Date('2024-04-07'),
    updatedAt: new Date('2024-04-08'),
    screenshots: [],
    files: [],
  },
  {
    id: '3',
    name: 'Calendar shows wrong week numbers',
    description: 'The week numbers in the calendar view are off by one',
    projectId: '2',
    affectedDashboards: ['4', '7'],
    reporterId: '3', // tester
    priority: 'low',
    status: 'pending',
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05'),
    screenshots: [],
    files: [],
  },
];

interface BugContextType {
  bugs: Bug[];
  projects: Project[];
  addBug: (bug: Omit<Bug, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBugStatus: (bugId: string, status: BugStatus) => void;
  updateBugAssignee: (bugId: string, assigneeId: string) => void;
  getProjectById: (id: string) => Project | undefined;
  getDashboardById: (id: string) => Dashboard | undefined;
  getBugsByProject: (projectId: string) => Bug[];
  getBugsByAssignee: (userId: string) => Bug[];
  getBugsByReporter: (userId: string) => Bug[];
}

const BugContext = createContext<BugContextType | undefined>(undefined);

export const BugProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bugs, setBugs] = useState<Bug[]>(DEMO_BUGS);
  const [projects, setProjects] = useState<Project[]>(DEMO_PROJECTS);

  const addBug = (newBugData: Omit<Bug, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newBug: Bug = {
      ...newBugData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    setBugs([newBug, ...bugs]);
    toast({
      title: "Bug reported successfully",
      description: `Bug "${newBug.name}" has been created.`,
    });
  };

  const updateBugStatus = (bugId: string, status: BugStatus) => {
    setBugs(
      bugs.map(bug => 
        bug.id === bugId 
          ? { ...bug, status, updatedAt: new Date() } 
          : bug
      )
    );
    toast({
      title: "Bug status updated",
      description: `Bug status changed to ${status}.`,
    });
  };

  const updateBugAssignee = (bugId: string, assigneeId: string) => {
    setBugs(
      bugs.map(bug => 
        bug.id === bugId 
          ? { ...bug, assigneeId, updatedAt: new Date() } 
          : bug
      )
    );
    toast({
      title: "Bug assigned",
      description: `Bug has been assigned to a developer.`,
    });
  };

  const getProjectById = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  const getDashboardById = (id: string): Dashboard | undefined => {
    for (const project of projects) {
      const dashboard = project.dashboards.find(d => d.id === id);
      if (dashboard) return dashboard;
    }
    return undefined;
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
    addBug,
    updateBugStatus,
    updateBugAssignee,
    getProjectById,
    getDashboardById,
    getBugsByProject,
    getBugsByAssignee,
    getBugsByReporter,
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
