
import { corsHeaders } from './cors.ts';
import { simulateChaincodeInteraction } from './chaincodeSimulator.ts';

export async function handleRequest(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { action, chaincodeFcn, args } = await req.json();

    if (!action || !chaincodeFcn) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: action and/or chaincodeFcn' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Validate the action
    if (action !== 'invoke' && action !== 'query') {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Must be either "invoke" or "query"' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Process the chaincode interaction
    console.log(`Processing ${action} for function '${chaincodeFcn}' with args:`, args);
    const result = await simulateChaincodeInteraction(action, chaincodeFcn, args || []);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in fabric-chaincode function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}
