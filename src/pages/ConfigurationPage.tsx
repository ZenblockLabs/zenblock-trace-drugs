
import { useState, useEffect } from 'react';
import { getBlockchainConfig, setUseFabric, isUsingMockService } from '@/services/blockchainServiceFactory';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NetworkStatusIndicator } from '@/components/NetworkStatusIndicator';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, HelpCircle, Database, Cpu, CheckCircle, Settings, Shield, Network } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { erpBlockchainIntegration } from '@/services/integration/ERPBlockchainIntegration';

export const ConfigurationPage = () => {
  const { toast } = useToast();
  const [useFabric, setUseFabricState] = useState(getBlockchainConfig().useFabric);
  const [isMockActive, setIsMockActive] = useState(false);
  const [fabricEndpoint, setFabricEndpoint] = useState('');
  const [channelName, setChannelName] = useState('pharma-channel');
  const [chaincodeName, setChaincodeName] = useState('drug-traceability');
  const [mspId, setMspId] = useState('Org1MSP');
  const [erpApiUrl, setErpApiUrl] = useState('http://localhost:3001/api');
  const [erpConnected, setErpConnected] = useState(true);
  const [integrationEvents, setIntegrationEvents] = useState(0);

  useEffect(() => {
    const checkService = async () => {
      const usingMock = await isUsingMockService();
      setIsMockActive(usingMock);
      
      // Get integration events count
      const events = erpBlockchainIntegration.getIntegrationEvents();
      setIntegrationEvents(events.length);
    };
    
    checkService();
  }, [useFabric]);

  const handleToggleFabric = (checked: boolean) => {
    setUseFabricState(checked);
    setUseFabric(checked);
    
    toast({
      title: `Switched to ${checked ? 'Fabric' : 'Mock'} Service`,
      description: `Now using ${checked ? 'Hyperledger Fabric' : 'mock data'} for blockchain operations.`,
    });
  };

  const testERPConnection = async () => {
    try {
      const orders = await erpBlockchainIntegration.getERPOrders();
      
      toast({
        title: "ERP Connection Test",
        description: `Successfully retrieved ${orders.length} orders from ERP system.`,
      });

      // Simulate syncing the first order to blockchain
      if (orders.length > 0) {
        await erpBlockchainIntegration.syncOrderToBlockchain(orders[0].id);
        const events = erpBlockchainIntegration.getIntegrationEvents();
        setIntegrationEvents(events.length);
      }
    } catch (error) {
      toast({
        title: "ERP Connection Failed",
        description: "Failed to connect to ERP system.",
        variant: "destructive"
      });
    }
  };

  const testFabricConnection = async () => {
    try {
      // This would test the actual Fabric connection
      toast({
        title: "Fabric Connection Test",
        description: "Testing connection to Hyperledger Fabric network...",
      });

      // Simulate connection test
      setTimeout(() => {
        if (useFabric && !isMockActive) {
          toast({
            title: "Fabric Connected",
            description: "Successfully connected to Hyperledger Fabric network.",
          });
        } else {
          toast({
            title: "Using Mock Service",
            description: "Fabric credentials not configured. Using mock blockchain service.",
            variant: "destructive"
          });
        }
      }, 2000);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Fabric network.",
        variant: "destructive"
      });
    }
  };

  const saveFabricConfig = () => {
    // In a real implementation, this would save to environment or config service
    toast({
      title: "Configuration Saved",
      description: "Fabric network configuration has been saved.",
    });
  };

  const saveERPConfig = () => {
    toast({
      title: "ERP Configuration Saved",
      description: "ERP integration settings have been saved.",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuration</h1>
        <p className="text-muted-foreground">Configure blockchain and ERP integration settings</p>
      </div>

      <Tabs defaultValue="blockchain" className="space-y-4">
        <TabsList>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="erp">ERP Integration</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="blockchain" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Network className="h-5 w-5" />
                Blockchain Configuration
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-80">
                    <p>Configure how the application connects to the Hyperledger Fabric blockchain network.</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <CardDescription>Configure blockchain network connection and parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between pb-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="use-fabric" className="cursor-pointer">Use Hyperledger Fabric</Label>
                  <span className="text-sm text-muted-foreground">
                    {useFabric 
                      ? "Connecting to real Fabric network" 
                      : "Using mock blockchain data"}
                  </span>
                </div>
                <Switch 
                  id="use-fabric" 
                  checked={useFabric}
                  onCheckedChange={handleToggleFabric}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Network Status</Label>
                <NetworkStatusIndicator />
              </div>

              {useFabric && (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Fabric Network Settings</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fabric-endpoint">Fabric Endpoint</Label>
                      <Input 
                        id="fabric-endpoint"
                        value={fabricEndpoint}
                        onChange={(e) => setFabricEndpoint(e.target.value)}
                        placeholder="grpcs://peer0.org1.pharma.com:7051"
                      />
                    </div>
                    <div>
                      <Label htmlFor="msp-id">MSP ID</Label>
                      <Input 
                        id="msp-id"
                        value={mspId}
                        onChange={(e) => setMspId(e.target.value)}
                        placeholder="Org1MSP"
                      />
                    </div>
                    <div>
                      <Label htmlFor="channel-name">Channel Name</Label>
                      <Input 
                        id="channel-name"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        placeholder="pharma-channel"
                      />
                    </div>
                    <div>
                      <Label htmlFor="chaincode-name">Chaincode Name</Label>
                      <Input 
                        id="chaincode-name"
                        value={chaincodeName}
                        onChange={(e) => setChaincodeName(e.target.value)}
                        placeholder="drug-traceability"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={testFabricConnection} variant="outline">
                      <Network className="h-4 w-4 mr-2" />
                      Test Connection
                    </Button>
                    <Button onClick={saveFabricConfig}>
                      Save Configuration
                    </Button>
                  </div>
                </div>
              )}
              
              {useFabric && isMockActive && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex gap-2 items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Using Mock Service</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Although Fabric mode is enabled, we're using mock data because the connection to the Fabric network failed.
                      Check network configuration or server status.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="erp" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5" />
                ERP Integration
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-80">
                    <p>Configure integration with pharmaceutical ERP systems for order and inventory management.</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <CardDescription>Configure pharmaceutical ERP system integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${erpConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <Label>ERP System Status</Label>
                </div>
                <span className="text-sm text-muted-foreground">
                  {erpConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="erp-api-url">ERP API URL</Label>
                  <Input 
                    id="erp-api-url"
                    value={erpApiUrl}
                    onChange={(e) => setErpApiUrl(e.target.value)}
                    placeholder="http://erp-system.pharma.com/api"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Integration Events</Label>
                  <span className="text-sm font-medium">{integrationEvents}</span>
                </div>

                <div className="flex gap-2">
                  <Button onClick={testERPConnection} variant="outline">
                    <Cpu className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                  <Button onClick={saveERPConfig}>
                    Save Configuration
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-md flex gap-2 items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">Mock ERP Active</p>
                  <p className="text-xs text-green-600 mt-1">
                    Mock pharmaceutical ERP system is running with sample orders, inventory, and supplier data.
                    Integration events are automatically synced to the blockchain.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cert-content">Client Certificate</Label>
                <Textarea 
                  id="cert-content"
                  placeholder="-----BEGIN CERTIFICATE-----"
                  className="h-24"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Paste your Fabric client certificate here
                </p>
              </div>

              <div>
                <Label htmlFor="key-content">Private Key</Label>
                <Textarea 
                  id="key-content"
                  placeholder="-----BEGIN PRIVATE KEY-----"
                  className="h-24"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Paste your Fabric client private key here
                </p>
              </div>

              <Button>
                Update Credentials
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Monitoring & Logging
              </CardTitle>
              <CardDescription>Configure system monitoring and logging preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Debug Logging</Label>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Real-time Monitoring</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Performance Metrics</Label>
                  <Switch defaultChecked />
                </div>

                <div>
                  <Label htmlFor="log-level">Log Level</Label>
                  <select className="w-full p-2 border rounded-md" id="log-level">
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                    <option value="warn">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </div>

              <Button>
                Save Monitoring Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
