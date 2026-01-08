import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import logo from '@/assets/logo.png';

const Auth: React.FC = () => {
  const { isAuthenticated, user, login, register } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'dealer' ? '/dealer' : '/contractor');
    }
  }, [isAuthenticated, user, navigate]);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('dealer');
  const [regError, setRegError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please fill in all fields');
      return;
    }

    const result = login(loginEmail.trim(), loginPassword);
    if (!result.success) {
      setLoginError(result.error || 'Login failed');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setRegError('Please fill in all fields');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(regEmail)) {
      setRegError('Please enter a valid email');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters');
      return;
    }

    const newUser: User = {
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: regPhone.trim(),
      whatsapp: regWhatsapp.trim() || regPhone.trim(), // Use phone if whatsapp not provided
      password: regPassword,
      role: regRole,
      createdAt: new Date().toISOString(),
    };

    const result = register(newUser);
    if (!result.success) {
      setRegError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Logo & Title */}
      <div className="mb-8 flex flex-col items-center">
        <img src={logo} alt="MATLYNX" className="mb-4 h-20 w-20 rounded-xl" />
        <h1 className="text-3xl font-bold text-foreground">MATLYNX</h1>
        <p className="mt-1 text-center text-muted-foreground">
          Construction Materials Marketplace
        </p>
      </div>

      <Card className="w-full max-w-md">
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                {loginError && (
                  <p className="text-sm text-destructive">{loginError}</p>
                )}
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </CardContent>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Join MATLYNX today</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label>I am a...</Label>
                  <RadioGroup
                    value={regRole}
                    onValueChange={(value) => setRegRole(value as UserRole)}
                    className="mt-2 flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dealer" id="role-dealer" />
                      <Label htmlFor="role-dealer" className="cursor-pointer font-normal">
                        Dealer (I sell materials)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="contractor" id="role-contractor" />
                      <Label htmlFor="role-contractor" className="cursor-pointer font-normal">
                        Contractor (I buy materials)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="reg-name">Full Name</Label>
                  <Input
                    id="reg-name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="reg-phone">Phone Number *</Label>
                  <Input
                    id="reg-phone"
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
                {regRole === 'dealer' && (
                  <div>
                    <Label htmlFor="reg-whatsapp">WhatsApp Number (optional)</Label>
                    <Input
                      id="reg-whatsapp"
                      type="tel"
                      value={regWhatsapp}
                      onChange={(e) => setRegWhatsapp(e.target.value)}
                      placeholder="Same as phone if empty"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Leave empty to use phone number for WhatsApp
                    </p>
                  </div>
                )}
                <div>
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                  />
                </div>
                {regError && (
                  <p className="text-sm text-destructive">{regError}</p>
                )}
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
