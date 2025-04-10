
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { QRCodeModal } from "@/components/QRCodeModal";
import { Drug } from "@/services/types";

interface DrugHeaderProps {
  drug: Drug;
}

export function DrugHeader({ drug }: DrugHeaderProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">{drug.productName || drug.name}</h1>
        <div className="flex items-center gap-2 mt-1">
          <StatusBadge status={drug.status || 'manufactured'} />
          <span className="text-gray-500">Batch: {drug.batchNumber}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <RouterLink to="/drugs">
            Back to Drugs
          </RouterLink>
        </Button>
        
        {/* QR Code Generator for ALL users */}
        <QRCodeModal 
          drugId={drug.id} 
          sgtin={drug.sgtin} 
          productName={drug.productName || drug.name} 
        />
      </div>
    </div>
  );
}
