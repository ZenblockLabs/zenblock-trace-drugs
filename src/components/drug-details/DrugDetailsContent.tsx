
import { Card } from "@/components/ui/card";
import { DrugHeader } from "./DrugHeader";
import { DetailsTabs } from "./DetailsTabs";
import { StatusInformation } from "./StatusInformation";
import { ActionCard } from "./ActionCard";
import { useAuth } from "@/context/AuthContext";
import { Drug } from "@/services/types";

interface DrugDetailsContentProps {
  data: Drug;
  formatDate: (date: string) => string;
}

export function DrugDetailsContent({ data, formatDate }: DrugDetailsContentProps) {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-6 px-4">
      <DrugHeader drug={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <DetailsTabs data={data} formatDate={formatDate} />
          </Card>
        </div>
        
        <div>
          <div className="space-y-6">
            <StatusInformation 
              status={data.status || 'manufactured'} 
              ownerName={data.currentOwnerName || 'Unknown'} 
              ownerRole={data.currentOwnerRole || 'Unknown'} 
            />
            
            <ActionCard 
              drugId={data.id} 
              userRole={user?.role} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
