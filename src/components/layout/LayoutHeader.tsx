
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
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4 bg-muted/20 rounded-lg p-2">
      <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        {canScanBarcodes && (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/batch-processing')}
              className="text-xs sm:text-sm"
            >
              <ScanBarcode className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden xs:inline">Batch Scan</span>
              <span className="xs:hidden">Batch</span>
            </Button>
            
            <BarcodeVerificationDialog />
          </>
        )}
        
        {/* Universal QR Code scanner with role-specific behavior */}
        <QRCodeScanDialog 
          variant="outline" 
          size="sm" 
          className="text-xs sm:text-sm" 
          onScanComplete={handleQRScan} 
        />
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2">
        <span className="text-xs sm:text-sm text-muted-foreground truncate flex-1 sm:flex-none">
          {user?.name} <span className="hidden sm:inline">({user?.role})</span>
        </span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-1 text-xs sm:text-sm flex-shrink-0"
        >
          <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Logout</span>
        </Button>
        <NetworkStatusIndicator />
      </div>
    </div>
  );
};
