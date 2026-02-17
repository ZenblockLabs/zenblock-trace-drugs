
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Clock, Package, MapPin, Search, Plus, Loader2, CheckCircle, AlertTriangle, Bell, RefreshCw,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useExpiryAlerts } from "@/hooks/useComplianceData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logAuditEntry } from "@/hooks/useComplianceData";
import { Label } from "@/components/ui/label";

export function ExpiryAlertsDashboard() {
  const { alerts, loading, fetchAlerts, acknowledgeAlert } = useExpiryAlerts();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAlert, setNewAlert] = useState({
    drug_name: "",
    batch_number: "",
    expiry_date: "",
    quantity: 0,
    location: "",
    severity: "warning",
  });
  const { toast } = useToast();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAlerts();
    setIsRefreshing(false);
  };

  const handleAddAlert = async () => {
    if (!newAlert.drug_name || !newAlert.batch_number || !newAlert.expiry_date) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please fill in all required fields" });
      return;
    }
    const { error } = await supabase.from("expiry_alerts").insert({
      drug_name: newAlert.drug_name,
      batch_number: newAlert.batch_number,
      expiry_date: newAlert.expiry_date,
      quantity: newAlert.quantity,
      location: newAlert.location || null,
      severity: newAlert.severity,
    });
    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to create alert" });
      return;
    }
    await logAuditEntry("expiry_alert_created", "Expiry Alerts", `Alert created for ${newAlert.drug_name} batch ${newAlert.batch_number}`);
    toast({ title: "Alert Created", description: "Expiry alert has been added successfully" });
    setShowAddDialog(false);
    setNewAlert({ drug_name: "", batch_number: "", expiry_date: "", quantity: 0, location: "", severity: "warning" });
    await fetchAlerts();
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.drug_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.batch_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "acknowledged" && alert.acknowledged) ||
      (statusFilter === "pending" && !alert.acknowledged);
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const criticalCount = alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length;
  const warningCount = alerts.filter((a) => a.severity === "warning" && !a.acknowledged).length;
  const pendingCount = alerts.filter((a) => !a.acknowledged).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-3xl font-bold">{criticalCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive opacity-70" />
            </div>
            <p className="text-xs text-destructive mt-1">≤14 days to expiry</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-3xl font-bold">{warningCount}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500 opacity-70" />
            </div>
            <p className="text-xs text-amber-600 mt-1">15-60 days to expiry</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Action</p>
                <p className="text-3xl font-bold">{pendingCount}</p>
              </div>
              <Bell className="h-8 w-8 text-primary opacity-70" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting acknowledgment</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-3xl font-bold">{alerts.length}</p>
              </div>
              <Package className="h-8 w-8 text-accent opacity-70" />
            </div>
            <Progress value={alerts.length > 0 ? ((alerts.length - pendingCount) / alerts.length) * 100 : 100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Expiry Alerts</CardTitle>
              <CardDescription>Monitor and manage product expiry dates across your supply chain</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button size="sm" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Alert
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by drug name or batch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Drug Name</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => {
                  const daysLeft = differenceInDays(new Date(alert.expiry_date), new Date());
                  return (
                    <TableRow key={alert.id} className={alert.acknowledged ? "opacity-60" : ""}>
                      <TableCell className="font-medium">{alert.drug_name}</TableCell>
                      <TableCell className="font-mono text-xs">{alert.batch_number}</TableCell>
                      <TableCell>{format(new Date(alert.expiry_date), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <span className={
                          daysLeft <= 14 ? "text-destructive font-semibold" :
                          daysLeft <= 30 ? "text-amber-600 font-medium" :
                          "text-muted-foreground"
                        }>
                          {daysLeft} days
                        </span>
                      </TableCell>
                      <TableCell>{alert.quantity.toLocaleString()}</TableCell>
                      <TableCell>
                        {alert.location ? (
                          <div className="flex items-center gap-1 text-xs">
                            <MapPin className="h-3 w-3" />
                            {alert.location}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            alert.severity === "critical" ? "destructive" :
                            alert.severity === "warning" ? "secondary" : "outline"
                          }
                          className="capitalize text-xs"
                        >
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {alert.acknowledged ? (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" /> Acknowledged
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {!alert.acknowledged && (
                          <Button variant="ghost" size="sm" className="text-xs" onClick={() => acknowledgeAlert(alert.id)}>
                            Acknowledge
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No expiry alerts found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Alert Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expiry Alert</DialogTitle>
            <DialogDescription>Create a new expiry alert for a drug batch</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Drug Name *</Label>
              <Input value={newAlert.drug_name} onChange={(e) => setNewAlert({ ...newAlert, drug_name: e.target.value })} placeholder="e.g., Amoxicillin 500mg" />
            </div>
            <div>
              <Label>Batch Number *</Label>
              <Input value={newAlert.batch_number} onChange={(e) => setNewAlert({ ...newAlert, batch_number: e.target.value })} placeholder="e.g., BATCH-2025-001" />
            </div>
            <div>
              <Label>Expiry Date *</Label>
              <Input type="date" value={newAlert.expiry_date} onChange={(e) => setNewAlert({ ...newAlert, expiry_date: e.target.value })} />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input type="number" value={newAlert.quantity} onChange={(e) => setNewAlert({ ...newAlert, quantity: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={newAlert.location} onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })} placeholder="e.g., Warehouse A" />
            </div>
            <div>
              <Label>Severity</Label>
              <Select value={newAlert.severity} onValueChange={(v) => setNewAlert({ ...newAlert, severity: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddAlert}>Create Alert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
