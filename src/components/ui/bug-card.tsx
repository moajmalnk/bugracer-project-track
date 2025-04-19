import { Link, useLocation } from 'react-router-dom';
import { Button } from './button';
import { Badge } from './badge';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { bugService } from '@/services/bugService';

interface Bug {
  id: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
  project_id?: string;
}

interface BugCardProps {
  bug: Bug;
  onDelete: () => void;
}

export const BugCard = ({ bug, onDelete }: BugCardProps) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const isFromProject = location.pathname.startsWith('/projects/');

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{bug.title}</h4>
          <Badge variant="outline">{bug.priority}</Badge>
          <Badge variant="outline">{bug.status.replace('_', ' ')}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Created {new Date(bug.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link 
            to={`/bugs/${bug.id}`}
            state={{ from: isFromProject ? 'project' : 'bugs' }}
          >
            View Details
          </Link>
        </Button>
        {(currentUser?.role === 'admin' || currentUser?.role === 'tester') && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={async () => {
              try {
                await bugService.deleteBug(bug.id);
                toast({
                  title: "Success",
                  description: "Bug has been deleted successfully",
                });
                onDelete();
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Failed to delete bug",
                  variant: "destructive",
                });
              }
            }}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}; 