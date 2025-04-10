
import React, { useState } from "react";
import { ComplianceReportButton } from "@/components/compliance/ComplianceReportButton";

interface CustomReportSectionProps {
  isComplianceUser: boolean;
}

export function CustomReportSection({ isComplianceUser }: CustomReportSectionProps) {
  const [sgtin, setSgtin] = useState("");
  
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
        <div className="w-full sm:w-auto">
          <label htmlFor="sgtin" className="block text-sm font-medium text-gray-700 mb-1">
            Product SGTIN
          </label>
          <input
            type="text"
            id="sgtin"
            placeholder="Enter product SGTIN"
            className="px-3 py-2 border rounded-md w-full sm:w-80"
            value={sgtin}
            onChange={(e) => setSgtin(e.target.value)}
          />
        </div>
        
        <ComplianceReportButton 
          drugSgtin={sgtin || "10012345678903"} // Example SGTIN if empty
        />
      </div>
    </div>
  );
}
