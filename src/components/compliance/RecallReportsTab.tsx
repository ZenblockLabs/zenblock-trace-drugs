import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { Drug } from "@/services/types";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function RecallReportsTab() {
  const [recalledDrugs, setRecalledDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecalledDrugs = async () => {
      try {
        setLoading(true);
        const service = await getBlockchainService(user?.email);
        const allDrugs = await service.getAllDrugs();
        
        const recalled = [];
        for (const drug of allDrugs) {
          try {
            const status = await service.checkRecallStatus(drug.sgtin);
            if (status.isRecalled) {
              recalled.push({...drug, recallReason: status.reason});
            }
          } catch (err) {
            console.error(`Error checking recall status for ${drug.sgtin}:`, err);
          }
        }
        
        setRecalledDrugs(recalled);
      } catch (err) {
        console.error("Error fetching recalled drugs:", err);
        setError("Failed to load recalled drugs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecalledDrugs();
  }, [user?.email]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        {error}
      </div>
    );
  }

  if (recalledDrugs.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium">No recalled drugs found</p>
            <p className="text-sm mt-2">All products in the system are currently safe for distribution</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-5 w-5" />
        <p className="text-sm font-medium">
          {recalledDrugs.length} recalled product{recalledDrugs.length !== 1 ? 's' : ''} requiring immediate action
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {recalledDrugs.map((drug) => (
          <Card key={drug.id} className="border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-destructive flex justify-between items-start">
                <span>{drug.name}</span>
                <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full font-medium">
                  RECALLED
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Manufacturer:</div>
                  <div className="font-medium">{drug.manufacturer}</div>
                  
                  <div className="text-muted-foreground">Batch Number:</div>
                  <div className="font-medium">{drug.batchNumber}</div>
                  
                  <div className="text-muted-foreground">SGTIN:</div>
                  <div className="font-mono text-xs">{drug.sgtin}</div>
                  
                  <div className="text-muted-foreground">Expiry Date:</div>
                  <div className="font-medium">{formatDate(drug.expiryDate)}</div>
                  
                  <div className="text-muted-foreground">Current Owner:</div>
                  <div className="font-medium">{drug.ownerName} ({drug.ownerRole})</div>
                </div>
                
                <div className="pt-2 border-t border-destructive/20">
                  <div className="text-sm text-muted-foreground mb-1">Recall Reason:</div>
                  <div className="text-sm text-destructive font-medium">
                    {(drug as any).recallReason || "Quality control issue"}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-destructive/20 text-destructive hover:bg-destructive/10"
                  onClick={() => window.open(`/track?code=${drug.sgtin}`, '_blank')}
                >
                  View Full History
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
