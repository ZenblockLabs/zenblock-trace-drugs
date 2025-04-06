
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Camera, StopCircle, Upload, Scan } from 'lucide-react';

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
  onClose?: () => void;
}

export const BarcodeScanner = ({ onDetected, onClose }: BarcodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startScanner = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        toast.info("Camera active. Position barcode in the frame.");
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Unable to access camera. Please check permissions or try uploading an image instead.');
      toast.error("Camera access denied. Please check permissions.");
    }
  };

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate barcode detection from file
    // In a real implementation, you would use a barcode detection library
    setTimeout(() => {
      // Generate a fake SGTIN for demo purposes
      const fakeSGTIN = `sgtin:0${Math.floor(10000000000000 + Math.random() * 90000000000000)}.${Math.floor(Math.random() * 1000000)}`;
      toast.success(`Barcode detected: ${fakeSGTIN}`);
      onDetected(fakeSGTIN);
    }, 1500);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  // This effect would handle the actual barcode scanning logic
  // In a real implementation, you'd use a library like zbar.wasm or QuaggaJS
  useEffect(() => {
    if (!isScanning) return;

    let animationFrameId: number;
    let scanInterval: NodeJS.Timeout;

    const scanBarcode = () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;
      
      // Match canvas dimensions to video
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      // Draw current video frame to canvas
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // In a real implementation, you would now analyze the canvas data
      // to detect barcodes using a library
      
      // For demo purposes, we'll simulate periodic detection
      animationFrameId = requestAnimationFrame(scanBarcode);
    };

    animationFrameId = requestAnimationFrame(scanBarcode);
    
    // Simulate detecting a barcode after a few seconds
    scanInterval = setTimeout(() => {
      // Generate a fake SGTIN for demo purposes
      const fakeSGTIN = `sgtin:0${Math.floor(10000000000000 + Math.random() * 90000000000000)}.${Math.floor(Math.random() * 1000000)}`;
      toast.success(`Barcode detected: ${fakeSGTIN}`);
      onDetected(fakeSGTIN);
      stopScanner();
    }, 5000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(scanInterval);
    };
  }, [isScanning, onDetected]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md aspect-video bg-black mb-4 rounded-lg overflow-hidden">
        {isScanning ? (
          <>
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover"
              playsInline
            />
            <canvas 
              ref={canvasRef} 
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />
            <div className="absolute inset-0 border-2 border-primary/50 rounded m-8 pointer-events-none"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/30">
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
            Scan Barcode
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
