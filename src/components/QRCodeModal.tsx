
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
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuth } from "@/context/AuthContext";

interface QRCodeModalProps {
  drugId: string;
  sgtin: string;
  productName: string;
}

export function QRCodeModal({ drugId, sgtin, productName }: QRCodeModalProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { user } = useAuth();
  
  // Use window.location to determine the base URL for tracking
  // In production, this would be a fixed domain
  const getTrackingBaseUrl = () => {
    return "https://trace.zenblocklabs.com/track";
  };
  
  // Determine if this is a manufacturer viewing their own product
  // Manufacturers get additional options for QR codes
  const isManufacturer = user?.role === 'manufacturer';
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <QrCode className="h-4 w-4" />
          {isManufacturer ? "Generate QR Code" : "View Drug QR Code"}
        </Button>
      </DialogTrigger>
      <DialogContent className={isMobile ? "w-[90vw] max-w-md" : "sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle>Drug Traceability QR Code</DialogTitle>
          <DialogDescription>
            {isManufacturer ? (
              <>
                Generate a QR code that links to the public traceability page for {productName}.
                You can download, print, or share this QR code to attach to drug packaging.
              </>
            ) : (
              <>
                This QR code links to the public traceability page for {productName}.
                Anyone can scan this QR code to verify the authenticity and track the journey of this drug.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <QRCodeGenerator 
            drugCode={sgtin} 
            trackingBaseUrl={getTrackingBaseUrl()} 
            productName={productName}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
