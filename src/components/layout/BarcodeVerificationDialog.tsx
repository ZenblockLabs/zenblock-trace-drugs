
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { Textarea } from "@/components/ui/textarea";
import { QrCode, Package, Calendar, MapPin, Hash, Pill, CheckCircle } from "lucide-react";
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
}

export const BarcodeVerificationDialog = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [barcodeResult, setBarcodeResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedBatch, setVerifiedBatch] = useState<VerifiedBatch | null>(null);
  const [scannedId, setScannedId] = useState<string | null>(null);

  // Detect if scanned data is QR code (JSON) or barcode (plain text)
  const detectCodeType = (code: string): 'qr' | 'barcode' => {
    try {
      JSON.parse(code);
      return 'qr';
    } catch {
      return 'barcode';
    }
  };

  // Generate a unique batch ID for QR codes that don't have one
  const generateBatchId = (): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `BATCH-${timestamp}-${random}`.toUpperCase();
  };

  // Extract or generate batch ID from scanned data
  const extractOrGenerateBatchId = (input: string): { id: string; drugName: string; quantity: number } => {
    const codeType = detectCodeType(input);
    
    if (codeType === 'qr') {
      try {
        const parsed = JSON.parse(input);
        const batchId = parsed["Batch ID"] || parsed.batch_id || generateBatchId();
        const drugName = parsed["Drug Name"] || parsed.drug_name || "Unknown Drug";
        const quantity = parseInt(parsed["Quantity"] || parsed.quantity) || 1;
        return { id: batchId, drugName, quantity };
      } catch {
        return { id: generateBatchId(), drugName: "Unknown Drug", quantity: 1 };
      }
    } else {
      // Barcode - use the scanned value as the ID
      return { id: input.trim(), drugName: "Scanned Product", quantity: 1 };
    }
  };

  const handleBarcodeDetected = async (barcode: string) => {
    setBarcodeResult(barcode);
    setIsScanning(false);
    
    // Extract or generate batch ID and store to database
    const { id, drugName, quantity } = extractOrGenerateBatchId(barcode);
    setScannedId(id);
    
    try {
      // Check if batch already exists
      const { data: existing } = await supabase
        .from('erp_batches')
        .select('batch_id')
        .eq('batch_id', id)
        .maybeSingle();
      
      if (!existing) {
        // Store new batch to database
        const { error } = await supabase
          .from('erp_batches')
          .insert({
            batch_id: id,
            drug_name: drugName,
            quantity: quantity,
            status: 'scanned',
            scanned_at: new Date().toISOString(),
            original_created_at: new Date().toISOString()
          });
        
        if (error) {
          console.error("Error storing scanned batch:", error);
        } else {
          toast.success("Batch ID stored successfully");
        }
      } else {
        toast.info("Batch ID already exists in database");
      }
    } catch (error) {
      console.error("Error storing batch:", error);
    }
  };

  const handleManualEntry = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBarcodeResult(e.target.value);
    setScannedId(null); // Clear scanned ID for manual entry
  };

  const extractBatchId = (input: string): string | null => {
    try {
      const parsed = JSON.parse(input);
      if (parsed["Batch ID"]) return parsed["Batch ID"];
      if (parsed.batch_id) return parsed.batch_id;
    } catch {
      // Not JSON
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
    
    try {
      // Use the stored scanned ID or extract from manual entry
      const searchValue = scannedId || extractBatchId(barcodeResult);
      
      if (!searchValue) {
        toast.error("Invalid barcode format");
        setIsLoading(false);
        return;
      }

      // Check erp_batches for matching batch_id
      const { data: erpBatch, error } = await supabase
        .from('erp_batches')
        .select('*')
        .eq('batch_id', searchValue)
        .maybeSingle();

      if (error) {
        console.error("Error checking ERP batches:", error);
      }

      if (erpBatch) {
        toast.success(`Batch verified - ID matched in database`);
        setVerifiedBatch(erpBatch);
        return;
      }

      // If not in erp_batches, try mock drugs
      const service = await getBlockchainService();
      const drug = await service.getDrugBySGTIN(searchValue);
      
      if (drug) {
        toast.success("Drug verified successfully");
        navigate(`/drugs/${drug.id}`);
        return;
      }

      toast.error("Batch ID not found in database");
    } catch (error) {
      console.error("Error verifying drug:", error);
      toast.error("Failed to verify drug. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setVerifiedBatch(null);
    setBarcodeResult("");
    setScannedId(null);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {verifiedBatch ? "Drug Verified ✓" : "Scan or Enter Drug Barcode"}
          </DialogTitle>
        </DialogHeader>
        
        {verifiedBatch ? (
          <div className="flex flex-col space-y-4">
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-2 text-green-700 mb-3">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Verification Successful</span>
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
        ) : (
          <div className="flex flex-col space-y-4">
            {isScanning ? (
              <>
                <div className="h-[300px]">
                  <BarcodeScanner onDetected={handleBarcodeDetected} />
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
                  placeholder="Enter Batch ID or SGTIN manually"
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