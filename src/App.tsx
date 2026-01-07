import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Auth from "@/pages/Auth";
import DealerDashboard from "@/pages/DealerDashboard";
import ContractorDashboard from "@/pages/ContractorDashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Home route that redirects based on auth status
const HomeRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  return <Navigate to={user.role === 'dealer' ? '/dealer' : '/contractor'} replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Home redirects based on auth/role */}
      <Route path="/" element={<HomeRedirect />} />
      
      {/* Auth page */}
      <Route path="/auth" element={<Auth />} />
      
      {/* Dealer dashboard - protected */}
      <Route
        path="/dealer"
        element={
          <ProtectedRoute allowedRole="dealer">
            <DealerDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Contractor dashboard - protected */}
      <Route
        path="/contractor"
        element={
          <ProtectedRoute allowedRole="contractor">
            <ContractorDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
