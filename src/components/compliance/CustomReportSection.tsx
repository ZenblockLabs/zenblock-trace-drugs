
import React, { useState } from "react";
import { ComplianceReportButton } from "@/components/compliance/ComplianceReportButton";
import { SgtinInput } from "./SgtinInput";

interface CustomReportSectionProps {
  isComplianceUser: boolean;
}

export function CustomReportSection({ isComplianceUser }: CustomReportSectionProps) {
  const [sgtin, setSgtin] = useState("");
  const [validSgtin, setValidSgtin] = useState(false);
  
  if (!isComplianceUser) {
    return null;
  }

  return (
    <div className="mt-8 p-6 border rounded-lg bg-slate-50">
      <h2 className="text-xl font-semibold mb-4">Generate Custom Compliance Report</h2>
      <p className="text-gray-600 mb-6">
        Generate a detailed compliance report for any specific product by entering its SGTIN (Serialized Global Trade Item Number).
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <SgtinInput 
          value={sgtin}
          onChange={setSgtin}
          onValid={setValidSgtin}
        />
        
        <ComplianceReportButton 
          drugSgtin={sgtin}
          className="mt-2 sm:mt-0"
          disabled={!validSgtin}
        />
      </div>
    </div>
  );
}
