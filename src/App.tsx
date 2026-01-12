import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProfileProvider, useProfile } from "@/contexts/ProfileContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileGuard from "@/components/ProfileGuard";
import Auth from "@/pages/Auth";
import ProfileSetup from "@/pages/ProfileSetup";
import Settings from "@/pages/Settings";
import DealerDashboard from "@/pages/DealerDashboard";
import ContractorDashboard from "@/pages/ContractorDashboard";
import NotFound from "@/pages/NotFound";
import LandingPage from "@/pages/LandingPage";

const queryClient = new QueryClient();

// Dashboard redirect for authenticated users
const DashboardRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { isProfileComplete, isLoading } = useProfile();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Contractors skip profile setup, dealers require it
  if (user.role === 'dealer' && !isProfileComplete) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <Navigate to={user.role === 'dealer' ? '/dealer' : '/contractor'} replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Dashboard redirect for authenticated users */}
      <Route path="/dashboard" element={<DashboardRedirect />} />
      
      {/* Auth page */}
      <Route path="/auth" element={<Auth />} />
      
      {/* Profile setup - requires auth but not complete profile */}
      <Route path="/profile-setup" element={<ProfileSetup />} />
      
      {/* Settings - requires auth and complete profile */}
      <Route
        path="/settings"
        element={
          <ProfileGuard>
            <Settings />
          </ProfileGuard>
        }
      />
      
      {/* Dealer dashboard - protected + profile required */}
      <Route
        path="/dealer"
        element={
          <ProtectedRoute allowedRole="dealer">
            <ProfileGuard>
              <DealerDashboard />
            </ProfileGuard>
          </ProtectedRoute>
        }
      />
      
      {/* Contractor dashboard - protected + profile required */}
      <Route
        path="/contractor"
        element={
          <ProtectedRoute allowedRole="contractor">
            <ProfileGuard>
              <ContractorDashboard />
            </ProfileGuard>
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
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ProfileProvider>
              <AppRoutes />
            </ProfileProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
