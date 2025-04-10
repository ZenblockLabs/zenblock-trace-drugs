
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface CompliancePageHeaderProps {
  isComplianceUser: boolean;
}

export function CompliancePageHeader({ isComplianceUser }: CompliancePageHeaderProps) {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compliance Management</h1>
        <p className="text-muted-foreground">
          Monitor DSCSA compliance and access audit reports
        </p>
      </div>
      
      {!isComplianceUser && (
        <Alert className="bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-800" />
          <AlertDescription className="text-amber-800">
            Some compliance features are only visible to compliance officers and regulators.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
