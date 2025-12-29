import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Package, Building2, Hash, Calendar } from "lucide-react";
import { ERPBatchData } from "@/hooks/useBatchProcessing";

interface QRScanConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batchData: ERPBatchData | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function QRScanConfirmDialog({
  open,
  onOpenChange,
  batchData,
  onConfirm,
  onCancel,
}: QRScanConfirmDialogProps) {
  if (!batchData) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            QR Code Scanned Successfully
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                The following batch data was detected. Click Update to save it to the database.
              </p>
              
              <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    Batch ID
                  </span>
                  <Badge variant="outline">{batchData.batchId}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Drug Name
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {batchData.drugName}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quantity</span>
                  <span className="text-sm font-semibold text-foreground">
                    {batchData.quantity.toLocaleString()} units
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Facility
                  </span>
                  <span className="text-sm text-foreground">
                    {batchData.facility}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Created At
                  </span>
                  <span className="text-sm text-foreground">
                    {formatDate(batchData.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Update</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
