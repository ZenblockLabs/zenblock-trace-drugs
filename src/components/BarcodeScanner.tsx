import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera, StopCircle, Upload, Scan } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
  onClose?: () => void;
}

export const BarcodeScanner = ({ onDetected, onClose }: BarcodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScannerRunningRef = useRef(false);
  const isProcessingRef = useRef(false); // Prevent duplicate scans
  const containerRef = useRef<HTMLDivElement>(null);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current && isScannerRunningRef.current) {
      try {
        await scannerRef.current.stop();
        isScannerRunningRef.current = false;
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
    setIsScanning(false);
  }, []);

  const handleDetection = useCallback((decodedText: string) => {
    // Prevent duplicate processing
    if (isProcessingRef.current) {
      console.log("Already processing a scan, ignoring duplicate");
      return;
    }
    
    isProcessingRef.current = true;
    console.log("QR/Barcode detected:", decodedText);
    toast.success("Code detected!");
    
    // Stop scanner first, then trigger callback
    stopScanner().then(() => {
      // Small delay to ensure state is updated before triggering callback
      setTimeout(() => {
        onDetected(decodedText);
        // Reset processing flag after a delay to allow new scans
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 1000);
      }, 100);
    });
  }, [onDetected, stopScanner]);

  const startScanner = async () => {
    try {
      setCameraError(null);
      isProcessingRef.current = false; // Reset processing flag

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        handleDetection,
        (errorMessage) => {
          // Ignore scanning errors - they happen frequently while scanning
        },
      );

      isScannerRunningRef.current = true;
      setIsScanning(true);
      toast.info("Camera active. Position QR code or barcode in the frame.");
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError("Unable to access camera. Please check permissions or try uploading an image instead.");
      toast.error("Camera access denied. Please check permissions.");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Prevent duplicate processing
    if (isProcessingRef.current) {
      toast.info("Please wait, processing previous scan...");
      return;
    }

    try {
      isProcessingRef.current = true;
      
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      const decodedText = await scannerRef.current.scanFile(file, true);
      console.log("QR/Barcode from file:", decodedText);
      toast.success("Code detected from image!");
      
      // Small delay to ensure state is ready
      setTimeout(() => {
        onDetected(decodedText);
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 1000);
      }, 100);
    } catch (error) {
      console.error("Error scanning file:", error);
      toast.error("Could not detect code in the image. Please try again.");
      isProcessingRef.current = false;
    }
    
    // Reset the file input
    event.target.value = '';
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current && isScannerRunningRef.current) {
        scannerRef.current.stop().catch(() => {});
        isScannerRunningRef.current = false;
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
          style={{ display: isScanning ? "block" : "none" }}
        />
        {!isScanning && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30 absolute inset-0 p-6">
            {cameraError ? (
              <p className="text-destructive text-sm p-4 text-center">{cameraError}</p>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
                <div className="flex items-center justify-center gap-8 flex-wrap">
                  {/* Sample QR Code indicator */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 border-2 border-dashed border-muted-foreground/50 rounded-xl flex items-center justify-center bg-background/60 shadow-sm">
                      <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 text-muted-foreground/70">
                        <rect x="5" y="5" width="30" height="30" fill="currentColor" />
                        <rect x="65" y="5" width="30" height="30" fill="currentColor" />
                        <rect x="5" y="65" width="30" height="30" fill="currentColor" />
                        <rect x="10" y="10" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="70" y="10" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="10" y="70" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="17" y="17" width="6" height="6" fill="currentColor" />
                        <rect x="77" y="17" width="6" height="6" fill="currentColor" />
                        <rect x="17" y="77" width="6" height="6" fill="currentColor" />
                        <rect x="42" y="5" width="8" height="8" fill="currentColor" />
                        <rect x="55" y="5" width="5" height="5" fill="currentColor" />
                        <rect x="42" y="42" width="16" height="16" fill="currentColor" />
                        <rect x="65" y="42" width="8" height="8" fill="currentColor" />
                        <rect x="80" y="42" width="8" height="8" fill="currentColor" />
                        <rect x="42" y="65" width="8" height="8" fill="currentColor" />
                        <rect x="55" y="75" width="8" height="8" fill="currentColor" />
                        <rect x="80" y="65" width="15" height="8" fill="currentColor" />
                        <rect x="65" y="80" width="8" height="15" fill="currentColor" />
                        <rect x="80" y="85" width="10" height="10" fill="currentColor" />
                      </svg>
                    </div>
                    {/* <span className="text-sm font-medium text-muted-foreground">QR Code</span> */}
                  </div>

                  {/* Sample Barcode indicator */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-36 h-28 sm:w-44 sm:h-32 border-2 border-dashed border-muted-foreground/50 rounded-xl flex items-center justify-center bg-background/60 shadow-sm px-3">
                      <svg viewBox="0 0 140 70" className="w-full h-16 sm:h-20 text-muted-foreground/70">
                        <rect x="5" y="5" width="4" height="55" fill="currentColor" />
                        <rect x="12" y="5" width="2" height="55" fill="currentColor" />
                        <rect x="18" y="5" width="5" height="55" fill="currentColor" />
                        <rect x="26" y="5" width="3" height="55" fill="currentColor" />
                        <rect x="33" y="5" width="4" height="55" fill="currentColor" />
                        <rect x="40" y="5" width="2" height="55" fill="currentColor" />
                        <rect x="46" y="5" width="6" height="55" fill="currentColor" />
                        <rect x="55" y="5" width="2" height="55" fill="currentColor" />
                        <rect x="60" y="5" width="4" height="55" fill="currentColor" />
                        <rect x="68" y="5" width="3" height="55" fill="currentColor" />
                        <rect x="75" y="5" width="5" height="55" fill="currentColor" />
                        <rect x="84" y="5" width="2" height="55" fill="currentColor" />
                        <rect x="90" y="5" width="4" height="55" fill="currentColor" />
                        <rect x="98" y="5" width="3" height="55" fill="currentColor" />
                        <rect x="105" y="5" width="6" height="55" fill="currentColor" />
                        <rect x="115" y="5" width="2" height="55" fill="currentColor" />
                        <rect x="121" y="5" width="4" height="55" fill="currentColor" />
                        <rect x="129" y="5" width="6" height="55" fill="currentColor" />
                      </svg>
                    </div>
                    {/* <span className="text-sm font-medium text-muted-foreground">Barcode</span> */}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 mt-2">
                  {/* <p className="text-sm text-muted-foreground text-center font-medium">
                    Position your QR code or barcode in the frame
                  </p> */}
                  <Scan className="h-6 w-6 text-primary/60 animate-pulse" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 w-full">
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
          <input type="file" accept="image/*" id="barcode-upload" className="sr-only" onChange={handleFileUpload} />
          <Button
            variant="outline"
            onClick={() => document.getElementById("barcode-upload")?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Image
          </Button>
        </div>

        {onClose && (
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
