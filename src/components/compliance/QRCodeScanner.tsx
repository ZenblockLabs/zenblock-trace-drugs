
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { SgtinInput } from './SgtinInput';
import { QrCode, ScanBarcode } from 'lucide-react';
import { BarcodeScanner } from '@/components/BarcodeScanner';

interface QRCodeScannerProps {
  onClose?: () => void;
}

export function QRCodeScanner({ onClose }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [validCode, setValidCode] = useState(false);
  const navigate = useNavigate();

  const handleScanResult = (result: string) => {
    setIsScanning(false);
    
    try {
      // Check if result is a URL
      const url = new URL(result);
      
      // Extract the code parameter from the URL
      const code = url.searchParams.get('code');
      
      if (code) {
        handleVerification(code);
      } else {
        // If no code parameter found, try using the entire result as a SGTIN
        handleVerification(result);
      }
    } catch (e) {
      // If not a URL, try using the entire result as a SGTIN
      handleVerification(result);
    }
  };

  const handleVerification = (code: string) => {
    // First ensure the code is not empty
    if (!code || code.trim() === '') {
      toast.error('Invalid QR code or SGTIN');
      return;
    }

    // Navigate to the tracking page with the code
    navigate(`/track?code=${encodeURIComponent(code.trim())}`);
    
    if (onClose) {
      onClose();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      {isScanning ? (
        <>
          <div className="p-2 relative h-[300px]">
            <BarcodeScanner onDetected={handleScanResult} />
            <Button 
              variant="secondary" 
              size="sm"
              className="absolute bottom-4 right-4" 
              onClick={() => setIsScanning(false)}
            >
              Cancel
            </Button>
          </div>
          <CardFooter className="flex justify-center py-4 text-center text-sm text-muted-foreground">
            Position the QR code within the frame to scan
          </CardFooter>
        </>
      ) : (
        <>
          <CardContent className="pt-6 pb-4">
            <div className="space-y-6">
              <div className="text-center">
                <QrCode className="h-10 w-10 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold text-lg">Scan Drug QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Scan a drug QR code to verify its authenticity and track its journey
                </p>
              </div>
              
              <Button 
                variant="default" 
                className="w-full" 
                onClick={() => setIsScanning(true)}
              >
                <ScanBarcode className="mr-2 h-5 w-5" />
                Scan QR Code
              </Button>
              
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-3 text-sm text-gray-500">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Enter SGTIN manually</p>
                <SgtinInput
                  value={manualCode}
                  onChange={setManualCode}
                  onValid={setValidCode}
                />
                
                <Button 
                  className="w-full mt-2" 
                  disabled={!validCode}
                  onClick={() => handleVerification(manualCode)}
                >
                  Verify
                </Button>
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
