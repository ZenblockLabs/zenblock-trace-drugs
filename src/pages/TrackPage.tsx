
import { useSearchParams } from "react-router-dom";
import { useDrugTracking } from "@/hooks/useDrugTracking";
import { TrackingLoader } from "@/components/tracking/TrackingLoader";
import { ErrorDisplay } from "@/components/tracking/ErrorDisplay";
import { StatusAlert } from "@/components/tracking/StatusAlert";
import { DrugInformation } from "@/components/tracking/DrugInformation";
import { SupplyChainJourney } from "@/components/tracking/SupplyChainJourney";
import { ActionButtons } from "@/components/tracking/ActionButtons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QRCodeScanner } from "@/components/compliance/QRCodeScanner";
import { Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ComplianceReportButton } from "@/components/compliance/ComplianceReportButton";

export function TrackPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const { data, loading, error, formatDate, isFiltered } = useDrugTracking(code);
  const { user } = useAuth();

  // Role-specific action component
  const RoleSpecificActions = () => {
    if (!data || !code) return null;
    
    switch (user?.role) {
      case 'regulator':
        return (
          <div className="mt-6">
            <ComplianceReportButton 
              drugSgtin={code}
              variant="default" 
              className="w-full md:w-auto"
            />
          </div>
        );
      case 'distributor':
      case 'dispenser':
        // Only show "Mark as Received" for drugs that haven't been received by current user
        const canReceive = data.events.every(event => 
          !(event.handler?.includes(user.organization || '') && event.step === 'received')
        );
        
        if (canReceive) {
          return (
            <div className="mt-6">
              <Button 
                variant="default" 
                className="w-full md:w-auto"
                onClick={handleReceiveDrug}
              >
                Mark as Received
              </Button>
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };
  
  // Function to handle "Mark as Received" action
  const handleReceiveDrug = async () => {
    if (!user || !code) return;
    
    try {
      const service = await getBlockchainService();
      
      // Call the receiveDrug method with appropriate parameters
      await service.receiveDrug(
        code, // Using code as drugId
        user.id,
        user.organization || user.email || 'Unknown',
        user.role || 'Unknown',
        'Current location', // Ideally this would be fetched or entered
        { notes: `Received by ${user.role}` }
      );
      
      toast.success("Drug marked as received successfully");
      
      // Refresh the page to show the updated status
      window.location.reload();
    } catch (error) {
      console.error("Error marking drug as received:", error);
      toast.error("Failed to mark drug as received");
    }
  };

  // If no code is provided, show the scanner
  if (!code) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/7f80b1a9-32ff-4729-bd56-1245ed723387.png" 
            alt="Zenblock Labs Logo" 
            className="h-16 w-16" 
          />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">Drug Verification</h1>
        <QRCodeScanner />
      </div>
    );
  }

  if (loading) {
    return <TrackingLoader />;
  }

  if (error || !data) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-center">
        <img 
          src="/lovable-uploads/7f80b1a9-32ff-4729-bd56-1245ed723387.png" 
          alt="Zenblock Labs Logo" 
          className="h-16 w-16 mb-4" 
        />
      </div>
      
      {/* Status Banner */}
      <StatusAlert status={data.status} />
      
      {/* Role-based filtering notice */}
      {isFiltered && (
        <Alert className="mb-4 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            🔐 Filtered view – showing only relevant events for your role.
          </AlertDescription>
        </Alert>
      )}

      {/* Drug Details */}
      <DrugInformation drug={data.drug} />

      {/* Supply Chain Journey */}
      <SupplyChainJourney events={data.events} formatDate={formatDate} />

      {/* Action Buttons */}
      <ActionButtons />
      
      {/* Role-specific Actions */}
      <RoleSpecificActions />

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Verified by {data.status.verifiedBy} on {new Date().toLocaleDateString()}</p>
        <p className="mt-1">© 2025 Zenblock Labs. All rights reserved.</p>
      </div>
    </div>
  );
}

// Need to import these dependencies
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getBlockchainService } from "@/services/blockchainServiceFactory";
