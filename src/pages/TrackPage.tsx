
import { useSearchParams } from "react-router-dom";
import { useDrugTracking } from "@/hooks/useDrugTracking";
import { TrackingLoader } from "@/components/tracking/TrackingLoader";
import { ErrorDisplay } from "@/components/tracking/ErrorDisplay";
import { StatusAlert } from "@/components/tracking/StatusAlert";
import { DrugInformation } from "@/components/tracking/DrugInformation";
import { SupplyChainJourney } from "@/components/tracking/SupplyChainJourney";
import { ActionButtons } from "@/components/tracking/ActionButtons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function TrackPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const { data, loading, error, formatDate, isFiltered } = useDrugTracking(code);

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

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Verified by {data.status.verifiedBy} on {new Date().toLocaleDateString()}</p>
        <p className="mt-1">© 2025 Zenblock Labs. All rights reserved.</p>
      </div>
    </div>
  );
}
