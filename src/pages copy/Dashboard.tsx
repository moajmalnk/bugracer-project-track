
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useBugs } from '@/context/BugContext';
import { projectStore } from '@/lib/store';
import { Bug, Project } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BugStats } from '@/components/dashboard/BugStats';
import { ProjectStats } from '@/components/dashboard/ProjectStats';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";

import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ArrowUpRight, BarChart3, LineChart as LineChartIcon, PieChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { bugs, getBugsByProject } = useBugs();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const initialProjects = await projectStore.getProjects();
        setProjects(initialProjects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filterBugsByUser = (bugs: Bug[], userId: string) => {
    return bugs.filter(
      bug => bug.reported_by === userId
    );
  };

  const userBugs = currentUser ? filterBugsByUser(bugs, currentUser.id) : [];

  const getProjectDashboard = (project: Project) => {
    return {
      totalBugs: getBugsByProject(project.id).length,
    };
  };

  // Generate weekly activity data
  const generateWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      name: day,
      bugs: Math.floor(Math.random() * 10),
      fixes: Math.floor(Math.random() * 8),
    }));
  };

  const weeklyData = generateWeeklyData();

  // Bug status distribution data
  const bugStatusData = [
    { name: 'Fixed', value: bugs.filter(bug => bug.status === 'fixed').length },
    { name: 'Pending', value: bugs.filter(bug => bug.status === 'pending').length },
    { name: 'Declined', value: bugs.filter(bug => (bug.status === 'declined' || bug.status === 'rejected')).length }
  ];

  const recentBugs = [...bugs]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {currentUser?.name || 'User'}! Here's an overview of your bug tracking system.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bugs</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{bugs.length}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {bugs.filter(bug => bug.status === 'fixed').length} bugs fixed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Bugs</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{userBugs.length}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {userBugs.filter(bug => bug.status === 'fixed').length} bugs fixed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{projects.length}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {projects.length > 0 ? 'Active projects' : 'No active projects'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bug Fix Rate</CardTitle>
            <LineChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {bugs.length > 0 
                  ? `${Math.round((bugs.filter(bug => bug.status === 'fixed').length / bugs.length) * 100)}%` 
                  : 'N/A'}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {bugs.filter(bug => bug.status === 'fixed').length} out of {bugs.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="recent">Recent Bugs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Weekly Bug Activity</CardTitle>
                <CardDescription>Bugs reported and fixed in the last week</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full" />
                  </div>
                ) : (
                  <ChartContainer config={{}} className="aspect-auto h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                        <Bar dataKey="bugs" name="Reported" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="fixes" name="Fixed" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Bug Status Distribution</CardTitle>
                <CardDescription>Distribution of bugs by status</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <Skeleton className="h-[250px] w-full" />
                  </div>
                ) : (
                  <BugStats bugs={bugs} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Project Bug Distribution</CardTitle>
                <CardDescription>Bug distribution across all projects</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-[350px] w-full" />
                  </div>
                ) : (
                  <ProjectStats />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projects Overview</CardTitle>
              <CardDescription>Status of all your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className={`${isMobile ? 'h-[300px]' : 'h-[400px]'} w-full rounded-md`}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Name</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead>Total Bugs</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-full" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[30px]" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-4 w-[60px] ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      projects.map((project) => {
                        const dashboard = getProjectDashboard(project);
                        return (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium">
                              <Link to={`/projects/${project.id}`}>{project.name}</Link>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {project.description.length > 50 
                                ? `${project.description.substring(0, 50)}...` 
                                : project.description}
                            </TableCell>
                            <TableCell>{dashboard.totalBugs}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={dashboard.totalBugs > 0 ? "outline" : "secondary"}>
                                {dashboard.totalBugs > 0 ? 'Active' : 'No bugs'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                    {!isLoading && projects.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-32">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <p className="text-muted-foreground">No projects found.</p>
                            <Link 
                              to="/projects" 
                              className="text-sm text-primary underline underline-offset-4"
                            >
                              Add your first project
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Link to="/projects" className="text-sm text-primary flex items-center gap-1">
                View all projects <ArrowUpRight className="h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bugs</CardTitle>
              <CardDescription>Latest reported bugs across all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className={`${isMobile ? 'h-[300px]' : 'h-[400px]'} w-full rounded-md`}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Project</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[100px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      recentBugs.map((bug) => {
                        const project = projects.find(p => p.id === bug.project_id);
                        return (
                          <TableRow key={bug.id}>
                            <TableCell className="font-medium">
                              <Link to={`/bugs/${bug.id}`}>{bug.title}</Link>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{project?.name || 'Unknown'}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline" 
                                className={`
                                  ${bug.priority === 'high' ? 'border-bugpriority-high text-bugpriority-high' :
                                    bug.priority === 'medium' ? 'border-bugpriority-medium text-bugpriority-medium' :
                                    'border-bugpriority-low text-bugpriority-low'}
                                `}
                              >
                                {bug.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`
                                  ${bug.status === 'fixed' ? 'border-bugstatus-fixed text-bugstatus-fixed' :
                                    bug.status === 'pending' ? 'border-bugstatus-pending text-bugstatus-pending' :
                                    'border-bugstatus-declined text-bugstatus-declined'}
                                `}
                              >
                                {bug.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                    {!isLoading && recentBugs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-32">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <p className="text-muted-foreground">No bugs found.</p>
                            <Link 
                              to="/bugs/new" 
                              className="text-sm text-primary underline underline-offset-4"
                            >
                              Report your first bug
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Link to="/bugs" className="text-sm text-primary flex items-center gap-1">
                View all bugs <ArrowUpRight className="h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
