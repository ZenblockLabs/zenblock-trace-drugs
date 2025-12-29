
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Camera, StopCircle, Upload, Scan } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
  onClose?: () => void;
}

export const BarcodeScanner = ({ onDetected, onClose }: BarcodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanner = async () => {
    try {
      setCameraError(null);
      
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          console.log("QR Code detected:", decodedText);
          toast.success("QR Code detected!");
          onDetected(decodedText);
          stopScanner();
        },
        (errorMessage) => {
          // Ignore scanning errors - they happen frequently while scanning
        }
      );
      
      setIsScanning(true);
      toast.info("Camera active. Position QR code in the frame.");
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Unable to access camera. Please check permissions or try uploading an image instead.');
      toast.error("Camera access denied. Please check permissions.");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
    setIsScanning(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }
      
      const decodedText = await scannerRef.current.scanFile(file, true);
      console.log("QR Code from file:", decodedText);
      toast.success("QR Code detected from image!");
      onDetected(decodedText);
    } catch (error) {
      console.error('Error scanning file:', error);
      toast.error("Could not detect QR code in the image. Please try again.");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md aspect-video bg-black mb-4 rounded-lg overflow-hidden">
        <div 
          id="qr-reader" 
          ref={containerRef}
          className="w-full h-full"
          style={{ display: isScanning ? 'block' : 'none' }}
        />
        {!isScanning && (
          <div className="w-full h-full flex items-center justify-center bg-muted/30 absolute inset-0">
            {cameraError ? (
              <p className="text-destructive text-sm p-4 text-center">{cameraError}</p>
            ) : (
              <Scan className="h-16 w-16 text-muted-foreground/50" />
            )}
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center w-full">
        {!isScanning ? (
          <Button onClick={startScanner} className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Scan QR Code
          </Button>
        ) : (
          <Button variant="destructive" onClick={stopScanner} className="flex items-center gap-2">
            <StopCircle className="h-4 w-4" />
            Stop Scanning
          </Button>
        )}
        
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            id="barcode-upload"
            className="sr-only"
            onChange={handleFileUpload}
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('barcode-upload')?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Image
          </Button>
        </div>
        
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
