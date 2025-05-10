
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { NetworkStatusIndicator } from "@/components/NetworkStatusIndicator";
import { Button } from "@/components/ui/button";
import { ScanBarcode, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { QRCodeScanDialog } from "@/components/compliance/QRCodeScanDialog";

export const Layout = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [barcodeResult, setBarcodeResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const canScanBarcodes = user?.role === 'manufacturer' || 
                          user?.role === 'distributor' || 
                          user?.role === 'dispenser';

  const handleBarcodeDetected = (barcode: string) => {
    setBarcodeResult(barcode);
    setIsScanning(false);
  };

  const handleManualEntry = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBarcodeResult(e.target.value);
  };

  const handleVerifyBarcode = async () => {
    if (!barcodeResult) {
      toast.error("Please scan or enter a barcode");
      return;
    }

    setIsLoading(true);
    
    try {
      const service = await getBlockchainService();
      const drug = await service.getDrugBySGTIN(barcodeResult);
      
      if (drug) {
        toast.success("Drug verified successfully");
        navigate(`/drugs/${drug.id}`);
      } else {
        toast.error("Drug not found or invalid barcode");
      }
    } catch (error) {
      console.error("Error verifying drug:", error);
      toast.error("Failed to verify drug. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4 bg-muted/20 rounded-lg p-2">
            <div className="flex items-center">
              {canScanBarcodes && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mr-2"
                    onClick={() => navigate('/batch-processing')}
                  >
                    <ScanBarcode className="h-4 w-4 mr-1" />
                    Batch Scan
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        <QrCode className="h-4 w-4 mr-1" />
                        Verify Drug
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Scan or Enter Drug Barcode</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col space-y-4">
                        {isScanning ? (
                          <div className="h-[300px] relative">
                            <BarcodeScanner onDetected={handleBarcodeDetected} />
                            <Button 
                              variant="secondary" 
                              className="absolute bottom-4 right-4"
                              onClick={() => setIsScanning(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button onClick={() => setIsScanning(true)}>
                            <ScanBarcode className="h-4 w-4 mr-2" /> Scan Barcode
                          </Button>
                        )}
                        
                        <div className="text-center">or</div>
                        
                        <Textarea
                          placeholder="Enter SGTIN manually"
                          value={barcodeResult}
                          onChange={handleManualEntry}
                          className="min-h-[80px]"
                        />
                        
                        <Button 
                          onClick={handleVerifyBarcode}
                          disabled={isLoading || !barcodeResult}
                        >
                          {isLoading ? "Verifying..." : "Verify"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              {/* Add QR Code scanner for all users */}
              <QRCodeScanDialog variant="outline" size="sm" className="ml-2" />
            </div>
            <NetworkStatusIndicator />
          </div>
          <Outlet />
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};
