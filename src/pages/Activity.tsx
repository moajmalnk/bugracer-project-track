
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useBugs } from '@/context/BugContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, User, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { mockDataStore } from '@/lib/mockData';

interface ActivityItem {
  id: string;
  type: string;
  userId: string;
  description: string;
  projectId: string;
  createdAt: Date;
}

const Activity = () => {
  const { currentUser } = useAuth();
  const { projects } = useBugs();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await mockDataStore.getActivities();

      if (data) {
        // Fetch user names for activities
        const userIds = [...new Set(data.map(activity => activity.userId))];
        const userMap: Record<string, string> = {};
        
        // Get user profiles
        const users = await mockDataStore.getUsers();
        
        if (users) {
          users.forEach(user => {
            userMap[user.id] = user.name;
          });
        }
        
        setUserNames(userMap);
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bug_reported':
        return <AlertCircle className="h-8 w-8 text-yellow-500" />;
      case 'bug_fixed':
        return <CheckCircle2 className="h-8 w-8 text-green-500" />;
      case 'bug_declined':
        return <XCircle className="h-8 w-8 text-red-500" />;
      case 'project_created':
        return <AlertCircle className="h-8 w-8 text-blue-500" />;
      case 'bug_assigned':
        return <User className="h-8 w-8 text-indigo-500" />;
      default:
        return <Clock className="h-8 w-8 text-gray-500" />;
    }
  };

  const getTimeSince = (dateString: Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading activities...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Activity Feed</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Track all actions across your projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No activities yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Activities will appear here as you and others use the system.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {activities.map((activity) => (
                <div key={activity.id} className="flex">
                  <div className="mr-4 flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{userNames[activity.userId] || 'Unknown User'}</p>
                      <p className="text-xs text-muted-foreground">{getTimeSince(activity.createdAt)}</p>
                    </div>
                    <p className="text-sm text-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">Project: {getProjectName(activity.projectId)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Activity;
