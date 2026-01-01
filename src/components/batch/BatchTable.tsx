
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CloudUpload, Trash2 } from 'lucide-react';
import { BatchStatusBadge } from './BatchStatusBadge';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  onDeleteBatches?: (batchIds: string[]) => Promise<void>;
  highlightedBatchId?: string | null;
}

export const BatchTable = ({ batches, onSyncBatch, isBatchSyncing, onDeleteBatches, highlightedBatchId }: BatchTableProps) => {
  const [selectedBatchIds, setSelectedBatchIds] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Clear selection when batches change (e.g., after delete)
  useEffect(() => {
    setSelectedBatchIds(prev => {
      const currentBatchIds = new Set(batches.map(b => b.batchId));
      const newSelected = new Set<string>();
      prev.forEach(id => {
        if (currentBatchIds.has(id)) {
          newSelected.add(id);
        }
      });
      return newSelected;
    });
  }, [batches]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBatchIds(new Set(batches.map(b => b.batchId)));
    } else {
      setSelectedBatchIds(new Set());
    }
  };

  const handleSelectRow = (batchId: string, checked: boolean) => {
    setSelectedBatchIds(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(batchId);
      } else {
        newSet.delete(batchId);
      }
      return newSet;
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!onDeleteBatches) return;
    
    setIsDeleting(true);
    try {
      await onDeleteBatches(Array.from(selectedBatchIds));
      setSelectedBatchIds(new Set());
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const selectedBatches = batches.filter(b => selectedBatchIds.has(b.batchId));
  const allSelected = batches.length > 0 && selectedBatchIds.size === batches.length;
  const someSelected = selectedBatchIds.size > 0 && selectedBatchIds.size < batches.length;

  if (batches.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No batch data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Delete button - shows when rows are selected */}
      {selectedBatchIds.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-fade-in">
          <span className="text-sm font-medium">
            {selectedBatchIds.size} batch{selectedBatchIds.size > 1 ? 'es' : ''} selected
          </span>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteClick}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  ref={(ref) => {
                    if (ref) {
                      (ref as any).indeterminate = someSelected;
                    }
                  }}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
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
                  highlightedBatchId === batch.batchId && "animate-row-highlight",
                  selectedBatchIds.has(batch.batchId) && "bg-muted/50"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedBatchIds.has(batch.batchId)}
                    onCheckedChange={(checked) => handleSelectRow(batch.batchId, checked as boolean)}
                    aria-label={`Select ${batch.batchId}`}
                  />
                </TableCell>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedBatches.length} Batch{selectedBatches.length > 1 ? 'es' : ''}?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>Are you sure you want to delete the following batch{selectedBatches.length > 1 ? 'es' : ''}? This action cannot be undone.</p>
                <div className="max-h-40 overflow-y-auto border rounded-md p-2 bg-muted/30">
                  {selectedBatches.map(batch => (
                    <div key={batch.batchId} className="flex items-center justify-between py-1.5 border-b last:border-0">
                      <span className="font-mono text-sm">{batch.batchId}</span>
                      <span className="text-sm text-muted-foreground">{batch.drugName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
