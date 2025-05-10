
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { SgtinInput } from './SgtinInput';
import { QrCode, ScanBarcode, AlertTriangle, Shield } from 'lucide-react';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { useAuth } from '@/context/AuthContext';

interface QRCodeScannerProps {
  onClose?: () => void;
  onScanComplete?: (code: string) => void;
}

export function QRCodeScanner({ onClose, onScanComplete }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [validCode, setValidCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleScanResult = (result: string) => {
    console.log("QR scan result:", result);
    setIsScanning(false);
    setError(null);
    
    try {
      // Check if result is a URL
      let code: string | null = null;
      
      if (result.includes('?code=')) {
        // Extract code from URL parameter
        try {
          const url = new URL(result);
          code = url.searchParams.get('code');
          console.log("Extracted code from URL:", code);
        } catch (e) {
          // If URL parsing fails, try regex
          const match = result.match(/[?&]code=([^&]+)/);
          if (match) {
            code = match[1];
            console.log("Extracted code using regex:", code);
          }
        }
      }
      
      // If no code parameter found, use the entire result as a SGTIN
      if (!code) {
        code = result;
        console.log("Using full result as code:", code);
      }
      
      handleVerification(code);
    } catch (e) {
      console.error("Error processing scan result:", e);
      // If not a URL, try using the entire result as a SGTIN
      handleVerification(result);
    }
  };

  const handleVerification = (code: string) => {
    console.log("Verifying code:", code);
    // First ensure the code is not empty
    if (!code || code.trim() === '') {
      toast.error('Invalid QR code or SGTIN');
      setError('Invalid QR code or SGTIN');
      return;
    }
    
    // Execute the onScanComplete callback if provided
    if (onScanComplete) {
      onScanComplete(code.trim());
      return;
    }

    // Navigate to the tracking page with the code
    navigate(`/track?code=${encodeURIComponent(code.trim())}`);
    
    if (onClose) {
      onClose();
    }
  };
  
  // Display role-specific instructions
  const getRoleSpecificInstructions = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'distributor':
        return (
          <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md text-sm">
            <Shield className="h-4 w-4 inline mr-1" /> Scan to verify authenticity before receiving shipments
          </div>
        );
      case 'dispenser':
        return (
          <div className="mt-2 p-2 bg-green-50 text-green-700 rounded-md text-sm">
            <Shield className="h-4 w-4 inline mr-1" /> Scan to confirm drug history before dispensing
          </div>
        );
      case 'regulator':
        return (
          <div className="mt-2 p-2 bg-purple-50 text-purple-700 rounded-md text-sm">
            <Shield className="h-4 w-4 inline mr-1" /> Scan for full compliance verification and reporting
          </div>
        );
      default:
        return null;
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
                {getRoleSpecificInstructions()}
              </div>
              
              {error && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
              
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
