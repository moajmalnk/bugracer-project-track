import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { BugIcon, Info, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { mockDataStore } from '@/lib/mockData';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('tester');
  const { login, isOfflineMode } = useAuth();
  const navigate = useNavigate();
  const [networkError, setNetworkError] = useState(false);

  // Check if we're online
  const isOnline = navigator.onLine;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNetworkError(false);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else if (!isOfflineMode) {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      if (!navigator.onLine) {
        setNetworkError(true);
      } else {
        toast({
          title: "An error occurred",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNetworkError(false);

    try {
      if (!isOnline) {
        setNetworkError(true);
        setIsLoading(false);
        return;
      }

      await mockDataStore.registerUser(
        email,
        password,
        fullName,
        role as 'admin' | 'developer' | 'tester'
      );

      toast({
        title: "Account created",
        description: "You can now sign in with your credentials.",
      });

      // Switch back to login view
      setIsSignUp(false);
    } catch (error: any) {
      if (!navigator.onLine) {
        setNetworkError(true);
      } else {
        toast({
          title: "Sign-up failed",
          description: error.message || "An error occurred during sign-up.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <BugIcon className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">BugRacer</h1>
          <p className="text-muted-foreground">Track bugs, ship faster</p>
        </div>
        
        {!isOnline && (
          <Alert variant="destructive" className="mb-4">
            <WifiOff className="h-4 w-4 mr-2" />
            <AlertTitle>You are offline</AlertTitle>
            <AlertDescription>
              Network connection is unavailable. You can still use demo accounts to explore the app.
            </AlertDescription>
          </Alert>
        )}
        
        {networkError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              Failed to connect to the server. Please check your internet connection or try again later.
              {!isSignUp && " You can use a demo account to login offline."}
            </AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>{isSignUp ? "Create Account" : "Sign in"}</CardTitle>
            <CardDescription>
              {isSignUp 
                ? "Fill in your details to create a new account" 
                : "Enter your credentials to access your account"
              }
            </CardDescription>
          </CardHeader>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
            <CardContent className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName"
                    type="text" 
                    placeholder="John Doe" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="your@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="•••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    className="w-full border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md border p-2"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="tester">Tester</option>
                    <option value="developer">Developer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full" type="submit" disabled={isLoading || (isSignUp && !isOnline)}>
                {isLoading 
                  ? (isSignUp ? "Creating account..." : "Signing in...") 
                  : (isSignUp ? "Create Account" : "Sign in")
                }
              </Button>
              
              <Button 
                variant="link" 
                type="button"
                className="w-full"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Sign up"
                }
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-start space-x-2">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">First time here?</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {!isOnline 
                  ? "You're currently offline. Use 'demo@example.com' as email with any password to explore the app."
                  : "Create a new account to start tracking bugs with BugRacer. Or use demo@example.com with any password."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
