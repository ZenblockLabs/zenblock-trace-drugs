
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Handle GET requests (no body) and POST requests (with body)
    let action = 'ping'; // Default action for GET requests
    
    if (req.method === 'POST') {
      const body = await req.json();
      action = body.action || 'ping';
    }

    if (action === 'ping') {
      // In a real implementation, this would check the connection to the Fabric network
      // and return detailed status about the network, peers, and orderers
      
      // Simulate different network conditions for testing
      const isConnected = Math.random() > 0.3; // 70% chance of success for demo
      
      if (isConnected) {
        return new Response(
          JSON.stringify({ 
            status: 'success', 
            message: 'Fabric network connection is available',
            timestamp: new Date().toISOString(),
            network: {
              name: 'pharma-supply-net',
              channelName: 'pharma-channel',
              peers: [
                { name: 'peer0.manufacturer.example.com', status: 'active' },
                { name: 'peer0.distributor.example.com', status: 'active' }
              ],
              orderers: [
                { name: 'orderer.example.com', status: 'active' }
              ]
            }
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      } else {
        // Simulating network failure
        return new Response(
          JSON.stringify({ 
            status: 'error', 
            message: 'Unable to connect to Fabric network',
            timestamp: new Date().toISOString(),
            error: 'Connection timeout'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 503 
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
  } catch (error) {
    console.error('Error in fabric-ping function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
