
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This would be replaced with actual Fabric SDK code in a production environment
// Here we're simulating the interaction with a chaincode
const simulateChaincodeInteraction = async (action: string, fcn: string, args: string[]) => {
  console.log(`Simulating ${action} for function '${fcn}' with args:`, args);
  
  // In a real implementation, this would use the Fabric SDK to submit or evaluate transactions
  // For demonstration purposes, we're returning mock data
  return mockChaincodeResponse(fcn, args);
};

// Mock function to simulate chaincode responses
const mockChaincodeResponse = (fcn: string, args: string[]) => {
  switch (fcn) {
    case 'RegisterDrug':
      try {
        const drugData = JSON.parse(args[0]);
        return {
          id: crypto.randomUUID(),
          gtin: drugData.gtin,
          sgtin: `sgtin:${drugData.gtin}.${Math.floor(Math.random() * 1000000)}`,
          batchNumber: drugData.batchNumber,
          manufacturerId: drugData.manufacturerId,
          manufacturerName: drugData.manufacturerName,
          expiryDate: drugData.expiryDate,
          productName: drugData.productName,
          dosage: drugData.dosage,
          description: drugData.description,
          status: 'manufactured',
          currentOwnerId: drugData.manufacturerId,
          currentOwnerName: drugData.manufacturerName,
          currentOwnerRole: 'manufacturer'
        };
      } catch (error) {
        throw new Error(`Failed to parse drug data: ${error.message}`);
      }
    
    case 'GetAllDrugs':
      return mockDrugs;
    
    case 'GetDrugsByOwner':
      const ownerId = args[0];
      return mockDrugs.filter(drug => drug.currentOwnerId === ownerId);
    
    case 'ReadDrug':
      const drugId = args[0];
      const drug = mockDrugs.find(d => d.id === drugId);
      return drug || null;
    
    case 'GetDrugBySGTIN':
      const sgtin = args[0];
      const drugBySGTIN = mockDrugs.find(d => d.sgtin === sgtin);
      return drugBySGTIN || null;
    
    case 'CreateEvent':
      try {
        const eventData = JSON.parse(args[0]);
        const newEvent = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          ...eventData
        };
        return newEvent;
      } catch (error) {
        throw new Error(`Failed to parse event data: ${error.message}`);
      }
    
    case 'GetEventsByDrug':
      const eventDrugId = args[0];
      return mockEvents.filter(event => event.drugId === eventDrugId);
    
    case 'GetAllEvents':
      return mockEvents;
    
    case 'GetRecentEvents':
      const limit = parseInt(args[0]) || 10;
      return mockEvents.slice(0, limit);
    
    case 'TransferDrug':
      try {
        const transferData = JSON.parse(args[0]);
        // In a real implementation, this would update the state in the ledger
        return true;
      } catch (error) {
        throw new Error(`Failed to parse transfer data: ${error.message}`);
      }
    
    case 'ReceiveDrug':
      try {
        const receiveData = JSON.parse(args[0]);
        // In a real implementation, this would update the state in the ledger
        return true;
      } catch (error) {
        throw new Error(`Failed to parse receive data: ${error.message}`);
      }
    
    default:
      throw new Error(`Unknown chaincode function: ${fcn}`);
  }
};

// Mock data for testing
const mockDrugs = [
  {
    id: "d1",
    gtin: "01234567890123",
    sgtin: "sgtin:01234567890123.123456",
    batchNumber: "BATCH-1234",
    manufacturerId: "manu1",
    manufacturerName: "ZenPharma Inc.",
    expiryDate: "2025-12-31",
    productName: "ZenRelief",
    dosage: "10mg",
    description: "ZenRelief is used to treat various conditions including...",
    status: "manufactured",
    currentOwnerId: "manu1",
    currentOwnerName: "ZenPharma Inc.",
    currentOwnerRole: "manufacturer"
  },
  {
    id: "d2",
    gtin: "01234567890124",
    sgtin: "sgtin:01234567890124.123457",
    batchNumber: "BATCH-1235",
    manufacturerId: "manu2",
    manufacturerName: "MediCorp Pharmaceuticals",
    expiryDate: "2026-01-15",
    productName: "CardioZen",
    dosage: "25mg",
    description: "CardioZen is used to treat various conditions including...",
    status: "shipped",
    currentOwnerId: "dist1",
    currentOwnerName: "MediDistribute LLC",
    currentOwnerRole: "distributor"
  }
];

const mockEvents = [
  {
    id: "e1",
    timestamp: "2023-04-01T10:00:00Z",
    drugId: "d1",
    eventType: "commission",
    location: "Manufacturing Facility, CA, USA",
    actor: {
      id: "manu1",
      name: "ZenPharma Inc.",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      batchNumber: "BATCH-1234",
      productionLine: "Line-1"
    }
  },
  {
    id: "e2",
    timestamp: "2023-04-02T14:30:00Z",
    drugId: "d2",
    eventType: "commission",
    location: "Manufacturing Facility, NY, USA",
    actor: {
      id: "manu2",
      name: "MediCorp Pharmaceuticals",
      role: "manufacturer",
      organization: "MediCorp Pharmaceuticals"
    },
    details: {
      batchNumber: "BATCH-1235",
      productionLine: "Line-3"
    }
  },
  {
    id: "e3",
    timestamp: "2023-04-03T09:15:00Z",
    drugId: "d2",
    eventType: "ship",
    location: "Manufacturing Facility, NY, USA",
    actor: {
      id: "manu2",
      name: "MediCorp Pharmaceuticals",
      role: "manufacturer",
      organization: "MediCorp Pharmaceuticals"
    },
    details: {
      destination: "MediDistribute LLC, NV, USA",
      shipmentId: "SHP-54321",
      carrier: "SecurePharmLogistics"
    }
  }
];

serve(async (req) => {
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
});
