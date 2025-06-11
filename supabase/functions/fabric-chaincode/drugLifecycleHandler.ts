
import { corsHeaders } from './cors.ts';
import { simulateChaincodeInteraction } from './chaincodeSimulator.ts';

export interface DrugRegistrationData {
  drugName: string;
  batchId: string;
  manufacturerName: string;
  manufacturerId: string;
  manufacturingDate: string;
  expiryDate: string;
  dosage: string;
  description?: string;
  gtin: string;
  serialNumbers: string[];
}

export interface ShipmentData {
  batchId: string;
  fromActorId: string;
  fromActorName: string;
  fromRole: string;
  toActorId: string;
  toActorName: string;
  toRole: string;
  location: string;
  timestamp: string;
  notes?: string;
}

export interface ReceiveData {
  batchId: string;
  receiverActorId: string;
  receiverActorName: string;
  receiverRole: string;
  location: string;
  timestamp: string;
  notes?: string;
}

export interface DispenseData {
  batchId: string;
  dispenserActorId: string;
  dispenserActorName: string;
  patientId?: string;
  location: string;
  timestamp: string;
  prescriptionId?: string;
  notes?: string;
}

export async function handleDrugLifecycleRequest(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const endpoint = pathSegments[pathSegments.length - 1];

    // Extract user role from headers (set by authentication middleware)
    const userRole = req.headers.get('x-user-role') || 'unknown';
    const userId = req.headers.get('x-user-id') || 'unknown';

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
    console.error('Error in drug lifecycle handler:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

async function handleDrugRegistration(req: Request, userRole: string): Promise<Response> {
  if (userRole !== 'manufacturer') {
    return new Response(
      JSON.stringify({ error: 'Only manufacturers can register drugs' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403 
      }
    );
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405 
      }
    );
  }

  const registrationData: DrugRegistrationData = await req.json();
  
  // Validate required fields
  const requiredFields = ['drugName', 'batchId', 'manufacturerName', 'manufacturerId', 'manufacturingDate', 'expiryDate', 'gtin'];
  for (const field of requiredFields) {
    if (!registrationData[field]) {
      return new Response(
        JSON.stringify({ error: `Missing required field: ${field}` }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
  }

  const result = await simulateChaincodeInteraction('invoke', 'RegisterDrug', [JSON.stringify(registrationData)]);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data: result,
      transactionId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201 
    }
  );
}

async function handleDrugShipment(req: Request, userRole: string): Promise<Response> {
  if (userRole !== 'distributor' && userRole !== 'manufacturer') {
    return new Response(
      JSON.stringify({ error: 'Only distributors and manufacturers can ship drugs' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403 
      }
    );
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405 
      }
    );
  }

  const shipmentData: ShipmentData = await req.json();
  
  const result = await simulateChaincodeInteraction('invoke', 'TransferOwnership', [JSON.stringify({
    sgtin: shipmentData.batchId,
    from: {
      id: shipmentData.fromActorId,
      name: shipmentData.fromActorName,
      role: shipmentData.fromRole
    },
    to: {
      id: shipmentData.toActorId,
      name: shipmentData.toActorName,
      role: shipmentData.toRole
    },
    details: {
      location: shipmentData.location,
      timestamp: shipmentData.timestamp,
      notes: shipmentData.notes
    }
  })]);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data: result,
      transactionId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  );
}

async function handleDrugReceive(req: Request, userRole: string): Promise<Response> {
  if (userRole !== 'distributor' && userRole !== 'dispenser') {
    return new Response(
      JSON.stringify({ error: 'Only distributors and dispensers can receive drugs' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403 
      }
    );
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405 
      }
    );
  }

  const receiveData: ReceiveData = await req.json();
  
  const result = await simulateChaincodeInteraction('invoke', 'LogEvent', [JSON.stringify({
    sgtin: receiveData.batchId,
    eventType: 'receive',
    metadata: {
      actorId: receiveData.receiverActorId,
      actorName: receiveData.receiverActorName,
      actorRole: receiveData.receiverRole,
      location: receiveData.location,
      timestamp: receiveData.timestamp,
      notes: receiveData.notes
    }
  })]);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data: result,
      transactionId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  );
}

async function handleDrugDispense(req: Request, userRole: string): Promise<Response> {
  if (userRole !== 'dispenser') {
    return new Response(
      JSON.stringify({ error: 'Only dispensers can dispense drugs' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403 
      }
    );
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405 
      }
    );
  }

  const dispenseData: DispenseData = await req.json();
  
  const result = await simulateChaincodeInteraction('invoke', 'LogEvent', [JSON.stringify({
    sgtin: dispenseData.batchId,
    eventType: 'dispense',
    metadata: {
      actorId: dispenseData.dispenserActorId,
      actorName: dispenseData.dispenserActorName,
      actorRole: dispenseData.dispenserRole,
      location: dispenseData.location,
      timestamp: dispenseData.timestamp,
      patientId: dispenseData.patientId,
      prescriptionId: dispenseData.prescriptionId,
      notes: dispenseData.notes
    }
  })]);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data: result,
      transactionId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  );
}

async function handleDrugHistory(req: Request, userRole: string): Promise<Response> {
  if (userRole !== 'regulator') {
    return new Response(
      JSON.stringify({ error: 'Only regulators can view full drug history' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403 
      }
    );
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405 
      }
    );
  }

  const url = new URL(req.url);
  const batchId = url.searchParams.get('batchId');
  
  if (!batchId) {
    return new Response(
      JSON.stringify({ error: 'Missing batchId parameter' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
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
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  );
}

async function handleComplianceStatus(req: Request, userRole: string): Promise<Response> {
  if (userRole !== 'regulator') {
    return new Response(
      JSON.stringify({ error: 'Only regulators can check compliance status' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403 
      }
    );
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405 
      }
    );
  }

  const url = new URL(req.url);
  const batchId = url.searchParams.get('batchId');
  
  if (!batchId) {
    return new Response(
      JSON.stringify({ error: 'Missing batchId parameter' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }

  // Get drug history and analyze for compliance
  const history = await simulateChaincodeInteraction('query', 'GetDrugHistory', [batchId]);
  
  // Simple compliance check logic
  const complianceStatus = {
    isCompliant: true,
    violations: [],
    score: 100,
    checks: {
      hasManufacturingRecord: false,
      hasQualityCheck: false,
      hasProperChainOfCustody: false,
      withinShelfLife: false
    }
  };

  // Analyze history for compliance (simplified logic)
  if (Array.isArray(history)) {
    complianceStatus.checks.hasManufacturingRecord = history.some(event => 
      event.eventType === 'commission' || event.eventType === 'manufactured'
    );
    complianceStatus.checks.hasQualityCheck = history.some(event => 
      event.eventType === 'qa-passed'
    );
    complianceStatus.checks.hasProperChainOfCustody = history.length >= 2;
    complianceStatus.checks.withinShelfLife = true; // Simplified check
  }

  // Calculate overall compliance
  const passedChecks = Object.values(complianceStatus.checks).filter(Boolean).length;
  const totalChecks = Object.keys(complianceStatus.checks).length;
  complianceStatus.score = Math.round((passedChecks / totalChecks) * 100);
  complianceStatus.isCompliant = complianceStatus.score >= 80;

  if (!complianceStatus.isCompliant) {
    complianceStatus.violations.push('Failed compliance checks');
  }
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data: complianceStatus,
      batchId: batchId,
      timestamp: new Date().toISOString()
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  );
}
