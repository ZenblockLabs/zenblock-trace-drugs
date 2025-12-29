
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ScannedItem {
  sgtin: string;
  timestamp: string;
  status: 'verified' | 'pending' | 'error';
  batchData?: ERPBatchData;
}

export interface ERPBatchData {
  batchId: string;
  drugName: string;
  quantity: number;
  createdAt: string;
  facility: string;
}

const parseQRCodeData = (code: string): ERPBatchData | null => {
  try {
    const parsed = JSON.parse(code);
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
  
  // State for QR confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingBatchData, setPendingBatchData] = useState<ERPBatchData | null>(null);

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
      // Show confirmation dialog instead of saving directly
      setPendingBatchData(batchData);
      setConfirmDialogOpen(true);
      return;
    }
    
    // Regular barcode/SGTIN - save directly
    const newItem: ScannedItem = {
      sgtin: code,
      timestamp: new Date().toISOString(),
      status: 'verified'
    };
    
    setScannedItems((prev) => [newItem, ...prev]);
    toast.success(`Barcode scanned: ${code}`);
  };

  const handleConfirmBatchSave = async () => {
    if (!pendingBatchData) return;

    toast.info(`Saving batch ${pendingBatchData.batchId} to database...`);
    
    const saved = await saveERPBatchToDatabase(pendingBatchData);
    
    const newItem: ScannedItem = {
      sgtin: pendingBatchData.batchId,
      timestamp: new Date().toISOString(),
      status: saved ? 'verified' : 'error',
      batchData: pendingBatchData
    };
    
    setScannedItems((prev) => [newItem, ...prev]);
    
    if (saved) {
      toast.success(`Batch ${pendingBatchData.batchId} saved successfully!`);
    }
    
    setConfirmDialogOpen(false);
    setPendingBatchData(null);
  };

  const handleCancelBatchSave = () => {
    setConfirmDialogOpen(false);
    setPendingBatchData(null);
    toast.info('Batch save cancelled');
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
    handleBatchImportComplete,
    // Dialog state and handlers
    confirmDialogOpen,
    setConfirmDialogOpen,
    pendingBatchData,
    handleConfirmBatchSave,
    handleCancelBatchSave
  };
};
