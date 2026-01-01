
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { BarcodeFormData } from '@/components/batch/BarcodeDataEntryDialog';
import { triggerERPBatchRefresh } from '@/hooks/useERPBatchData';

interface ScannedItem {
  sgtin: string;
  timestamp: string;
  status: 'verified' | 'pending' | 'error';
  batchData?: ERPBatchData;
  scanType?: 'qr' | 'barcode';
}

export interface ERPBatchData {
  batchId: string;
  drugName: string;
  quantity: number;
  createdAt: string;
  facility: string;
}

// Detect if scanned code is QR (JSON) or barcode (plain number/text)
const detectCodeType = (code: string): 'qr' | 'barcode' => {
  try {
    const parsed = JSON.parse(code);
    // If it parses as JSON and has expected fields, it's a QR code
    if (parsed && typeof parsed === 'object' && (parsed['Batch ID'] || parsed['Drug Name'] || parsed.batchId)) {
      return 'qr';
    }
    return 'barcode';
  } catch {
    // If it doesn't parse as JSON, it's a barcode
    return 'barcode';
  }
};

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

// Check if batch already exists in database
const checkBatchExists = async (batchId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('erp_batches')
    .select('batch_id')
    .eq('batch_id', batchId)
    .maybeSingle();
  
  if (error) {
    console.error('Error checking batch existence:', error);
    return false;
  }
  
  return data !== null;
};

const saveERPBatchToDatabase = async (batchData: ERPBatchData): Promise<{ success: boolean; isDuplicate: boolean }> => {
  try {
    // Check for duplicate first
    const exists = await checkBatchExists(batchData.batchId);
    if (exists) {
      return { success: false, isDuplicate: true };
    }

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
      return { success: false, isDuplicate: false };
    }
    
    return { success: true, isDuplicate: false };
  } catch (err) {
    console.error('Error saving ERP batch:', err);
    toast.error('Failed to save batch to database');
    return { success: false, isDuplicate: false };
  }
};

export const useBatchProcessing = () => {
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  
  // State for QR confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingBatchData, setPendingBatchData] = useState<ERPBatchData | null>(null);

  // State for barcode manual entry dialog
  const [barcodeEntryDialogOpen, setBarcodeEntryDialogOpen] = useState(false);
  const [pendingBarcodeNumber, setPendingBarcodeNumber] = useState<string>('');

  // State for duplicate warning dialog
  const [duplicateWarningOpen, setDuplicateWarningOpen] = useState(false);
  const [duplicateBatchId, setDuplicateBatchId] = useState<string>('');

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
    const codeType = detectCodeType(code);
    
    if (codeType === 'qr') {
      // QR Code detected - has all data, show confirmation dialog
      const batchData = parseQRCodeData(code);
      
      if (batchData) {
        toast.success('QR Code detected with complete data!');
        setPendingBatchData(batchData);
        setConfirmDialogOpen(true);
        return;
      }
    }
    
    // Barcode detected - show manual entry form
    toast.info('Barcode detected. Please enter batch details.');
    setPendingBarcodeNumber(code);
    setBarcodeEntryDialogOpen(true);
  };

  const handleBarcodeFormSubmit = async (formData: BarcodeFormData) => {
    const batchData: ERPBatchData = {
      batchId: formData.batchId,
      drugName: formData.drugName,
      quantity: formData.quantity,
      createdAt: formData.createdAt,
      facility: formData.facility,
    };

    toast.info(`Saving batch ${batchData.batchId} to database...`);
    
    const result = await saveERPBatchToDatabase(batchData);
    
    if (result.isDuplicate) {
      setDuplicateBatchId(batchData.batchId);
      setDuplicateWarningOpen(true);
      setBarcodeEntryDialogOpen(false);
      setPendingBarcodeNumber('');
      return;
    }
    
    const newItem: ScannedItem = {
      sgtin: formData.barcodeNumber,
      timestamp: new Date().toISOString(),
      status: result.success ? 'verified' : 'error',
      batchData: batchData,
      scanType: 'barcode'
    };
    
    setScannedItems((prev) => [newItem, ...prev]);
    
    if (result.success) {
      toast.success(`Batch ${batchData.batchId} saved successfully!`);
      // Trigger refresh of ERP batch table with the specific batch ID
      triggerERPBatchRefresh(batchData.batchId);
    }
    
    setBarcodeEntryDialogOpen(false);
    setPendingBarcodeNumber('');
  };

  const handleCancelBarcodeEntry = () => {
    setBarcodeEntryDialogOpen(false);
    setPendingBarcodeNumber('');
    toast.info('Barcode entry cancelled');
  };

  const handleConfirmBatchSave = async (editedData?: ERPBatchData) => {
    const dataToSave = editedData || pendingBatchData;
    if (!dataToSave) return;
    
    const result = await saveERPBatchToDatabase(dataToSave);
    
    if (result.isDuplicate) {
      setDuplicateBatchId(dataToSave.batchId);
      setDuplicateWarningOpen(true);
      setConfirmDialogOpen(false);
      setPendingBatchData(null);
      return;
    }
    
    const newItem: ScannedItem = {
      sgtin: dataToSave.batchId,
      timestamp: new Date().toISOString(),
      status: result.success ? 'verified' : 'error',
      batchData: dataToSave,
      scanType: 'qr'
    };
    
    setScannedItems((prev) => [newItem, ...prev]);
    
    if (result.success) {
      toast.success(`Batch ${dataToSave.batchId} saved successfully!`);
      // Trigger refresh of ERP batch table with the specific batch ID
      triggerERPBatchRefresh(dataToSave.batchId);
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

  const handleCloseDuplicateWarning = () => {
    setDuplicateWarningOpen(false);
    setDuplicateBatchId('');
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
    // QR Dialog state and handlers
    confirmDialogOpen,
    setConfirmDialogOpen,
    pendingBatchData,
    handleConfirmBatchSave,
    handleCancelBatchSave,
    // Barcode entry dialog state and handlers
    barcodeEntryDialogOpen,
    setBarcodeEntryDialogOpen,
    pendingBarcodeNumber,
    handleBarcodeFormSubmit,
    handleCancelBarcodeEntry,
    // Duplicate warning dialog state
    duplicateWarningOpen,
    duplicateBatchId,
    handleCloseDuplicateWarning
  };
};
