
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { Textarea } from "@/components/ui/textarea";
import { QrCode } from "lucide-react";
import { toast } from "sonner";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
import { useNavigate } from "react-router-dom";

export const BarcodeVerificationDialog = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [barcodeResult, setBarcodeResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
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
            <>
              <div className="h-[300px]">
                <BarcodeScanner onDetected={handleBarcodeDetected} />
              </div>
              <Button 
                variant="secondary" 
                onClick={() => setIsScanning(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsScanning(true)}>
              <QrCode className="h-4 w-4 mr-2" /> Scan Barcode
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
  );
};
