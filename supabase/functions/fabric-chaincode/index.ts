
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleRequest } from './requestHandler.ts';

serve(async (req) => {
  return handleRequest(req);
});
