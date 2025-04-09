
import { useState, FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBugs } from '@/context/BugContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  ImagePlus, 
  Paperclip 
} from 'lucide-react';
import { BugPriority, Project } from '@/types';

const NewBug = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedProjectId = searchParams.get('projectId');
  const { currentUser } = useAuth();
  const { projects, addBug } = useBugs();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(preSelectedProjectId || '');
  const [priority, setPriority] = useState<BugPriority>('medium');
  const [selectedDashboards, setSelectedDashboards] = useState<string[]>([]);
  
  // Screenshots and files would normally be handled with file uploads
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  
  // Get the dashboards for the selected project
  const selectedProject = projects.find(project => project.id === projectId);
  const availableDashboards = selectedProject?.dashboards || [];
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addBug({
        name,
        description,
        projectId,
        reporterId: currentUser.id,
        affectedDashboards: selectedDashboards,
        priority,
        status: 'pending',
        screenshots,
        files,
      });
      
      navigate('/bugs');
    } catch (error) {
      console.error('Error submitting bug:', error);
      setIsSubmitting(false);
    }
  };
  
  const handleDashboardChange = (dashboardId: string, checked: boolean) => {
    if (checked) {
      setSelectedDashboards([...selectedDashboards, dashboardId]);
    } else {
      setSelectedDashboards(selectedDashboards.filter(id => id !== dashboardId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center text-muted-foreground hover:text-foreground" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Report a Bug</CardTitle>
          <CardDescription>
            Fill out the form below to report a new bug
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Bug Name</Label>
              <Input 
                id="name" 
                placeholder="Enter a descriptive title"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the bug in detail. What were you doing when it happened? What did you expect to happen?"
                className="min-h-[150px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select 
                  value={projectId} 
                  onValueChange={setProjectId}
                  required
                >
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={priority} 
                  onValueChange={(value) => setPriority(value as BugPriority)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {projectId && availableDashboards.length > 0 && (
              <div className="space-y-2">
                <Label>Affected Dashboards</Label>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {availableDashboards.map((dashboard) => (
                    <div key={dashboard.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`dashboard-${dashboard.id}`}
                        checked={selectedDashboards.includes(dashboard.id)}
                        onCheckedChange={(checked) => 
                          handleDashboardChange(dashboard.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`dashboard-${dashboard.id}`}
                        className="text-sm font-normal"
                      >
                        {dashboard.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center"
                >
                  <ImagePlus className="h-8 w-8 mb-2 text-muted-foreground" />
                  <span>Add Screenshots</span>
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center"
                >
                  <Paperclip className="h-8 w-8 mb-2 text-muted-foreground" />
                  <span>Attach Files</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Note: File uploads are not functional in this demo.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !projectId}
            >
              {isSubmitting ? "Submitting..." : "Submit Bug Report"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewBug;
