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

    // Verify authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - valid authentication required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    console.log('Authenticated user:', user.id);

    const payload: RecallPayload = await req.json();

    // Validate action
    if (!payload.action || !['initiate', 'update_item', 'add_event'].includes(payload.action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Must be "initiate", "update_item", or "add_event"' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    if (payload.action === 'initiate') {
      // Validate required fields for initiate
      if (!payload.lotNumber || !payload.reason) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields for initiate: lotNumber, reason' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }

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
                initiatedBy: payload.raisedBy || user.email,
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
          actor_name: payload.raisedBy || user.email,
          actor_role: 'regulator',
          metadata: {
            initiated_by_user_id: user.id,
          },
        });

        console.log('Recall initiated:', recallId, 'by user:', user.id);

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
      // Validate required fields for update_item
      if (!payload.itemUpdate.itemId || !payload.itemUpdate.status) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields for update_item: itemId, status' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }

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

      console.log('Recall item updated:', payload.itemUpdate.itemId, 'by user:', user.id);

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else if (payload.action === 'add_event' && payload.recallId && payload.eventData) {
      // Validate required fields for add_event
      if (!payload.eventData.eventType || !payload.eventData.description) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields for add_event: eventType, description' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }

      // Add recall event
      const { data, error } = await supabaseClient
        .from('recall_events')
        .insert({
          recall_id: payload.recallId,
          event_type: payload.eventData.eventType,
          description: payload.eventData.description,
          actor_name: payload.eventData.actorName || user.email,
          actor_role: payload.eventData.actorRole,
          metadata: {
            added_by_user_id: user.id,
          },
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Recall event added:', data.id, 'by user:', user.id);

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    throw new Error('Invalid action or missing required data');
  } catch (error) {
    console.error('Error managing recall:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
