
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ProductInformation } from "./ProductInformation";
import { TrackingContent } from "./TrackingContent";
import { Drug } from "@/services/types";

interface DetailsTabsProps {
  data: Drug;
  formatDate: (date: string) => string;
}

export function DetailsTabs({ data, formatDate }: DetailsTabsProps) {
  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle>Product Information</CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="details">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="details" className="m-0">
          <ProductInformation data={data} formatDate={formatDate} />
        </TabsContent>
        
        <TabsContent value="tracking" className="m-0">
          <TrackingContent drugId={data.id} sgtin={data.sgtin} />
        </TabsContent>
      </Tabs>
    </>
  );
}
