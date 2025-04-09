
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface RecallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drug: {
    id: string;
    sgtin: string;
    productName: string;
    batchNumber: string;
  };
  onSuccess: () => void;
}

export function RecallModal({ open, onOpenChange, drug, onSuccess }: RecallModalProps) {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for the recall",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const service = await getBlockchainService();
      
      const initiator = {
        id: user?.id || "system",
        name: user?.name || "System",
        role: user?.role || "system",
        organization: user?.organization || user?.name || "System"
      };

      const success = await service.initiateRecall(drug.sgtin, reason, initiator);

      if (success) {
        toast({
          title: "Recall Initiated",
          description: "The product has been successfully recalled",
        });
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error("Failed to initiate recall");
      }
    } catch (error) {
      console.error("Error initiating recall:", error);
      toast({
        title: "Error",
        description: "Failed to initiate recall. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" /> 
            Initiate Product Recall
          </DialogTitle>
          <DialogDescription>
            You are about to recall product: {drug.productName} (Batch: {drug.batchNumber})
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Recall Reason</p>
            <Textarea
              placeholder="Enter the reason for recalling this product..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="rounded-md bg-destructive/10 p-3">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-destructive">Attention</h3>
                <div className="mt-2 text-sm text-destructive/90">
                  <p>
                    This action will mark the product as recalled in the blockchain ledger. 
                    All supply chain participants will be notified, and the product will 
                    no longer be eligible for distribution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex gap-2 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleSubmit}
            disabled={isSubmitting || !reason.trim()}
          >
            {isSubmitting ? "Processing..." : "Confirm Recall"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
