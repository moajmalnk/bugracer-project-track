
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBugs } from '@/context/BugContext';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BugStatus } from '@/types';
import { ChevronLeft, Clock } from 'lucide-react';

const BugDetails = () => {
  const { bugId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { bugs, projects, getProjectById, getDashboardById, updateBugStatus } = useBugs();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const bug = bugs.find(b => b.id === bugId);
  
  if (!bug) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Bug not found</h1>
        <Button asChild>
          <Link to="/bugs">Back to Bugs</Link>
        </Button>
      </div>
    );
  }
  
  const project = getProjectById(bug.projectId);
  const formattedCreatedDate = format(new Date(bug.createdAt), 'MMMM d, yyyy HH:mm');
  const formattedUpdatedDate = format(new Date(bug.updatedAt), 'MMMM d, yyyy HH:mm');
  
  const canUpdateStatus = currentUser?.role === 'admin' || currentUser?.role === 'developer';
  
  const handleStatusChange = async (status: BugStatus) => {
    setIsUpdating(true);
    
    try {
      updateBugStatus(bug.id, status);
    } catch (error) {
      console.error('Failed to update bug status:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const priorityColors = {
    high: 'text-bugpriority-high',
    medium: 'text-bugpriority-medium',
    low: 'text-bugpriority-low',
  };
  
  const statusColors = {
    fixed: 'text-bugstatus-fixed',
    pending: 'text-bugstatus-pending',
    declined: 'text-bugstatus-declined',
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Link to="/bugs" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Bugs
        </Link>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{bug.name}</h1>
            <p className="text-muted-foreground">
              Bug ID: {bug.id} • Reported on {formattedCreatedDate}
            </p>
          </div>
          
          {currentUser?.role === 'admin' && (
            <Button variant="outline">Edit Bug</Button>
          )}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{bug.description}</p>
            </CardContent>
          </Card>
          
          {bug.screenshots.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Screenshots</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {bug.screenshots.map((screenshot, index) => (
                  <img 
                    key={index} 
                    src={screenshot} 
                    alt={`Screenshot ${index + 1}`} 
                    className="rounded-md border object-cover aspect-video"
                  />
                ))}
              </CardContent>
            </Card>
          )}
          
          {bug.files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attached Files</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {bug.files.map((file, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <a 
                        href={file} 
                        className="text-blue-600 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Attachment {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bug Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                {canUpdateStatus ? (
                  <Select 
                    value={bug.status} 
                    onValueChange={(value) => handleStatusChange(value as BugStatus)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className={`text-base font-medium capitalize ${statusColors[bug.status]}`}>
                    {bug.status}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Priority</h3>
                <div className={`text-base font-medium capitalize ${priorityColors[bug.priority]}`}>
                  {bug.priority}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Project</h3>
                <div className="text-base">
                  <Link to={`/projects/${project?.id}`} className="hover:underline">
                    {project?.name}
                  </Link>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Affected Dashboards</h3>
                <div className="flex flex-wrap gap-2">
                  {bug.affectedDashboards.length === 0 ? (
                    <span className="text-muted-foreground">None specified</span>
                  ) : (
                    bug.affectedDashboards.map(dashboardId => {
                      const dashboard = getDashboardById(dashboardId);
                      return dashboard ? (
                        <Badge key={dashboardId} variant="outline">
                          {dashboard.name}
                        </Badge>
                      ) : null;
                    })
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                <div className="flex items-center text-sm">
                  <Clock className="mr-1 h-3 w-3" />
                  {formattedUpdatedDate}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BugDetails;
