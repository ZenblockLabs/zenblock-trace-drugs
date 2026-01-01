import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { ERPBatchDetails } from './ERPBatchDetails';
import { Badge } from '@/components/ui/badge';
import { Package, Brain, ShieldCheck, ShieldAlert, AlertTriangle, Eye, Pill, Hash, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface AIVerificationResult {
  isGenuine: boolean;
  confidence: number;
  analysis: string;
  riskFactors: string[];
  recommendations: string[];
  detectedInfo?: {
    drugName?: string | null;
    batchId?: string | null;
    facility?: string | null;
    expiryDate?: string | null;
  };
}

interface ScanModeTabProps {
  isDemoMode: boolean;
  setIsDemoMode: (value: boolean) => void;
  handleDemoScan: () => void;
  handleBarcodeScan: (code: string) => void;
  userRole: string;
}

export const ScanModeTab = ({ 
  isDemoMode, 
  setIsDemoMode, 
  handleDemoScan, 
  handleBarcodeScan, 
  userRole 
}: ScanModeTabProps) => {
  const [aiVerification, setAiVerification] = useState<AIVerificationResult | null>(null);
  const [isAiVerifying, setIsAiVerifying] = useState(false);

  const runAIVerification = async (scannedData: string, imageData?: string) => {
    setIsAiVerifying(true);
    
    try {
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

  const handleResetAiVerification = () => {
    setAiVerification(null);
  };

  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scan Individual Barcodes</CardTitle>
          <CardDescription>
            Scan drug barcodes one at a time to verify and process them
          </CardDescription>
        </CardHeader>
        <CardContent>
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
            <div className="space-y-4">
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

                  {/* Detected Drug Info */}
                  {(aiVerification.detectedInfo?.drugName || aiVerification.detectedInfo?.batchId || aiVerification.detectedInfo?.facility || aiVerification.detectedInfo?.expiryDate) && (
                    <div className="space-y-2 p-3 bg-background/50 rounded-lg border">
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <Pill className="h-3 w-3" />
                        Detected Drug Information
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {aiVerification.detectedInfo?.drugName && (
                          <div>
                            <p className="text-xs text-muted-foreground">Drug Name</p>
                            <p className="font-medium">{aiVerification.detectedInfo.drugName}</p>
                          </div>
                        )}
                        {aiVerification.detectedInfo?.batchId && (
                          <div>
                            <p className="text-xs text-muted-foreground">Batch ID</p>
                            <p className="font-medium font-mono">{aiVerification.detectedInfo.batchId}</p>
                          </div>
                        )}
                        {aiVerification.detectedInfo?.facility && (
                          <div>
                            <p className="text-xs text-muted-foreground">Facility</p>
                            <p className="font-medium">{aiVerification.detectedInfo.facility}</p>
                          </div>
                        )}
                        {aiVerification.detectedInfo?.expiryDate && (
                          <div>
                            <p className="text-xs text-muted-foreground">Expiry Date</p>
                            <p className="font-medium">{aiVerification.detectedInfo.expiryDate}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Verified at: {format(new Date(), "PPp")}
                      </div>
                    </div>
                  )}

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
              
              <Button variant="outline" onClick={handleResetAiVerification} className="w-full">
                Scan Another
              </Button>
            </div>
          )}

          {/* Scanner UI - only show when not in AI verification state */}
          {!aiVerification && !isAiVerifying && (
            <>
              {isDemoMode ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This is a demo mode. In a production environment, this would activate your device&apos;s camera to scan actual barcodes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleDemoScan} className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Run Demo Scan
                    </Button>
                    <Button variant="outline" onClick={() => setIsDemoMode(false)}>
                      Try Real Scanner
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <BarcodeScanner 
                    onDetected={handleBarcodeScan} 
                    onScanFailed={handleImageScanFailed}
                  />
                  <Button variant="outline" onClick={() => setIsDemoMode(true)}>
                    Switch to Demo Mode
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ERPBatchDetails userRole={userRole} />
    </div>
  );
};
