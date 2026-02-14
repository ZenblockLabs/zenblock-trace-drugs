import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ComplianceViolation {
  id: string;
  drug_name: string;
  batch_number: string | null;
  violation_type: string;
  severity: string;
  description: string;
  status: string;
  assigned_to: string | null;
  resolution_notes: string | null;
  detected_at: string;
  resolved_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ComplianceAuditEntry {
  id: string;
  action: string;
  category: string;
  description: string;
  actor_name: string | null;
  actor_email: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface ExpiryAlert {
  id: string;
  drug_name: string;
  batch_number: string;
  expiry_date: string;
  quantity: number;
  location: string | null;
  severity: string;
  acknowledged: boolean;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  created_at: string;
}

export interface SupplyChainAnomaly {
  id: string;
  anomaly_type: string;
  description: string;
  affected_batch: string | null;
  severity: string;
  resolved: boolean;
  resolved_by: string | null;
  resolved_at: string | null;
  resolution_notes: string | null;
  detected_at: string;
  created_at: string;
}

export function useComplianceViolations() {
  const [violations, setViolations] = useState<ComplianceViolation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchViolations = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("compliance_violations")
      .select("*")
      .order("detected_at", { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch violations" });
    } else {
      setViolations(data as ComplianceViolation[]);
    }
    setLoading(false);
  }, [toast]);

  const addViolation = async (violation: Omit<ComplianceViolation, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("compliance_violations").insert(violation);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to add violation" });
      return false;
    }
    await logAuditEntry("violation_created", "Violations", `New violation: ${violation.description}`);
    await fetchViolations();
    return true;
  };

  const updateViolation = async (id: string, updates: Partial<ComplianceViolation>) => {
    const { error } = await supabase.from("compliance_violations").update(updates).eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update violation" });
      return false;
    }
    await logAuditEntry("violation_updated", "Violations", `Violation ${id} updated`);
    await fetchViolations();
    return true;
  };

  useEffect(() => { fetchViolations(); }, [fetchViolations]);

  return { violations, loading, fetchViolations, addViolation, updateViolation };
}

export function useExpiryAlerts() {
  const [alerts, setAlerts] = useState<ExpiryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("expiry_alerts")
      .select("*")
      .order("expiry_date", { ascending: true });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch expiry alerts" });
    } else {
      setAlerts(data as ExpiryAlert[]);
    }
    setLoading(false);
  }, [toast]);

  const acknowledgeAlert = async (id: string) => {
    const { error } = await supabase
      .from("expiry_alerts")
      .update({ acknowledged: true, acknowledged_at: new Date().toISOString() })
      .eq("id", id);
    if (!error) {
      await logAuditEntry("alert_acknowledged", "Expiry Alerts", `Alert ${id} acknowledged`);
      await fetchAlerts();
    }
  };

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  return { alerts, loading, fetchAlerts, acknowledgeAlert };
}

export function useSupplyChainAnomalies() {
  const [anomalies, setAnomalies] = useState<SupplyChainAnomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnomalies = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("supply_chain_anomalies")
      .select("*")
      .order("detected_at", { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch anomalies" });
    } else {
      setAnomalies(data as SupplyChainAnomaly[]);
    }
    setLoading(false);
  }, [toast]);

  const resolveAnomaly = async (id: string, notes: string) => {
    const { error } = await supabase
      .from("supply_chain_anomalies")
      .update({ resolved: true, resolved_at: new Date().toISOString(), resolution_notes: notes })
      .eq("id", id);
    if (!error) {
      await logAuditEntry("anomaly_resolved", "Anomalies", `Anomaly ${id} resolved`);
      await fetchAnomalies();
    }
  };

  useEffect(() => { fetchAnomalies(); }, [fetchAnomalies]);

  return { anomalies, loading, fetchAnomalies, resolveAnomaly };
}

export function useComplianceAuditTrail() {
  const [entries, setEntries] = useState<ComplianceAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("compliance_audit_trail")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch audit trail" });
    } else {
      setEntries(data as ComplianceAuditEntry[]);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  return { entries, loading, fetchEntries };
}

// Helper to log audit entries
async function logAuditEntry(action: string, category: string, description: string, metadata?: Record<string, any>) {
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from("compliance_audit_trail").insert({
    action,
    category,
    description,
    actor_name: user?.user_metadata?.full_name || user?.email || "System",
    actor_email: user?.email || null,
    metadata: metadata || {},
  });
}

export { logAuditEntry };
