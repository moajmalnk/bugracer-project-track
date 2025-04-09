
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bug } from '@/types';
import { useBugs } from '@/context/BugContext';
import { format } from 'date-fns';
import { ArrowUpRight } from 'lucide-react';

interface BugCardProps {
  bug: Bug;
}

export function BugCard({ bug }: BugCardProps) {
  const { getProjectById, getDashboardById } = useBugs();
  
  const project = getProjectById(bug.projectId);
  
  // Format creation date
  const formattedDate = format(new Date(bug.createdAt), 'MMM d, yyyy');
  
  // Get priority and status classes
  const priorityClass = `priority-${bug.priority}`;
  const statusClass = `status-${bug.status}`;
  
  return (
    <div className={cn("bug-card", priorityClass)}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to={`/bugs/${bug.id}`} className="text-base font-medium hover:underline">
              {bug.name}
            </Link>
            <Badge variant="outline" className="capitalize">
              {bug.priority}
            </Badge>
            <Badge className={cn("capitalize", statusClass)}>
              {bug.status}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            <span>Project: {project?.name} • </span>
            <span>Reported on {formattedDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/bugs/${bug.id}`}>
              <ArrowUpRight className="mr-2 h-3 w-3" />
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
