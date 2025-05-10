
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleRequest } from './handler.ts';

console.log("Track-drug function loaded");

serve(async (req) => {
  console.log("Track-drug function received request:", req.method);
  return handleRequest(req);
});
