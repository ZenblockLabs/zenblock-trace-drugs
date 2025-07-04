
import { useState } from 'react';
import { getBlockchainService } from '@/services/blockchainServiceFactory';
import { toast } from 'sonner';

export const useERPBlockchainSync = () => {
  const [syncingBatches, setSyncingBatches] = useState<Set<string>>(new Set());

  const syncBatchToBlockchain = async (batchId: string, batchData: any) => {
    setSyncingBatches(prev => new Set(prev).add(batchId));
    
    try {
      console.log(`Syncing batch ${batchId} to blockchain...`, batchData);
      
      const blockchainService = await getBlockchainService();
      
      // Create a blockchain event directly for the batch
      await blockchainService.createEvent({
        drugId: batchData.drugName.replace(/\s+/g, '-').toLowerCase(),
        eventType: 'manufactured',
        actorId: 'erp-system',
        actorName: 'ERP System',
        actorRole: 'manufacturer',
        location: batchData.facility || 'Manufacturing Facility',
        details: {
          batchId: batchData.batchId,
          drugName: batchData.drugName,
          quantity: batchData.quantity,
          status: batchData.status,
          createdAt: batchData.createdAt,
          facility: batchData.facility,
          syncedFromERP: true,
          syncTimestamp: new Date().toISOString()
        }
      });
      
      toast.success(`Batch ${batchId} synced to blockchain successfully`);
      return true;
    } catch (error) {
      console.error('Error syncing batch to blockchain:', error);
      toast.error(`Failed to sync batch ${batchId}: ${error.message}`);
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
