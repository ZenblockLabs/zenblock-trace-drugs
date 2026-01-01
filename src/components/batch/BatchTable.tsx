
import { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, CloudUpload } from 'lucide-react';
import { BatchStatusBadge } from './BatchStatusBadge';
import { cn } from '@/lib/utils';

interface ERPBatch {
  batchId: string;
  drugName: string;
  quantity: number;
  status: string;
  createdAt: string;
  facility: string;
}

interface BatchTableProps {
  batches: ERPBatch[];
  onSyncBatch: (batch: ERPBatch) => void;
  isBatchSyncing: (batchId: string) => boolean;
}

export const BatchTable = ({ batches, onSyncBatch, isBatchSyncing }: BatchTableProps) => {
  const [highlightedBatchIds, setHighlightedBatchIds] = useState<Set<string>>(new Set());
  const prevBatchIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentBatchIds = new Set(batches.map(b => b.batchId));
    const prevBatchIds = prevBatchIdsRef.current;
    
    // Find newly added or updated batches
    const newOrUpdatedIds = new Set<string>();
    batches.forEach(batch => {
      if (!prevBatchIds.has(batch.batchId)) {
        newOrUpdatedIds.add(batch.batchId);
      }
    });

    if (newOrUpdatedIds.size > 0) {
      setHighlightedBatchIds(newOrUpdatedIds);
      
      // Remove highlight after animation completes
      const timer = setTimeout(() => {
        setHighlightedBatchIds(new Set());
      }, 1500);
      
      return () => clearTimeout(timer);
    }
    
    prevBatchIdsRef.current = currentBatchIds;
  }, [batches]);

  if (batches.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No batch data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch ID</TableHead>
            <TableHead>Drug Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Facility</TableHead>
            <TableHead className="text-center">Blockchain Sync</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch) => (
            <TableRow 
              key={batch.batchId}
              className={cn(
                "transition-colors duration-1000",
                highlightedBatchIds.has(batch.batchId) && "animate-row-highlight"
              )}
            >
              <TableCell className="font-mono text-sm">{batch.batchId}</TableCell>
              <TableCell className="font-medium">{batch.drugName}</TableCell>
              <TableCell>{batch.quantity.toLocaleString()}</TableCell>
              <TableCell>
                <BatchStatusBadge status={batch.status} />
              </TableCell>
              <TableCell>{new Date(batch.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{batch.facility}</TableCell>
              <TableCell className="text-center">
                <Button
                  onClick={() => onSyncBatch(batch)}
                  disabled={isBatchSyncing(batch.batchId)}
                  size="sm"
                  variant="outline"
                  className="h-7 px-2"
                >
                  {isBatchSyncing(batch.batchId) ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <CloudUpload className="h-3 w-3" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
