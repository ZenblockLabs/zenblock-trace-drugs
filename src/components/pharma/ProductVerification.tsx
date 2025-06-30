
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle, XCircle, Scan } from 'lucide-react';
import { pharmaTraceabilityService, VerificationResponse } from '@/services/PharmaTraceabilityService';
import { PRODUCT_STATUS } from '@/config/pharmaConfig';
import { toast } from 'sonner';

export function ProductVerification() {
  const [gtin, setGtin] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!gtin || !lotNumber || !serialNumber || !expiryDate) {
      toast.error('All fields are required for verification');
      return;
    }

    setLoading(true);
    try {
      const response = await pharmaTraceabilityService.verifyProduct({
        gtin,
        lotNumber,
        serialNumber,
        expiryDate,
      });
      
      setVerificationResult(response);
      toast.success('Product verification completed');
    } catch (error) {
      toast.error('Failed to verify product');
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScanBarcode = () => {
    // Mock barcode scan - in real implementation this would use camera
    setGtin('00012345678901');
    setLotNumber('LOT001');
    setSerialNumber('SN123456789');
    setExpiryDate('2025-12-31');
    toast.info('Barcode scanned successfully');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case PRODUCT_STATUS.SALEABLE:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case PRODUCT_STATUS.UNDER_EVALUATION:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case PRODUCT_STATUS.UNDER_INVESTIGATION:
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case PRODUCT_STATUS.RECALLED:
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case PRODUCT_STATUS.SALEABLE:
        return 'bg-green-100 text-green-800 border-green-200';
      case PRODUCT_STATUS.UNDER_EVALUATION:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case PRODUCT_STATUS.UNDER_INVESTIGATION:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case PRODUCT_STATUS.RECALLED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Product Verification</h2>
        <p className="text-muted-foreground">
          Verify the authenticity and status of pharmaceutical products
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Identifiers</CardTitle>
          <CardDescription>
            Enter product details or scan barcode to verify
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Manual Entry</h4>
            <Button variant="outline" onClick={handleScanBarcode}>
              <Scan className="mr-2 h-4 w-4" />
              Scan Barcode
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gtin">GTIN *</Label>
              <Input
                id="gtin"
                placeholder="00012345678901"
                value={gtin}
                onChange={(e) => setGtin(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lot">Lot Number *</Label>
              <Input
                id="lot"
                placeholder="LOT001"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serial">Serial Number *</Label>
              <Input
                id="serial"
                placeholder="SN123456789"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date *</Label>
              <Input
                id="expiry"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <Button onClick={handleVerify} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Product'
            )}
          </Button>
        </CardContent>
      </Card>

      {verificationResult && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(verificationResult.status)}
                Verification Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <Badge className={getStatusColor(verificationResult.status)}>
                  {verificationResult.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Product Name</Label>
                  <p className="text-sm text-muted-foreground">{verificationResult.product.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Manufacturer</Label>
                  <p className="text-sm text-muted-foreground">{verificationResult.product.manufacturer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">GTIN</Label>
                  <p className="text-sm text-muted-foreground">{verificationResult.product.gtin}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Lot Number</Label>
                  <p className="text-sm text-muted-foreground">{verificationResult.product.lotNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Serial Number</Label>
                  <p className="text-sm text-muted-foreground">{verificationResult.product.serialNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Expiry Date</Label>
                  <p className="text-sm text-muted-foreground">{verificationResult.product.expiryDate}</p>
                </div>
              </div>

              {verificationResult.alerts && verificationResult.alerts.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Alerts</Label>
                  {verificationResult.alerts.map((alert, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{alert}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Verification completed using Hyperledger Fabric blockchain data. 
              {verificationResult.isValid ? 'Product is authentic.' : 'Product authenticity could not be verified.'}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
