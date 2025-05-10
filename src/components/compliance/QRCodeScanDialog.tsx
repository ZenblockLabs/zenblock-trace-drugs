
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScanBarcode } from "lucide-react";
import { QRCodeScanner } from "./QRCodeScanner";
import { useAuth } from "@/context/AuthContext";

interface QRCodeScanDialogProps {
  className?: string;
  size?: "default" | "sm";
  variant?: "default" | "outline" | "secondary";
  onScanComplete?: (code: string) => void;
}

export function QRCodeScanDialog({ 
  className = "", 
  size = "default",
  variant = "default",
  onScanComplete
}: QRCodeScanDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  
  // Customize button text based on user role
  const getButtonText = () => {
    if (user?.role === 'manufacturer') {
      return "Generate QR Code";
    } else if (user?.role === 'regulator') {
      return "Verify Drug";
    } else {
      return "Scan QR Code";
    }
  };

  const handleScanComplete = (code: string) => {
    if (onScanComplete) {
      onScanComplete(code);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <ScanBarcode className="h-4 w-4 mr-1" />
          {getButtonText()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Drug</DialogTitle>
          <DialogDescription>
            Scan a QR code or enter a SGTIN to verify a drug's authenticity
          </DialogDescription>
        </DialogHeader>
        <QRCodeScanner onClose={() => setOpen(false)} onScanComplete={handleScanComplete} />
      </DialogContent>
    </Dialog>
  );
}
