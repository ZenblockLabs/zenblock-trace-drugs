
import { useState, useEffect } from 'react';
import { getBlockchainConfig, setUseFabric, isUsingMockService } from '@/services/blockchainServiceFactory';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NetworkStatusIndicator } from '@/components/NetworkStatusIndicator';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const BlockchainConfig = () => {
  const { toast } = useToast();
  const [useFabric, setUseFabricState] = useState(getBlockchainConfig().useFabric);
  const [isMockActive, setIsMockActive] = useState(false);

  useEffect(() => {
    const checkService = async () => {
      const usingMock = await isUsingMockService();
      setIsMockActive(usingMock);
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

  return (
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
  );
};
