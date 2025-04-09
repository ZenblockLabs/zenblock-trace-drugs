
import { corsHeaders } from './cors.ts';
import { simulateChaincodeInteraction } from './chaincodeSimulator.ts';

export async function handleRequest(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for specific API routes
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const endpoint = pathSegments[pathSegments.length - 2] === 'recall' ? 'recall' : '';
    const sgtinParam = endpoint === 'recall' ? pathSegments[pathSegments.length - 1] : '';

    // Handle recall routes
    if (endpoint === 'recall') {
      // GET /recall/:sgtin - Check recall status
      if (req.method === 'GET' && sgtinParam) {
        const result = await simulateChaincodeInteraction('query', 'IsRecalled', [sgtinParam]);
        
        return new Response(
          JSON.stringify(result),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }
      
      // POST /recall - Initiate recall
      if (req.method === 'POST') {
        const recallData = await req.json();
        
        if (!recallData.sgtin) {
          return new Response(
            JSON.stringify({ error: 'Missing required parameter: sgtin' }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400 
            }
          );
        }
        
        const result = await simulateChaincodeInteraction('invoke', 'InitiateRecall', [JSON.stringify(recallData)]);
        
        return new Response(
          JSON.stringify(result),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }
    }

    // If not a recall endpoint, proceed with standard chaincode interaction
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
