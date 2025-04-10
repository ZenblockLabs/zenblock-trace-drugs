
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ShieldCheck } from "lucide-react";
import { ComplianceReport } from "@/services/types";

interface ComplianceStatusProps {
  complianceData: {
    dscsa: {
      status: string;
      lastUpdated: Date;
      complianceRatio: number;
      violations: number;
      pendingResolutions: number;
    };
  };
  selectedPeriod: string;
  onPeriodChange: (value: string) => void;
  onGenerateReport: () => void;
  isLoading: boolean;
}

export function ComplianceStatus({
  complianceData,
  selectedPeriod,
  onPeriodChange,
  onGenerateReport,
  isLoading
}: ComplianceStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheck className="h-5 w-5 mr-2 text-green-500" />
          DSCSA Compliance Status
        </CardTitle>
        <CardDescription>
          Current compliance with Drug Supply Chain Security Act requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Overall Status:</span>
            <Badge variant={complianceData.dscsa.status === "Compliant" ? "success" : "destructive"}>
              {complianceData.dscsa.status}
            </Badge>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full" 
              style={{ width: `${complianceData.dscsa.complianceRatio}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>{complianceData.dscsa.complianceRatio}% Compliant</span>
            <span className="text-muted-foreground">
              Last updated: {format(complianceData.dscsa.lastUpdated, 'MMM d, yyyy')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <div className="text-2xl font-semibold">{complianceData.dscsa.violations}</div>
              <div className="text-sm text-muted-foreground">Compliance Violations</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <div className="text-2xl font-semibold">{complianceData.dscsa.pendingResolutions}</div>
              <div className="text-sm text-muted-foreground">Pending Resolutions</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center space-x-2">
          <Select 
            value={selectedPeriod} 
            onValueChange={onPeriodChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Monthly Report</SelectItem>
              <SelectItem value="quarter">Quarterly Report</SelectItem>
              <SelectItem value="year">Annual Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onGenerateReport} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Report"}
        </Button>
      </CardFooter>
    </Card>
  );
}
