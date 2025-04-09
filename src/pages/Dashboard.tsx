
import { useAuth } from '@/context/AuthContext';
import { useBugs } from '@/context/BugContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { RecentBugs } from '@/components/bugs/RecentBugs';
import { BugStats } from '@/components/dashboard/BugStats';
import { ProjectStats } from '@/components/dashboard/ProjectStats';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { bugs, projects } = useBugs();

  // Calculate statistics based on user role
  const totalBugs = bugs.length;
  const pendingBugs = bugs.filter(bug => bug.status === 'pending').length;
  const fixedBugs = bugs.filter(bug => bug.status === 'fixed').length;
  const declinedBugs = bugs.filter(bug => bug.status === 'declined').length;
  
  // Get relevant bugs based on user role
  let relevantBugs = bugs;
  if (currentUser?.role === 'developer') {
    relevantBugs = bugs.filter(bug => bug.assigneeId === currentUser.id);
  } else if (currentUser?.role === 'tester') {
    relevantBugs = bugs.filter(bug => bug.reporterId === currentUser.id);
  }

  const dashboardTitle = `${currentUser?.role === 'admin' ? 'Admin' : 
    currentUser?.role === 'developer' ? 'Developer' : 'Tester'} Dashboard`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{dashboardTitle}</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bugs</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relevantBugs.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {projects.length} projects
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {relevantBugs.filter(bug => bug.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Bugs waiting to be fixed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fixed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {relevantBugs.filter(bug => bug.status === 'fixed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Resolved successfully
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Declined</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {relevantBugs.filter(bug => bug.status === 'declined').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Not considered as issues
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Bug Statistics</CardTitle>
            <CardDescription>
              Distribution of bugs by status and priority
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BugStats bugs={relevantBugs} />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Projects Overview</CardTitle>
            <CardDescription>
              Bug distribution across projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectStats />
          </CardContent>
        </Card>
      </div>
      
      <RecentBugs 
        title="Recent Bugs" 
        bugs={relevantBugs.slice(0, 5)} 
      />
    </div>
  );
};

export default Dashboard;
