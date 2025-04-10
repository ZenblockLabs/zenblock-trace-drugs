
import React, { useState } from "react";
import { ComplianceReportButton } from "@/components/compliance/ComplianceReportButton";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface CustomReportSectionProps {
  isComplianceUser: boolean;
}

export function CustomReportSection({ isComplianceUser }: CustomReportSectionProps) {
  const [sgtin, setSgtin] = useState("");
  const [validSgtin, setValidSgtin] = useState(false);
  
  // Some example SGTINs for testing
  const exampleSgtins = [
    "00614141777734", // Drug 1
    "00614141000127", // Drug 2
    "00978214500018"  // Drug 3
  ];
  
  const handleSgtinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSgtin(value);
    // Simple validation - at least 12 digits
    setValidSgtin(value.trim().length >= 12);
  };
  
  const handleUseExample = (example: string) => {
    setSgtin(example);
    setValidSgtin(true);
  };
  
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
          <Label htmlFor="sgtin" className="block text-sm font-medium text-gray-700 mb-1">
            Product SGTIN
          </Label>
          <div className="relative">
            <Input
              type="text"
              id="sgtin"
              placeholder="Enter product SGTIN"
              className="pl-8 pr-3 py-2 w-full sm:w-80"
              value={sgtin}
              onChange={handleSgtinChange}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            <span>Try one of these example SGTINs: </span>
            {exampleSgtins.map((example, index) => (
              <Button 
                key={example} 
                variant="link" 
                className="p-0 h-auto text-xs text-blue-600 hover:text-blue-800" 
                onClick={() => handleUseExample(example)}
              >
                {example}{index < exampleSgtins.length - 1 ? ", " : ""}
              </Button>
            ))}
          </div>
        </div>
        
        <ComplianceReportButton 
          drugSgtin={sgtin}
          className="mt-2 sm:mt-0"
          disabled={!validSgtin}
        />
      </div>
    </div>
  );
}
