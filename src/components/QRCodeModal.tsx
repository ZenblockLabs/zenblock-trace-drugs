
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";

interface QRCodeModalProps {
  drugId: string;
  sgtin: string;
  productName: string;
}

export function QRCodeModal({ drugId, sgtin, productName }: QRCodeModalProps) {
  const [open, setOpen] = useState(false);
  
  // Use window.location to determine the base URL for tracking
  // In production, this would be a fixed domain
  const getTrackingBaseUrl = () => {
    const { protocol, host } = window.location;
    return `${protocol}//${host}/track`;
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <QrCode className="h-4 w-4" />
          Generate QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Drug Traceability QR Code</DialogTitle>
          <DialogDescription>
            Generate a QR code that links to the public traceability page for {productName}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <QRCodeGenerator 
            drugCode={sgtin} 
            trackingBaseUrl={getTrackingBaseUrl()} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
