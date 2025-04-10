
import { Badge } from "@/components/ui/badge";
import { Drug } from "@/services/types";

interface HistoryHeaderProps {
  drug: Drug | null;
}

export function HistoryHeader({ drug }: HistoryHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">{drug ? `History for ${drug.productName}` : 'Event History'}</h1>
        <p className="text-muted-foreground">
          {drug 
            ? `Tracking events for ${drug.sgtin} (Batch: ${drug.batchNumber})` 
            : 'All supply chain events in the blockchain'}
        </p>
      </div>
      
      {drug && (
        <Badge className="text-sm" variant="outline">
          {drug.status || 'Unknown Status'}
        </Badge>
      )}
    </div>
  );
}
