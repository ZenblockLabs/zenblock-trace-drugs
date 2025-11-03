import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AggregationPayload {
  action: 'aggregate' | 'disaggregate';
  parentId: string;
  childIds: string[];
  parentType: 'pallet' | 'case' | 'container';
  childType: 'case' | 'unit' | 'pallet';
  batchId?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const payload: AggregationPayload = await req.json();
    
    if (payload.action === 'aggregate') {
      // Create aggregation records
      const aggregations = payload.childIds.map(childId => ({
        parent_id: payload.parentId,
        child_id: childId,
        parent_type: payload.parentType,
        child_type: payload.childType,
        batch_id: payload.batchId,
        status: 'active',
      }));

      const { data, error } = await supabaseClient
        .from('aggregations')
        .insert(aggregations)
        .select();

      if (error) throw error;

      console.log(`Created ${aggregations.length} aggregation records`);

      return new Response(
        JSON.stringify({
          success: true,
          data,
          message: `Successfully aggregated ${payload.childIds.length} items`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else if (payload.action === 'disaggregate') {
      // Disaggregate by updating status and setting disaggregation date
      const { data, error } = await supabaseClient
        .from('aggregations')
        .update({
          status: 'disaggregated',
          disaggregation_date: new Date().toISOString(),
        })
        .eq('parent_id', payload.parentId)
        .in('child_id', payload.childIds)
        .select();

      if (error) throw error;

      console.log(`Disaggregated ${data.length} items`);

      return new Response(
        JSON.stringify({
          success: true,
          data,
          message: `Successfully disaggregated ${data.length} items`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      throw new Error('Invalid action. Must be "aggregate" or "disaggregate"');
    }
  } catch (error) {
    console.error('Error managing aggregation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
