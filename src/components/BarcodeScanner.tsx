
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
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30 absolute inset-0 p-4">
            {cameraError ? (
              <p className="text-destructive text-sm p-4 text-center">{cameraError}</p>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-4">
                  {/* Sample QR Code indicator */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-16 h-16 border-2 border-dashed border-muted-foreground/40 rounded-lg flex items-center justify-center bg-background/50">
                      <svg viewBox="0 0 100 100" className="w-12 h-12 text-muted-foreground/60">
                        <rect x="10" y="10" width="25" height="25" fill="currentColor"/>
                        <rect x="65" y="10" width="25" height="25" fill="currentColor"/>
                        <rect x="10" y="65" width="25" height="25" fill="currentColor"/>
                        <rect x="15" y="15" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="3"/>
                        <rect x="70" y="15" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="3"/>
                        <rect x="15" y="70" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="3"/>
                        <rect x="45" y="10" width="10" height="10" fill="currentColor"/>
                        <rect x="45" y="45" width="10" height="10" fill="currentColor"/>
                        <rect x="65" y="45" width="10" height="10" fill="currentColor"/>
                        <rect x="80" y="65" width="10" height="10" fill="currentColor"/>
                        <rect x="65" y="80" width="10" height="10" fill="currentColor"/>
                      </svg>
                    </div>
                    <span className="text-xs text-muted-foreground">QR Code</span>
                  </div>
                  
                  {/* Sample Barcode indicator */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-20 h-16 border-2 border-dashed border-muted-foreground/40 rounded-lg flex items-center justify-center bg-background/50 px-2">
                      <svg viewBox="0 0 120 60" className="w-full h-10 text-muted-foreground/60">
                        <rect x="5" y="5" width="3" height="50" fill="currentColor"/>
                        <rect x="12" y="5" width="2" height="50" fill="currentColor"/>
                        <rect x="18" y="5" width="4" height="50" fill="currentColor"/>
                        <rect x="26" y="5" width="2" height="50" fill="currentColor"/>
                        <rect x="32" y="5" width="3" height="50" fill="currentColor"/>
                        <rect x="40" y="5" width="2" height="50" fill="currentColor"/>
                        <rect x="46" y="5" width="4" height="50" fill="currentColor"/>
                        <rect x="54" y="5" width="2" height="50" fill="currentColor"/>
                        <rect x="60" y="5" width="3" height="50" fill="currentColor"/>
                        <rect x="68" y="5" width="2" height="50" fill="currentColor"/>
                        <rect x="74" y="5" width="4" height="50" fill="currentColor"/>
                        <rect x="82" y="5" width="2" height="50" fill="currentColor"/>
                        <rect x="88" y="5" width="3" height="50" fill="currentColor"/>
                        <rect x="96" y="5" width="2" height="50" fill="currentColor"/>
                        <rect x="102" y="5" width="4" height="50" fill="currentColor"/>
                        <rect x="110" y="5" width="3" height="50" fill="currentColor"/>
                      </svg>
                    </div>
                    <span className="text-xs text-muted-foreground">Barcode</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Position your QR code or barcode here
                </p>
                <Scan className="h-8 w-8 text-muted-foreground/40 animate-pulse" />
              </div>
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
