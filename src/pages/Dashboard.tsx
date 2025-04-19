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
    <div className="space-y-3 sm:space-y-4 lg:space-y-6 p-2 sm:p-4 lg:p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-1 sm:gap-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
          Welcome back, {currentUser?.name || 'User'}! Here's an overview of your bug tracking system.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 md:grid-cols-4">
        <Card className="p-2 sm:p-3 lg:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1.5 sm:pb-2">
            <CardTitle className="text-[11px] xs:text-xs sm:text-sm font-medium">Total Bugs</CardTitle>
            <BarChart3 className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <Skeleton className="h-5 sm:h-6 lg:h-8 w-14 sm:w-16 lg:w-20" />
            ) : (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{bugs.length}</div>
            )}
            <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5 sm:mt-1">
              {bugs.filter(bug => bug.status === 'fixed').length} bugs fixed
            </p>
          </CardContent>
        </Card>
        
        <Card className="p-2 sm:p-3 lg:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1.5 sm:pb-2">
            <CardTitle className="text-[11px] xs:text-xs sm:text-sm font-medium">Your Bugs</CardTitle>
            <BarChart3 className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <Skeleton className="h-5 sm:h-6 lg:h-8 w-14 sm:w-16 lg:w-20" />
            ) : (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{userBugs.length}</div>
            )}
            <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5 sm:mt-1">
              {userBugs.filter(bug => bug.status === 'fixed').length} bugs fixed
            </p>
          </CardContent>
        </Card>

        <Card className="p-2 sm:p-3 lg:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1.5 sm:pb-2">
            <CardTitle className="text-[11px] xs:text-xs sm:text-sm font-medium">Total Projects</CardTitle>
            <PieChart className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <Skeleton className="h-5 sm:h-6 lg:h-8 w-14 sm:w-16 lg:w-20" />
            ) : (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{projects.length}</div>
            )}
            <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5 sm:mt-1">
              {projects.length > 0 ? 'Active projects' : 'No active projects'}
            </p>
          </CardContent>
        </Card>

        <Card className="p-2 sm:p-3 lg:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1.5 sm:pb-2">
            <CardTitle className="text-[11px] xs:text-xs sm:text-sm font-medium">Bug Fix Rate</CardTitle>
            <LineChartIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <Skeleton className="h-5 sm:h-6 lg:h-8 w-14 sm:w-16 lg:w-20" />
            ) : (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                {bugs.length > 0 
                  ? `${Math.round((bugs.filter(bug => bug.status === 'fixed').length / bugs.length) * 100)}%` 
                  : 'N/A'}
              </div>
            )}
            <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5 sm:mt-1">
              {bugs.filter(bug => bug.status === 'fixed').length} out of {bugs.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-2 sm:space-y-3 lg:space-y-4">
        <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1 sm:gap-2 bg-transparent sm:bg-muted p-1 rounded-lg overflow-x-auto">
          <TabsTrigger value="overview" className="text-[11px] xs:text-xs sm:text-sm h-7 sm:h-8 lg:h-9 px-2.5 sm:px-3 lg:px-4 whitespace-nowrap">
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-[11px] xs:text-xs sm:text-sm h-7 sm:h-8 lg:h-9 px-2.5 sm:px-3 lg:px-4 whitespace-nowrap">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-[11px] xs:text-xs sm:text-sm h-7 sm:h-8 lg:h-9 px-2.5 sm:px-3 lg:px-4 whitespace-nowrap">
            Projects
          </TabsTrigger>
          <TabsTrigger value="recent" className="text-[11px] xs:text-xs sm:text-sm h-7 sm:h-8 lg:h-9 px-2.5 sm:px-3 lg:px-4 whitespace-nowrap">
            Recent Bugs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-2 sm:space-y-3 lg:space-y-4">
          <div className="grid gap-2 sm:gap-3 lg:gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader className="space-y-1 p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-sm sm:text-base lg:text-lg">Weekly Bug Activity</CardTitle>
                <CardDescription className="text-[11px] sm:text-xs lg:text-sm">
                  Bugs reported and fixed in the last week
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 sm:p-2 lg:p-4">
                {isLoading ? (
                  <div className="h-[180px] sm:h-[250px] lg:h-[300px] flex items-center justify-center p-4">
                    <Skeleton className="h-[160px] sm:h-[230px] lg:h-[280px] w-full" />
                  </div>
                ) : (
                  <ChartContainer config={{}} className="aspect-auto h-[180px] sm:h-[250px] lg:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis 
                          dataKey="name" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false}
                          tick={{ fontSize: '10px', fill: 'var(--muted-foreground)' }}
                        />
                        <YAxis 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false}
                          tick={{ fontSize: '10px', fill: 'var(--muted-foreground)' }}
                        />
                        <Bar 
                          dataKey="bugs" 
                          name="Reported" 
                          fill="hsl(var(--primary))" 
                          radius={[4, 4, 0, 0]}
                          maxBarSize={50}
                        />
                        <Bar 
                          dataKey="fixes" 
                          name="Fixed" 
                          fill="#10b981" 
                          radius={[4, 4, 0, 0]}
                          maxBarSize={50}
                        />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          cursor={{ fill: 'var(--muted)' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
              <CardHeader className="space-y-1 p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-sm sm:text-base lg:text-lg">Bug Status Distribution</CardTitle>
                <CardDescription className="text-[11px] sm:text-xs lg:text-sm">
                  Distribution of bugs by status
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 sm:p-2 lg:p-4">
                {isLoading ? (
                  <div className="h-[180px] sm:h-[250px] lg:h-[300px] flex items-center justify-center p-4">
                    <Skeleton className="h-[160px] sm:h-[230px] lg:h-[280px] w-full" />
                  </div>
                ) : (
                  <div className="h-[180px] sm:h-[250px] lg:h-[300px]">
                    <BugStats bugs={bugs} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-2 sm:space-y-3 lg:space-y-4">
          <Card>
            <CardHeader className="space-y-1 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-sm sm:text-base lg:text-lg">Project Bug Distribution</CardTitle>
              <CardDescription className="text-[11px] sm:text-xs lg:text-sm">
                Bug distribution across all projects
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-2 lg:p-4">
              <div className="h-[200px] sm:h-[300px] lg:h-[400px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center p-4">
                    <Skeleton className="h-[180px] sm:h-[280px] lg:h-[380px] w-full" />
                  </div>
                ) : (
                  <ProjectStats />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-2 sm:space-y-3 lg:space-y-4">
          <Card>
            <CardHeader className="space-y-1 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-sm sm:text-base lg:text-lg">Projects Overview</CardTitle>
              <CardDescription className="text-[11px] sm:text-xs lg:text-sm">
                Status of all your projects
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-2 lg:p-4">
              <ScrollArea className="h-[200px] sm:h-[300px] lg:h-[400px] w-full rounded-md">
                <div className="min-w-[400px] sm:min-w-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] text-[11px] sm:text-xs lg:text-sm">Name</TableHead>
                        <TableHead className="hidden sm:table-cell text-[11px] sm:text-xs lg:text-sm">Description</TableHead>
                        <TableHead className="text-[11px] sm:text-xs lg:text-sm">Total Bugs</TableHead>
                        <TableHead className="text-right text-[11px] sm:text-xs lg:text-sm">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array(5).fill(0).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-[60px] sm:w-[80px]" /></TableCell>
                            <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[25px] sm:w-[30px]" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-4 w-[50px] sm:w-[60px] ml-auto" /></TableCell>
                          </TableRow>
                        ))
                      ) : (
                        projects.map((project) => {
                          const dashboard = getProjectDashboard(project);
                          return (
                            <TableRow key={project.id}>
                              <TableCell className="font-medium text-[11px] sm:text-xs lg:text-sm py-2 sm:py-3">
                                <Link to={`/projects/${project.id}`} className="hover:underline">
                                  {project.name}
                                </Link>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell text-[11px] sm:text-xs lg:text-sm py-2 sm:py-3">
                                {project.description.length > 50 
                                  ? `${project.description.substring(0, 50)}...` 
                                  : project.description}
                              </TableCell>
                              <TableCell className="text-[11px] sm:text-xs lg:text-sm py-2 sm:py-3">
                                {dashboard.totalBugs}
                              </TableCell>
                              <TableCell className="text-right py-2 sm:py-3">
                                <Badge 
                                  variant={dashboard.totalBugs > 0 ? "outline" : "secondary"}
                                  className="text-[10px] sm:text-xs whitespace-nowrap px-1.5 sm:px-2"
                                >
                                  {dashboard.totalBugs > 0 ? 'Active' : 'No bugs'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                      {!isLoading && projects.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center h-20 sm:h-24 lg:h-32">
                            <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
                              <p className="text-[11px] sm:text-xs lg:text-sm text-muted-foreground">
                                No projects found.
                              </p>
                              <Link 
                                to="/projects" 
                                className="text-[11px] sm:text-xs lg:text-sm text-primary hover:underline underline-offset-4"
                              >
                                Add your first project
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-3 sm:p-4">
              <Link 
                to="/projects" 
                className="text-[11px] sm:text-xs lg:text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all projects 
                <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-2 sm:space-y-3 lg:space-y-4">
          <Card>
            <CardHeader className="space-y-1 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-sm sm:text-base lg:text-lg">Recent Bugs</CardTitle>
              <CardDescription className="text-[11px] sm:text-xs lg:text-sm">
                Latest reported bugs across all projects
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-2 lg:p-4">
              <ScrollArea className="h-[200px] sm:h-[300px] lg:h-[400px] w-full rounded-md">
                <div className="min-w-[400px] sm:min-w-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[11px] sm:text-xs lg:text-sm">Title</TableHead>
                        <TableHead className="hidden sm:table-cell text-[11px] sm:text-xs lg:text-sm">Project</TableHead>
                        <TableHead className="text-[11px] sm:text-xs lg:text-sm">Priority</TableHead>
                        <TableHead className="text-[11px] sm:text-xs lg:text-sm">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array(5).fill(0).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                            <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-[100px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                          </TableRow>
                        ))
                      ) : (
                        recentBugs.map((bug) => {
                          const project = projects.find(p => p.id === bug.project_id);
                          return (
                            <TableRow key={bug.id}>
                              <TableCell className="font-medium text-[11px] sm:text-xs lg:text-sm py-2 sm:py-3">
                                <Link to={`/bugs/${bug.id}`} className="hover:underline">
                                  {bug.title}
                                </Link>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell text-[11px] sm:text-xs lg:text-sm py-2 sm:py-3">
                                {project?.name || 'Unknown'}
                              </TableCell>
                              <TableCell className="text-[11px] sm:text-xs lg:text-sm py-2 sm:py-3">
                                <Badge
                                  variant="outline" 
                                  className={`text-[10px] sm:text-xs whitespace-nowrap px-1.5 sm:px-2
                                    ${bug.priority === 'high' ? 'border-bugpriority-high text-bugpriority-high' :
                                      bug.priority === 'medium' ? 'border-bugpriority-medium text-bugpriority-medium' :
                                      'border-bugpriority-low text-bugpriority-low'}
                                  `}
                                >
                                  {bug.priority}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right py-2 sm:py-3">
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] sm:text-xs whitespace-nowrap px-1.5 sm:px-2
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
                          <TableCell colSpan={4} className="text-center h-20 sm:h-24 lg:h-32">
                            <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
                              <p className="text-[11px] sm:text-xs lg:text-sm text-muted-foreground">
                                No bugs found.
                              </p>
                              <Link 
                                to="/bugs/new" 
                                className="text-[11px] sm:text-xs lg:text-sm text-primary hover:underline underline-offset-4"
                              >
                                Report your first bug
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-3 sm:p-4">
              <Link 
                to="/bugs" 
                className="text-[11px] sm:text-xs lg:text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all bugs 
                <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
