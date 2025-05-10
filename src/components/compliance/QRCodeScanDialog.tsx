
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

interface QRCodeScanDialogProps {
  className?: string;
  size?: "default" | "sm";
  variant?: "default" | "outline" | "secondary";
}

export function QRCodeScanDialog({ 
  className = "", 
  size = "default",
  variant = "default"
}: QRCodeScanDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <ScanBarcode className="h-4 w-4 mr-1" />
          Scan QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Drug</DialogTitle>
          <DialogDescription>
            Scan a QR code or enter a SGTIN to verify a drug's authenticity
          </DialogDescription>
        </DialogHeader>
        <QRCodeScanner onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
