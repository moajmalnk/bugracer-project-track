import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Activity = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Activity Feed</h1>
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Coming Soon!</AlertTitle>
        <AlertDescription>
          The activity feed feature is currently under development. We'll notify you when it's ready!
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Track all actions across your projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">Feature Coming Soon</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We're working hard to bring you a comprehensive activity tracking system.
              Check back soon!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activity;
