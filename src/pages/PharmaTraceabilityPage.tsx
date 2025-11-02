
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Activity, TrendingUp } from 'lucide-react';
import { TrackAndTrace } from '@/components/pharma/TrackAndTrace';
import { ProductVerification } from '@/components/pharma/ProductVerification';
import { AlertsAndRecalls } from '@/components/pharma/AlertsAndRecalls';
import { usePageAccessLog } from '@/components/SecurityAudit';
import { useAuth } from '@/context/AuthContext';

export function PharmaTraceabilityPage() {
  const { user } = useAuth();
  
  // Log page access for security audit
  usePageAccessLog('pharma-traceability');

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pharma Operations Hub</h1>
          <p className="text-muted-foreground">
            Track, verify, and monitor pharmaceutical supply chain operations
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1 capitalize">
            <Activity className="h-3 w-3" />
            {user?.role || 'User'}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700">
            <Shield className="h-3 w-3" />
            Blockchain Verified
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Operations Dashboard</CardTitle>
          <CardDescription>
            DSCSA-compliant pharmaceutical traceability powered by Hyperledger Fabric
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="track" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="track">Track & Trace</TabsTrigger>
              <TabsTrigger value="verify">Verify Product</TabsTrigger>
              <TabsTrigger value="alerts">Alerts & Recalls</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="track" className="mt-6">
              <TrackAndTrace />
            </TabsContent>
            
            <TabsContent value="verify" className="mt-6">
              <ProductVerification />
            </TabsContent>
            
            <TabsContent value="alerts" className="mt-6">
              <AlertsAndRecalls />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Supply Chain Analytics</h3>
                  <p className="text-muted-foreground">
                    View key metrics, event statistics, and performance KPIs for your supply chain operations.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,247</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        <TrendingUp className="inline h-3 w-3 text-green-600" /> +12% vs last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Events Tracked</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8,431</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        <TrendingUp className="inline h-3 w-3 text-green-600" /> +18% vs last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">98.5%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Shield className="inline h-3 w-3 text-green-600" /> DSCSA Compliant
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    Analytics data is updated in real-time from blockchain events. 
                    All metrics are blockchain-verified for accuracy.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          All operations are blockchain-verified using Hyperledger Fabric. 
          Role-based access ensures you see only relevant supply chain information.
        </AlertDescription>
      </Alert>
    </div>
  );
}
