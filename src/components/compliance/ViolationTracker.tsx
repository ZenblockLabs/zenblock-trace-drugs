import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useComplianceViolations } from "@/hooks/useComplianceData";
import { format } from "date-fns";
import { AlertTriangle, Plus, CheckCircle, Clock, Loader2, Search, Filter } from "lucide-react";

export function ViolationTracker() {
  const { violations, loading, addViolation, updateViolation } = useComplianceViolations();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newViolation, setNewViolation] = useState({
    drug_name: "",
    batch_number: "",
    violation_type: "documentation",
    severity: "warning",
    description: "",
    assigned_to: "",
  });

  const handleAdd = async () => {
    const success = await addViolation({
      ...newViolation,
      status: "open",
      detected_at: new Date().toISOString(),
      resolved_at: null,
      resolution_notes: null,
      created_by: null,
    });
    if (success) {
      setIsAddOpen(false);
      setNewViolation({ drug_name: "", batch_number: "", violation_type: "documentation", severity: "warning", description: "", assigned_to: "" });
    }
  };

  const handleResolve = async (id: string) => {
    await updateViolation(id, { status: "resolved", resolved_at: new Date().toISOString() });
  };

  const filtered = violations.filter((v) => {
    const matchesSearch = v.drug_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCount = violations.filter((v) => v.status === "open").length;
  const criticalCount = violations.filter((v) => v.severity === "critical" && v.status === "open").length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4 text-center">
            <p className="text-3xl font-bold">{violations.length}</p>
            <p className="text-sm text-muted-foreground">Total Violations</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="pt-5 pb-4 text-center">
            <p className="text-3xl font-bold text-destructive">{openCount}</p>
            <p className="text-sm text-muted-foreground">Open</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-5 pb-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{criticalCount}</p>
            <p className="text-sm text-muted-foreground">Critical Open</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search violations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Report Violation</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report New Violation</DialogTitle>
              <DialogDescription>Log a new compliance violation for tracking and resolution.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Drug Name</Label>
                <Input value={newViolation.drug_name} onChange={(e) => setNewViolation((p) => ({ ...p, drug_name: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Batch Number</Label>
                <Input value={newViolation.batch_number} onChange={(e) => setNewViolation((p) => ({ ...p, batch_number: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select value={newViolation.violation_type} onValueChange={(v) => setNewViolation((p) => ({ ...p, violation_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="documentation">Documentation</SelectItem>
                      <SelectItem value="temperature">Temperature</SelectItem>
                      <SelectItem value="serialization">Serialization</SelectItem>
                      <SelectItem value="labeling">Labeling</SelectItem>
                      <SelectItem value="storage">Storage</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Severity</Label>
                  <Select value={newViolation.severity} onValueChange={(v) => setNewViolation((p) => ({ ...p, severity: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea value={newViolation.description} onChange={(e) => setNewViolation((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Assigned To</Label>
                <Input value={newViolation.assigned_to} onChange={(e) => setNewViolation((p) => ({ ...p, assigned_to: e.target.value }))} placeholder="Name or email" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!newViolation.drug_name || !newViolation.description}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No violations found</p>
            <p className="text-sm mt-1">All clear — or adjust your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((v) => (
            <Card key={v.id} className={`hover:shadow-md transition-shadow ${v.status === "resolved" ? "opacity-60" : ""}`}>
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    v.severity === "critical" ? "bg-destructive/10" : v.severity === "warning" ? "bg-amber-500/10" : "bg-muted"
                  }`}>
                    <AlertTriangle className={`h-5 w-5 ${
                      v.severity === "critical" ? "text-destructive" : v.severity === "warning" ? "text-amber-500" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{v.drug_name}</p>
                      <Badge variant={v.severity === "critical" ? "destructive" : "secondary"} className="capitalize text-xs">
                        {v.severity}
                      </Badge>
                      <Badge variant="outline" className="capitalize text-xs">{v.violation_type}</Badge>
                      <Badge variant={v.status === "resolved" ? "outline" : v.status === "open" ? "destructive" : "secondary"} className="capitalize text-xs">
                        {v.status === "resolved" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {v.status === "open" && <Clock className="h-3 w-3 mr-1" />}
                        {v.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{v.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                      {v.batch_number && <span>Batch: <span className="font-mono font-medium text-foreground">{v.batch_number}</span></span>}
                      <span>Detected: {format(new Date(v.detected_at), "MMM d, yyyy")}</span>
                      {v.assigned_to && <span>Assigned: {v.assigned_to}</span>}
                    </div>
                  </div>
                  {v.status === "open" && (
                    <Button variant="outline" size="sm" className="shrink-0 text-xs" onClick={() => handleResolve(v.id)}>
                      <CheckCircle className="h-3 w-3 mr-1" /> Resolve
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
