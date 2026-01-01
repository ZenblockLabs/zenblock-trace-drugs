import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ERPBatch {
  batchId: string;
  drugName: string;
  quantity: number;
  status: string;
  createdAt: string;
  facility: string;
}

export const useERPBatchData = (userRole: string) => {
  const [batches, setBatches] = useState<ERPBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchERPBatches = async () => {
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
  };

  useEffect(() => {
    fetchERPBatches();
    
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
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    batches,
    loading,
    error,
    fetchERPBatches
  };
};
