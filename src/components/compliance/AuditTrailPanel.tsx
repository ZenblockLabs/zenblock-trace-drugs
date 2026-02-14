import { useComplianceAuditTrail } from "@/hooks/useComplianceData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2, History, RefreshCw, FileText, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

const categoryIcons: Record<string, any> = {
  "Violations": AlertTriangle,
  "Expiry Alerts": ShieldAlert,
  "Anomalies": AlertTriangle,
  "Reports": FileText,
};

const actionColors: Record<string, string> = {
  violation_created: "text-destructive",
  violation_updated: "text-amber-600",
  alert_acknowledged: "text-primary",
  anomaly_resolved: "text-accent",
  report_generated: "text-primary",
};

export function AuditTrailPanel() {
  const { entries, loading, fetchEntries } = useComplianceAuditTrail();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <History className="h-5 w-5" />
            Compliance Audit Trail
          </h3>
          <p className="text-sm text-muted-foreground">Complete log of all compliance-related actions</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchEntries}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {entries.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No audit entries yet</p>
            <p className="text-sm mt-1">Actions will be logged here automatically.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-4">
            {entries.map((entry) => {
              const Icon = categoryIcons[entry.category] || CheckCircle;
              const colorClass = actionColors[entry.action] || "text-muted-foreground";

              return (
                <div key={entry.id} className="relative flex gap-4 pl-2">
                  <div className={`z-10 p-1.5 rounded-full bg-background border ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <Card className="flex-1">
                    <CardContent className="py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{entry.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs capitalize">{entry.category}</Badge>
                            {entry.actor_name && <span>by {entry.actor_name}</span>}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {format(new Date(entry.created_at), "MMM d, h:mm a")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
