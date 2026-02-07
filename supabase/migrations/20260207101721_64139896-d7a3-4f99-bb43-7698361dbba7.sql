
-- Tighten coldchain_events INSERT policy
DROP POLICY IF EXISTS "Authenticated users can insert coldchain events" ON coldchain_events;
CREATE POLICY "Users can insert coldchain events for their org shipments"
ON coldchain_events FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND (
    batch_id IN (
      SELECT b.id FROM batches b
      JOIN user_profiles up ON b.organization_id = up.organization_id
      WHERE up.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
);

-- Tighten aggregations policy
DROP POLICY IF EXISTS "Authenticated users can manage aggregations" ON aggregations;
CREATE POLICY "Users can manage own org aggregations"
ON aggregations FOR ALL
USING (
  batch_id IN (
    SELECT b.id FROM batches b
    JOIN user_profiles up ON b.organization_id = up.organization_id
    WHERE up.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  batch_id IN (
    SELECT b.id FROM batches b
    JOIN user_profiles up ON b.organization_id = up.organization_id
    WHERE up.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Keep the SELECT policy for aggregations
DROP POLICY IF EXISTS "Authenticated users can view aggregations" ON aggregations;

-- Tighten shipments policy
DROP POLICY IF EXISTS "Authenticated users can manage shipments" ON shipments;
CREATE POLICY "Users can manage own org shipments"
ON shipments FOR ALL
USING (
  batch_id IN (
    SELECT b.id FROM batches b
    JOIN user_profiles up ON b.organization_id = up.organization_id
    WHERE up.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  batch_id IN (
    SELECT b.id FROM batches b
    JOIN user_profiles up ON b.organization_id = up.organization_id
    WHERE up.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Keep the SELECT policy for shipments
DROP POLICY IF EXISTS "Authenticated users can view shipments" ON shipments;
CREATE POLICY "Users can view own org shipments"
ON shipments FOR SELECT
USING (
  batch_id IN (
    SELECT b.id FROM batches b
    JOIN user_profiles up ON b.organization_id = up.organization_id
    WHERE up.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Tighten recall_affected_items policy
DROP POLICY IF EXISTS "Authenticated users can manage recall items" ON recall_affected_items;
CREATE POLICY "Admins can manage recall items"
ON recall_affected_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Keep the SELECT policy for recall_affected_items
DROP POLICY IF EXISTS "Authenticated users can view recall items" ON recall_affected_items;
CREATE POLICY "Authenticated users can view recall items"
ON recall_affected_items FOR SELECT
USING (auth.role() = 'authenticated');

-- Tighten recall_events INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create recall events" ON recall_events;
CREATE POLICY "Admins can create recall events"
ON recall_events FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Tighten erp_batches permissive policies
DROP POLICY IF EXISTS "Anyone can delete erp_batches" ON erp_batches;
DROP POLICY IF EXISTS "Anyone can insert erp_batches" ON erp_batches;
DROP POLICY IF EXISTS "Anyone can view erp_batches" ON erp_batches;

CREATE POLICY "Authenticated users can insert erp_batches"
ON erp_batches FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view erp_batches"
ON erp_batches FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete erp_batches"
ON erp_batches FOR DELETE
USING (auth.role() = 'authenticated');
