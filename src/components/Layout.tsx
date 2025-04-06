
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { NetworkStatusIndicator } from "@/components/NetworkStatusIndicator";
import { Button } from "@/components/ui/button";
import { ScanBarcode } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Layout = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const canScanBarcodes = user?.role === 'manufacturer' || 
                          user?.role === 'distributor' || 
                          user?.role === 'pharmacy';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4 bg-muted/20 rounded-lg p-2">
            <div className="flex items-center">
              {canScanBarcodes && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-2"
                  onClick={() => navigate('/batch-processing')}
                >
                  <ScanBarcode className="h-4 w-4 mr-1" />
                  Batch Scan
                </Button>
              )}
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
