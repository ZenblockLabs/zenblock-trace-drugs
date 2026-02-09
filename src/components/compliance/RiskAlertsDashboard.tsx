
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  TrendingUp,
  Package,
  Thermometer,
  MapPin,
  RefreshCw,
  ChevronRight,
  Activity,
} from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ExpiryAlert {
  id: string;
  drugName: string;
  batchNumber: string;
  expiryDate: Date;
  quantity: number;
  location: string;
  severity: "critical" | "warning" | "info";
}

interface RiskIndicator {
  id: string;
  drugName: string;
  sgtin: string;
  riskScore: number;
  factors: string[];
  lastVerified: Date;
  status: "high" | "medium" | "low";
}

interface SupplyChainAnomaly {
  id: string;
  type: string;
  description: string;
  detectedAt: Date;
  affectedBatch: string;
  severity: "critical" | "warning" | "info";
  resolved: boolean;
}

// Mock data representing realistic pharma scenarios
const expiryAlerts: ExpiryAlert[] = [
  {
    id: "exp-1",
    drugName: "Amoxicillin 500mg",
    batchNumber: "AMX-2024-1847",
    expiryDate: addDays(new Date(), 12),
    quantity: 2400,
    location: "Warehouse B - Dubai",
    severity: "critical",
  },
  {
    id: "exp-2",
    drugName: "Metformin 850mg",
    batchNumber: "MET-2024-0932",
    expiryDate: addDays(new Date(), 28),
    quantity: 800,
    location: "Distribution Center - Riyadh",
    severity: "warning",
  },
  {
    id: "exp-3",
    drugName: "Atorvastatin 20mg",
    batchNumber: "ATV-2025-0114",
    expiryDate: addDays(new Date(), 58),
    quantity: 5200,
    location: "Main Warehouse - Mumbai",
    severity: "info",
  },
  {
    id: "exp-4",
    drugName: "Omeprazole 40mg",
    batchNumber: "OMP-2024-2201",
    expiryDate: addDays(new Date(), 7),
    quantity: 150,
    location: "Pharmacy - Abu Dhabi",
    severity: "critical",
  },
];

const riskIndicators: RiskIndicator[] = [
  {
    id: "risk-1",
    drugName: "Insulin Glargine 100U",
    sgtin: "urn:epc:id:sgtin:0614141.107346.2154",
    riskScore: 82,
    factors: ["Cold chain excursion detected", "Unverified transfer at node 3", "Unusual transit delay"],
    lastVerified: addDays(new Date(), -2),
    status: "high",
  },
  {
    id: "risk-2",
    drugName: "Adalimumab 40mg",
    sgtin: "urn:epc:id:sgtin:0614141.107346.3891",
    riskScore: 54,
    factors: ["Non-standard packaging scan", "Minor timeline gap"],
    lastVerified: addDays(new Date(), -1),
    status: "medium",
  },
  {
    id: "risk-3",
    drugName: "Paracetamol 500mg",
    sgtin: "urn:epc:id:sgtin:0614141.107346.7723",
    riskScore: 15,
    factors: ["All verifications passed"],
    lastVerified: new Date(),
    status: "low",
  },
];

const anomalies: SupplyChainAnomaly[] = [
  {
    id: "anom-1",
    type: "Temperature Excursion",
    description: "Shipment SHP-4821 recorded 14°C for 47 min during transit (threshold: 8°C max)",
    detectedAt: addDays(new Date(), -1),
    affectedBatch: "INS-2025-0044",
    severity: "critical",
    resolved: false,
  },
  {
    id: "anom-2",
    type: "Route Deviation",
    description: "Truck deviated 38km from approved route between checkpoint 2 and 3",
    detectedAt: addDays(new Date(), -3),
    affectedBatch: "ADA-2025-0112",
    severity: "warning",
    resolved: false,
  },
  {
    id: "anom-3",
    type: "Duplicate Scan",
    description: "Same SGTIN scanned at two different locations within 15 minutes",
    detectedAt: addDays(new Date(), -5),
    affectedBatch: "AMX-2024-1847",
    severity: "critical",
    resolved: true,
  },
  {
    id: "anom-4",
    type: "Missing Checkpoint",
    description: "Batch skipped mandatory quality checkpoint at Distribution Hub C",
    detectedAt: addDays(new Date(), -2),
    affectedBatch: "MET-2024-0932",
    severity: "warning",
    resolved: false,
  },
];

function SeverityBadge({ severity }: { severity: "critical" | "warning" | "info" }) {
  const variants: Record<string, "destructive" | "secondary" | "outline"> = {
    critical: "destructive",
    warning: "secondary",
    info: "outline",
  };
  return (
    <Badge variant={variants[severity]} className="capitalize text-xs">
      {severity}
    </Badge>
  );
}

function RiskScoreBar({ score }: { score: number }) {
  const color =
    score >= 70
      ? "bg-destructive"
      : score >= 40
      ? "bg-amber-500"
      : "bg-accent";
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
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const criticalCount = expiryAlerts.filter((a) => a.severity === "critical").length;
  const unresolvedAnomalies = anomalies.filter((a) => !a.resolved).length;
  const highRiskCount = riskIndicators.filter((r) => r.status === "high").length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({ title: "Risk data refreshed", description: "All indicators updated to latest values." });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Counterfeit Risk</p>
                <p className="text-3xl font-bold">{highRiskCount}</p>
              </div>
              <ShieldAlert className="h-8 w-8 text-amber-500 opacity-70" />
            </div>
            <p className="text-xs text-amber-600 mt-1 font-medium">High-risk items flagged</p>
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
                <p className="text-sm text-muted-foreground">Overall Risk Score</p>
                <p className="text-3xl font-bold">Medium</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent opacity-70" />
            </div>
            <Progress value={62} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
      </div>

      {/* Refresh button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      {/* Detailed sub-tabs */}
      <Tabs defaultValue="expiry" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="expiry" className="text-xs sm:text-sm">Expiry Alerts</TabsTrigger>
          <TabsTrigger value="counterfeit" className="text-xs sm:text-sm">Counterfeit Risk</TabsTrigger>
          <TabsTrigger value="anomalies" className="text-xs sm:text-sm">Anomalies</TabsTrigger>
        </TabsList>

        {/* Expiry Alerts Tab */}
        <TabsContent value="expiry" className="mt-4 space-y-3">
          {expiryAlerts.map((alert) => {
            const daysLeft = differenceInDays(alert.expiryDate, new Date());
            return (
              <Card key={alert.id} className="hover:shadow-md transition-shadow">
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
                      <p className="font-semibold text-sm truncate">{alert.drugName}</p>
                      <p className="text-xs text-muted-foreground">Batch: {alert.batchNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="text-xs">{alert.location}</span>
                    </div>
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
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Counterfeit Risk Tab */}
        <TabsContent value="counterfeit" className="mt-4 space-y-3">
          {riskIndicators.map((risk) => (
            <Card key={risk.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      risk.status === "high" ? "bg-destructive/10" :
                      risk.status === "medium" ? "bg-amber-500/10" : "bg-accent/10"
                    }`}>
                      <ShieldAlert className={`h-5 w-5 ${
                        risk.status === "high" ? "text-destructive" :
                        risk.status === "medium" ? "text-amber-500" : "text-accent"
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{risk.drugName}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate max-w-[280px]">{risk.sgtin}</p>
                    </div>
                  </div>
                  <Badge variant={risk.status === "high" ? "destructive" : risk.status === "medium" ? "secondary" : "outline"} className="capitalize">
                    {risk.status} risk
                  </Badge>
                </div>
                <RiskScoreBar score={risk.riskScore} />
                <div className="flex flex-wrap gap-1.5">
                  {risk.factors.map((factor, i) => (
                    <Badge key={i} variant="outline" className="text-xs font-normal">
                      {factor}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last verified: {format(risk.lastVerified, "MMM d, yyyy 'at' h:mm a")}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Anomalies Tab */}
        <TabsContent value="anomalies" className="mt-4 space-y-3">
          {anomalies.map((anomaly) => (
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
                      <p className="font-semibold text-sm">{anomaly.type}</p>
                      <SeverityBadge severity={anomaly.severity} />
                      {anomaly.resolved && (
                        <Badge variant="outline" className="text-xs text-accent border-accent">Resolved</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{anomaly.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span>Batch: <span className="font-mono font-medium text-foreground">{anomaly.affectedBatch}</span></span>
                      <span>Detected: {format(anomaly.detectedAt, "MMM d, yyyy")}</span>
                    </div>
                  </div>
                  {!anomaly.resolved && (
                    <Button variant="outline" size="sm" className="shrink-0 text-xs">
                      Investigate <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
