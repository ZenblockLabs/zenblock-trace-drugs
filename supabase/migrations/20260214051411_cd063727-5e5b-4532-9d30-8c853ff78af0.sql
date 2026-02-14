
-- Compliance Violations tracking
CREATE TABLE public.compliance_violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_name text NOT NULL,
  batch_number text,
  violation_type text NOT NULL,
  severity text NOT NULL DEFAULT 'warning',
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  assigned_to text,
  resolution_notes text,
  detected_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.compliance_violations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view violations"
  ON public.compliance_violations FOR SELECT
  USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can create violations"
  ON public.compliance_violations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can update violations"
  ON public.compliance_violations FOR UPDATE
  USING (auth.role() = 'authenticated'::text);

-- Compliance Audit Trail
CREATE TABLE public.compliance_audit_trail (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  actor_name text,
  actor_email text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.compliance_audit_trail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view audit trail"
  ON public.compliance_audit_trail FOR SELECT
  USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can create audit entries"
  ON public.compliance_audit_trail FOR INSERT
  WITH CHECK (auth.role() = 'authenticated'::text);

-- Expiry Alerts table
CREATE TABLE public.expiry_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_name text NOT NULL,
  batch_number text NOT NULL,
  expiry_date date NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  location text,
  severity text NOT NULL DEFAULT 'info',
  acknowledged boolean NOT NULL DEFAULT false,
  acknowledged_by uuid,
  acknowledged_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.expiry_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view expiry alerts"
  ON public.expiry_alerts FOR SELECT
  USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can manage expiry alerts"
  ON public.expiry_alerts FOR ALL
  USING (auth.role() = 'authenticated'::text)
  WITH CHECK (auth.role() = 'authenticated'::text);

-- Supply Chain Anomalies table
CREATE TABLE public.supply_chain_anomalies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anomaly_type text NOT NULL,
  description text NOT NULL,
  affected_batch text,
  severity text NOT NULL DEFAULT 'warning',
  resolved boolean NOT NULL DEFAULT false,
  resolved_by uuid,
  resolved_at timestamptz,
  resolution_notes text,
  detected_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.supply_chain_anomalies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view anomalies"
  ON public.supply_chain_anomalies FOR SELECT
  USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Authenticated users can manage anomalies"
  ON public.supply_chain_anomalies FOR ALL
  USING (auth.role() = 'authenticated'::text)
  WITH CHECK (auth.role() = 'authenticated'::text);

-- Trigger for updated_at on violations
CREATE TRIGGER update_compliance_violations_updated_at
  BEFORE UPDATE ON public.compliance_violations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
