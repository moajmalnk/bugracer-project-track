
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  FolderKanban,
  Bug, 
  Settings, 
  Users,
  ActivitySquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  closeSidebar?: () => void;
}

export const Sidebar = ({ closeSidebar }: SidebarProps) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLinkClick = () => {
    if (closeSidebar) {
      closeSidebar();
    }
  };

  const NavLink = ({ to, icon, label }: { to: string; icon: JSX.Element; label: string }) => (
    <Link to={to} onClick={handleLinkClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start mb-1",
          isActive(to) && "bg-accent text-accent-foreground"
        )}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </Button>
    </Link>
  );

  return (
    <div className="h-full flex flex-col border-r bg-card">
      <div className="p-4">
        <div className="flex items-center mb-8 px-2">
          <Bug className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-xl font-bold">BugRacer</h2>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-4 px-1">
            <div>
              <h3 className="text-xs font-medium px-2 mb-2 text-muted-foreground">NAVIGATION</h3>
              <NavLink 
                to="/dashboard" 
                icon={<LayoutDashboard className="h-5 w-5" />} 
                label="Dashboard" 
              />
              <NavLink 
                to="/projects" 
                icon={<FolderKanban className="h-5 w-5" />} 
                label="Projects" 
              />
              <NavLink 
                to="/bugs" 
                icon={<Bug className="h-5 w-5" />} 
                label="Bugs" 
              />
              <NavLink 
                to="/activity" 
                icon={<ActivitySquare className="h-5 w-5" />} 
                label="Activity" 
              />
            </div>
            
            {currentUser?.role === 'admin' && (
              <>
                <Separator />
                <div>
                  <h3 className="text-xs font-medium px-2 mb-2 text-muted-foreground">ADMIN</h3>
                  <NavLink 
                    to="/users" 
                    icon={<Users className="h-5 w-5" />} 
                    label="Users" 
                  />
                  <NavLink 
                    to="/settings" 
                    icon={<Settings className="h-5 w-5" />} 
                    label="Settings" 
                  />
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </div>
      
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center">
          <img
            src={currentUser?.avatar}
            alt="User avatar"
            className="h-8 w-8 rounded-full mr-2"
          />
          <div>
            <p className="text-sm font-medium">{currentUser?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{currentUser?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
