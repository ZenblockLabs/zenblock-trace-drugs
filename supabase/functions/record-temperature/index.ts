import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TemperaturePayload {
  shipmentId: string;
  batchId?: string;
  tempMin: number;
  tempMax: number;
  tempAvg?: number;
  humidity?: number;
  sensorId?: string;
  locationGln?: string;
  timestamp?: string;
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

    const payload: TemperaturePayload = await req.json();

    // Validate required fields
    if (!payload.shipmentId || payload.tempMin === undefined || payload.tempMax === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: shipmentId, tempMin, tempMax' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Validate temperature values are numbers
    if (typeof payload.tempMin !== 'number' || typeof payload.tempMax !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Temperature values must be numbers' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    // Calculate excursion flag (assuming safe range 2-8°C for cold chain)
    const excursionFlag = payload.tempMin < 2 || payload.tempMax > 8;
    const excursionDetails = excursionFlag
      ? `Temperature out of range: ${payload.tempMin}°C - ${payload.tempMax}°C`
      : null;

    // Create event hash for blockchain anchoring
    const eventData = JSON.stringify({
      shipmentId: payload.shipmentId,
      tempMin: payload.tempMin,
      tempMax: payload.tempMax,
      timestamp: payload.timestamp || new Date().toISOString(),
    });
    
    const encoder = new TextEncoder();
    const data = encoder.encode(eventData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const eventHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Insert cold chain event
    const { data: coldchainEvent, error: insertError } = await supabaseClient
      .from('coldchain_events')
      .insert({
        shipment_id: payload.shipmentId,
        batch_id: payload.batchId,
        temp_min: payload.tempMin,
        temp_max: payload.tempMax,
        temp_avg: payload.tempAvg,
        humidity: payload.humidity,
        excursion_flag: excursionFlag,
        excursion_details: excursionDetails,
        sensor_id: payload.sensorId,
        location_gln: payload.locationGln,
        event_hash: eventHash,
        recorded_at: payload.timestamp || new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // If excursion detected, create alert
    if (excursionFlag && payload.batchId) {
      await supabaseClient.from('batch_events').insert({
        batch_id: payload.batchId,
        event_type: 'temperature_alert',
        title: 'Temperature Excursion Detected',
        description: excursionDetails,
        metadata: {
          shipment_id: payload.shipmentId,
          temp_min: payload.tempMin,
          temp_max: payload.tempMax,
          sensor_id: payload.sensorId,
          recorded_by: user.id,
        },
      });
    }

    console.log('Temperature event recorded:', coldchainEvent.id, 'by user:', user.id);

    return new Response(
      JSON.stringify({
        success: true,
        data: coldchainEvent,
        excursionDetected: excursionFlag,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error recording temperature:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
