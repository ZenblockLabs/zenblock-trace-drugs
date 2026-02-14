import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertTriangle, Clock, ShieldAlert, TrendingUp, Package,
  MapPin, RefreshCw, ChevronRight, Activity, Loader2, CheckCircle,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useExpiryAlerts, useSupplyChainAnomalies } from "@/hooks/useComplianceData";

function SeverityBadge({ severity }: { severity: string }) {
  const variants: Record<string, "destructive" | "secondary" | "outline"> = {
    critical: "destructive",
    warning: "secondary",
    info: "outline",
  };
  return (
    <Badge variant={variants[severity] || "outline"} className="capitalize text-xs">
      {severity}
    </Badge>
  );
}

function RiskScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? "bg-destructive" : score >= 40 ? "bg-amber-500" : "bg-accent";
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-semibold w-10 text-right">{score}%</span>
    </div>
  );
}

export function RiskAlertsDashboard() {
  const { alerts: expiryAlerts, loading: alertsLoading, fetchAlerts, acknowledgeAlert } = useExpiryAlerts();
  const { anomalies, loading: anomaliesLoading, fetchAnomalies, resolveAnomaly } = useSupplyChainAnomalies();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resolveDialogId, setResolveDialogId] = useState<string | null>(null);
  const [resolveNotes, setResolveNotes] = useState("");

  const loading = alertsLoading || anomaliesLoading;
  const criticalCount = expiryAlerts.filter((a) => a.severity === "critical").length;
  const unresolvedAnomalies = anomalies.filter((a) => !a.resolved).length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchAlerts(), fetchAnomalies()]);
    setIsRefreshing(false);
  };

  const handleResolve = async () => {
    if (resolveDialogId) {
      await resolveAnomaly(resolveDialogId, resolveNotes);
      setResolveDialogId(null);
      setResolveNotes("");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiry Alerts</p>
                <p className="text-3xl font-bold">{expiryAlerts.length}</p>
              </div>
              <Clock className="h-8 w-8 text-destructive opacity-70" />
            </div>
            <p className="text-xs text-destructive mt-1 font-medium">{criticalCount} critical (≤14 days)</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Supply Anomalies</p>
                <p className="text-3xl font-bold">{unresolvedAnomalies}</p>
              </div>
              <Activity className="h-8 w-8 text-primary opacity-70" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Unresolved incidents</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Risk</p>
                <p className="text-3xl font-bold">
                  {criticalCount + unresolvedAnomalies > 3 ? "High" : criticalCount + unresolvedAnomalies > 0 ? "Medium" : "Low"}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent opacity-70" />
            </div>
            <Progress value={Math.min(100, (criticalCount + unresolvedAnomalies) * 15)} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
      </div>

      {/* Refresh */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="expiry" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="expiry" className="text-xs sm:text-sm">Expiry Alerts</TabsTrigger>
          <TabsTrigger value="anomalies" className="text-xs sm:text-sm">Anomalies</TabsTrigger>
        </TabsList>

        <TabsContent value="expiry" className="mt-4 space-y-3">
          {expiryAlerts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No expiry alerts</p>
                <p className="text-sm mt-1">All batches are within safe expiry ranges.</p>
              </CardContent>
            </Card>
          ) : (
            expiryAlerts.map((alert) => {
              const daysLeft = differenceInDays(new Date(alert.expiry_date), new Date());
              return (
                <Card key={alert.id} className={`hover:shadow-md transition-shadow ${alert.acknowledged ? "opacity-60" : ""}`}>
                  <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        alert.severity === "critical" ? "bg-destructive/10" :
                        alert.severity === "warning" ? "bg-amber-500/10" : "bg-muted"
                      }`}>
                        <Package className={`h-5 w-5 ${
                          alert.severity === "critical" ? "text-destructive" :
                          alert.severity === "warning" ? "text-amber-500" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{alert.drug_name}</p>
                        <p className="text-xs text-muted-foreground">Batch: {alert.batch_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm flex-wrap">
                      {alert.location && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="text-xs">{alert.location}</span>
                        </div>
                      )}
                      <div className="text-xs">
                        <span className="text-muted-foreground">Qty:</span>{" "}
                        <span className="font-medium">{alert.quantity.toLocaleString()}</span>
                      </div>
                      <div className="text-xs font-medium">
                        {daysLeft <= 14 ? (
                          <span className="text-destructive">{daysLeft} days left</span>
                        ) : daysLeft <= 30 ? (
                          <span className="text-amber-600">{daysLeft} days left</span>
                        ) : (
                          <span className="text-muted-foreground">{daysLeft} days left</span>
                        )}
                      </div>
                      <SeverityBadge severity={alert.severity} />
                      {!alert.acknowledged && (
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => acknowledgeAlert(alert.id)}>
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="anomalies" className="mt-4 space-y-3">
          {anomalies.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No anomalies detected</p>
                <p className="text-sm mt-1">Supply chain is operating normally.</p>
              </CardContent>
            </Card>
          ) : (
            anomalies.map((anomaly) => (
              <Card key={anomaly.id} className={`hover:shadow-md transition-shadow ${anomaly.resolved ? "opacity-60" : ""}`}>
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      anomaly.severity === "critical" ? "bg-destructive/10" : "bg-amber-500/10"
                    }`}>
                      <AlertTriangle className={`h-5 w-5 ${
                        anomaly.severity === "critical" ? "text-destructive" : "text-amber-500"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{anomaly.anomaly_type}</p>
                        <SeverityBadge severity={anomaly.severity} />
                        {anomaly.resolved && (
                          <Badge variant="outline" className="text-xs text-accent border-accent">Resolved</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{anomaly.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                        {anomaly.affected_batch && (
                          <span>Batch: <span className="font-mono font-medium text-foreground">{anomaly.affected_batch}</span></span>
                        )}
                        <span>Detected: {format(new Date(anomaly.detected_at), "MMM d, yyyy")}</span>
                      </div>
                      {anomaly.resolution_notes && (
                        <p className="text-xs text-accent mt-1">Resolution: {anomaly.resolution_notes}</p>
                      )}
                    </div>
                    {!anomaly.resolved && (
                      <Button variant="outline" size="sm" className="shrink-0 text-xs" onClick={() => setResolveDialogId(anomaly.id)}>
                        Resolve <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Resolve Dialog */}
      <Dialog open={!!resolveDialogId} onOpenChange={() => setResolveDialogId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Anomaly</DialogTitle>
            <DialogDescription>Add resolution notes for this incident.</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Describe how the anomaly was resolved..."
            value={resolveNotes}
            onChange={(e) => setResolveNotes(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialogId(null)}>Cancel</Button>
            <Button onClick={handleResolve}>Mark Resolved</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
