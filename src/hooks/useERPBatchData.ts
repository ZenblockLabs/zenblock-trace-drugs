import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ERPBatch {
  batchId: string;
  drugId: string | null;
  drugName: string;
  quantity: number;
  status: string;
  createdAt: string;
  facility: string;
}

// Global event emitter for cross-component refresh with batch ID tracking
type RefreshListener = (updatedBatchId?: string) => void;
const refreshListeners = new Set<RefreshListener>();

export const triggerERPBatchRefresh = (updatedBatchId?: string) => {
  refreshListeners.forEach(listener => listener(updatedBatchId));
};

// Store for the last updated batch ID
let lastUpdatedBatchId: string | null = null;

export const getLastUpdatedBatchId = () => {
  const id = lastUpdatedBatchId;
  lastUpdatedBatchId = null; // Clear after reading
  return id;
};

export const useERPBatchData = (userRole: string) => {
  const [batches, setBatches] = useState<ERPBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightedBatchId, setHighlightedBatchId] = useState<string | null>(null);

  const fetchERPBatches = useCallback(async (updatedBatchId?: string) => {
    if (updatedBatchId) {
      setHighlightedBatchId(updatedBatchId);
      // Clear highlight after animation
      setTimeout(() => setHighlightedBatchId(null), 1500);
    }
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('erp_batches')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        throw fetchError;
      }
      
      const formattedBatches: ERPBatch[] = (data || []).map(batch => ({
        batchId: batch.batch_id,
        drugId: batch.drug_id || null,
        drugName: batch.drug_name,
        quantity: batch.quantity,
        status: batch.status || 'scanned',
        createdAt: batch.original_created_at 
          ? new Date(batch.original_created_at).toLocaleDateString()
          : new Date(batch.created_at || '').toLocaleDateString(),
        facility: batch.facility || 'Unknown'
      }));
      setBatches(formattedBatches);
      setError(null);
    } catch (err) {
      console.error('Error fetching ERP batches:', err);
      setError('Failed to fetch batch data from database');
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchERPBatches();
    
    // Register this instance's refresh function
    refreshListeners.add(fetchERPBatches);
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('erp_batches_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'erp_batches'
        },
        () => {
          fetchERPBatches();
        }
      )
      .subscribe();

    return () => {
      refreshListeners.delete(fetchERPBatches);
      supabase.removeChannel(channel);
    };
  }, [fetchERPBatches]);

  const deleteBatches = useCallback(async (batchIds: string[]) => {
    const { error: deleteError } = await supabase
      .from('erp_batches')
      .delete()
      .in('batch_id', batchIds);
    
    if (deleteError) {
      throw deleteError;
    }
    
    // Refresh data after delete
    await fetchERPBatches();
  }, [fetchERPBatches]);

  return {
    batches,
    loading,
    error,
    fetchERPBatches,
    deleteBatches,
    highlightedBatchId
  };
};
