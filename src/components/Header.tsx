import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import logo from '@/assets/logo.png';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const isSettingsPage = location.pathname === '/settings';

  // Use profile name if available, fallback to user name
  const displayName = profile?.fullName || user?.name || '';

  return (
    <header className="gradient-navy shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(user?.role === 'dealer' ? '/dealer' : '/contractor')}
          >
            <img src={logo} alt="MATLYNX" className="h-10 w-10 rounded-lg object-contain" />
            <span className="text-xl font-bold text-primary-foreground">MATLYNX</span>
          </div>

          {/* User info & actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user && (
              <div className="flex items-center gap-3">
                {/* User info */}
                <div className="hidden sm:flex items-center gap-2 text-primary-foreground/80">
                  {profile?.profilePhoto ? (
                    <img 
                      src={profile.profilePhoto} 
                      alt="Profile" 
                      className="h-7 w-7 rounded-full object-cover border border-primary-foreground/20"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">{displayName}</span>
                  <span className="rounded bg-primary/20 px-2 py-0.5 text-xs capitalize text-primary-foreground">
                    {user.role}
                  </span>
                </div>

                {/* Settings button */}
                {!isSettingsPage && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/settings')}
                    className="text-primary-foreground/80 hover:bg-primary/20 hover:text-primary-foreground"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                )}

                {/* Logout button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-primary-foreground/80 hover:bg-primary/20 hover:text-primary-foreground"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
