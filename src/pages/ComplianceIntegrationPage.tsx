
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteroperabilityPanel } from '@/components/compliance/InteroperabilityPanel';
import { ComplianceConfigPanel } from '@/components/compliance/ComplianceConfigPanel';
import { Globe, Settings, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function ComplianceIntegrationPage() {
  const { user } = useAuth();

  const complianceFeatures = [
    { name: 'GS1 Serialization', status: 'implemented', description: 'SGTIN/GTIN support with 2D barcodes' },
    { name: 'EPCIS Event Capture', status: 'implemented', description: 'Complete lifecycle event tracking' },
    { name: 'Role-based Access', status: 'implemented', description: 'DSCSA ATP model compliance' },
    { name: 'Verification Interface', status: 'implemented', description: 'Real-time drug authentication' },
    { name: 'Tatmeen Integration', status: 'configured', description: 'UAE regulatory system connection' },
    { name: 'DSCSA VRS Integration', status: 'configured', description: 'US verification router service' }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance Integration</h1>
          <p className="text-muted-foreground mt-1">
            Regulatory system integrations for UAE Tatmeen and US DSCSA compliance
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          <CheckCircle className="h-4 w-4 mr-1" />
          Compliance Ready
        </Badge>
      </div>

      {/* Compliance Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Feature Status
          </CardTitle>
          <CardDescription>
            Overview of implemented compliance features and regulatory integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complianceFeatures.map((feature) => (
              <div key={feature.name} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{feature.name}</h4>
                  <Badge 
                    variant={feature.status === 'implemented' ? 'default' : 'secondary'}
                  >
                    {feature.status === 'implemented' ? 'Complete' : 'Ready'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Integration Interface */}
      <Tabs defaultValue="integration" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            System Integration
          </TabsTrigger>
          <TabsTrigger value="configuration" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integration">
          <InteroperabilityPanel userRole={user?.role || 'user'} />
        </TabsContent>

        <TabsContent value="configuration">
          <ComplianceConfigPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
