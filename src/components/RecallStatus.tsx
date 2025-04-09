
import { useEffect, useState } from "react";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface RecallStatusProps {
  sgtin: string;
  className?: string;
}

export function RecallStatus({ sgtin, className }: RecallStatusProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [recallData, setRecallData] = useState<{
    isRecalled: boolean;
    recallDetails: {
      reason: string;
      initiatedBy: { name: string; role: string } | string;
      timestamp: string;
    } | null;
  } | null>(null);

  useEffect(() => {
    const checkRecallStatus = async () => {
      if (!sgtin) return;
      
      try {
        setIsLoading(true);
        const service = await getBlockchainService();
        const status = await service.checkRecallStatus(sgtin);
        setRecallData(status);
      } catch (error) {
        console.error("Error checking recall status:", error);
        toast({
          title: "Error",
          description: "Failed to check recall status",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkRecallStatus();
  }, [sgtin]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!recallData) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        Unable to check recall status
      </div>
    );
  }

  const { isRecalled, recallDetails } = recallData;

  // Format the initiator information
  const getInitiatorName = () => {
    if (!recallDetails?.initiatedBy) return "Unknown";
    
    if (typeof recallDetails.initiatedBy === "string") {
      return recallDetails.initiatedBy;
    }
    
    return recallDetails.initiatedBy.name || "Unknown";
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMM d, yyyy h:mm a");
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <div className={cn("rounded-lg border p-4", className, {
      "border-green-200 bg-green-50": !isRecalled,
      "border-red-200 bg-red-50": isRecalled,
    })}>
      {isRecalled ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <h4 className="font-medium">Product Recalled</h4>
          </div>
          
          {recallDetails && (
            <div className="text-sm space-y-2">
              <p className="font-medium">Reason:</p>
              <p className="text-muted-foreground bg-white/50 p-2 rounded border border-red-100">
                {recallDetails.reason}
              </p>
              
              <div className="flex flex-col space-y-1 mt-2">
                <span className="text-xs text-muted-foreground">
                  Initiated by: {getInitiatorName()}
                </span>
                <span className="text-xs text-muted-foreground">
                  Date: {formatTimestamp(recallDetails.timestamp)}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          <h4 className="font-medium">No Active Recalls</h4>
        </div>
      )}
    </div>
  );
}
