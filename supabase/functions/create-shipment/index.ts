import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ShipmentPayload {
  batchId: string;
  shipmentNumber: string;
  fromGln: string;
  toGln: string;
  fromLocation: string;
  toLocation: string;
  departureDate?: string;
  expectedArrival?: string;
  temperatureControlled?: boolean;
  routeInfo?: Record<string, any>;
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

    const payload: ShipmentPayload = await req.json();

    // Validate required fields
    if (!payload.batchId || !payload.shipmentNumber || !payload.fromGln || !payload.toGln) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: batchId, shipmentNumber, fromGln, toGln' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    // Create shipment document hash
    const shipmentData = JSON.stringify({
      shipmentNumber: payload.shipmentNumber,
      fromGln: payload.fromGln,
      toGln: payload.toGln,
      departureDate: payload.departureDate,
      batchId: payload.batchId,
    });
    
    const encoder = new TextEncoder();
    const data = encoder.encode(shipmentData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const shipmentDocHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Create shipment record
    const { data: shipment, error: insertError } = await supabaseClient
      .from('shipments')
      .insert({
        batch_id: payload.batchId,
        shipment_number: payload.shipmentNumber,
        from_gln: payload.fromGln,
        to_gln: payload.toGln,
        from_location: payload.fromLocation,
        to_location: payload.toLocation,
        departure_date: payload.departureDate,
        expected_arrival: payload.expectedArrival,
        status: 'pending',
        temperature_controlled: payload.temperatureControlled || false,
        route_info: payload.routeInfo || {},
        shipment_doc_hash: shipmentDocHash,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Create corresponding batch event
    await supabaseClient.from('batch_events').insert({
      batch_id: payload.batchId,
      event_type: 'shipping',
      title: 'Shipment Created',
      description: `Shipment ${payload.shipmentNumber} from ${payload.fromLocation} to ${payload.toLocation}`,
      location: payload.fromLocation,
      metadata: {
        shipment_id: shipment.id,
        from_gln: payload.fromGln,
        to_gln: payload.toGln,
        temperature_controlled: payload.temperatureControlled,
        created_by: user.id,
      },
    });

    console.log('Shipment created:', shipment.id, 'by user:', user.id);

    return new Response(
      JSON.stringify({
        success: true,
        data: shipment,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating shipment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
