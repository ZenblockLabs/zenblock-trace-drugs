
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

console.log("Drug API function loaded");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Mock chaincode interaction
const simulateChaincodeInteraction = async (action: string, fcn: string, args: string[]) => {
  console.log(`Simulating ${action} for function '${fcn}' with args:`, args);
  
  switch (fcn) {
    case 'RegisterDrug':
      return { 
        success: true, 
        batchId: JSON.parse(args[0]).batchId,
        status: 'registered'
      };
    case 'TransferOwnership':
      return { 
        success: true, 
        transferId: crypto.randomUUID(),
        status: 'transferred'
      };
    case 'LogEvent':
      return { 
        success: true, 
        eventId: crypto.randomUUID(),
        status: 'logged'
      };
    case 'GetDrugHistory':
      return [
        { eventType: 'manufactured', timestamp: new Date().toISOString(), actor: 'Manufacturer A' },
        { eventType: 'shipped', timestamp: new Date().toISOString(), actor: 'Distributor B' }
      ];
    default:
      return { success: true, message: 'Operation completed' };
  }
};

async function authenticateUser(req: Request): Promise<{ user: any; role: string } | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error } = await supabaseClient.auth.getUser();
  if (error || !user) return null;

  // Get user role from user_profiles table
  const { data: profile } = await supabaseClient
    .from('user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  const role = profile?.role || 'unknown';
  
  // Map database roles to drug API roles based on email as fallback
  let drugApiRole = role;
  if (role === 'producer' || role === 'brand_manager') {
    // Determine specific pharma role from email pattern
    const email = user.email?.toLowerCase() || '';
    if (email.includes('manufacturer')) drugApiRole = 'manufacturer';
    else if (email.includes('distributor')) drugApiRole = 'distributor';
    else if (email.includes('dispenser')) drugApiRole = 'dispenser';
    else if (email.includes('regulator')) drugApiRole = 'regulator';
    else drugApiRole = 'manufacturer'; // default for producers
  }

  return { user, role: drugApiRole };
}

serve(async (req) => {
  console.log("Drug API function received request:", req.method, req.url);
  
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204
    });
  }
  
  try {
    // Authenticate the user via JWT
    const authResult = await authenticateUser(req);
    if (!authResult) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Please log in.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { role: userRole } = authResult;

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const endpoint = pathSegments[pathSegments.length - 1];
    
    console.log(`Processing ${req.method} request for endpoint: ${endpoint}, role: ${userRole}`);

    switch (endpoint) {
      case 'register':
        return await handleDrugRegistration(req, userRole);
      case 'ship':
        return await handleDrugShipment(req, userRole);
      case 'receive':
        return await handleDrugReceive(req, userRole);
      case 'dispense':
        return await handleDrugDispense(req, userRole);
      case 'history':
        return await handleDrugHistory(req, userRole);
      case 'compliance-status':
        return await handleComplianceStatus(req, userRole);
      case 'batch':
        return await handleGetDrugBatch(req, userRole);
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown endpoint' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404 
          }
        );
    }
  } catch (error) {
    console.error("Error handling drug API request:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

async function handleDrugRegistration(req: Request, userRole: string): Promise<Response> {
  if (userRole !== 'manufacturer') {
    return new Response(
      JSON.stringify({ error: 'Only manufacturers can register drugs' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
    );
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );
  }

  const registrationData = await req.json();
  const result = await simulateChaincodeInteraction('invoke', 'RegisterDrug', [JSON.stringify(registrationData)]);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data: result,
      transactionId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
  );
}

async function handleDrugShipment(req: Request, userRole: string): Promise<Response> {
  if (userRole !== 'distributor' && userRole !== 'manufacturer') {
    return new Response(
      JSON.stringify({ error: 'Only distributors and manufacturers can ship drugs' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
    );
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );
  }

  const shipmentData = await req.json();
  const result = await simulateChaincodeInteraction('invoke', 'TransferOwnership', [JSON.stringify(shipmentData)]);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data: result,
      transactionId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  );
}

async function handleDrugReceive(req: Request, userRole: string): Promise<Response> {
  if (userRole !== 'distributor' && userRole !== 'dispenser') {
    return new Response(
      JSON.stringify({ error: 'Only distributors and dispensers can receive drugs' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
    );
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );
  }

  const receiveData = await req.json();
  const result = await simulateChaincodeInteraction('invoke', 'LogEvent', [JSON.stringify({
    ...receiveData,
    eventType: 'receive'
  })]);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data: result,
      transactionId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  );
}

async function handleDrugDispense(req: Request, userRole: string): Promise<Response> {
  if (userRole !== 'dispenser') {
    return new Response(
      JSON.stringify({ error: 'Only dispensers can dispense drugs' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
    );
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );
  }

  const dispenseData = await req.json();
  const result = await simulateChaincodeInteraction('invoke', 'LogEvent', [JSON.stringify({
    ...dispenseData,
    eventType: 'dispense'
  })]);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data: result,
      transactionId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  );
}

async function handleDrugHistory(req: Request, userRole: string): Promise<Response> {
  if (userRole !== 'regulator') {
    return new Response(
      JSON.stringify({ error: 'Only regulators can view full drug history' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
    );
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );
  }

  const url = new URL(req.url);
  const batchId = url.searchParams.get('batchId');
  
  if (!batchId) {
    return new Response(
      JSON.stringify({ error: 'Missing batchId parameter' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  const result = await simulateChaincodeInteraction('query', 'GetDrugHistory', [batchId]);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data: result,
      batchId: batchId,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  );
}

async function handleComplianceStatus(req: Request, userRole: string): Promise<Response> {
  if (userRole !== 'regulator') {
    return new Response(
      JSON.stringify({ error: 'Only regulators can check compliance status' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
    );
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );
  }

  const url = new URL(req.url);
  const batchId = url.searchParams.get('batchId');
  
  if (!batchId) {
    return new Response(
      JSON.stringify({ error: 'Missing batchId parameter' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  const complianceStatus = {
    isCompliant: true,
    violations: [],
    score: 95,
    checks: {
      hasManufacturingRecord: true,
      hasQualityCheck: true,
      hasProperChainOfCustody: true,
      withinShelfLife: true
    }
  };
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data: complianceStatus,
      batchId: batchId,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  );
}

async function handleGetDrugBatch(req: Request, userRole: string): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );
  }

  const url = new URL(req.url);
  const batchId = url.searchParams.get('batchId');
  
  if (!batchId) {
    return new Response(
      JSON.stringify({ error: 'Missing batchId parameter' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }

  const mockBatchData = {
    batchId,
    drugName: "Sample Drug",
    manufacturerName: "Pharma Corp",
    status: "active",
    manufacturingDate: "2024-01-15",
    expiryDate: "2026-01-15"
  };
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data: mockBatchData,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  );
}
