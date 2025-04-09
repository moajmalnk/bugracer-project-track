
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Code2, 
  Bug, 
  Plus,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Users = () => {
  const { currentUser } = useAuth();
  
  // This would normally come from your API or context
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@bugracer.com',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff',
    },
    {
      id: '2',
      name: 'Developer User',
      email: 'developer@bugracer.com',
      role: 'developer',
      avatar: 'https://ui-avatars.com/api/?name=Developer+User&background=10b981&color=fff',
    },
    {
      id: '3',
      name: 'Tester User',
      email: 'tester@bugracer.com',
      role: 'tester',
      avatar: 'https://ui-avatars.com/api/?name=Tester+User&background=f59e0b&color=fff',
    }
  ]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-5 w-5 text-blue-500" />;
      case 'developer':
        return <Code2 className="h-5 w-5 text-green-500" />;
      case 'tester':
        return <Bug className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const handleAddUser = () => {
    // This would normally trigger a modal or form to add a new user
    toast({
      title: "Feature coming soon",
      description: "Adding new users will be implemented in the next version.",
    });
  };

  // Only admin should access this page
  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">Only administrators can access the user management page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <Button onClick={handleAddUser}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>BugRacer Users</CardTitle>
          <CardDescription>
            Manage users and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center">
                  <img
                    src={user.avatar}
                    alt={`${user.name}'s avatar`}
                    className="h-10 w-10 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-accent/50 px-3 py-1 rounded-full">
                    {getRoleIcon(user.role)}
                    <span className="ml-2 text-sm capitalize">{user.role}</span>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
