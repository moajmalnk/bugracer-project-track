
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useBugs } from '@/context/BugContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BugCard } from '@/components/bugs/BugCard';
import { Bug as BugIcon, Plus, Search } from 'lucide-react';
import { Bug, BugPriority, BugStatus, Project } from '@/types';

const Bugs = () => {
  const { currentUser } = useAuth();
  const { bugs, projects } = useBugs();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BugStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<BugPriority | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  // Filter bugs based on user role
  let filteredBugs = bugs;
  if (currentUser?.role === 'developer') {
    filteredBugs = bugs.filter(bug => bug.assigneeId === currentUser.id);
  } else if (currentUser?.role === 'tester') {
    filteredBugs = bugs.filter(bug => bug.reporterId === currentUser.id);
  }

  // Apply filters
  filteredBugs = filteredBugs.filter(bug => {
    // Text search
    const matchesSearch = 
      bug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || bug.status === statusFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === 'all' || bug.priority === priorityFilter;
    
    // Project filter
    const matchesProject = projectFilter === 'all' || bug.projectId === projectFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bugs</h1>
          <p className="text-muted-foreground">
            {currentUser?.role === 'developer'
              ? 'Bugs assigned to you'
              : currentUser?.role === 'tester'
              ? 'Bugs reported by you'
              : 'All bugs across projects'}
          </p>
        </div>
        
        <Button asChild>
          <Link to="/bugs/new">
            <Plus className="mr-2 h-4 w-4" /> Report Bug
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative col-span-4 md:col-span-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bugs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BugStatus | 'all')}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as BugPriority | 'all')}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="col-span-4 md:col-span-1">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredBugs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <BugIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No bugs found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No bugs match your current filter criteria.
          </p>
          {(currentUser?.role === 'admin' || currentUser?.role === 'tester') && (
            <Button className="mt-4" asChild>
              <Link to="/bugs/new">Report Bug</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBugs.map((bug) => (
            <BugCard key={bug.id} bug={bug} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bugs;
