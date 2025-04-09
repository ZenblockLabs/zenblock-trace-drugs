
import { corsHeaders } from '../fabric-chaincode/cors.ts';

export async function handleRequest(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: code' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Call the mock chaincode for now - in production this would query the Fabric network
    const drugData = await getTraceabilityData(code);
    
    return new Response(
      JSON.stringify(drugData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in track-drug function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

// This function would query the Fabric network in production
// For now, we'll simulate blockchain data
async function getTraceabilityData(code: string) {
  // In production, this would call Fabric chaincode
  console.log(`Getting traceability data for code: ${code}`);
  
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if this is a recalled code 
  const isRecalled = code.includes('RECALL');

  return {
    drug: {
      name: code.startsWith('ZBL-A') ? "Amoxiflox 500" : "Zenbiotic Plus",
      manufacturer: "XYZ Pharma Ltd",
      batchId: `BATCH-${code.substring(code.length - 5)}`,
      expiry: "2026-01-01",
      license: "MH/DRUGS/1191",
      sgtin: code
    },
    events: [
      {
        step: "Manufactured",
        timestamp: "2025-04-01T10:30:00Z",
        location: "Baddi, HP",
        handler: "XYZ Pharma Ltd",
        notes: "Batch created"
      },
      {
        step: "Quality Control",
        timestamp: "2025-04-02T14:15:00Z",
        location: "Baddi, HP",
        handler: "XYZ Pharma QA Team",
        notes: "Batch passed all quality tests"
      },
      {
        step: "Shipped",
        timestamp: "2025-04-05T08:45:00Z",
        location: "Baddi, HP",
        handler: "XYZ Pharma Ltd",
        notes: "Shipped to MedEx Distributors"
      },
      {
        step: "Received by Distributor",
        timestamp: "2025-04-07T11:20:00Z",
        location: "Mumbai, MH",
        handler: "MedEx Distributors",
        notes: "Inventory verified and stored"
      },
      {
        step: "Shipped to Pharmacy",
        timestamp: "2025-04-12T09:30:00Z",
        location: "Mumbai, MH",
        handler: "MedEx Distributors",
        notes: "Shipped to LifeCare Pharmacy"
      },
      {
        step: "Received by Pharmacy",
        timestamp: "2025-04-13T16:10:00Z",
        location: "Pune, MH",
        handler: "LifeCare Pharmacy",
        notes: "Inventory verified and stored"
      }
    ],
    status: {
      isRecalled: isRecalled,
      message: isRecalled 
        ? "⚠️ This batch has been recalled. Do not use." 
        : "✅ This batch is genuine and traceable.",
      verifiedBy: "Zenblock Labs"
    }
  };
}
