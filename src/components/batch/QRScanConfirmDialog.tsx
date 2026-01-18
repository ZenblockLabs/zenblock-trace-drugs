import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Package, Building2, Hash, Calendar, Edit3, Save, X } from "lucide-react";
import { ERPBatchData } from "@/hooks/useBatchProcessing";
import { useState, useEffect } from "react";

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState<ERPBatchData | null>(null);

  useEffect(() => {
    if (batchData) {
      setEditedData({ ...batchData });
      setIsEditMode(false);
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

  const handleSave = () => {
    onConfirm(editedData);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditedData({ ...batchData });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            QR Code Scanned Successfully
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Edit the batch data below and save to upload." 
              : "Review the detected batch data. You can edit before saving."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isEditMode ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batchId">Batch ID</Label>
                <Input
                  id="batchId"
                  value={editedData.batchId}
                  onChange={(e) => setEditedData(prev => prev ? { ...prev, batchId: e.target.value } : prev)}
                  placeholder="Enter batch ID"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="drugName">Drug Name</Label>
                <Input
                  id="drugName"
                  value={editedData.drugName}
                  onChange={(e) => setEditedData(prev => prev ? { ...prev, drugName: e.target.value } : prev)}
                  placeholder="Enter drug name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={editedData.quantity}
                  onChange={(e) => setEditedData(prev => prev ? { ...prev, quantity: parseInt(e.target.value) || 0 } : prev)}
                  placeholder="Enter quantity"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facility">Facility</Label>
                <Input
                  id="facility"
                  value={editedData.facility}
                  onChange={(e) => setEditedData(prev => prev ? { ...prev, facility: e.target.value } : prev)}
                  placeholder="Enter facility"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="createdAt">Created Date</Label>
                <Input
                  id="createdAt"
                  type="date"
                  value={editedData.createdAt.split('T')[0]}
                  onChange={(e) => setEditedData(prev => prev ? { ...prev, createdAt: e.target.value } : prev)}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              {/* Batch ID */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  Batch ID
                </span>
                <Badge variant="outline">{editedData.batchId}</Badge>
              </div>
              
              {/* Drug Name */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Drug Name
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {editedData.drugName}
                </span>
              </div>
              
              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Quantity</span>
                <span className="text-sm font-semibold text-foreground">
                  {editedData.quantity.toLocaleString()} units
                </span>
              </div>
              
              {/* Facility */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Facility
                </span>
                <span className="text-sm text-foreground">
                  {editedData.facility}
                </span>
              </div>
              
              {/* Created At */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Created At
                </span>
                <span className="text-sm text-foreground">
                  {formatDate(editedData.createdAt)}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {isEditMode ? (
            <>
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Save & Upload
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="button" variant="secondary" onClick={() => setIsEditMode(true)}>
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button onClick={() => onConfirm(editedData)}>
                <Save className="h-4 w-4 mr-1" />
                Upload
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
