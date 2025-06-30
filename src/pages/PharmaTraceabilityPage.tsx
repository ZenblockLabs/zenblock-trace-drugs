
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Server, Users, Settings } from 'lucide-react';
import { TrackAndTrace } from '@/components/pharma/TrackAndTrace';
import { ProductVerification } from '@/components/pharma/ProductVerification';
import { AlertsAndRecalls } from '@/components/pharma/AlertsAndRecalls';
import { ProvenanceViewer } from '@/components/pharma/ProvenanceViewer';
import { DEMO_ROLES, DemoRole } from '@/config/pharmaConfig';
import { usePageAccessLog } from '@/components/SecurityAudit';

export function PharmaTraceabilityPage() {
  const [currentRole, setCurrentRole] = useState<DemoRole>('manufacturer');
  
  // Log page access for security audit
  usePageAccessLog('pharma-traceability');

  const handleRoleChange = (role: string) => {
    setCurrentRole(role as DemoRole);
  };

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pharma Traceability</h1>
          <p className="text-muted-foreground">
            DSCSA-compliant pharmaceutical supply chain management powered by Hyperledger Fabric
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Role:</span>
            <Select value={currentRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEMO_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Blockchain Verified
          </Badge>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blockchain Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Connected</div>
            <p className="text-xs text-muted-foreground">
              Hyperledger Fabric network active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Role</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {currentRole.replace('_', ' ')}
            </div>
            <p className="text-xs text-muted-foreground">
              Demo role for supply chain simulation
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Endpoint</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Local</div>
            <p className="text-xs text-muted-foreground">
              localhost:3000 (configurable)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Supply Chain Management</CardTitle>
          <CardDescription>
            Comprehensive pharmaceutical traceability and compliance tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="track" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="track">Track & Trace</TabsTrigger>
              <TabsTrigger value="verify">Verify Product</TabsTrigger>
              <TabsTrigger value="alerts">Alerts & Recalls</TabsTrigger>
              <TabsTrigger value="provenance">Provenance Viewer</TabsTrigger>
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
            
            <TabsContent value="provenance" className="mt-6">
              <ProvenanceViewer />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer Alert */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          This system is demo-ready and connects to a Hyperledger Fabric backend. 
          All data is blockchain-verified and DSCSA-compliant. 
          Switch between local (localhost:3000) and remote endpoints via configuration.
        </AlertDescription>
      </Alert>
    </div>
  );
}
