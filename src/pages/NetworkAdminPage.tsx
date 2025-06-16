
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Network, 
  Shield, 
  Users, 
  Server, 
  Key, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Settings
} from 'lucide-react';
import { fabricConfig, FabricCredentials } from '@/services/fabric/FabricConfigService';
import { EnhancedFabricGateway } from '@/services/fabric/EnhancedFabricGateway';

export const NetworkAdminPage = () => {
  const [gateway] = useState(new EnhancedFabricGateway());
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'failed'>('disconnected');
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [credentials, setCredentials] = useState<Partial<FabricCredentials>>({
    userId: '',
    userCert: '',
    userKey: '',
    mspId: 'ManufacturerMSP'
  });

  useEffect(() => {
    loadNetworkConfig();
  }, []);

  const loadNetworkConfig = async () => {
    try {
      await fabricConfig.loadNetworkConfig();
      const existingCreds = fabricConfig.getCredentials();
      if (existingCreds) {
        setCredentials(existingCreds);
      }
    } catch (error) {
      console.error('Failed to load network config:', error);
    }
  };

  const handleConnect = async () => {
    setConnectionStatus('connecting');
    
    try {
      // Set credentials before connecting
      if (credentials.userId && credentials.userCert && credentials.userKey && credentials.mspId) {
        fabricConfig.setCredentials(credentials as FabricCredentials);
      }

      const connected = await gateway.connect();
      
      if (connected) {
        setConnectionStatus('connected');
        setNetworkInfo(gateway.getNetworkInfo());
        toast.success('Connected to Fabric network');
      } else {
        setConnectionStatus('failed');
        toast.error('Failed to connect to Fabric network');
      }
    } catch (error) {
      setConnectionStatus('failed');
      toast.error('Connection error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDisconnect = async () => {
    await gateway.disconnect();
    setConnectionStatus('disconnected');
    setNetworkInfo(null);
    toast.info('Disconnected from network');
  };

  const testTransaction = async () => {
    if (!gateway.isConnected()) {
      toast.error('Not connected to network');
      return;
    }

    try {
      const result = await gateway.submitTransaction({
        fcn: 'RegisterDrug',
        args: [JSON.stringify({
          batchId: `TEST_${Date.now()}`,
          drugName: 'Test Drug',
          quantity: 100
        })]
      });

      toast.success(`Transaction successful: ${result.transactionId}`);
    } catch (error) {
      toast.error('Transaction failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'connecting': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Network className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Network Administration</h1>
        <p className="text-muted-foreground">Manage Hyperledger Fabric network connection and configuration</p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Network Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'}>
                {connectionStatus.toUpperCase()}
              </Badge>
              <span className={getStatusColor()}>
                {connectionStatus === 'connected' ? 'Connected to Fabric network' : 
                 connectionStatus === 'connecting' ? 'Connecting...' :
                 connectionStatus === 'failed' ? 'Connection failed' : 'Not connected'}
              </span>
            </div>
            <div className="flex gap-2">
              {connectionStatus === 'connected' ? (
                <>
                  <Button onClick={testTransaction} variant="outline" size="sm">
                    Test Transaction
                  </Button>
                  <Button onClick={handleDisconnect} variant="outline" size="sm">
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button onClick={handleConnect} disabled={connectionStatus === 'connecting'} size="sm">
                  {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="credentials" className="space-y-4">
        <TabsList>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="network">Network Info</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="tools">Admin Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="credentials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                User Credentials
              </CardTitle>
              <CardDescription>Configure your Fabric identity for network access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="userId">User ID</Label>
                  <Input 
                    id="userId"
                    value={credentials.userId}
                    onChange={(e) => setCredentials(prev => ({ ...prev, userId: e.target.value }))}
                    placeholder="admin"
                  />
                </div>
                <div>
                  <Label htmlFor="mspId">MSP ID</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={credentials.mspId}
                    onChange={(e) => setCredentials(prev => ({ ...prev, mspId: e.target.value }))}
                  >
                    <option value="ManufacturerMSP">ManufacturerMSP</option>
                    <option value="DistributorMSP">DistributorMSP</option>
                    <option value="DispenserMSP">DispenserMSP</option>
                    <option value="RegulatorMSP">RegulatorMSP</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="userCert">User Certificate</Label>
                <Textarea 
                  id="userCert"
                  value={credentials.userCert}
                  onChange={(e) => setCredentials(prev => ({ ...prev, userCert: e.target.value }))}
                  placeholder="-----BEGIN CERTIFICATE-----"
                  className="h-32"
                />
              </div>
              
              <div>
                <Label htmlFor="userKey">Private Key</Label>
                <Textarea 
                  id="userKey"
                  value={credentials.userKey}
                  onChange={(e) => setCredentials(prev => ({ ...prev, userKey: e.target.value }))}
                  placeholder="-----BEGIN PRIVATE KEY-----"
                  className="h-32"
                />
              </div>

              <Button 
                onClick={() => {
                  if (credentials.userId && credentials.userCert && credentials.userKey && credentials.mspId) {
                    fabricConfig.setCredentials(credentials as FabricCredentials);
                    toast.success('Credentials saved');
                  } else {
                    toast.error('Please fill all credential fields');
                  }
                }}
              >
                Save Credentials
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Network Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {networkInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Channel</Label>
                      <p className="font-mono text-sm">{networkInfo.channel}</p>
                    </div>
                    <div>
                      <Label>MSP ID</Label>
                      <p className="font-mono text-sm">{networkInfo.mspId}</p>
                    </div>
                    <div>
                      <Label>Chaincode</Label>
                      <p className="font-mono text-sm">{networkInfo.chaincode?.name} v{networkInfo.chaincode?.version}</p>
                    </div>
                    <div>
                      <Label>Organizations</Label>
                      <p className="text-sm">{networkInfo.organizations?.join(', ')}</p>
                    </div>
                  </div>
                  
                  {gateway.getConnectionProfile() && (
                    <div>
                      <Label>Connection Profile</Label>
                      <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-64">
                        {JSON.stringify(gateway.getConnectionProfile(), null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Connect to network to view information</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Organizations
              </CardTitle>
              <CardDescription>Network organizations and their configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Manufacturer', 'Distributor', 'Dispenser', 'Regulator'].map((org) => (
                  <Card key={org} className="border-dashed">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{org}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>MSP ID:</span>
                        <span className="font-mono">{org}MSP</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Peers:</span>
                        <span className="text-muted-foreground">1</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Status:</span>
                        <Badge variant="outline" className="text-xs">Configured</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Administrative Tools
              </CardTitle>
              <CardDescription>Tools for testing and managing the network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={testTransaction}
                  disabled={connectionStatus !== 'connected'}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Network className="h-6 w-6 mb-2" />
                  Test Transaction
                </Button>
                
                <Button 
                  variant="outline"
                  disabled={connectionStatus !== 'connected'}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Shield className="h-6 w-6 mb-2" />
                  Validate Config
                </Button>
                
                <Button 
                  variant="outline"
                  disabled={connectionStatus !== 'connected'}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Users className="h-6 w-6 mb-2" />
                  List Peers
                </Button>
                
                <Button 
                  variant="outline"
                  disabled={connectionStatus !== 'connected'}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Server className="h-6 w-6 mb-2" />
                  Channel Info
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
