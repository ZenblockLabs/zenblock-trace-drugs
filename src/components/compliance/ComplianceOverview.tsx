
import React from "react";
import { ComplianceStatus } from "@/components/compliance/ComplianceStatus";
import { ProductTraceability } from "@/components/compliance/ProductTraceability";

interface ComplianceOverviewProps {
  complianceData: {
    dscsa: {
      status: string;
      lastUpdated: Date;
      complianceRatio: number;
      violations: number;
      pendingResolutions: number;
    };
    traceability: {
      totalDrugs: number;
      trackedDrugs: number;
      traceabilityScore: number;
      lastAudit: Date;
    };
  };
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onGenerateReport: () => void;
  isLoading: boolean;
}

export function ComplianceOverview({
  complianceData,
  selectedPeriod,
  onPeriodChange,
  onGenerateReport,
  isLoading
}: ComplianceOverviewProps) {
  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      <ComplianceStatus 
        complianceData={complianceData}
        selectedPeriod={selectedPeriod}
        onPeriodChange={onPeriodChange}
        onGenerateReport={onGenerateReport}
        isLoading={isLoading}
      />

      <ProductTraceability 
        traceabilityData={complianceData.traceability}
      />
    </div>
  );
}
