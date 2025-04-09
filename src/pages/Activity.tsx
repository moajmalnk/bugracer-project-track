
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, User, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const Activity = () => {
  const { currentUser } = useAuth();

  // This would normally be fetched from an API
  const activities = [
    {
      id: '1',
      type: 'bug_reported',
      user: 'Tester User',
      description: 'Reported a new bug: "Login button not working"',
      project: 'MedocSuite',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'bug_fixed',
      user: 'Developer User',
      description: 'Fixed bug: "Dashboard loading issue"',
      project: 'Albedo Educator',
      timestamp: '5 hours ago'
    },
    {
      id: '3',
      type: 'bug_declined',
      user: 'Developer User',
      description: 'Declined bug: "Button color inconsistency"',
      project: 'MedocSuite',
      timestamp: '1 day ago'
    },
    {
      id: '4',
      type: 'project_created',
      user: 'Admin User',
      description: 'Created new project: "Patient Portal"',
      project: 'Patient Portal',
      timestamp: '2 days ago'
    },
    {
      id: '5',
      type: 'bug_assigned',
      user: 'Admin User',
      description: 'Assigned bug "Navigation error" to Developer User',
      project: 'Albedo Educator',
      timestamp: '2 days ago'
    }
  ];

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
          <div className="space-y-8">
            {activities.map((activity) => (
              <div key={activity.id} className="flex">
                <div className="mr-4 flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                  <p className="text-sm text-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">Project: {activity.project}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activity;
