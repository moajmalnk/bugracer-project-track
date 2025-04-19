import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bug as BugIcon, Plus, Filter } from 'lucide-react';
import { BugCard } from '@/components/bugs/BugCard';
import { useAuth } from '@/context/AuthContext';
import { bugService } from '@/services/bugService';
import { Bug } from '@/types';
import { toast } from '@/components/ui/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Bugs = () => {
  const { currentUser } = useAuth();
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      const data = await bugService.getBugs();
      setBugs(data);
    } catch (error) {
      console.error('Error fetching bugs:', error);
      toast({
        title: "Error",
        description: "Failed to load bugs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    fetchBugs();
  };

  const filteredBugs = bugs.filter(bug => {
    const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bug.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || bug.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || bug.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const FilterControls = () => (
    <>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
        <SelectTrigger className="w-full min-w-[120px] max-w-[160px] bg-background/50 h-9 text-xs sm:text-sm">
          <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full min-w-[120px] max-w-[160px] bg-background/50 h-9 text-xs sm:text-sm">
          <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
    </>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-3 py-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-3 sm:space-y-4">
        {/* Report Bug Button - Full Width on Mobile */}
        {(currentUser?.role === 'admin' || currentUser?.role === 'tester') && (
          <Button 
            variant="default" 
            asChild 
            className="w-full h-10 text-sm"
          >
            <Link to="/bugs/new" state={{ from: '/bugs' }} className="flex items-center justify-center">
              <Plus className="mr-2 h-4 w-4" /> Report Bug
            </Link>
          </Button>
        )}

        {/* Search and Filters Section */}
        <div className="space-y-3">
          <Input
            placeholder="Search bugs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background/50 h-9 text-xs sm:text-sm"
          />
          
          {/* Mobile Filter Button */}
          <div className="block sm:hidden">
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full h-9 text-xs bg-background/50"
                >
                  <Filter className="h-3.5 w-3.5 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="bottom" 
                className="h-[40vh] px-4 py-6"
              >
                <SheetHeader className="mb-4">
                  <SheetTitle className="text-base">Filters</SheetTitle>
                  <SheetDescription className="text-xs">
                    Apply filters to find specific bugs
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-3">
                  <FilterControls />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filters */}
          <div className="hidden sm:flex gap-3">
            <FilterControls />
          </div>
        </div>

        {/* Bugs List */}
        {filteredBugs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-border/40 bg-background/50 p-4 sm:p-6 text-center mt-6">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
              <BugIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mt-3 text-sm sm:text-base font-medium">No bugs found</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-[250px]">
            No bugs match your current filter criteria.
          </p>
          {(currentUser?.role === 'admin' || currentUser?.role === 'tester') && (
              <Button 
                className="mt-4 h-9 text-xs sm:text-sm" 
                asChild
              >
              <Link to="/bugs/new" state={{ from: '/bugs' }}>Report Bug</Link>
            </Button>
          )}
        </div>
      ) : (
          <div className="grid gap-3">
          {filteredBugs.map((bug) => (
            <BugCard key={bug.id} bug={bug} onDelete={handleDelete} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Bugs;
