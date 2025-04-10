
import { AlertTriangle } from "lucide-react";

interface ComplianceIssuesListProps {
  issues: string[];
}

export function ComplianceIssuesList({ issues }: ComplianceIssuesListProps) {
  if (issues.length === 0) return null;
  
  return (
    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
      <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center">
        <AlertTriangle className="h-4 w-4 mr-1" />
        Compliance Issues Detected
      </h4>
      <ul className="text-xs text-amber-700 space-y-1 list-disc pl-5">
        {issues.map((issue, i) => (
          <li key={i}>{issue}</li>
        ))}
      </ul>
    </div>
  );
}
