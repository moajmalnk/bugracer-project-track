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
  ActivitySquare,
  FileBarChart,
  CheckCircle,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
  closeSidebar?: () => void;
}

const defaultAvatar = "https://codoacademy.com/uploads/system/e7c3fb5390c74909db1bb3559b24007a.png";

export const Sidebar = ({ className, closeSidebar }: SidebarProps) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, icon, label }: { to: string; icon: JSX.Element; label: string }) => (
    <Link to={to} onClick={closeSidebar}>
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
                to="/fixes" 
                icon={<CheckCircle className="h-5 w-5" />} 
                label="Fixes" 
              />
              <NavLink 
                to="/activity" 
                icon={<ActivitySquare className="h-5 w-5" />} 
                label="Activity" 
              />
              <NavLink 
                to="/messages" 
                icon={<MessageCircle className="h-5 w-5" />} 
                label="Messages" 
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
                    to="/reports" 
                    icon={<FileBarChart className="h-5 w-5" />} 
                    label="Reports" 
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
        <Link 
          to="/profile" 
          className="flex items-center hover:bg-accent rounded-lg p-2 transition-colors"
          onClick={closeSidebar}
        >
          <img
            src={currentUser?.avatar || defaultAvatar}
            alt="User avatar"
            className="h-8 w-8 rounded-full mr-2"
          />
          <div>
            <p className="text-sm font-medium">{currentUser?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{currentUser?.role}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};
