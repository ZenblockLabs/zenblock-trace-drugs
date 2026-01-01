import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ScannedItem {
  sgtin: string;
  timestamp: string;
  status: 'verified' | 'pending' | 'error';
}

interface ScannedItemDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ScannedItem | null;
}

export const ScannedItemDetailsDialog = ({
  open,
  onOpenChange,
  item,
}: ScannedItemDetailsDialogProps) => {
  if (!item) return null;

  const getStatusIcon = () => {
    switch (item.status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (item.status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Scanned Item Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">SGTIN / Batch ID</p>
              <p className="font-mono font-medium">{item.sgtin}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="mt-1">{getStatusBadge()}</div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Scanned At</p>
            <p className="font-medium">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Scan Date</p>
            <p className="font-medium">
              {new Date(item.timestamp).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
