
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceReportGenerator } from "@/components/compliance/ComplianceReportGenerator";
import { Shield } from "lucide-react";

interface ComplianceActionsProps {
  drugId: string;
  sgtin: string;
}

export function ComplianceActions({ drugId, sgtin }: ComplianceActionsProps) {
  const { user } = useAuth();
  
  // Only show compliance actions to regulators and compliance users
  const isComplianceUser = user?.role === 'regulator' || 
                          user?.email?.includes('compliance') ||
                          user?.email?.includes('regulator');
  
  if (!isComplianceUser) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Shield className="h-4 w-4 mr-2 text-blue-500" />
          Compliance Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <ComplianceReportGenerator 
            drugId={drugId} 
            drugSgtin={sgtin}
            buttonVariant="outline"
            className="w-full justify-start"
          />
        </div>
      </CardContent>
    </Card>
  );
}
