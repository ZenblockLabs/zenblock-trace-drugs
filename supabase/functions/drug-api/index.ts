import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

console.log("Drug API function loaded");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Mock chaincode interaction
const simulateChaincodeInteraction = async (action: string, fcn: string, args: string[]) => {
  console.log(`Simulating ${action} for function '${fcn}' with args:`, args);
  
  // Return mock data based on function name
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

// Helper function to get user and role from Supabase
async function getUserWithRole(supabaseClient: any) {
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
  
  if (authError || !user) {
    return { user: null, role: null, error: authError };
  }

  // Get user role from user_roles table
  const { data: roleData, error: roleError } = await supabaseClient
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  // Default to 'user' if no role found
  const role = roleData?.role || 'user';

  return { user, role, error: null };
}

Deno.serve(async (req) => {
  console.log("Drug API function received request:", req.method, req.url);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204
    });
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
    const { user, role: userRole, error: authError } = await getUserWithRole(supabaseClient);
    
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

    console.log(`Authenticated user: ${user.id}, role: ${userRole}`);

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const endpoint = pathSegments[pathSegments.length - 1];
    
    console.log(`Processing ${req.method} request for endpoint: ${endpoint}, role: ${userRole}`);

    switch (endpoint) {
      case 'register':
        return await handleDrugRegistration(req, userRole, user.id);
      case 'ship':
        return await handleDrugShipment(req, userRole, user.id);
      case 'receive':
        return await handleDrugReceive(req, userRole, user.id);
      case 'dispense':
        return await handleDrugDispense(req, userRole, user.id);
      case 'history':
        return await handleDrugHistory(req, userRole, user.id);
      case 'compliance-status':
        return await handleComplianceStatus(req, userRole, user.id);
      case 'batch':
        return await handleGetDrugBatch(req, userRole, user.id);
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

async function handleDrugRegistration(req: Request, userRole: string, userId: string): Promise<Response> {
  // Only manufacturers and admins can register drugs
  if (userRole !== 'producer' && userRole !== 'admin') {
    return new Response(
      JSON.stringify({ error: 'Only manufacturers/producers can register drugs' }),
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
  
  console.log('Drug registered by user:', userId);

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

async function handleDrugShipment(req: Request, userRole: string, userId: string): Promise<Response> {
  // Only producers, brand_managers, and admins can ship drugs
  if (userRole !== 'producer' && userRole !== 'brand_manager' && userRole !== 'admin') {
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
  
  console.log('Drug shipped by user:', userId);

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

async function handleDrugReceive(req: Request, userRole: string, userId: string): Promise<Response> {
  // Only producers, brand_managers, and admins can receive drugs
  if (userRole !== 'producer' && userRole !== 'brand_manager' && userRole !== 'admin') {
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
  
  console.log('Drug received by user:', userId);

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

async function handleDrugDispense(req: Request, userRole: string, userId: string): Promise<Response> {
  // Only brand_managers and admins can dispense drugs
  if (userRole !== 'brand_manager' && userRole !== 'admin') {
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
  
  console.log('Drug dispensed by user:', userId);

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

async function handleDrugHistory(req: Request, userRole: string, userId: string): Promise<Response> {
  // Only admins can view full drug history
  if (userRole !== 'admin') {
    return new Response(
      JSON.stringify({ error: 'Only regulators/admins can view full drug history' }),
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
  
  console.log('Drug history viewed by user:', userId);

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

async function handleComplianceStatus(req: Request, userRole: string, userId: string): Promise<Response> {
  // Only admins can check compliance status
  if (userRole !== 'admin') {
    return new Response(
      JSON.stringify({ error: 'Only regulators/admins can check compliance status' }),
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
  
  console.log('Compliance status checked by user:', userId);

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

async function handleGetDrugBatch(req: Request, userRole: string, userId: string): Promise<Response> {
  // All authenticated users can view batch info
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
  
  console.log('Batch info viewed by user:', userId);

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: mockBatchData,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  );
}
