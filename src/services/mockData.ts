import { Drug, TrackingEvent, DrugStatus } from './types';

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
  },
  // A drug with an anomalous flow (skips distributor)
  {
    id: "d4",
    gtin: "01234567890126",
    sgtin: "sgtin:01234567890126.123459",
    batchNumber: "BATCH-1237",
    manufacturerId: "user1",
    manufacturerName: "ZenPharma Inc.",
    expiryDate: "2025-08-15",
    productName: "AnomalyMed",
    dosage: "100mg",
    description: "This medication has an irregular supply chain path for testing...",
    status: "dispensed",
    currentOwnerId: "user3",
    currentOwnerName: "ZenMed Pharmacy",
    currentOwnerRole: "dispenser"
  },
  // A drug with a gap in its timeline
  {
    id: "d5",
    gtin: "01234567890127",
    sgtin: "sgtin:01234567890127.123460",
    batchNumber: "BATCH-1238",
    manufacturerId: "user1",
    manufacturerName: "ZenPharma Inc.",
    expiryDate: "2025-10-20",
    productName: "TimeGapMed",
    dosage: "75mg",
    description: "This medication has a gap in its timeline for testing exception handling...",
    status: "warehoused",
    currentOwnerId: "user2",
    currentOwnerName: "MediDistribute LLC",
    currentOwnerRole: "distributor"
  }
];

export const mockEvents: TrackingEvent[] = [
  // Normal flow - Drug 1 (ZenRelief) - Only manufactured so far
  {
    id: "e1",
    timestamp: "2023-04-01T10:00:00Z",
    drugId: "d1",
    type: "commission",
    location: "ZenPharma Manufacturing Facility, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      batchNumber: "BATCH-1234",
      productionLine: "Line-1",
      temperatureCheckPassed: true,
      digitalSignature: "0xabc123def456",
      isOnChain: true,
      geoCoordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      notes: "Initial production completed successfully"
    }
  },
  {
    id: "e1b",
    timestamp: "2023-04-01T14:00:00Z",
    drugId: "d1",
    type: "qa-passed",
    location: "ZenPharma QA Lab, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      batchNumber: "BATCH-1234",
      testResults: "All tests passed",
      temperatureCheckPassed: true,
      digitalSignature: "0xabc123def457",
      isOnChain: true,
      geoCoordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      notes: "Quality assurance testing completed with no issues"
    }
  },

  // Normal flow - Drug 2 (CardioZen) - Manufactured and shipped to distributor
  {
    id: "e2",
    timestamp: "2023-04-02T14:30:00Z",
    drugId: "d2",
    type: "commission",
    location: "ZenPharma Manufacturing Facility, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      batchNumber: "BATCH-1235",
      productionLine: "Line-2",
      temperatureCheckPassed: true,
      digitalSignature: "0xdef456ghi789",
      isOnChain: true,
      geoCoordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      notes: "Production completed according to specifications"
    }
  },
  {
    id: "e2b",
    timestamp: "2023-04-02T17:45:00Z",
    drugId: "d2",
    type: "qa-passed",
    location: "ZenPharma QA Lab, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      batchNumber: "BATCH-1235",
      testResults: "All tests passed",
      temperatureCheckPassed: true,
      digitalSignature: "0xdef456ghi790",
      isOnChain: true,
      geoCoordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      notes: "All quality tests completed successfully"
    }
  },
  {
    id: "e3",
    timestamp: "2023-04-03T09:15:00Z",
    drugId: "d2",
    type: "ship",
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
      carrier: "SecurePharmLogistics",
      temperatureCheckPassed: true,
      digitalSignature: "0xghi789jkl012",
      isOnChain: true,
      geoCoordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      notes: "Shipped with temperature-controlled transport"
    }
  },
  {
    id: "e4",
    timestamp: "2023-04-05T11:30:00Z",
    drugId: "d2",
    type: "receive",
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
      temperatureCheckPassed: true,
      digitalSignature: "0xjkl012mno345",
      isOnChain: true,
      geoCoordinates: {
        latitude: 36.1699,
        longitude: -115.1398
      },
      notes: "All packages received in good condition"
    }
  },

  // Rest of the events...
  {
    id: "e5",
    timestamp: "2023-04-10T11:30:00Z",
    drugId: "d3",
    type: "commission",
    location: "ZenPharma Manufacturing Facility, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      batchNumber: "BATCH-1236",
      productionLine: "Line-3",
      temperatureCheckPassed: true,
      digitalSignature: "0xmno345pqr678",
      isOnChain: true,
      geoCoordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      notes: "Production completed with standard protocols"
    }
  },
  {
    id: "e5b",
    timestamp: "2023-04-10T15:15:00Z",
    drugId: "d3",
    eventType: "qa-passed",
    location: "ZenPharma QA Lab, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      batchNumber: "BATCH-1236",
      testResults: "All tests passed",
      temperatureCheckPassed: true,
      digitalSignature: "0xmno345pqr679",
      isOnChain: true,
      geoCoordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      notes: "Quality assurance completed with no issues"
    }
  },
  {
    id: "e6",
    timestamp: "2023-04-12T09:15:00Z",
    drugId: "d3",
    type: "ship",
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
      carrier: "SecurePharmLogistics",
      temperatureCheckPassed: true,
      digitalSignature: "0xpqr678stu901",
      isOnChain: true,
      geoCoordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      notes: "Shipped via secure logistics partner"
    }
  },
  {
    id: "e7",
    timestamp: "2023-04-14T11:30:00Z",
    drugId: "d3",
    type: "receive",
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
      temperatureCheckPassed: true,
      digitalSignature: "0xstu901vwx234",
      isOnChain: true,
      geoCoordinates: {
        latitude: 36.1699,
        longitude: -115.1398
      },
      notes: "All packages received in good condition"
    }
  },
  {
    id: "e7b",
    timestamp: "2023-04-15T10:45:00Z",
    drugId: "d3",
    eventType: "warehouse",
    location: "MediDistribute Warehouse, NV, USA",
    actor: {
      id: "user2",
      name: "Jane Distributor",
      role: "distributor",
      organization: "MediDistribute LLC"
    },
    details: {
      storageConditions: "Temperature controlled",
      temperatureCheckPassed: true,
      digitalSignature: "0xstu901vwx235",
      isOnChain: true,
      geoCoordinates: {
        latitude: 36.1699,
        longitude: -115.1398
      },
      notes: "Stored in climate-controlled section B3"
    }
  },
  {
    id: "e8",
    timestamp: "2023-04-16T09:15:00Z",
    drugId: "d3",
    type: "ship",
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
      carrier: "MedExpress Delivery",
      temperatureCheckPassed: true,
      digitalSignature: "0xvwx234yz1567",
      isOnChain: true,
      geoCoordinates: {
        latitude: 36.1699,
        longitude: -115.1398
      },
      notes: "Shipped to pharmacy via express service"
    }
  },
  {
    id: "e9",
    timestamp: "2023-04-18T14:30:00Z",
    drugId: "d3",
    type: "receive",
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
      temperatureCheckPassed: true,
      digitalSignature: "0xyz1567abc890",
      isOnChain: true,
      geoCoordinates: {
        latitude: 34.0522,
        longitude: -118.2437
      },
      notes: "Received and stored in controlled environment"
    }
  },

  // Anomalous flow - Drug 4 (AnomalyMed) - Skips distributor
  {
    id: "e10",
    timestamp: "2023-05-01T10:00:00Z",
    drugId: "d4",
    type: "commission",
    location: "ZenPharma Manufacturing Facility, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      batchNumber: "BATCH-1237",
      productionLine: "Line-2",
      temperatureCheckPassed: true,
      digitalSignature: "0xabc890def123",
      isOnChain: true,
      geoCoordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      notes: "Production completed for special order"
    }
  },
  {
    id: "e11",
    timestamp: "2023-05-01T15:30:00Z",
    drugId: "d4",
    type: "qa-passed",
    location: "ZenPharma QA Lab, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      batchNumber: "BATCH-1237",
      testResults: "All tests passed",
      temperatureCheckPassed: true,
      digitalSignature: "0xabc890def124",
      isOnChain: true,
      geoCoordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      notes: "Quality checks completed with minor notes"
    }
  },
  {
    id: "e12",
    timestamp: "2023-05-03T09:00:00Z",
    drugId: "d4",
    type: "ship",
    location: "ZenPharma Distribution Center, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      destination: "ZenMed Pharmacy, CA, USA", // Direct to pharmacy!
      shipmentId: "SHP-99999",
      carrier: "DirectMed Courier",
      temperatureCheckPassed: true,
      digitalSignature: "0xdef123ghi456",
      isOnChain: true,
      geoCoordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      notes: "Direct shipment to pharmacy (UNUSUAL PATH)"
    }
  },
  {
    id: "e13",
    timestamp: "2023-05-04T14:00:00Z",
    drugId: "d4",
    type: "receive",
    location: "ZenMed Pharmacy, CA, USA",
    actor: {
      id: "user3",
      name: "Sam Pharmacist",
      role: "dispenser",
      organization: "ZenMed Pharmacy"
    },
    details: {
      shipmentId: "SHP-99999",
      condition: "Good",
      temperatureCheckPassed: true,
      digitalSignature: "0xghi456jkl789",
      isOnChain: true,
      geoCoordinates: {
        latitude: 34.0522,
        longitude: -118.2437
      },
      notes: "Received direct shipment from manufacturer (UNUSUAL PATH)"
    }
  },
  {
    id: "e14",
    timestamp: "2023-05-05T10:30:00Z",
    drugId: "d4",
    type: "dispense",
    location: "ZenMed Pharmacy, CA, USA",
    actor: {
      id: "user3",
      name: "Sam Pharmacist",
      role: "dispenser",
      organization: "ZenMed Pharmacy"
    },
    details: {
      prescription: "RX-12345",
      patientId: "anonymous",
      temperatureCheckPassed: true,
      digitalSignature: "0xjkl789mno012",
      isOnChain: true,
      geoCoordinates: {
        latitude: 34.0522,
        longitude: -118.2437
      },
      notes: "Dispensed to patient with counseling"
    }
  },

  // Gap flow - Drug 5 (TimeGapMed) - Missing receiving event
  {
    id: "e15",
    timestamp: "2023-06-01T11:00:00Z",
    drugId: "d5",
    type: "commission",
    location: "ZenPharma Manufacturing Facility, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      batchNumber: "BATCH-1238",
      productionLine: "Line-1",
      temperatureCheckPassed: true,
      digitalSignature: "0xmno012pqr345",
      isOnChain: true,
      geoCoordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      notes: "Production completed without issues"
    }
  },
  {
    id: "e16",
    timestamp: "2023-06-01T16:30:00Z",
    drugId: "d5",
    type: "qa-passed",
    location: "ZenPharma QA Lab, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      batchNumber: "BATCH-1238",
      testResults: "All tests passed",
      temperatureCheckPassed: true,
      digitalSignature: "0xmno012pqr346",
      isOnChain: true,
      geoCoordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      notes: "Quality verification completed"
    }
  },
  {
    id: "e17",
    timestamp: "2023-06-03T09:30:00Z",
    drugId: "d5",
    type: "ship",
    location: "ZenPharma Distribution Center, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer",
      organization: "ZenPharma Inc."
    },
    details: {
      destination: "MediDistribute LLC, NV, USA",
      shipmentId: "SHP-77777",
      carrier: "SecurePharmLogistics",
      temperatureCheckPassed: true,
      digitalSignature: "0xpqr345stu678",
      isOnChain: true,
      geoCoordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      notes: "Shipped with regular protocols"
    }
  },
  // Gap here - no receiving event!
  {
    id: "e19",
    timestamp: "2023-06-10T11:30:00Z",
    drugId: "d5",
    type: "warehouse",
    location: "MediDistribute Warehouse, NV, USA",
    actor: {
      id: "user2",
      name: "Jane Distributor",
      role: "distributor",
      organization: "MediDistribute LLC"
    },
    details: {
      storageLocation: "Zone C, Rack 15",
      temperatureCheckPassed: true,
      digitalSignature: "0xvwx012yz1345",
      isOnChain: true,
      geoCoordinates: {
        latitude: 36.1699,
        longitude: -115.1398
      },
      notes: "Product warehoused (MISSING RECEIVING EVENT)"
    }
  }
];

// A utility function to generate the current status of a drug based on its most recent event
export function computeDrugStatus(drugId: string): {
  status: DrugStatus;
  currentOwnerId: string;
  currentOwnerName: string;
  currentOwnerRole: string;
} {
  // Get all events for this drug
  const drugEvents = mockEvents.filter(event => event.drugId === drugId);
  
  // Default values if no events found
  if (drugEvents.length === 0) {
    return {
      status: 'manufactured',
      currentOwnerId: '',
      currentOwnerName: 'Unknown',
      currentOwnerRole: 'unknown'
    };
  }
  
  // Sort events by timestamp (newest first)
  const sortedEvents = [...drugEvents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Get most recent event
  const latestEvent = sortedEvents[0];
  
  // Map event type to status
  let status: DrugStatus;
  switch (latestEvent.type) {
    case 'commission':
    case 'qa-passed':
      status = 'manufactured';
      break;
    case 'ship':
      status = 'shipped';
      break;
    case 'receive':
      status = 'received';
      break;
    case 'warehouse':
      status = 'warehoused';
      break;
    case 'dispense':
      status = 'dispensed';
      break;
    case 'recall':
      status = 'recalled';
      break;
    default:
      status = 'manufactured';
  }
  
  // Get actor information from the latest event
  const actorId = typeof latestEvent.actor === 'string' 
    ? latestEvent.actor 
    : latestEvent.actor.id || '';
  
  const actorName = typeof latestEvent.actor === 'string' 
    ? latestEvent.actor 
    : latestEvent.actor.name || 'Unknown';
  
  const actorRole = typeof latestEvent.actor === 'string' 
    ? 'unknown' 
    : latestEvent.actor.role || 'unknown';
  
  return {
    status,
    currentOwnerId: actorId,
    currentOwnerName: actorName,
    currentOwnerRole: actorRole
  };
}

// Function to filter events based on user role
export function filterEventsByRole(events: TrackingEvent[], role: string): TrackingEvent[] {
  if (role === 'regulator') {
    // Regulators see everything
    return events;
  }
  
  // Define which event types each role can see
  const roleEventMap: Record<string, string[]> = {
    'manufacturer': ['commission', 'qa-passed', 'ship'],
    'distributor': ['receive', 'warehouse', 'ship'],
    'dispenser': ['receive', 'warehouse', 'dispense']
  };
  
  const allowedTypes = roleEventMap[role] || [];
  return events.filter(event => allowedTypes.includes(event.type));
}
