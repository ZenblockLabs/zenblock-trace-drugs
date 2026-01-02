import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { ERPBatchDetails } from './ERPBatchDetails';
import { Badge } from '@/components/ui/badge';
import { Package, Brain, ShieldCheck, ShieldAlert, AlertTriangle, Eye, Pill, Hash, MapPin, Calendar, Edit3, Save } from 'lucide-react';
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

interface ManualEntryData {
  drugName: string;
  batchId: string;
  facility: string;
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
  const [isManualEntryMode, setIsManualEntryMode] = useState(false);
  const [manualEntry, setManualEntry] = useState<ManualEntryData>({
    drugName: '',
    batchId: '',
    facility: ''
  });

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
      
      // Check if details were not detected - enable manual entry option
      const hasUndetectedInfo = !result.detectedInfo?.drugName || 
                                !result.detectedInfo?.batchId || 
                                !result.detectedInfo?.facility;
      if (hasUndetectedInfo) {
        // Pre-fill manual entry with any detected values
        setManualEntry({
          drugName: result.detectedInfo?.drugName || '',
          batchId: result.detectedInfo?.batchId || '',
          facility: result.detectedInfo?.facility || ''
        });
      }
      
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
    setIsManualEntryMode(false);
    setManualEntry({ drugName: '', batchId: '', facility: '' });
  };

  const handleSaveManualEntry = () => {
    if (!manualEntry.drugName && !manualEntry.batchId && !manualEntry.facility) {
      toast.error("Please enter at least one field");
      return;
    }

    // Update AI verification with manual data
    setAiVerification(prev => prev ? {
      ...prev,
      detectedInfo: {
        ...prev.detectedInfo,
        drugName: manualEntry.drugName || prev.detectedInfo?.drugName || null,
        batchId: manualEntry.batchId || prev.detectedInfo?.batchId || null,
        facility: manualEntry.facility || prev.detectedInfo?.facility || null,
      }
    } : null);
    
    setIsManualEntryMode(false);
    toast.success("Drug details updated successfully");
  };

  const hasUndetectedInfo = aiVerification && (
    !aiVerification.detectedInfo?.drugName || 
    !aiVerification.detectedInfo?.batchId || 
    !aiVerification.detectedInfo?.facility
  );

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

                  {/* Detected Drug Info Box */}
                  <div className="p-4 bg-background rounded-lg border space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <Pill className="h-3 w-3" />
                        Drug Information
                      </p>
                      {!isManualEntryMode && hasUndetectedInfo && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsManualEntryMode(true)}
                          className="h-7 text-xs"
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          Enter Manually
                        </Button>
                      )}
                    </div>
                    
                    {isManualEntryMode ? (
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="drugName" className="text-xs">Drug Name</Label>
                          <Input
                            id="drugName"
                            value={manualEntry.drugName}
                            onChange={(e) => setManualEntry(prev => ({ ...prev, drugName: e.target.value }))}
                            placeholder="Enter drug name"
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="batchId" className="text-xs">Batch ID</Label>
                          <Input
                            id="batchId"
                            value={manualEntry.batchId}
                            onChange={(e) => setManualEntry(prev => ({ ...prev, batchId: e.target.value }))}
                            placeholder="Enter batch ID"
                            className="h-9 font-mono"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="facility" className="text-xs">Facility</Label>
                          <Input
                            id="facility"
                            value={manualEntry.facility}
                            onChange={(e) => setManualEntry(prev => ({ ...prev, facility: e.target.value }))}
                            placeholder="Enter facility name"
                            className="h-9"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" onClick={handleSaveManualEntry} className="flex-1">
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setIsManualEntryMode(false)} className="flex-1">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Drug Name</p>
                            <p className="font-medium">{aiVerification.detectedInfo?.drugName || "Not detected"}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Batch ID</p>
                            <p className="font-medium font-mono">{aiVerification.detectedInfo?.batchId || "Not detected"}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Facility</p>
                            <p className="font-medium">{aiVerification.detectedInfo?.facility || "Not detected"}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Verified At</p>
                            <p className="font-medium">{format(new Date(), "PPp")}</p>
                          </div>
                        </div>
                      </div>
                    )}
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
