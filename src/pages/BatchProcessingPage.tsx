
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BatchImportModal } from '@/components/BatchImportModal';
import { BatchProcessingHeader } from '@/components/batch/BatchProcessingHeader';
import { ScanModeTab } from '@/components/batch/ScanModeTab';
import { BatchImportTab } from '@/components/batch/BatchImportTab';
import { ResultsTab } from '@/components/batch/ResultsTab';
import { useBatchProcessing } from '@/hooks/useBatchProcessing';

export const BatchProcessingPage = () => {
  const {
    isDemoMode,
    setIsDemoMode,
    batchModalOpen,
    setBatchModalOpen,
    scannedItems,
    handleDemoScan,
    handleBarcodeScan,
    handleVerifyAll,
    handleBatchImportComplete
  } = useBatchProcessing();

  // Mock user role - in production this would come from auth context
  const userRole = 'Manufacturer'; // This could be 'Distributor', 'Dispenser', 'Regulator'

  return (
    <div className="space-y-6">
      <BatchProcessingHeader />

      <Tabs defaultValue="scan" className="w-full">
        <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
          <TabsTrigger value="scan">Scan Mode</TabsTrigger>
          <TabsTrigger value="batch">Batch Import</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan">
          <ScanModeTab
            isDemoMode={isDemoMode}
            setIsDemoMode={setIsDemoMode}
            handleDemoScan={handleDemoScan}
            handleBarcodeScan={handleBarcodeScan}
            userRole={userRole}
          />
        </TabsContent>
        
        <TabsContent value="batch">
          <BatchImportTab setBatchModalOpen={setBatchModalOpen} />
        </TabsContent>
        
        <TabsContent value="results">
          <ResultsTab
            scannedItems={scannedItems}
            handleVerifyAll={handleVerifyAll}
            handleDemoScan={handleDemoScan}
          />
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
