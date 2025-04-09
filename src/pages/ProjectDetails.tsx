
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBugs } from '@/context/BugContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bug, ChevronLeft, Plus } from 'lucide-react';
import { RecentBugs } from '@/components/bugs/RecentBugs';
import { BugStats } from '@/components/dashboard/BugStats';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { getProjectById, getBugsByProject } = useBugs();
  const [activeTab, setActiveTab] = useState('overview');

  const project = getProjectById(projectId || '');
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Button asChild>
          <Link to="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  const projectBugs = getBugsByProject(project.id);
  const pendingBugs = projectBugs.filter(bug => bug.status === 'pending');
  const fixedBugs = projectBugs.filter(bug => bug.status === 'fixed');
  const declinedBugs = projectBugs.filter(bug => bug.status === 'declined');

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Link to="/projects" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Projects
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
              {project.isActive ? (
                <Badge>Active</Badge>
              ) : (
                <Badge variant="outline">Inactive</Badge>
              )}
            </div>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <Button asChild>
            <Link to={`/bugs/new?projectId=${project.id}`}>
              <Bug className="mr-2 h-4 w-4" /> Report Bug
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bugs">Bugs</TabsTrigger>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bugs</CardTitle>
                <Bug className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectBugs.length}</div>
                <p className="text-xs text-muted-foreground">
                  Reported issues
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <div className="h-4 w-4 rounded-full bg-bugstatus-pending" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingBugs.length}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((pendingBugs.length / (projectBugs.length || 1)) * 100)}% of total bugs
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fixed</CardTitle>
                <div className="h-4 w-4 rounded-full bg-bugstatus-fixed" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fixedBugs.length}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((fixedBugs.length / (projectBugs.length || 1)) * 100)}% of total bugs
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Declined</CardTitle>
                <div className="h-4 w-4 rounded-full bg-bugstatus-declined" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{declinedBugs.length}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((declinedBugs.length / (projectBugs.length || 1)) * 100)}% of total bugs
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Bug Statistics</CardTitle>
              <CardDescription>
                Distribution of bugs by status and priority
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BugStats bugs={projectBugs} />
            </CardContent>
          </Card>
          
          <RecentBugs title="Recent Bugs" bugs={projectBugs.slice(0, 5)} />
        </TabsContent>
        
        <TabsContent value="bugs">
          <RecentBugs title="All Bugs" bugs={projectBugs} />
        </TabsContent>
        
        <TabsContent value="dashboards">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Project Dashboards</CardTitle>
                <CardDescription>
                  All dashboards available in this project
                </CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Dashboard
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {project.dashboards.map((dashboard) => (
                  <Card key={dashboard.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{dashboard.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {projectBugs.filter(bug => 
                          bug.affectedDashboards.includes(dashboard.id)
                        ).length} related bugs
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetails;
