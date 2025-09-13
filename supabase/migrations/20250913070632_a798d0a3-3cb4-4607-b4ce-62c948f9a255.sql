-- Remove incorrect Zenblock Labs batches with organic/ayurvedic products
DELETE FROM public.kadha_capsules WHERE batch_id IN (
  SELECT id FROM public.batches WHERE batch_number IN ('BTH-001', 'BTH-002', 'BTH-003')
);

DELETE FROM public.batch_events WHERE batch_id IN (
  SELECT id FROM public.batches WHERE batch_number IN ('BTH-001', 'BTH-002', 'BTH-003')
);

DELETE FROM public.event_images WHERE batch_id IN (
  SELECT id FROM public.batches WHERE batch_number IN ('BTH-001', 'BTH-002', 'BTH-003')
);

DELETE FROM public.batches WHERE batch_number IN ('BTH-001', 'BTH-002', 'BTH-003');