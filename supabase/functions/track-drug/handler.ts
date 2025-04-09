
import { DrugTraceability } from "../fabric-chaincode/types";
import { corsHeaders } from "../fabric-chaincode/cors";

// Mock data for demo purposes
export async function getTraceabilityData(code: string): Promise<DrugTraceability> {
  // In a real implementation, this would query the blockchain
  
  // Check if the drug is recalled
  const isRecalled = code.includes("RECALL") || Math.random() < 0.1;
  
  return {
    drug: {
      name: "Amoxicillin 500mg",
      manufacturer: "PharmaLabs Inc.",
      batchId: "BTC" + code.substring(0, 5),
      expiry: "2026-02-28",
      license: "FDA-PL-2023-4872",
      sgtin: code
    },
    events: [
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
    ],
    status: {
      isRecalled: isRecalled,
      message: isRecalled 
        ? "RECALL ALERT: This product has been recalled due to potential contamination. Do not use. Return to pharmacy." 
        : "This product has been verified as authentic and is safe to use as directed.",
      verifiedBy: "ZenPharma Verification System"
    }
  };
}
