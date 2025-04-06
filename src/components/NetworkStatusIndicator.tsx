
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle2, WifiOff } from "lucide-react";

export const NetworkStatusIndicator = () => {
  const { toast } = useToast();
  const [initialCheck, setInitialCheck] = useState(false);

  // Query to check the blockchain network status
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['fabric-network-status'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fabric-ping', {
          body: { action: 'ping' }
        });
        
        if (error) throw error;
        return { status: 'connected', data };
      } catch (err) {
        console.error('Network check failed:', err);
        return { status: 'disconnected', error: err };
      }
    },
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Show toast notification only on the first status change
  useEffect(() => {
    if (!initialCheck && data) {
      setInitialCheck(true);
      if (data.status === 'connected') {
        toast({
          title: "Blockchain Network Connected",
          description: "Successfully connected to the Hyperledger Fabric network.",
        });
      } else {
        toast({
          title: "Network Disconnected",
          description: "Using mock data. Check your network configuration.",
          variant: "destructive",
        });
      }
    }
  }, [data, initialCheck, toast]);

  if (isLoading) {
    return (
      <Badge variant="outline" className="gap-1 border-yellow-300 text-yellow-600">
        <AlertCircle className="h-4 w-4" />
        Checking
      </Badge>
    );
  }

  const isConnected = data?.status === 'connected';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant={isConnected ? "outline" : "destructive"} 
          className={`gap-1 cursor-pointer ${isConnected ? 'border-green-300 text-green-600' : ''}`}
          onClick={() => refetch()}
        >
          {isConnected ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Connected
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              Disconnected
            </>
          )}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {isConnected 
            ? `Connected to Hyperledger Fabric network` 
            : `Using mock blockchain service. Click to retry.`}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Last checked: {new Date().toLocaleTimeString()}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
