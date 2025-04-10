
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { AlertTriangle, FileCheck, ShieldCheck } from "lucide-react";

interface ProductTraceabilityProps {
  traceabilityData: {
    totalDrugs: number;
    trackedDrugs: number;
    traceabilityScore: number;
    lastAudit: Date;
  };
}

export function ProductTraceability({ traceabilityData }: ProductTraceabilityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileCheck className="h-5 w-5 mr-2 text-blue-500" />
          Product Traceability
        </CardTitle>
        <CardDescription>
          End-to-end visibility of products in the supply chain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Traceability Score:</span>
            <Badge variant="outline" className="bg-blue-50">
              {traceabilityData.traceabilityScore}%
            </Badge>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-blue-500 h-2.5 rounded-full" 
              style={{ width: `${traceabilityData.traceabilityScore}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>{traceabilityData.trackedDrugs} / {traceabilityData.totalDrugs} Products Tracked</span>
            <span className="text-muted-foreground">
              Last audit: {format(traceabilityData.lastAudit, 'MMM d, yyyy')}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 mt-4">
            <div className="border rounded-md p-3">
              <div className="text-sm font-medium">T3 Transaction Requirements</div>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-muted-foreground">Transaction Information</span>
                <ShieldCheck className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-muted-foreground">Transaction History</span>
                <ShieldCheck className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-muted-foreground">Transaction Statement</span>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end border-t pt-4">
        <Button variant="outline">View Full Traceability Report</Button>
      </CardFooter>
    </Card>
  );
}
