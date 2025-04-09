import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { Drug, TrackingEvent } from "@/services/types";

export function RecallReportsPage() {
  const [recalledDrugs, setRecalledDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecalledDrugs = async () => {
      try {
        setLoading(true);
        const service = await getBlockchainService();
        const allDrugs = await service.getAllDrugs();
        
        // Filter for recalled drugs
        // In a real implementation, this would be a direct query
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
  }, []);

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

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Recall Reports</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : recalledDrugs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>No recalled drugs found.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {recalledDrugs.map((drug) => (
            <Card key={drug.id} className="border-red-200 bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-800 flex justify-between items-start">
                  <span>{drug.name}</span>
                  <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    Recalled
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Manufacturer:</div>
                    <div>{drug.manufacturer}</div>
                    
                    <div className="text-muted-foreground">Batch Number:</div>
                    <div>{drug.batchNumber}</div>
                    
                    <div className="text-muted-foreground">SGTIN:</div>
                    <div>{drug.sgtin}</div>
                    
                    <div className="text-muted-foreground">Expiry Date:</div>
                    <div>{formatDate(drug.expiryDate)}</div>
                    
                    <div className="text-muted-foreground">Current Owner:</div>
                    <div>{drug.ownerName} ({drug.ownerRole})</div>
                    
                    <div className="text-muted-foreground">Recall Reason:</div>
                    <div className="text-red-700 font-medium">
                      {(drug as any).recallReason || "Quality control issue"}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-red-200 text-red-800 hover:bg-red-100"
                      onClick={() => window.open(`/track?code=${drug.sgtin}`, '_blank')}
                    >
                      View Full History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
