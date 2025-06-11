
import { useState, useEffect } from 'react';
import { getBlockchainConfig, setUseFabric, isUsingMockService } from '@/services/blockchainServiceFactory';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NetworkStatusIndicator } from '@/components/NetworkStatusIndicator';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, HelpCircle, Database, Cpu, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { erpBlockchainIntegration } from '@/services/integration/ERPBlockchainIntegration';

export const BlockchainConfig = () => {
  const { toast } = useToast();
  const [useFabric, setUseFabricState] = useState(getBlockchainConfig().useFabric);
  const [isMockActive, setIsMockActive] = useState(false);
  const [erpConnected, setErpConnected] = useState(true); // Mock ERP is always "connected"
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

  const handleToggle = (checked: boolean) => {
    setUseFabricState(checked);
    setUseFabric(checked);
    
    toast({
      title: `Switched to ${checked ? 'Fabric' : 'Mock'} Service`,
      description: `Now using ${checked ? 'Hyperledger Fabric' : 'mock data'} for blockchain operations.`,
    });
  };

  const testERPIntegration = async () => {
    try {
      const orders = await erpBlockchainIntegration.getERPOrders();
      
      toast({
        title: "ERP Integration Test",
        description: `Successfully retrieved ${orders.length} orders from mock ERP system.`,
      });

      // Simulate syncing the first order to blockchain
      if (orders.length > 0) {
        await erpBlockchainIntegration.syncOrderToBlockchain(orders[0].id);
        const events = erpBlockchainIntegration.getIntegrationEvents();
        setIntegrationEvents(events.length);
      }
    } catch (error) {
      toast({
        title: "ERP Integration Failed",
        description: "Failed to connect to mock ERP system.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            Blockchain Configuration
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-80">
                <p>Toggle between using the real Hyperledger Fabric network or a mock service for development.</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <CardDescription>Configure how the application connects to the blockchain</CardDescription>
        </CardHeader>
        <CardContent>
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
              onCheckedChange={handleToggle}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label>Network Status</Label>
            <NetworkStatusIndicator />
          </div>
          
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
          <CardDescription>Pharmaceutical ERP system integration status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${erpConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <Label>Mock ERP Status</Label>
              </div>
              <span className="text-sm text-muted-foreground">
                {erpConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <Label>Integration Events</Label>
              <span className="text-sm font-medium">{integrationEvents}</span>
            </div>

            <Button 
              variant="outline" 
              onClick={testERPIntegration}
              className="w-full"
            >
              <Cpu className="h-4 w-4 mr-2" />
              Test ERP Integration
            </Button>

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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
