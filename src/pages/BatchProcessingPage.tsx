
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BatchImportModal } from '@/components/BatchImportModal';
import { BatchProcessingHeader } from '@/components/batch/BatchProcessingHeader';
import { ScanModeTab } from '@/components/batch/ScanModeTab';
import { BatchImportTab } from '@/components/batch/BatchImportTab';
import { ResultsTab } from '@/components/batch/ResultsTab';
import { useBatchProcessing } from '@/hooks/useBatchProcessing';
import { QRScanConfirmDialog } from '@/components/batch/QRScanConfirmDialog';
import { BarcodeDataEntryDialog } from '@/components/batch/BarcodeDataEntryDialog';
import { DuplicateBatchWarningDialog } from '@/components/batch/DuplicateBatchWarningDialog';

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
    handleBatchImportComplete,
    confirmDialogOpen,
    setConfirmDialogOpen,
    pendingBatchData,
    handleConfirmBatchSave,
    handleCancelBatchSave,
    // Barcode entry dialog
    barcodeEntryDialogOpen,
    setBarcodeEntryDialogOpen,
    pendingBarcodeNumber,
    handleBarcodeFormSubmit,
    handleCancelBarcodeEntry,
    // Duplicate warning dialog
    duplicateWarningOpen,
    duplicateBatchId,
    handleCloseDuplicateWarning
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

      {/* QR Code confirmation dialog */}
      <QRScanConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        batchData={pendingBatchData}
        onConfirm={handleConfirmBatchSave}
        onCancel={handleCancelBatchSave}
      />

      {/* Barcode manual entry dialog */}
      <BarcodeDataEntryDialog
        open={barcodeEntryDialogOpen}
        onOpenChange={setBarcodeEntryDialogOpen}
        barcodeNumber={pendingBarcodeNumber}
        onSubmit={handleBarcodeFormSubmit}
        onCancel={handleCancelBarcodeEntry}
      />

      {/* Duplicate batch warning dialog */}
      <DuplicateBatchWarningDialog
        open={duplicateWarningOpen}
        batchId={duplicateBatchId}
        onClose={handleCloseDuplicateWarning}
      />
    </div>
  );
};
