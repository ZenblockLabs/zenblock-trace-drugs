
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { Textarea } from "@/components/ui/textarea";
import { QrCode, Package, Calendar, MapPin, Hash, Pill, CheckCircle, Eye, AlertTriangle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface VerifiedBatch {
  batch_id: string;
  drug_name: string;
  quantity: number;
  facility: string | null;
  status: string | null;
  scanned_at: string | null;
  original_created_at: string | null;
  drug_id: string | null;
}

export const BarcodeVerificationDialog = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [barcodeResult, setBarcodeResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedBatch, setVerifiedBatch] = useState<VerifiedBatch | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleBarcodeDetected = (barcode: string) => {
    setBarcodeResult(barcode);
    setIsScanning(false);
  };

  const handleManualEntry = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBarcodeResult(e.target.value);
  };

  const extractBatchId = (input: string): string | null => {
    // Try to parse as JSON first (scanned QR codes contain JSON)
    try {
      const parsed = JSON.parse(input);
      if (parsed["Batch ID"]) {
        return parsed["Batch ID"];
      }
      if (parsed.batch_id) {
        return parsed.batch_id;
      }
      if (parsed["Drug ID"]) {
        return parsed["Drug ID"];
      }
      if (parsed.drug_id) {
        return parsed.drug_id;
      }
    } catch {
      // Not JSON, treat as plain batch ID or barcode number
    }
    return input.trim();
  };

  const handleVerifyBarcode = async () => {
    if (!barcodeResult) {
      toast.error("Please scan or enter a barcode");
      return;
    }

    setIsLoading(true);
    setVerifiedBatch(null);
    setNotFound(false);
    
    try {
      const searchValue = extractBatchId(barcodeResult);
      
      if (!searchValue) {
        toast.error("Invalid barcode format");
        setIsLoading(false);
        return;
      }

      // First try to find in mock drugs by SGTIN
      const service = await getBlockchainService();
      const drug = await service.getDrugBySGTIN(searchValue);
      
      if (drug) {
        toast.success("Drug verified successfully");
        navigate(`/drugs/${drug.id}`);
        return;
      }

      // Search by drug_id first (scanned barcode number is stored as drug_id)
      const { data: erpBatchByDrugId, error: drugIdError } = await supabase
        .from('erp_batches')
        .select('*')
        .eq('drug_id', searchValue)
        .maybeSingle();

      if (drugIdError) {
        console.error("Error checking ERP batches by drug_id:", drugIdError);
      }

      if (erpBatchByDrugId) {
        toast.success(`Drug verified successfully`);
        setVerifiedBatch(erpBatchByDrugId);
        return;
      }

      // Fallback: check erp_batches by batch_id
      const { data: erpBatch, error } = await supabase
        .from('erp_batches')
        .select('*')
        .eq('batch_id', searchValue)
        .maybeSingle();

      if (error) {
        console.error("Error checking ERP batches:", error);
      }

      if (erpBatch) {
        toast.success(`Batch verified successfully`);
        setVerifiedBatch(erpBatch);
        return;
      }

      // Drug not found in database
      setNotFound(true);
      toast.error("Drug not found in database");
    } catch (error) {
      console.error("Error verifying drug:", error);
      toast.error("Failed to verify drug. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setVerifiedBatch(null);
    setNotFound(false);
    setBarcodeResult("");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPp");
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="h-4 w-4 mr-1" />
          Verify Drug
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {verifiedBatch ? "Drug Verified ✓" : notFound ? "Drug Not Found" : "Scan or Enter Drug Barcode"}
          </DialogTitle>
        </DialogHeader>

        {/* Not Found State */}
        {notFound && !verifiedBatch && (
          <div className="flex flex-col space-y-4">
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="pt-4 space-y-3">
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
                    <XCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="font-semibold text-lg text-destructive">Drug Not Found</h3>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    The scanned barcode/ID was not found in the database.
                  </p>
                  <div className="p-3 bg-muted rounded-md border mt-4 w-full">
                    <p className="text-xs text-muted-foreground mb-1">Scanned Value</p>
                    <p className="text-sm font-mono break-all">{extractBatchId(barcodeResult)}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm text-amber-600">Please verify this drug is registered in the system</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Scan Another
              </Button>
              <DialogClose asChild>
                <Button variant="secondary" className="flex-1">
                  Close
                </Button>
              </DialogClose>
            </div>
          </div>
        )}

        {/* Verified Batch Display - Read Only */}
        {verifiedBatch && (
          <div className="flex flex-col space-y-4">
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Verification Successful</span>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    Monitor Only
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Pill className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Drug Name</p>
                      <p className="font-medium">{verifiedBatch.drug_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Hash className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Drug ID</p>
                      <p className="font-medium font-mono text-sm">{verifiedBatch.drug_id || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Hash className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Batch ID</p>
                      <p className="font-medium">{verifiedBatch.batch_id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Quantity</p>
                      <p className="font-medium">{verifiedBatch.quantity} units</p>
                    </div>
                  </div>
                  
                  {verifiedBatch.facility && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Facility</p>
                        <p className="font-medium">{verifiedBatch.facility}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Created At</p>
                      <p className="font-medium">{formatDate(verifiedBatch.original_created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Status:</span>
                    <Badge variant="outline" className="capitalize">
                      {verifiedBatch.status || "Unknown"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Scan Another
              </Button>
              <DialogClose asChild>
                <Button onClick={() => navigate('/batch-processing')} className="flex-1">
                  View All Batches
                </Button>
              </DialogClose>
            </div>
          </div>
        )}

        {/* Scan/Entry UI - Show when no result yet */}
        {!verifiedBatch && !notFound && (
          <div className="flex flex-col space-y-4">
            {isScanning ? (
              <>
                <div className="h-[300px]">
                  <BarcodeScanner 
                    onDetected={handleBarcodeDetected} 
                  />
                </div>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsScanning(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsScanning(true)}>
                <QrCode className="h-4 w-4 mr-2" /> Scan Barcode
              </Button>
            )}
            
            {barcodeResult ? (
              <div className="p-3 bg-muted rounded-md border">
                <p className="text-xs text-muted-foreground mb-1">Scanned Data</p>
                <p className="text-sm font-mono break-all">{extractBatchId(barcodeResult)}</p>
              </div>
            ) : (
              <>
                <div className="text-center">or</div>
                <Textarea
                  placeholder="Enter Batch ID or Drug ID manually"
                  value={barcodeResult}
                  onChange={handleManualEntry}
                  className="min-h-[80px]"
                />
              </>
            )}
            
            <Button 
              onClick={handleVerifyBarcode}
              disabled={isLoading || !barcodeResult}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};