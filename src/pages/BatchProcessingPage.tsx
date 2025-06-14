import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { BatchImportModal } from '@/components/BatchImportModal';
import { ERPBatchDetails } from '@/components/batch/ERPBatchDetails';
import { toast } from 'sonner';
import { Package, Upload, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';

export const BatchProcessingPage = () => {
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [scannedItems, setScannedItems] = useState<{
    sgtin: string;
    timestamp: string;
    status: 'verified' | 'pending' | 'error';
  }[]>([]);

  // Mock user role - in production this would come from auth context
  const userRole = 'Manufacturer'; // This could be 'Distributor', 'Dispenser', 'Regulator'

  const handleDemoScan = () => {
    // Simulate batch scanning
    toast.info("Starting demo batch scan. This will add sample drugs.");
    
    const newItems = [];
    for (let i = 0; i < 5; i++) {
      const fakeSGTIN = `sgtin:0${Math.floor(10000000000000 + Math.random() * 90000000000000)}.${Math.floor(Math.random() * 1000000)}`;
      newItems.push({
        sgtin: fakeSGTIN,
        timestamp: new Date().toISOString(),
        status: Math.random() > 0.2 ? 'verified' : (Math.random() > 0.5 ? 'pending' : 'error') as any
      });
    }
    
    setTimeout(() => {
      setScannedItems((prev) => [...newItems, ...prev]);
      toast.success("Demo scan complete. 5 items processed.");
    }, 2000);
  };

  const handleBarcodeScan = (code: string) => {
    const newItem = {
      sgtin: code,
      timestamp: new Date().toISOString(),
      status: 'verified' as const
    };
    
    setScannedItems((prev) => [newItem, ...prev]);
  };

  const handleVerifyAll = () => {
    toast.info("Verifying all pending items...");
    
    setTimeout(() => {
      setScannedItems(prev => 
        prev.map(item => ({
          ...item,
          status: item.status === 'pending' ? 'verified' : item.status
        }))
      );
      toast.success("Verification complete");
    }, 2000);
  };

  const handleBatchImportComplete = () => {
    // Simulate adding the batch imported items
    const newItems = [];
    for (let i = 0; i < 10; i++) {
      const fakeSGTIN = `sgtin:0${Math.floor(10000000000000 + Math.random() * 90000000000000)}.${Math.floor(Math.random() * 1000000)}`;
      newItems.push({
        sgtin: fakeSGTIN,
        timestamp: new Date().toISOString(),
        status: 'verified' as const
      });
    }
    
    setScannedItems((prev) => [...newItems, ...prev]);
    toast.success("Batch import complete. 10 items added.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Batch Processing</h1>
        <p className="text-muted-foreground">
          Efficiently process multiple drugs in a single operation
        </p>
      </div>

      <Tabs defaultValue="scan" className="w-full">
        <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
          <TabsTrigger value="scan">Scan Mode</TabsTrigger>
          <TabsTrigger value="batch">Batch Import</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan Individual Barcodes</CardTitle>
              <CardDescription>
                Scan drug barcodes one at a time to verify and process them
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isDemoMode ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This is a demo mode. In a production environment, this would activate your device's camera to scan actual barcodes.
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
                  <BarcodeScanner onDetected={handleBarcodeScan} />
                  <Button variant="outline" onClick={() => setIsDemoMode(true)}>
                    Switch to Demo Mode
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* New ERP Batch Details Section */}
          <ERPBatchDetails userRole={userRole} />
        </TabsContent>
        
        <TabsContent value="batch" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Batch Drug Import</CardTitle>
              <CardDescription>
                Process multiple drugs at once with batch operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center text-center h-40">
                      <Upload className="h-10 w-10 text-muted-foreground/60 mb-4" />
                      <h3 className="text-lg font-medium">Batch Scanning</h3>
                      <p className="text-sm text-muted-foreground mt-2 mb-4">
                        Scan multiple barcodes in sequence
                      </p>
                      <Button onClick={() => setBatchModalOpen(true)}>Start Batch Import</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center text-center h-40">
                      <BarChart3 className="h-10 w-10 text-muted-foreground/60 mb-4" />
                      <h3 className="text-lg font-medium">Analytics</h3>
                      <p className="text-sm text-muted-foreground mt-2 mb-4">
                        Review batch processing statistics
                      </p>
                      <Button variant="outline">View Reports</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Scan Results</CardTitle>
                <CardDescription>
                  {scannedItems.length} items processed in this session
                </CardDescription>
              </div>
              {scannedItems.some(item => item.status === 'pending') && (
                <Button onClick={handleVerifyAll} size="sm">
                  Verify All Pending
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {scannedItems.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-2 text-xs font-medium text-muted-foreground">SGTIN</th>
                        <th className="text-left p-2 text-xs font-medium text-muted-foreground">Timestamp</th>
                        <th className="text-left p-2 text-xs font-medium text-muted-foreground">Status</th>
                        <th className="text-right p-2 text-xs font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {scannedItems.map((item, index) => (
                        <tr key={index} className="text-sm">
                          <td className="p-2 font-mono">{item.sgtin}</td>
                          <td className="p-2">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="p-2">
                            {item.status === 'verified' && (
                              <span className="inline-flex items-center gap-1 text-green-600">
                                <CheckCircle className="h-3 w-3" /> Verified
                              </span>
                            )}
                            {item.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 text-amber-600">
                                Pending
                              </span>
                            )}
                            {item.status === 'error' && (
                              <span className="inline-flex items-center gap-1 text-red-600">
                                Error
                              </span>
                            )}
                          </td>
                          <td className="p-2 text-right">
                            <Button size="sm" variant="ghost" className="h-7 px-2">
                              Details <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground mb-4">No items have been scanned yet</p>
                  <Button variant="outline" onClick={handleDemoScan}>
                    Generate Sample Data
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BatchImportModal 
        open={batchModalOpen} 
        onOpenChange={setBatchModalOpen}
        onImportComplete={handleBatchImportComplete}
      />
    </div>
  );
};
