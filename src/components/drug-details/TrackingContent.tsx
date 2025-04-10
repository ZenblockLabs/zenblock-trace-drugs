
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link as RouterLink } from "react-router-dom";
import { RecallStatus } from "@/components/RecallStatus";

interface TrackingContentProps {
  drugId: string;
  sgtin: string;
}

export function TrackingContent({ drugId, sgtin }: TrackingContentProps) {
  return (
    <CardContent className="py-6">
      <p className="text-gray-500 mb-6">Track the journey of this product through the supply chain.</p>
      
      <div className="flex justify-center mb-6">
        <Button asChild>
          <RouterLink to={`/history?drugId=${drugId}`}>
            View Full Chain of Custody
          </RouterLink>
        </Button>
      </div>
      
      <RecallStatus sgtin={sgtin} className="mt-4" />
    </CardContent>
  );
}
