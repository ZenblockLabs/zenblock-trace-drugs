import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';

// Validation schemas
const emailSchema = z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" });
const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters" }).max(128, { message: "Password must be less than 128 characters" });

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const { login, signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateInputs = (isSignUp: boolean): string | null => {
    // Validate email
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      return emailResult.error.errors[0].message;
    }

    // Validate password
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      return passwordResult.error.errors[0].message;
    }

    // Additional validation for sign up
    if (isSignUp) {
      if (password !== confirmPassword) {
        return 'Passwords do not match';
      }
    }

    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const validationError = validateInputs(false);
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const { error: loginError } = await login(email, password);
      if (loginError) {
        setError(loginError);
      } else {
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const validationError = validateInputs(true);
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await signUp(email, password, name);
      if (signUpError) {
        setError(signUpError);
      } else {
        toast.success('Account created! Please check your email to confirm your account.');
        setActiveTab('login');
      }
    } catch (err: any) {
      setError('An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9]">
      <div className="w-full max-w-md space-y-6">
        {/* Zenblock Labs Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-16 h-16 flex items-center justify-center">
              <img 
                src="/lovable-uploads/fd76e0b7-8d5a-4483-97be-efb53405f021.png" 
                alt="Zenblock Labs Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-charcoal">Zenblock Labs</h1>
              <p className="text-sm text-slate-gray">Blockchain Innovation</p>
            </div>
          </div>
        </div>

        <Card className="w-full bg-white border-[#E6EBE9] shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-charcoal">Pharma Traceability</CardTitle>
            <CardDescription className="text-slate-gray">
              {activeTab === 'login' ? 'Sign in to your account' : 'Create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="border-[#E6EBE9]"
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="border-[#E6EBE9]"
                      autoComplete="current-password"
                    />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-deep-teal hover:bg-emerald" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <div className="mt-6 space-y-3">
                    <p className="text-sm text-center text-muted-foreground">Quick login options:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-border"
                        onClick={() => {
                          setEmail('manufacturer@demo.com');
                          setPassword('Demo123!');
                        }}
                      >
                        Manufacturer
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-border"
                        onClick={() => {
                          setEmail('distributor@demo.com');
                          setPassword('Demo123!');
                        }}
                      >
                        Distributor
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-border"
                        onClick={() => {
                          setEmail('dispenser@demo.com');
                          setPassword('Demo123!');
                        }}
                      >
                        Dispenser
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-border"
                        onClick={() => {
                          setEmail('regulator@demo.com');
                          setPassword('Demo123!');
                        }}
                      >
                        Regulator
                      </Button>
                    </div>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Name (optional)</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="border-[#E6EBE9]"
                      autoComplete="name"
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="border-[#E6EBE9]"
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password (min 6 characters)"
                      className="border-[#E6EBE9]"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm your password"
                      className="border-[#E6EBE9]"
                      autoComplete="new-password"
                    />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-deep-teal hover:bg-emerald" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-4 border-t border-[#E6EBE9]">
              <p className="text-xs text-slate-gray text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
