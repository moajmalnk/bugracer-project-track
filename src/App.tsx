
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from './context/AuthContext';
import { BugProvider } from './context/BugContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Bugs from './pages/Bugs';
import BugDetails from './pages/BugDetails';
import NewBug from './pages/NewBug';
import Activity from './pages/Activity';
import Users from './pages/Users';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <BugProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={<ProtectedRoute element={<Dashboard />} />} 
              />
              <Route 
                path="/projects" 
                element={<ProtectedRoute element={<Projects />} />} 
              />
              <Route 
                path="/projects/:projectId" 
                element={<ProtectedRoute element={<ProjectDetails />} />} 
              />
              <Route 
                path="/bugs" 
                element={<ProtectedRoute element={<Bugs />} />} 
              />
              <Route 
                path="/bugs/:bugId" 
                element={<ProtectedRoute element={<BugDetails />} />} 
              />
              <Route 
                path="/bugs/new" 
                element={
                  <ProtectedRoute 
                    element={<NewBug />} 
                    requiredRoles={['admin', 'tester']} 
                  />
                } 
              />
              <Route 
                path="/activity" 
                element={<ProtectedRoute element={<Activity />} />} 
              />
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute 
                    element={<Users />} 
                    requiredRoles={['admin']} 
                  />
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute 
                    element={<Settings />} 
                    requiredRoles={['admin']} 
                  />
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BugProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
