
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { ComplianceStatus } from "@/utils/compliance/statusUtils";

interface ComplianceStatusBadgeProps {
  status: ComplianceStatus;
}

export function ComplianceStatusBadge({ status }: ComplianceStatusBadgeProps) {
  switch (status) {
    case "compliant":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          <CheckCircle className="h-3.5 w-3.5 mr-1" />
          Fully Compliant
        </Badge>
      );
    case "warning":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
          <AlertTriangle className="h-3.5 w-3.5 mr-1" />
          Warning (Minor Violation)
        </Badge>
      );
    case "violated":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
          <XCircle className="h-3.5 w-3.5 mr-1" />
          Non-Compliant
        </Badge>
      );
  }
}
