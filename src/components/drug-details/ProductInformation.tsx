
import { CardContent } from "@/components/ui/card";
import { ProductIdentifiers } from "./ProductIdentifiers";
import { ProductDescription } from "./ProductDescription";
import { ProductDetails } from "./ProductDetails";
import { QualityAssurance } from "./QualityAssurance";
import { CurrentOwner } from "./CurrentOwner";
import { Drug } from "@/services/types";

interface ProductInformationProps {
  data: Drug;
  formatDate: (date: string) => string;
}

export function ProductInformation({ data, formatDate }: ProductInformationProps) {
  return (
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 pt-4">
        <ProductIdentifiers 
          gtin={data.gtin} 
          sgtin={data.sgtin} 
          batchNumber={data.batchNumber}
        />
        
        <ProductDescription name={data.productName || data.name} />
        
        <ProductDetails 
          dosage={data.dosage} 
          manufacturer={data.manufacturerName}
          expiryDate={data.expiryDate}
          formatDate={formatDate}
        />
        
        <QualityAssurance />
      </div>
      
      <CurrentOwner 
        ownerName={data.currentOwnerName}
        ownerRole={data.currentOwnerRole}
      />
    </CardContent>
  );
}
