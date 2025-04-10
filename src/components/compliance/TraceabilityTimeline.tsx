
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTraceabilityData } from "@/hooks/useTraceabilityData";
import { ComplianceStatusBadge } from "./ComplianceStatusBadge";
import { ComplianceIssuesList } from "./ComplianceIssuesList";
import { TimelineTable } from "./TimelineTable";

interface TraceabilityTimelineProps {
  drugId?: string;
  showFullDetails?: boolean;
}

export function TraceabilityTimeline({ drugId, showFullDetails = false }: TraceabilityTimelineProps) {
  const { 
    events, 
    loading, 
    complianceStatus, 
    complianceIssues 
  } = useTraceabilityData(drugId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traceability Timeline</CardTitle>
          <CardDescription>Loading timeline data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Traceability Timeline</CardTitle>
          <CardDescription>
            Full chain of custody verification
          </CardDescription>
        </div>
        <ComplianceStatusBadge status={complianceStatus} />
      </CardHeader>
      <CardContent>
        <ComplianceIssuesList issues={complianceIssues} />
        <TimelineTable events={events} showFullDetails={showFullDetails} />
      </CardContent>
    </Card>
  );
}
