
import { Drug, TrackingEvent } from './types.ts';

// Mock data for testing
export const mockDrugs: Drug[] = [
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
  },
  {
    id: "d3",
    gtin: "01234567890125",
    sgtin: "sgtin:01234567890125.123458",
    batchNumber: "BATCH-1236",
    manufacturerId: "manu1",
    manufacturerName: "ZenPharma Inc.",
    expiryDate: "2024-06-30", // Note: Expired date
    productName: "PainEase",
    dosage: "50mg",
    description: "PainEase is a prescription medication for moderate to severe pain...",
    status: "recalled",
    currentOwnerId: "manu1",
    currentOwnerName: "ZenPharma Inc.",
    currentOwnerRole: "manufacturer"
  }
];

export const mockEvents: TrackingEvent[] = [
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
  },
  {
    id: "e4",
    timestamp: "2023-04-10T11:30:00Z",
    drugId: "d3",
    eventType: "commission",
    location: "Manufacturing Facility, CA, USA",
    actor: {
      id: "manu1",
      name: "ZenPharma Inc.",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      batchNumber: "BATCH-1236",
      productionLine: "Line-2"
    }
  },
  {
    id: "e5",
    timestamp: "2023-06-15T16:45:00Z",
    drugId: "d3",
    eventType: "recall",
    location: "Quality Control Department, CA, USA",
    actor: {
      id: "manu1",
      name: "ZenPharma Inc.",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      reason: "Quality control issues identified in post-market surveillance",
      severity: "Class II",
      instructions: "Return to manufacturer for proper disposal",
      referenceNumber: "RC-2023-061501"
    }
  }
];
