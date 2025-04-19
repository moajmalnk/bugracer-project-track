
import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import AppProviders from '@/components/providers/AppProviders';
import RouteConfig from '@/components/routes/RouteConfig';
import { initOfflineDetector } from '@/lib/offline';

// Initialize the query client outside of the component
const queryClient = new QueryClient();

function App() {
  // Initialize offline detector
  useEffect(() => {
    const cleanup = initOfflineDetector();
    return cleanup;
  }, []);

  return (
    <Router>
      <AppProviders queryClient={queryClient}>
        <RouteConfig />
      </AppProviders>
    </Router>
  );
}

export default App;
