
import { TrackingEvent } from "@/services/types";
import { ReactNode } from "react";
import { CheckCircle, AlertTriangle, XCircle, ArrowDown, ArrowUp, Package, Clock } from "lucide-react";

export type ComplianceStatus = "compliant" | "warning" | "violated";

/**
 * Determines compliance status based on compliance issues
 */
export const determineComplianceStatus = (issues: string[]): ComplianceStatus => {
  if (issues.length === 0) {
    return "compliant";
  } else if (issues.some(issue => issue.includes("Missing required event") || issue.includes("Invalid flow"))) {
    return "violated";
  } else {
    return "warning";
  }
};

/**
 * Returns the appropriate icon for an event type
 */
export const getEventIcon = (eventType: string): ReactNode => {
  switch (eventType.toLowerCase()) {
    case 'commission':
      return <Package className="h-4 w-4 text-blue-500" />;
    case 'ship':
      return <ArrowUp className="h-4 w-4 text-indigo-500" />;
    case 'receive':
      return <ArrowDown className="h-4 w-4 text-green-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

/**
 * Formats a date string into a locale string
 */
export const formatEventDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
