import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecallPayload {
  action: 'initiate' | 'update_item' | 'add_event';
  recallId?: string;
  lotNumber?: string;
  batchId?: string;
  reason?: string;
  scope?: string;
  raisedBy?: string;
  affectedItems?: Array<{
    itemType: 'batch' | 'unit' | 'shipment';
    itemId: string;
    sgtin?: string;
    lotNumber?: string;
    currentLocation?: string;
    ownerGln?: string;
  }>;
  itemUpdate?: {
    itemId: string;
    status: 'identified' | 'notified' | 'quarantined' | 'returned' | 'disposed';
  };
  eventData?: {
    eventType: string;
    description: string;
    actorName: string;
    actorRole: string;
  };
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

    const payload: RecallPayload = await req.json();
    
    if (payload.action === 'initiate') {
      // Create recall via fabric-chaincode
      const { data: recallResult, error: recallError } = await supabaseClient.functions.invoke(
        'fabric-chaincode',
        {
          body: {
            action: 'invoke',
            chaincodeFcn: 'InitiateRecall',
            args: [
              JSON.stringify({
                sgtin: payload.lotNumber,
                reason: payload.reason,
                initiatedBy: payload.raisedBy,
                timestamp: new Date().toISOString(),
              }),
            ],
          },
        }
      );

      if (recallError) throw recallError;

      // Find all affected items
      const { data: batches } = await supabaseClient
        .from('batches')
        .select('id')
        .eq('batch_number', payload.lotNumber);

      if (batches && batches.length > 0 && payload.affectedItems) {
        const recallId = crypto.randomUUID();
        
        // Insert affected items
        const items = payload.affectedItems.map(item => ({
          recall_id: recallId,
          item_type: item.itemType,
          item_id: item.itemId,
          sgtin: item.sgtin,
          lot_number: item.lotNumber || payload.lotNumber,
          current_location: item.currentLocation,
          owner_gln: item.ownerGln,
          status: 'identified',
        }));

        await supabaseClient.from('recall_affected_items').insert(items);

        // Create initial recall event
        await supabaseClient.from('recall_events').insert({
          recall_id: recallId,
          event_type: 'recall_initiated',
          description: payload.reason,
          actor_name: payload.raisedBy,
          actor_role: 'regulator',
        });

        return new Response(
          JSON.stringify({
            success: true,
            recallId,
            affectedItemsCount: items.length,
            blockchainTxId: recallResult?.txId,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Recall initiated on blockchain',
          blockchainTxId: recallResult?.txId,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else if (payload.action === 'update_item' && payload.itemUpdate) {
      // Update affected item status
      const { data, error } = await supabaseClient
        .from('recall_affected_items')
        .update({
          status: payload.itemUpdate.status,
          action_taken_at: new Date().toISOString(),
        })
        .eq('id', payload.itemUpdate.itemId)
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else if (payload.action === 'add_event' && payload.recallId && payload.eventData) {
      // Add recall event
      const { data, error } = await supabaseClient
        .from('recall_events')
        .insert({
          recall_id: payload.recallId,
          event_type: payload.eventData.eventType,
          description: payload.eventData.description,
          actor_name: payload.eventData.actorName,
          actor_role: payload.eventData.actorRole,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error managing recall:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
