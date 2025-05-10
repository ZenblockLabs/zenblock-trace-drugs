
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleRequest } from './handler.ts';

console.log("Track-drug function loaded");

serve(async (req) => {
  console.log("Track-drug function received request:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
      },
      status: 204
    });
  }
  
  try {
    return await handleRequest(req);
  } catch (error) {
    console.error("Error handling track-drug request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
        },
        status: 500
      }
    );
  }
});
