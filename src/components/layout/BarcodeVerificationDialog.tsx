
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { Textarea } from "@/components/ui/textarea";
import { QrCode, Package, Calendar, MapPin, Hash, Pill, CheckCircle, Eye, AlertTriangle, Brain, ShieldCheck, ShieldAlert } from "lucide-react";
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

interface AIVerificationResult {
  isGenuine: boolean;
  confidence: number;
  analysis: string;
  riskFactors: string[];
  recommendations: string[];
}

export const BarcodeVerificationDialog = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [barcodeResult, setBarcodeResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedBatch, setVerifiedBatch] = useState<VerifiedBatch | null>(null);
  const [aiVerification, setAiVerification] = useState<AIVerificationResult | null>(null);
  const [isAiVerifying, setIsAiVerifying] = useState(false);

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
    } catch {
      // Not JSON, treat as plain batch ID or SGTIN
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
        toast.success(`Drug verified successfully by Drug ID`);
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

      // Drug not found in database - trigger AI verification
      toast.info("Drug not found in database. Running AI verification...");
      await runAIVerification(barcodeResult);
    } catch (error) {
      console.error("Error verifying drug:", error);
      toast.error("Failed to verify drug. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const runAIVerification = async (scannedData: string, imageData?: string) => {
    setIsAiVerifying(true);
    setIsScanning(false);
    
    try {
      // Try to extract drug info from scanned data
      let drugName = "";
      let facility = "";
      let batchId = "";
      
      if (scannedData && !imageData) {
        try {
          const parsed = JSON.parse(scannedData);
          drugName = parsed["Drug Name"] || parsed.drug_name || "";
          facility = parsed["Facility"] || parsed.facility || "";
          batchId = parsed["Batch ID"] || parsed.batch_id || "";
        } catch {
          // Plain text - use as batch ID
          batchId = scannedData.trim();
        }
      }

      const response = await supabase.functions.invoke('verify-drug-ai', {
        body: { 
          drugName, 
          facility, 
          batchId, 
          scannedData: scannedData || undefined,
          imageData: imageData || undefined
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const result = response.data as AIVerificationResult;
      setAiVerification(result);
      
      if (result.isGenuine) {
        toast.success("AI Analysis: Drug appears genuine", { duration: 5000 });
      } else {
        toast.warning("AI Analysis: Drug may be suspicious", { duration: 5000 });
      }
    } catch (error) {
      console.error("AI verification error:", error);
      toast.error("AI verification failed. Please try again.");
      setAiVerification({
        isGenuine: false,
        confidence: 0,
        analysis: "Unable to complete AI verification due to an error.",
        riskFactors: ["Verification system error"],
        recommendations: ["Please try again or contact support"]
      });
    } finally {
      setIsAiVerifying(false);
    }
  };

  const handleImageScanFailed = async (imageData: string) => {
    console.log("Image scan failed, sending to AI for analysis");
    await runAIVerification("", imageData);
  };

  const handleReset = () => {
    setVerifiedBatch(null);
    setAiVerification(null);
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
            {verifiedBatch ? "Drug Verified ✓" : aiVerification ? "AI Verification Result" : "Scan or Enter Drug Barcode"}
          </DialogTitle>
        </DialogHeader>
        
        {/* AI Verification Loading State */}
        {isAiVerifying && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Brain className="h-5 w-5" />
              <span>AI is analyzing the drug data...</span>
            </div>
          </div>
        )}

        {/* AI Verification Result */}
        {aiVerification && !isAiVerifying && (
          <div className="flex flex-col space-y-4">
            <Card className={aiVerification.isGenuine ? "border-green-200 bg-green-50/50" : "border-amber-200 bg-amber-50/50"}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex items-center gap-2 ${aiVerification.isGenuine ? 'text-green-700' : 'text-amber-700'}`}>
                    {aiVerification.isGenuine ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : (
                      <ShieldAlert className="h-5 w-5" />
                    )}
                    <span className="font-medium">
                      {aiVerification.isGenuine ? "Likely Genuine" : "Potentially Suspicious"}
                    </span>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    AI Analysis
                  </Badge>
                </div>

                {/* Confidence Score */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-medium">{aiVerification.confidence}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${aiVerification.isGenuine ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: `${aiVerification.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Analysis */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Analysis</p>
                  <p className="text-sm">{aiVerification.analysis}</p>
                </div>

                {/* Risk Factors */}
                {aiVerification.riskFactors.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Risk Factors
                    </p>
                    <ul className="text-sm space-y-1">
                      {aiVerification.riskFactors.map((risk, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-600">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {aiVerification.recommendations.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Recommendations</p>
                    <ul className="text-sm space-y-1">
                      {aiVerification.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary">→</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Badge variant="outline" className="w-fit">
                  <Eye className="h-3 w-3 mr-1" />
                  Monitor Only - Not in Database
                </Badge>
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

        {verifiedBatch && !aiVerification ? (
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
        ) : !aiVerification && !isAiVerifying ? (
          <div className="flex flex-col space-y-4">
            {isScanning ? (
              <>
                <div className="h-[300px]">
                  <BarcodeScanner 
                    onDetected={handleBarcodeDetected} 
                    onScanFailed={handleImageScanFailed}
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
        ) : null}
      </DialogContent>
    </Dialog>
  );
};