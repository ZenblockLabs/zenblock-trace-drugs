import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { DemoBanner } from "@/components/DemoBanner";
import { toast } from "sonner";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9]">
      <DemoBanner />
      <div className="flex-1 flex items-center justify-center">
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
            <CardDescription className="text-slate-gray">Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="border-[#E6EBE9]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="border-[#E6EBE9]"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-deep-teal hover:bg-emerald" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 space-y-2">
              <p className="text-sm text-slate-gray text-center">Demo accounts (enter password manually):</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin("manufacturer@medico.com")}
                  className="border-[#E6EBE9] hover:bg-light-mist hover:text-charcoal"
                >
                  Manufacturer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin("distributor@lifeline.com")}
                  className="border-[#E6EBE9] hover:bg-light-mist hover:text-charcoal"
                >
                  Distributor
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin("dispenser@citypharmacy.com")}
                  className="border-[#E6EBE9] hover:bg-light-mist hover:text-charcoal"
                >
                  Dispenser
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin("regulator@authority.gov")}
                  className="border-[#E6EBE9] hover:bg-light-mist hover:text-charcoal"
                >
                  Regulator
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};
