
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      navigate("/dashboard");
    }
  };

  // Demo credentials
  const demoCredentials = [
    { role: "Manufacturer", email: "manufacturer@zenblock.com", password: "password" },
    { role: "Distributor", email: "distributor@zenblock.com", password: "password" },
    { role: "Dispenser", email: "dispenser@zenblock.com", password: "password" },
    { role: "Regulator", email: "regulator@zenblock.com", password: "password" },
  ];

  const setDemoUser = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-zenblue-500 to-zenblue-700 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/45b0e393-a331-4b63-9f6b-e590813b266e.png" 
              alt="Zenblock Labs Logo" 
              className="h-24 w-24" 
            />
          </div>
          <h1 className="text-3xl font-bold text-white">Zenblock Labs</h1>
          <p className="text-zenblue-100 mt-2">Pharmaceutical Supply Chain Tracking</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Sign in to access the supply chain portal
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="mt-6 w-full">
                <p className="text-sm text-center mb-2">Demo Accounts:</p>
                <div className="grid grid-cols-2 gap-2">
                  {demoCredentials.map((cred) => (
                    <Button
                      key={cred.role}
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => setDemoUser(cred.email, cred.password)}
                      className="text-xs"
                    >
                      {cred.role}
                    </Button>
                  ))}
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
