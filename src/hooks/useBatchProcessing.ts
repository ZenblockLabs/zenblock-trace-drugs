
import { useState } from 'react';
import { toast } from 'sonner';

interface ScannedItem {
  sgtin: string;
  timestamp: string;
  status: 'verified' | 'pending' | 'error';
}

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

  const handleBarcodeScan = (code: string) => {
    const newItem = {
      sgtin: code,
      timestamp: new Date().toISOString(),
      status: 'verified' as const
    };
    
    setScannedItems((prev) => [newItem, ...prev]);
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
