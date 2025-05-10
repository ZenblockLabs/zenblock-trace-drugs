
// Define CORS headers directly instead of importing them
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

// Define DrugTraceability type inline to avoid import problems
interface DrugTraceability {
  drug: {
    name: string;
    manufacturer: string;
    batchId: string;
    expiry: string;
    license: string;
    sgtin: string;
  };
  events: {
    step: string;
    timestamp: string;
    location: string;
    handler: string;
    notes: string;
  }[];
  status: {
    isRecalled: boolean;
    message: string;
    verifiedBy: string;
  };
}

// Mock data for demo purposes
export async function getTraceabilityData(code: string, userRole?: string): Promise<DrugTraceability> {
  // In a real implementation, this would query the blockchain
  
  // Check if the drug is recalled
  const isRecalled = code.includes("RECALL") || Math.random() < 0.1;
  
  // Base events for the supply chain journey
  const allEvents = [
    {
      step: "manufactured",
      timestamp: "2023-04-15T09:30:00Z",
      location: "Boston, MA, USA",
      handler: "PharmaLabs Manufacturing",
      notes: "Produced according to GMP guidelines"
    },
    {
      step: "quality-checked",
      timestamp: "2023-04-16T14:20:00Z",
      location: "Boston, MA, USA",
      handler: "PharmaLabs QA Team",
      notes: "Batch passed all quality tests"
    },
    {
      step: "shipped",
      timestamp: "2023-04-20T08:15:00Z",
      location: "Boston, MA, USA",
      handler: "MedLogistics",
      notes: "Shipped with temperature control"
    },
    {
      step: "in-transit",
      timestamp: "2023-04-21T11:45:00Z",
      location: "Chicago, IL, USA",
      handler: "MedLogistics Fleet",
      notes: "Temperature maintained at 18°C"
    },
    {
      step: "received",
      timestamp: "2023-04-23T09:10:00Z",
      location: "Denver, CO, USA",
      handler: "MountainHealth Distributors",
      notes: "Package integrity verified"
    },
    {
      step: "dispensed",
      timestamp: "2023-05-02T15:30:00Z",
      location: "Denver Community Pharmacy",
      handler: "Licensed Pharmacist",
      notes: "Dispensed with patient counseling"
    }
  ];
  
  // Filter events based on user role
  let filteredEvents = allEvents;
  if (userRole) {
    if (userRole === 'manufacturer') {
      filteredEvents = allEvents.filter(event => 
        ['manufactured', 'quality-checked', 'shipped'].includes(event.step)
      );
    } else if (userRole === 'distributor') {
      filteredEvents = allEvents.filter(event => 
        ['received', 'in-transit', 'shipped'].includes(event.step)
      );
    } else if (userRole === 'dispenser') {
      filteredEvents = allEvents.filter(event => 
        ['received', 'dispensed'].includes(event.step)
      );
    }
    // regulator sees all events (default)
  }
  
  return {
    drug: {
      name: "Amoxicillin 500mg",
      manufacturer: "PharmaLabs Inc.",
      batchId: "BTC" + (code ? code.substring(0, 5) : "00000"),
      expiry: "2026-02-28",
      license: "FDA-PL-2023-4872",
      sgtin: code || "UNKNOWN"
    },
    events: filteredEvents,
    status: {
      isRecalled: isRecalled,
      message: isRecalled 
        ? "RECALL ALERT: This product has been recalled due to potential contamination. Do not use. Return to pharmacy." 
        : "This product has been verified as authentic and is safe to use as directed.",
      verifiedBy: "ZenPharma Verification Service"
    }
  };
}

// Add handler for the edge function request
export async function handleRequest(req: Request): Promise<Response> {
  console.log("Received track-drug request:", req.method);
  
  try {
    let code: string | null = null;
    let userRole: string | null = null;
    
    // Support both GET and POST methods
    if (req.method === "GET") {
      // Get the code parameter from the URL
      const url = new URL(req.url);
      code = url.searchParams.get("code");
      userRole = url.searchParams.get("role");
      console.log("GET request with code:", code, "role:", userRole);
    } else if (req.method === "POST") {
      // Get the code from the request body
      try {
        const contentType = req.headers.get("content-type") || "";
        
        if (contentType.includes("application/json")) {
          const body = await req.json();
          code = body.code || null;
          userRole = body.role || null;
          console.log("POST request with JSON body:", { code, role: userRole });
        } else {
          // Handle form data or other content types if needed
          const formData = await req.formData();
          code = formData.get("code") as string;
          userRole = formData.get("role") as string;
          console.log("POST request with form data:", { code, role: userRole });
        }
      } catch (e) {
        console.error("Error parsing request body:", e);
        return new Response(
          JSON.stringify({ error: "Invalid request body" }),
          {
            headers: corsHeaders,
            status: 400,
          }
        );
      }
    }

    if (!code) {
      console.error("No tracking code provided");
      return new Response(
        JSON.stringify({ error: "No tracking code provided" }),
        {
          headers: corsHeaders,
          status: 400,
        }
      );
    }

    console.log(`Processing tracking request for code: ${code}, role: ${userRole || 'not specified'}`);
    const data = await getTraceabilityData(code, userRole || undefined);
    
    return new Response(
      JSON.stringify(data),
      {
        headers: corsHeaders,
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in track-drug edge function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        headers: corsHeaders,
        status: 500,
      }
    );
  }
}
