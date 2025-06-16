
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Key, 
  Globe, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

export function ComplianceConfigPanel() {
  const [tatmeenConfig, setTatmeenConfig] = useState({
    apiUrl: 'https://api.tatmeen.ae/v1',
    apiKey: '',
    organizationGLN: '',
    enabled: false
  });

  const [vrsConfig, setVrsConfig] = useState({
    apiUrl: 'https://vrs.test.dscsa.org/v1',
    credentials: '',
    organizationId: '',
    enabled: false
  });

  const [gs1Config, setGs1Config] = useState({
    companyPrefix: '0614141',
    gtinPrefix: '061414100',
    locationGLN: '',
    licenseNumber: ''
  });

  const handleSaveConfig = async (configType: string) => {
    try {
      toast.info(`Saving ${configType} configuration...`);
      
      // Simulate API call to save configuration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${configType} configuration saved successfully`);
    } catch (error) {
      toast.error(`Failed to save ${configType} configuration`);
    }
  };

  const testConnection = async (system: string) => {
    try {
      toast.info(`Testing ${system} connection...`);
      
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${system} connection successful`);
    } catch (error) {
      toast.error(`${system} connection failed`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Compliance System Configuration
          </CardTitle>
          <CardDescription>
            Configure integration settings for regulatory compliance systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tatmeen" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tatmeen">UAE Tatmeen</TabsTrigger>
              <TabsTrigger value="dscsa">US DSCSA</TabsTrigger>
              <TabsTrigger value="gs1">GS1 Standards</TabsTrigger>
            </TabsList>

            <TabsContent value="tatmeen" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Tatmeen Integration</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={tatmeenConfig.enabled ? "default" : "secondary"}>
                      {tatmeenConfig.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={tatmeenConfig.enabled}
                      onCheckedChange={(enabled) => 
                        setTatmeenConfig(prev => ({ ...prev, enabled }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tatmeen-url">API URL</Label>
                    <Input
                      id="tatmeen-url"
                      value={tatmeenConfig.apiUrl}
                      onChange={(e) => 
                        setTatmeenConfig(prev => ({ ...prev, apiUrl: e.target.value }))
                      }
                      placeholder="https://api.tatmeen.ae/v1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tatmeen-key">API Key</Label>
                    <Input
                      id="tatmeen-key"
                      type="password"
                      value={tatmeenConfig.apiKey}
                      onChange={(e) => 
                        setTatmeenConfig(prev => ({ ...prev, apiKey: e.target.value }))
                      }
                      placeholder="Enter Tatmeen API key"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="org-gln">Organization GLN</Label>
                    <Input
                      id="org-gln"
                      value={tatmeenConfig.organizationGLN}
                      onChange={(e) => 
                        setTatmeenConfig(prev => ({ ...prev, organizationGLN: e.target.value }))
                      }
                      placeholder="0614141000000"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleSaveConfig('Tatmeen')}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Configuration
                    </Button>
                    <Button 
                      onClick={() => testConnection('Tatmeen')}
                      variant="outline"
                    >
                      Test Connection
                    </Button>
                  </div>
                </div>

                <Alert>
                  <Globe className="h-4 w-4" />
                  <AlertDescription>
                    Tatmeen integration requires valid UAE regulatory approval and API credentials.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="dscsa" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">DSCSA VRS Configuration</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={vrsConfig.enabled ? "default" : "secondary"}>
                      {vrsConfig.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={vrsConfig.enabled}
                      onCheckedChange={(enabled) => 
                        setVrsConfig(prev => ({ ...prev, enabled }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vrs-url">VRS URL</Label>
                    <Input
                      id="vrs-url"
                      value={vrsConfig.apiUrl}
                      onChange={(e) => 
                        setVrsConfig(prev => ({ ...prev, apiUrl: e.target.value }))
                      }
                      placeholder="https://vrs.test.dscsa.org/v1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vrs-credentials">VRS Credentials</Label>
                    <Input
                      id="vrs-credentials"
                      type="password"
                      value={vrsConfig.credentials}
                      onChange={(e) => 
                        setVrsConfig(prev => ({ ...prev, credentials: e.target.value }))
                      }
                      placeholder="Enter VRS authentication token"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="org-id">Organization ID</Label>
                    <Input
                      id="org-id"
                      value={vrsConfig.organizationId}
                      onChange={(e) => 
                        setVrsConfig(prev => ({ ...prev, organizationId: e.target.value }))
                      }
                      placeholder="Your DSCSA organization identifier"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleSaveConfig('DSCSA')}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Configuration
                    </Button>
                    <Button 
                      onClick={() => testConnection('VRS')}
                      variant="outline"
                    >
                      Test Connection
                    </Button>
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    VRS integration requires FDA registration and authorized trading partner status.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="gs1" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">GS1 Standards Configuration</h3>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-prefix">GS1 Company Prefix</Label>
                    <Input
                      id="company-prefix"
                      value={gs1Config.companyPrefix}
                      onChange={(e) => 
                        setGs1Config(prev => ({ ...prev, companyPrefix: e.target.value }))
                      }
                      placeholder="0614141"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gtin-prefix">GTIN Prefix</Label>
                    <Input
                      id="gtin-prefix"
                      value={gs1Config.gtinPrefix}
                      onChange={(e) => 
                        setGs1Config(prev => ({ ...prev, gtinPrefix: e.target.value }))
                      }
                      placeholder="061414100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location-gln">Location GLN</Label>
                    <Input
                      id="location-gln"
                      value={gs1Config.locationGLN}
                      onChange={(e) => 
                        setGs1Config(prev => ({ ...prev, locationGLN: e.target.value }))
                      }
                      placeholder="0614141000017"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="license-number">GS1 License Number</Label>
                    <Input
                      id="license-number"
                      value={gs1Config.licenseNumber}
                      onChange={(e) => 
                        setGs1Config(prev => ({ ...prev, licenseNumber: e.target.value }))
                      }
                      placeholder="GS1-License-123456"
                    />
                  </div>

                  <Button onClick={() => handleSaveConfig('GS1')}>
                    <Save className="h-4 w-4 mr-2" />
                    Save GS1 Configuration
                  </Button>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Valid GS1 company prefix required for compliant GTIN generation. 
                    Contact GS1 organization in your country for registration.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
