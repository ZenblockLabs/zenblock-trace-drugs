
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ScannedItem {
  sgtin: string;
  timestamp: string;
  status: 'verified' | 'pending' | 'error';
  batchData?: ERPBatchData;
}

interface ERPBatchData {
  batchId: string;
  drugName: string;
  quantity: number;
  createdAt: string;
  facility: string;
}

const parseQRCodeData = (code: string): ERPBatchData | null => {
  try {
    // Try to parse as JSON (QR code format)
    const parsed = JSON.parse(code);
    
    // Map the QR code fields to our interface
    if (parsed['Batch ID'] && parsed['Drug Name']) {
      return {
        batchId: parsed['Batch ID'],
        drugName: parsed['Drug Name'],
        quantity: parsed['Quantity'] || 0,
        createdAt: parsed['Created At'] || new Date().toISOString(),
        facility: parsed['Facility'] || 'Unknown'
      };
    }
    return null;
  } catch {
    // Not a JSON QR code, return null
    return null;
  }
};

const saveERPBatchToDatabase = async (batchData: ERPBatchData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('erp_batches')
      .insert({
        batch_id: batchData.batchId,
        drug_name: batchData.drugName,
        quantity: batchData.quantity,
        facility: batchData.facility,
        original_created_at: batchData.createdAt,
        status: 'scanned'
      });

    if (error) {
      console.error('Error saving ERP batch:', error);
      toast.error(`Failed to save batch: ${error.message}`);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error saving ERP batch:', err);
    toast.error('Failed to save batch to database');
    return false;
  }
};

export const useBatchProcessing = () => {
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);

  const handleDemoScan = () => {
    toast.info("Starting demo batch scan. This will add sample drugs.");
    
    const newItems = [];
    for (let i = 0; i < 5; i++) {
      const fakeSGTIN = `sgtin:0${Math.floor(10000000000000 + Math.random() * 90000000000000)}.${Math.floor(Math.random() * 1000000)}`;
      newItems.push({
        sgtin: fakeSGTIN,
        timestamp: new Date().toISOString(),
        status: Math.random() > 0.2 ? 'verified' : (Math.random() > 0.5 ? 'pending' : 'error') as any
      });
    }
    
    setTimeout(() => {
      setScannedItems((prev) => [...newItems, ...prev]);
      toast.success("Demo scan complete. 5 items processed.");
    }, 2000);
  };

  const handleBarcodeScan = async (code: string) => {
    // Try to parse as ERP batch QR code
    const batchData = parseQRCodeData(code);
    
    if (batchData) {
      // It's an ERP batch QR code - save to database
      toast.info(`Saving batch ${batchData.batchId} to database...`);
      
      const saved = await saveERPBatchToDatabase(batchData);
      
      const newItem: ScannedItem = {
        sgtin: batchData.batchId,
        timestamp: new Date().toISOString(),
        status: saved ? 'verified' : 'error',
        batchData
      };
      
      setScannedItems((prev) => [newItem, ...prev]);
      
      if (saved) {
        toast.success(`Batch ${batchData.batchId} saved successfully!`);
      }
    } else {
      // Regular barcode/SGTIN
      const newItem: ScannedItem = {
        sgtin: code,
        timestamp: new Date().toISOString(),
        status: 'verified'
      };
      
      setScannedItems((prev) => [newItem, ...prev]);
      toast.success(`Barcode scanned: ${code}`);
    }
  };

  const handleVerifyAll = () => {
    toast.info("Verifying all pending items...");
    
    setTimeout(() => {
      setScannedItems(prev => 
        prev.map(item => ({
          ...item,
          status: item.status === 'pending' ? 'verified' : item.status
        }))
      );
      toast.success("Verification complete");
    }, 2000);
  };

  const handleBatchImportComplete = () => {
    const newItems = [];
    for (let i = 0; i < 10; i++) {
      const fakeSGTIN = `sgtin:0${Math.floor(10000000000000 + Math.random() * 90000000000000)}.${Math.floor(Math.random() * 1000000)}`;
      newItems.push({
        sgtin: fakeSGTIN,
        timestamp: new Date().toISOString(),
        status: 'verified' as const
      });
    }
    
    setScannedItems((prev) => [...newItems, ...prev]);
    toast.success("Batch import complete. 10 items added.");
  };

  return {
    isDemoMode,
    setIsDemoMode,
    batchModalOpen,
    setBatchModalOpen,
    scannedItems,
    handleDemoScan,
    handleBarcodeScan,
    handleVerifyAll,
    handleBatchImportComplete
  };
};
