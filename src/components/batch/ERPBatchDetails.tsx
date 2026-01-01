
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useERPBlockchainSync } from '@/hooks/useERPBlockchainSync';
import { useERPBatchData } from '@/hooks/useERPBatchData';
import { ERPBatchHeader } from './ERPBatchHeader';
import { BatchTable } from './BatchTable';

interface ERPBatchDetailsProps {
  userRole: string;
}

export const ERPBatchDetails = ({ userRole }: ERPBatchDetailsProps) => {
  const { batches, loading, error, fetchERPBatches, deleteBatches, highlightedBatchId } = useERPBatchData(userRole);
  const { 
    syncBatchToBlockchain, 
    syncAllBatchesToBlockchain, 
    isBatchSyncing 
  } = useERPBlockchainSync();

  const handleSyncBatch = async (batch: any) => {
    await syncBatchToBlockchain(batch.batchId, batch);
  };

  const handleSyncAllBatches = async () => {
    await syncAllBatchesToBlockchain(batches);
  };

  const handleDeleteBatches = async (batchIds: string[]) => {
    await deleteBatches(batchIds);
  };

  return (
    <Card>
      <ERPBatchHeader
        userRole={userRole}
        loading={loading}
        batchCount={batches.length}
        onRefresh={fetchERPBatches}
        onSyncAll={handleSyncAllBatches}
      />
      <CardContent>
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading ERP batch data...</span>
          </div>
        ) : (
          <BatchTable
            batches={batches}
            onSyncBatch={handleSyncBatch}
            isBatchSyncing={isBatchSyncing}
            onDeleteBatches={handleDeleteBatches}
            highlightedBatchId={highlightedBatchId}
          />
        )}
      </CardContent>
    </Card>
  );
};
