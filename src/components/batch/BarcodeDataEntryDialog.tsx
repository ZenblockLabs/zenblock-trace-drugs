import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { Barcode } from 'lucide-react';

export interface BarcodeFormData {
  barcodeNumber: string;
  batchId: string;
  drugName: string;
  quantity: number;
  status: string;
  createdAt: string;
  facility: string;
}

interface BarcodeDataEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barcodeNumber: string;
  onSubmit: (data: BarcodeFormData) => void;
  onCancel: () => void;
}

export const BarcodeDataEntryDialog = ({
  open,
  onOpenChange,
  barcodeNumber,
  onSubmit,
  onCancel,
}: BarcodeDataEntryDialogProps) => {
  const [formData, setFormData] = useState<BarcodeFormData>({
    barcodeNumber: '',
    batchId: '',
    drugName: '',
    quantity: 0,
    status: 'scanned',
    createdAt: new Date().toISOString().split('T')[0],
    facility: '',
  });

  useEffect(() => {
    if (barcodeNumber) {
      setFormData(prev => ({
        ...prev,
        barcodeNumber,
        batchId: `BATCH-${barcodeNumber.slice(-6)}`,
      }));
    }
  }, [barcodeNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Barcode className="h-5 w-5 text-primary" />
            Barcode Detected
          </DialogTitle>
          <DialogDescription>
            A barcode was scanned. Please enter the batch details manually.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="barcodeNumber">Barcode Number</Label>
            <Input
              id="barcodeNumber"
              value={formData.barcodeNumber}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batchId">Batch ID *</Label>
              <Input
                id="batchId"
                value={formData.batchId}
                onChange={(e) => setFormData(prev => ({ ...prev, batchId: e.target.value }))}
                placeholder="Enter batch ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="drugName">Drug Name *</Label>
              <Input
                id="drugName"
                value={formData.drugName}
                onChange={(e) => setFormData(prev => ({ ...prev, drugName: e.target.value }))}
                placeholder="Enter drug name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                placeholder="Enter quantity"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scanned">Scanned</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="createdAt">Created Date *</Label>
              <Input
                id="createdAt"
                type="date"
                value={formData.createdAt}
                onChange={(e) => setFormData(prev => ({ ...prev, createdAt: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facility">Facility *</Label>
              <Input
                id="facility"
                value={formData.facility}
                onChange={(e) => setFormData(prev => ({ ...prev, facility: e.target.value }))}
                placeholder="Enter facility name"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Save Batch
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
