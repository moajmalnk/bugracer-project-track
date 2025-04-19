import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Code2, 
  Bug,
  MoreHorizontal,
  UserPlus,
  Pencil,
  Key,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AddUserDialog } from '@/components/users/AddUserDialog';
import { EditUserDialog } from '@/components/users/EditUserDialog';
import { DeleteUserDialog } from '@/components/users/DeleteUserDialog';
import { ChangePasswordDialog } from '@/components/users/ChangePasswordDialog';
import { User, UserRole } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserDetailDialog } from '@/components/users/UserDetailDialog';
import { ENV } from '@/lib/env';

interface NewUser {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

const Users = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${ENV.API_URL}/users/get.php`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      if (data.success) {
        setUsers(data.data.map((user: any) => ({
          ...user,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=3b82f6&color=fff`
        })));
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleAddUser = async (userData: NewUser) => {
    try {
      const response = await fetch(`${ENV.API_URL}/users/create.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const data = await response.json();
      if (data.success) {
        const newUser = {
          ...data.data,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username)}&background=3b82f6&color=fff`
        };
        setUsers([...users, newUser]);
        toast({
          title: "Success",
          description: "New user has been added successfully.",
        });
        return true;
      } else {
        throw new Error(data.message || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`${ENV.API_URL}/users/update.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedUser)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      if (data.success) {
        setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
        toast({
          title: "Success",
          description: "User has been updated successfully.",
        });
      } else {
        throw new Error(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`${ENV.API_URL}/users/delete.php?id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      const data = await response.json();
      if (data.success) {
        setUsers(users.filter(user => user.id !== userId));
        toast({
          title: "Success",
          description: "User has been deleted successfully.",
        });
      } else {
        throw new Error(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage your team members and their access levels</p>
        </div>
        <AddUserDialog onUserAdd={handleAddUser} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>BugRacer Users</CardTitle>
          <CardDescription>
            Total users: {users.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="space-y-4">
              {users.map((user) => (
                <div 
                  key={user.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-4 cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={user.avatar}
                      alt={`${user.name}'s avatar`}
                      className="h-10 w-10 rounded-full shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{user.name}</p>
                      <div className="flex flex-col sm:flex-row text-sm text-muted-foreground sm:space-x-2">
                        <p className="font-medium truncate">@{user.username}</p>
                        <span className="hidden sm:inline">•</span>
                        <p className="truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                    <div className="flex items-center bg-accent/50 px-3 py-1 rounded-full shrink-0">
                      {getRoleIcon(user.role)}
                      <span className="ml-2 text-sm capitalize">{user.role}</span>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 mr-2" />
                          <span>Edit User</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Key className="h-4 w-4 mr-2" />
                          <span>Change Password</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span>Delete User</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedUser && (
        <UserDetailDialog
          user={selectedUser}
          open={!!selectedUser}
          onOpenChange={(open) => !open && setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default Users;
