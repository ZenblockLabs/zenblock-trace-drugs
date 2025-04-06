
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getBlockchainService } from '@/services/blockchainServiceFactory';
import { toast } from 'sonner';
import { PackagePlus, Box, FileInput } from 'lucide-react';

interface BatchImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete?: () => void;
}

export const BatchImportModal = ({ open, onOpenChange, onImportComplete }: BatchImportModalProps) => {
  const [importMode, setImportMode] = useState<'scan' | 'manual' | 'csv' | null>(null);
  const [sgtinList, setSgtinList] = useState<string[]>([]);
  const [csvText, setCsvText] = useState('');
  const [manualSgtin, setManualSgtin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBarcodeScan = (code: string) => {
    if (!sgtinList.includes(code)) {
      setSgtinList([...sgtinList, code]);
      toast.success(`Added to batch: ${code}`);
    } else {
      toast.info(`Code already in batch: ${code}`);
    }
  };

  const handleManualAdd = () => {
    if (!manualSgtin.trim()) {
      toast.error("Please enter a valid SGTIN code");
      return;
    }
    
    if (!sgtinList.includes(manualSgtin)) {
      setSgtinList([...sgtinList, manualSgtin]);
      setManualSgtin('');
      toast.success(`Added to batch: ${manualSgtin}`);
    } else {
      toast.info(`Code already in batch: ${manualSgtin}`);
    }
  };

  const handleCsvImport = () => {
    if (!csvText.trim()) {
      toast.error("Please enter CSV data");
      return;
    }

    // Simple CSV parsing for demo purposes
    const lines = csvText.trim().split('\n');
    const newCodes = lines.filter(line => line.trim() !== '');
    
    const uniqueCodes = newCodes.filter(code => !sgtinList.includes(code));
    if (uniqueCodes.length > 0) {
      setSgtinList([...sgtinList, ...uniqueCodes]);
      toast.success(`Added ${uniqueCodes.length} new codes to batch`);
      setCsvText('');
    } else {
      toast.info("No new codes found in CSV");
    }
  };

  const removeSgtin = (code: string) => {
    setSgtinList(sgtinList.filter(item => item !== code));
  };

  const handleImportBatch = async () => {
    if (sgtinList.length === 0) {
      toast.error("Batch is empty. Add at least one SGTIN code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const service = await getBlockchainService();
      
      // Simulate batch verification request
      // In a real implementation, this would query the blockchain for all SGTINs
      toast.info(`Verifying ${sgtinList.length} drugs...`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll assume all codes are valid
      toast.success(`Successfully verified ${sgtinList.length} drugs`);
      
      if (onImportComplete) {
        onImportComplete();
      }
      
      setSgtinList([]);
      setImportMode(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Batch import error:", error);
      toast.error("Failed to process batch. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setImportMode(null);
    setSgtinList([]);
    setCsvText('');
    setManualSgtin('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Batch Drug Import</DialogTitle>
          <DialogDescription>
            Import multiple drugs at once by scanning barcodes or uploading a CSV file.
          </DialogDescription>
        </DialogHeader>

        {importMode === null ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <Button 
              onClick={() => setImportMode('scan')} 
              variant="outline" 
              className="flex flex-col h-32 items-center justify-center gap-2"
            >
              <PackagePlus className="h-10 w-10" />
              <span>Scan Barcodes</span>
            </Button>
            <Button 
              onClick={() => setImportMode('manual')} 
              variant="outline" 
              className="flex flex-col h-32 items-center justify-center gap-2"
            >
              <Box className="h-10 w-10" />
              <span>Manual Entry</span>
            </Button>
            <Button 
              onClick={() => setImportMode('csv')} 
              variant="outline" 
              className="flex flex-col h-32 items-center justify-center gap-2"
            >
              <FileInput className="h-10 w-10" />
              <span>CSV Import</span>
            </Button>
          </div>
        ) : (
          <>
            {importMode === 'scan' && (
              <div className="py-4">
                <BarcodeScanner onDetected={handleBarcodeScan} />
              </div>
            )}
            
            {importMode === 'manual' && (
              <div className="flex gap-2 py-4">
                <Input
                  placeholder="Enter SGTIN (e.g., sgtin:01234567890123.123456)"
                  value={manualSgtin}
                  onChange={(e) => setManualSgtin(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleManualAdd}>Add</Button>
              </div>
            )}
            
            {importMode === 'csv' && (
              <div className="py-4 space-y-4">
                <Textarea
                  placeholder="Enter one SGTIN per line"
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="h-32"
                />
                <Button onClick={handleCsvImport}>Parse CSV</Button>
              </div>
            )}
            
            <div className="py-2">
              <h3 className="text-sm font-medium mb-2">Batch Contents ({sgtinList.length} items)</h3>
              <div className="max-h-40 overflow-y-auto border rounded-md">
                {sgtinList.length > 0 ? (
                  <ul className="divide-y">
                    {sgtinList.map((code, index) => (
                      <li key={index} className="flex justify-between items-center p-2 text-sm">
                        <span className="font-mono">{code}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeSgtin(code)}
                          className="h-6 px-2"
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-center py-4 text-sm">
                    No items added to batch yet
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
              <div className="space-x-2">
                <Button 
                  variant="secondary" 
                  onClick={() => setImportMode(null)}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleImportBatch} 
                  disabled={sgtinList.length === 0 || isSubmitting}
                >
                  Process Batch
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
