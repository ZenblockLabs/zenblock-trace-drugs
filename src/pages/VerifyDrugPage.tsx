
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBlockchainService } from '@/services/blockchainServiceFactory';
import { Drug } from '@/services/mockBlockchainService';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { ScanBarcode, ShieldCheck, ShieldX, AlertTriangle } from 'lucide-react';

export const VerifyDrugPage = () => {
  const [sgtin, setSgtin] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  
  const { data: drug, isLoading, error, refetch } = useQuery<Drug | null>({
    queryKey: ['verify-drug', sgtin],
    queryFn: async () => {
      if (!sgtin) return null;
      
      try {
        const service = await getBlockchainService();
        return await service.getDrugBySGTIN(sgtin);
      } catch (err) {
        console.error('Error verifying drug:', err);
        toast({
          title: 'Verification Failed',
          description: 'Could not verify this product. Please try again.',
          variant: 'destructive',
        });
        return null;
      }
    },
    enabled: false, // Don't run query automatically
    retry: 1,
  });

  const handleVerify = async () => {
    if (!sgtin.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please enter a valid SGTIN code to verify.',
        variant: 'destructive',
      });
      return;
    }
    
    setHasSearched(true);
    refetch();
  };

  const handleScanCode = () => {
    // In a real app, this would trigger a camera/scanner
    // For demo, we'll simulate by using a sample code
    const sampleCode = "sgtin:01234567890123.123456";
    setSgtin(sampleCode);
    toast({
      title: 'Code Scanned',
      description: `Scanned code: ${sampleCode}`,
    });
  };

  const isRecalled = drug?.status === 'recalled';

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Verify Drug Authenticity</h1>
      
      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Enter SGTIN code (e.g., sgtin:01234567890123.123456)"
            value={sgtin}
            onChange={(e) => setSgtin(e.target.value)}
            className="w-full"
          />
        </div>
        <Button onClick={handleVerify} disabled={isLoading}>
          Verify
        </Button>
        <Button 
          variant="outline" 
          onClick={handleScanCode}
          className="flex items-center gap-2"
        >
          <ScanBarcode className="h-4 w-4" />
          Scan
        </Button>
      </div>

      {isLoading && (
        <Card className="border-muted-foreground/20">
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 animate-pulse rounded-full bg-muted"></div>
            </div>
            <p className="text-center mt-4">Verifying product...</p>
          </CardContent>
        </Card>
      )}

      {hasSearched && !isLoading && (
        <>
          {drug ? (
            <Card className={cn("border-2", isRecalled ? "border-red-400" : "border-green-400")}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {isRecalled ? (
                      <>
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                        Recalled Product
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-6 w-6 text-green-600" />
                        Verified Product
                      </>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {isRecalled 
                      ? "This product has been recalled and should not be used."
                      : "This product appears to be legitimate according to blockchain records"
                    }
                  </CardDescription>
                </div>
                <StatusBadge status={drug.status} size="lg" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm text-muted-foreground">Product Name</h3>
                    <p className="font-medium">{drug.productName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">SGTIN</h3>
                    <p className="font-medium">{drug.sgtin}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Manufacturer</h3>
                    <p className="font-medium">{drug.manufacturerName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Batch Number</h3>
                    <p className="font-medium">{drug.batchNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Current Owner</h3>
                    <p className="font-medium">{drug.currentOwnerName} ({drug.currentOwnerRole})</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Expiry Date</h3>
                    <p className="font-medium">{drug.expiryDate}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className={cn("text-sm", 
                isRecalled ? "bg-red-50/80" : "bg-green-50/80"
              )}>
                {isRecalled 
                  ? "This product has been recalled. Please contact the manufacturer for more information."
                  : "This verification was performed using blockchain technology to ensure product authenticity."
                }
              </CardFooter>
            </Card>
          ) : (
            <Card className="border-destructive/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <ShieldX className="h-6 w-6 text-destructive" />
                  Unverified Product
                </CardTitle>
                <CardDescription>
                  This product could not be verified in our blockchain records
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p>
                  The SGTIN code <span className="font-mono">{sgtin}</span> was not found in the blockchain ledger.
                  This may indicate:
                </p>
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>The product may be counterfeit</li>
                  <li>The code may have been entered incorrectly</li>
                  <li>The product may not yet be registered in the system</li>
                </ul>
              </CardContent>
              <CardFooter className="bg-destructive/5 text-sm">
                If you believe this is an error, please contact the manufacturer for verification.
              </CardFooter>
            </Card>
          )}
        </>
      )}

      <div className="mt-8 bg-muted/30 p-4 rounded-lg">
        <h2 className="text-lg font-medium mb-2">How Drug Verification Works</h2>
        <p className="text-sm text-muted-foreground">
          Our system uses blockchain technology to verify the authenticity and traceability of pharmaceutical products.
          Each legitimate product has a unique SGTIN (Serialized Global Trade Item Number) that is recorded on the blockchain
          at the time of manufacture and tracked through the entire supply chain.
        </p>
      </div>
    </div>
  );
};

// Helper functions
function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}
