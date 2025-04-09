
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define local interface for the drug traceability data to avoid import errors
interface DrugTraceability {
  drug: {
    name: string;
    manufacturer: string;
    batchId: string;
    expiry: string;
    license: string;
    sgtin: string;
  };
  events: Array<{
    step: string;
    timestamp: string;
    location: string;
    handler: string;
    notes: string;
  }>;
  status: {
    isRecalled: boolean;
    message: string;
    verifiedBy: string;
  };
}

// Mock data for demonstration
const mockTraceabilityData: Record<string, DrugTraceability> = {
  "ZBL-RXB34A9812": {
    drug: {
      name: "Amoxiflox 500",
      manufacturer: "XYZ Pharma Ltd",
      batchId: "BATCH-X89",
      expiry: "2026-01-01",
      license: "MH/DRUGS/1191",
      sgtin: "ZBL-RXB34A9812"
    },
    events: [
      {
        step: "Manufactured",
        timestamp: "2025-04-01T10:00:00Z",
        location: "Baddi, HP",
        handler: "XYZ Pharma Ltd",
        notes: "Batch created"
      },
      {
        step: "Quality Control",
        timestamp: "2025-04-02T14:30:00Z",
        location: "Baddi, HP",
        handler: "XYZ QA Team",
        notes: "Passed all tests"
      },
      {
        step: "Packaged",
        timestamp: "2025-04-03T09:15:00Z",
        location: "Baddi, HP",
        handler: "XYZ Packaging",
        notes: "Batch packaged in units of 10"
      },
      {
        step: "Shipped to Distributor",
        timestamp: "2025-04-05T08:45:00Z",
        location: "Delhi Distribution Center",
        handler: "MediSupply Inc.",
        notes: "Temperature controlled transport"
      },
      {
        step: "Received by Pharmacy",
        timestamp: "2025-04-08T11:20:00Z",
        location: "HealthPlus Pharmacy, Mumbai",
        handler: "HealthPlus Ltd",
        notes: "Inventory added"
      }
    ],
    status: {
      isRecalled: false,
      message: "✅ This batch is genuine and traceable.",
      verifiedBy: "Zenblock Labs"
    }
  },
  "ZBL-RXB34A9813": {
    drug: {
      name: "Feloprin 20mg",
      manufacturer: "Horizon Pharmaceuticals",
      batchId: "BATCH-H42",
      expiry: "2025-08-15",
      license: "DL/DRUGS/3384",
      sgtin: "ZBL-RXB34A9813"
    },
    events: [
      {
        step: "Manufactured",
        timestamp: "2025-02-10T08:30:00Z",
        location: "Hyderabad Plant",
        handler: "Horizon Pharmaceuticals",
        notes: "Manufacturing complete"
      },
      {
        step: "Quality Control",
        timestamp: "2025-02-11T13:45:00Z",
        location: "Hyderabad Plant",
        handler: "Horizon QA Team",
        notes: "Passed with minor adjustments"
      },
      {
        step: "Packaged",
        timestamp: "2025-02-12T10:20:00Z",
        location: "Hyderabad Plant",
        handler: "Horizon Packaging",
        notes: "Blister packs of 10 tablets"
      },
      {
        step: "Shipped to Distributor",
        timestamp: "2025-02-15T07:30:00Z",
        location: "Chennai Distribution Hub",
        handler: "PharmaXpress Logistics",
        notes: "Standard shipping conditions"
      }
    ],
    status: {
      isRecalled: true,
      message: "⚠️ This batch has been recalled due to labeling errors.",
      verifiedBy: "Zenblock Labs"
    }
  }
};

export const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Extract the code from URL
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response(
        JSON.stringify({ error: "Missing drug code parameter" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // In a real implementation, this would query the blockchain
    // For now, return mock data if we have it
    const data = mockTraceabilityData[code];

    if (!data) {
      return new Response(
        JSON.stringify({ error: "Drug not found or invalid code" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Return the data
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};
