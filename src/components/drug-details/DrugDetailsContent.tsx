
import { Card } from "@/components/ui/card";
import { DrugHeader } from "./DrugHeader";
import { DetailsTabs } from "./DetailsTabs";
import { StatusInformation } from "./StatusInformation";
import { ActionCard } from "./ActionCard";
import { ComplianceActions } from "./ComplianceActions";
import { TraceabilityTimeline } from "@/components/compliance/TraceabilityTimeline";
import { useAuth } from "@/context/AuthContext";
import { Drug } from "@/services/types";

interface DrugDetailsContentProps {
  data: Drug;
  formatDate: (date: string) => string;
}

export function DrugDetailsContent({ data, formatDate }: DrugDetailsContentProps) {
  const { user } = useAuth();
  
  // Check if user is a compliance or regulator user
  const isComplianceUser = user?.role === 'regulator' || 
                          user?.email?.includes('compliance') ||
                          user?.email?.includes('regulator');

  return (
    <div className="container mx-auto py-6 px-4">
      <DrugHeader drug={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <DetailsTabs data={data} formatDate={formatDate} />
          </Card>
          
          {/* Show full traceability timeline for compliance/regulator users */}
          {isComplianceUser && (
            <div className="mt-6">
              <TraceabilityTimeline drugId={data.id} showFullDetails={true} />
            </div>
          )}
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
            
            {/* Add compliance actions for regulator/compliance users */}
            <ComplianceActions 
              drugId={data.id}
              sgtin={data.sgtin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
