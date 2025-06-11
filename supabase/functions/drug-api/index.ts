
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleDrugLifecycleRequest } from '../fabric-chaincode/drugLifecycleHandler.ts';

console.log("Drug API function loaded");

serve(async (req) => {
  console.log("Drug API function received request:", req.method, req.url);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-user-role, x-user-id"
      },
      status: 204
    });
  }
  
  try {
    // Extract user info from request headers or token
    // For now, we'll use mock role extraction based on the user email pattern
    const authHeader = req.headers.get('authorization');
    let userRole = 'unknown';
    let userId = 'unknown';
    
    // Simple role extraction - in a real implementation, this would decode JWT
    // For demo purposes, we'll extract from a custom header or use default
    userRole = req.headers.get('x-user-role') || 'manufacturer';
    userId = req.headers.get('x-user-id') || 'demo-user';
    
    // Add role headers for the handler
    const modifiedReq = new Request(req.url, {
      method: req.method,
      headers: new Headers({
        ...Object.fromEntries(req.headers.entries()),
        'x-user-role': userRole,
        'x-user-id': userId
      }),
      body: req.body
    });
    
    return await handleDrugLifecycleRequest(modifiedReq);
  } catch (error) {
    console.error("Error handling drug API request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-user-role, x-user-id"
        },
        status: 500
      }
    );
  }
});
