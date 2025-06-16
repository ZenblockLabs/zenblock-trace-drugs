
import { useState } from 'react';
import { erpBlockchainIntegration } from '@/services/integration/ERPBlockchainIntegration';
import { toast } from 'sonner';

export const useERPBlockchainSync = () => {
  const [syncingBatches, setSyncingBatches] = useState<Set<string>>(new Set());

  const syncBatchToBlockchain = async (batchId: string, batchData: any) => {
    setSyncingBatches(prev => new Set(prev).add(batchId));
    
    try {
      // Create a mock order from batch data to sync
      const mockOrder = {
        id: `order-${batchId}`,
        customerName: 'ERP System',
        items: [{
          drugId: batchData.drugName.replace(/\s+/g, '-').toLowerCase(),
          drugName: batchData.drugName,
          quantity: batchData.quantity,
          batchId: batchData.batchId,
          unitPrice: 0
        }],
        status: 'processing' as const,
        totalAmount: 0
      };

      // Sync to blockchain via integration service
      const success = await erpBlockchainIntegration.syncOrderToBlockchain(mockOrder.id);
      
      if (success) {
        toast.success(`Batch ${batchId} synced to blockchain successfully`);
        return true;
      } else {
        toast.error(`Failed to sync batch ${batchId} to blockchain`);
        return false;
      }
    } catch (error) {
      console.error('Error syncing batch to blockchain:', error);
      toast.error(`Error syncing batch ${batchId}: ${error.message}`);
      return false;
    } finally {
      setSyncingBatches(prev => {
        const newSet = new Set(prev);
        newSet.delete(batchId);
        return newSet;
      });
    }
  };

  const syncAllBatchesToBlockchain = async (batches: any[]) => {
    const results = await Promise.allSettled(
      batches.map(batch => syncBatchToBlockchain(batch.batchId, batch))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
    const failed = results.length - successful;
    
    if (successful > 0) {
      toast.success(`${successful} batches synced successfully`);
    }
    if (failed > 0) {
      toast.error(`${failed} batches failed to sync`);
    }
  };

  const isBatchSyncing = (batchId: string) => syncingBatches.has(batchId);

  return {
    syncBatchToBlockchain,
    syncAllBatchesToBlockchain,
    isBatchSyncing,
    syncingBatches
  };
};
