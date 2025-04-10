
import { Drug, TrackingEvent } from './types.ts';

// Mock data for testing
export const mockDrugs: Drug[] = [
  {
    id: "d1",
    gtin: "01234567890123",
    sgtin: "sgtin:01234567890123.123456",
    batchNumber: "BATCH-1234",
    manufacturerId: "user1",
    manufacturerName: "ZenPharma Inc.",
    expiryDate: "2025-12-31",
    productName: "ZenRelief",
    dosage: "10mg",
    description: "ZenRelief is used to treat various conditions including...",
    status: "manufactured",
    currentOwnerId: "user1",
    currentOwnerName: "ZenPharma Inc.",
    currentOwnerRole: "manufacturer"
  },
  {
    id: "d2",
    gtin: "01234567890124",
    sgtin: "sgtin:01234567890124.123457",
    batchNumber: "BATCH-1235",
    manufacturerId: "user1",
    manufacturerName: "ZenPharma Inc.",
    expiryDate: "2026-01-15",
    productName: "CardioZen",
    dosage: "25mg",
    description: "CardioZen is used to treat various conditions including...",
    status: "shipped",
    currentOwnerId: "user2",
    currentOwnerName: "MediDistribute LLC",
    currentOwnerRole: "distributor"
  },
  {
    id: "d3",
    gtin: "01234567890125",
    sgtin: "sgtin:01234567890125.123458",
    batchNumber: "BATCH-1236",
    manufacturerId: "user1",
    manufacturerName: "ZenPharma Inc.",
    expiryDate: "2025-06-30",
    productName: "PainEase",
    dosage: "50mg",
    description: "PainEase is a prescription medication for moderate to severe pain...",
    status: "received",
    currentOwnerId: "user3",
    currentOwnerName: "ZenMed Pharmacy",
    currentOwnerRole: "dispenser"
  }
];

export const mockEvents: TrackingEvent[] = [
  {
    id: "e1",
    timestamp: "2023-04-01T10:00:00Z",
    drugId: "d1",
    eventType: "commission",
    location: "ZenPharma Manufacturing Facility, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
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
    location: "ZenPharma Manufacturing Facility, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      batchNumber: "BATCH-1235",
      productionLine: "Line-2"
    }
  },
  {
    id: "e3",
    timestamp: "2023-04-03T09:15:00Z",
    drugId: "d2",
    eventType: "ship",
    location: "ZenPharma Distribution Center, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      destination: "MediDistribute LLC, NV, USA",
      shipmentId: "SHP-54321",
      carrier: "SecurePharmLogistics"
    }
  },
  {
    id: "e4",
    timestamp: "2023-04-05T11:30:00Z",
    drugId: "d2",
    eventType: "receive",
    location: "MediDistribute Warehouse, NV, USA",
    actor: {
      id: "user2",
      name: "Jane Distributor",
      role: "distributor",
      organization: "MediDistribute LLC"
    },
    details: {
      shipmentId: "SHP-54321",
      condition: "Good",
      notes: "All packages received in good condition"
    }
  },
  {
    id: "e5",
    timestamp: "2023-04-10T11:30:00Z",
    drugId: "d3",
    eventType: "commission",
    location: "ZenPharma Manufacturing Facility, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      batchNumber: "BATCH-1236",
      productionLine: "Line-3"
    }
  },
  {
    id: "e6",
    timestamp: "2023-04-12T09:15:00Z",
    drugId: "d3",
    eventType: "ship",
    location: "ZenPharma Distribution Center, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      destination: "MediDistribute LLC, NV, USA",
      shipmentId: "SHP-54322",
      carrier: "SecurePharmLogistics"
    }
  },
  {
    id: "e7",
    timestamp: "2023-04-14T11:30:00Z",
    drugId: "d3",
    eventType: "receive",
    location: "MediDistribute Warehouse, NV, USA",
    actor: {
      id: "user2",
      name: "Jane Distributor",
      role: "distributor",
      organization: "MediDistribute LLC"
    },
    details: {
      shipmentId: "SHP-54322",
      condition: "Good",
      notes: "All packages received in good condition"
    }
  },
  {
    id: "e8",
    timestamp: "2023-04-16T09:15:00Z",
    drugId: "d3",
    eventType: "ship",
    location: "MediDistribute Warehouse, NV, USA",
    actor: {
      id: "user2",
      name: "Jane Distributor",
      role: "distributor",
      organization: "MediDistribute LLC"
    },
    details: {
      destination: "ZenMed Pharmacy, CA, USA",
      shipmentId: "SHP-54323",
      carrier: "MedExpress Delivery"
    }
  },
  {
    id: "e9",
    timestamp: "2023-04-18T14:30:00Z",
    drugId: "d3",
    eventType: "receive",
    location: "ZenMed Pharmacy, CA, USA",
    actor: {
      id: "user3",
      name: "Sam Pharmacist",
      role: "dispenser",
      organization: "ZenMed Pharmacy"
    },
    details: {
      shipmentId: "SHP-54323",
      condition: "Good",
      notes: "Received and stored in controlled environment"
    }
  }
];
