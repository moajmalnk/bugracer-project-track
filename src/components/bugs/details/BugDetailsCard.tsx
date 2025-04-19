import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Bug, Project, BugStatus } from '@/types';
import { StatusSection } from './StatusSection';
import { PrioritySection } from './PrioritySection';
import { ProjectSection } from './ProjectSection';
import { LastUpdatedSection } from './LastUpdatedSection';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

interface BugDetailsCardProps {
  bug: Bug;
  project?: Project;
  canUpdateStatus: boolean;
  updateBugStatus: (bugId: string, status: BugStatus) => Promise<void>;
  formattedUpdatedDate: string;
}

export const BugDetailsCard = ({ 
  bug, 
  project, 
  canUpdateStatus, 
  updateBugStatus,
  formattedUpdatedDate 
}: BugDetailsCardProps) => {
  
  const priorityColors = {
    high: 'text-bugpriority-high',
    medium: 'text-bugpriority-medium',
    low: 'text-bugpriority-low',
  };
  
  const statusColors = {
    fixed: 'text-bugstatus-fixed',
    pending: 'text-bugstatus-pending',
    in_progress: 'text-bugstatus-pending',
    declined: 'text-bugstatus-declined',
    rejected: 'text-bugstatus-declined',
  };
  
  const handleStatusChange = (status: BugStatus) => {
    return updateBugStatus(bug.id, status);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Bug Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs sm:text-sm">Status</Label>
          {canUpdateStatus ? (
            <Select
              value={bug.status}
              onValueChange={() => {
                toast({
                  title: "Coming Soon",
                  description: "Bug status update functionality will be available soon.",
                  variant: "default"
                });
              }}
            >
              <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="p-2 border rounded-md text-xs sm:text-sm">
              <span className="capitalize">{bug.status.replace('_', ' ')}</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs sm:text-sm">Priority</Label>
          <div className="p-2 border rounded-md text-xs sm:text-sm">
            <span className="capitalize">{bug.priority}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs sm:text-sm">Last Updated</Label>
          <div className="p-2 border rounded-md text-xs sm:text-sm">
            {formattedUpdatedDate}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
