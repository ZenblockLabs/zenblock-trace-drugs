
import { Button } from "@/components/ui/button";
import { ScanBarcode, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { NetworkStatusIndicator } from "@/components/NetworkStatusIndicator";
import { QRCodeScanDialog } from "@/components/compliance/QRCodeScanDialog";
import { BarcodeVerificationDialog } from "./BarcodeVerificationDialog";
import { toast } from "sonner";

export const LayoutHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // User can scan barcodes if they're manufacturer, distributor, or dispenser
  const canScanBarcodes = user?.role === 'manufacturer' || 
                          user?.role === 'distributor' || 
                          user?.role === 'dispenser';

  // Handle QR code scan based on user role
  const handleQRScan = (code: string) => {
    if (!code) return;
    
    // For all roles, when scanning a QR, redirect to the track page
    navigate(`/track?code=${encodeURIComponent(code)}`);
    toast.info("QR code detected. Loading verification info...");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center mb-4 bg-muted/20 rounded-lg p-2">
      <div className="flex items-center flex-wrap gap-2">
        {canScanBarcodes && (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/batch-processing')}
            >
              <ScanBarcode className="h-4 w-4 mr-1" />
              Batch Scan
            </Button>
            
            <BarcodeVerificationDialog />
          </>
        )}
        
        {/* Universal QR Code scanner with role-specific behavior */}
        <QRCodeScanDialog 
          variant="outline" 
          size="sm" 
          className="ml-0 sm:ml-2" 
          onScanComplete={handleQRScan} 
        />
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {user?.name} ({user?.role})
        </span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-1"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
        <NetworkStatusIndicator />
      </div>
    </div>
  );
};
