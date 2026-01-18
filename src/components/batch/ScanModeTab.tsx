import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { ERPBatchDetails } from './ERPBatchDetails';
import { Package } from 'lucide-react';

interface ScanModeTabProps {
  isDemoMode: boolean;
  setIsDemoMode: (value: boolean) => void;
  handleDemoScan: () => void;
  handleBarcodeScan: (code: string) => void;
  userRole: string;
}

export const ScanModeTab = ({ 
  isDemoMode, 
  setIsDemoMode, 
  handleDemoScan, 
  handleBarcodeScan, 
  userRole 
}: ScanModeTabProps) => {
  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scan QR Code or Barcode</CardTitle>
          <CardDescription>
            Scan a QR code to view and save batch data, or scan a barcode to enter details manually
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isDemoMode ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This is a demo mode. In a production environment, this would activate your device&apos;s camera to scan actual barcodes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleDemoScan} className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Run Demo Scan
                </Button>
                <Button variant="outline" onClick={() => setIsDemoMode(false)}>
                  Try Real Scanner
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <BarcodeScanner 
                onDetected={handleBarcodeScan} 
              />
              <Button variant="outline" onClick={() => setIsDemoMode(true)}>
                Switch to Demo Mode
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ERPBatchDetails userRole={userRole} />
    </div>
  );
};
