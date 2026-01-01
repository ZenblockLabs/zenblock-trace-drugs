import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Building2, Hash, Calendar, Pencil } from "lucide-react";
import { ERPBatchData } from "@/hooks/useBatchProcessing";

interface QRScanConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batchData: ERPBatchData | null;
  onConfirm: (editedData?: ERPBatchData) => void;
  onCancel: () => void;
}

export function QRScanConfirmDialog({
  open,
  onOpenChange,
  batchData,
  onConfirm,
  onCancel,
}: QRScanConfirmDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ERPBatchData | null>(null);

  // Reset state when dialog opens with new data
  useEffect(() => {
    if (batchData) {
      setEditedData({ ...batchData });
      setIsEditing(false);
    }
  }, [batchData]);

  if (!batchData || !editedData) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const handleConfirm = () => {
    onConfirm(isEditing ? editedData : undefined);
  };

  const handleInputChange = (field: keyof ERPBatchData, value: string | number) => {
    setEditedData(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              QR Code Scanned Successfully
            </AlertDialogTitle>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-1"
            >
              <Pencil className="h-3 w-3" />
              {isEditing ? "Editing" : "Edit"}
            </Button>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                {isEditing 
                  ? "Edit the batch data below, then click Update to save."
                  : "The following batch data was detected. Click Update to save it to the database."}
              </p>
              
              <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                {/* Batch ID */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    Batch ID
                  </span>
                  {isEditing ? (
                    <Input
                      value={editedData.batchId}
                      onChange={(e) => handleInputChange('batchId', e.target.value)}
                      className="w-40 h-8 text-sm"
                    />
                  ) : (
                    <Badge variant="outline">{editedData.batchId}</Badge>
                  )}
                </div>
                
                {/* Drug Name */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Drug Name
                  </span>
                  {isEditing ? (
                    <Input
                      value={editedData.drugName}
                      onChange={(e) => handleInputChange('drugName', e.target.value)}
                      className="w-40 h-8 text-sm"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-foreground">
                      {editedData.drugName}
                    </span>
                  )}
                </div>
                
                {/* Quantity */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quantity</span>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedData.quantity}
                      onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                      className="w-40 h-8 text-sm"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-foreground">
                      {editedData.quantity.toLocaleString()} units
                    </span>
                  )}
                </div>
                
                {/* Facility */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Facility
                  </span>
                  {isEditing ? (
                    <Input
                      value={editedData.facility}
                      onChange={(e) => handleInputChange('facility', e.target.value)}
                      className="w-40 h-8 text-sm"
                    />
                  ) : (
                    <span className="text-sm text-foreground">
                      {editedData.facility}
                    </span>
                  )}
                </div>
                
                {/* Created At */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Created At
                  </span>
                  {isEditing ? (
                    <Input
                      type="datetime-local"
                      value={editedData.createdAt.slice(0, 16)}
                      onChange={(e) => handleInputChange('createdAt', e.target.value)}
                      className="w-40 h-8 text-sm"
                    />
                  ) : (
                    <span className="text-sm text-foreground">
                      {formatDate(editedData.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Update</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}