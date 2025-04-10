
import { TrackingEvent } from '../types';

// Second set of events (drugs 3-5)
export const drugEventsSet2: TrackingEvent[] = [
  // Continuation of Drug 3 events
  {
    id: "e7",
    timestamp: "2023-04-14T11:30:00Z",
    drugId: "d3",
    type: "receive",
    location: "MediDistribute Warehouse, NV, USA",
    actor: {
      id: "user2",
      name: "Jane Distributor",
      role: "distributor"
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
    type: "warehouse",
    location: "MediDistribute Warehouse, NV, USA",
    actor: {
      id: "user2",
      name: "Jane Distributor",
      role: "distributor"
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
      role: "distributor"
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
      role: "dispenser"
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
  {
    id: "e9b",
    timestamp: "2023-04-20T10:15:00Z",
    drugId: "d3",
    type: "dispense",
    location: "ZenMed Pharmacy, CA, USA",
    actor: {
      id: "user3",
      name: "Sam Pharmacist",
      role: "dispenser"
    },
    details: {
      prescription: "RX-98765",
      patientId: "anonymous",
      digitalSignature: "0xabc789xyz123",
      isOnChain: true,
      blockchainHash: "0xfedcba9876543210fedcba9876543210fedcba98",
      blockHeight: 7847653,
      verificationTimestamp: "2023-04-20T10:16:22Z",
      geoCoordinates: {
        latitude: 34.0522,
        longitude: -118.2437
      },
      notes: "Dispensed to patient with full medication counseling"
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
      role: "manufacturer"
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
      role: "manufacturer"
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
      role: "manufacturer"
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
      role: "dispenser"
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
      role: "dispenser"
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
      role: "manufacturer"
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
      role: "manufacturer"
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
      role: "manufacturer"
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
      role: "distributor"
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
  },
  {
    id: "e19b",
    timestamp: "2023-06-15T09:45:00Z",
    drugId: "d5",
    type: "ship",
    location: "MediDistribute Warehouse, NV, USA",
    actor: {
      id: "user2",
      name: "Jane Distributor",
      role: "distributor"
    },
    details: {
      destination: "ZenMed Pharmacy, CA, USA",
      shipmentId: "SHP-88888",
      carrier: "PharmaTrans",
      temperatureCheckPassed: true,
      temperatureLog: [
        { timestamp: "2023-06-15T10:30:00Z", temperature: 4.9, unit: "Celsius" },
        { timestamp: "2023-06-15T14:30:00Z", temperature: 5.1, unit: "Celsius" },
        { timestamp: "2023-06-15T18:30:00Z", temperature: 5.0, unit: "Celsius" }
      ],
      digitalSignature: "0xabc012def345",
      isOnChain: true,
      blockchainHash: "0x0123456789abcdef0123456789abcdef01234567",
      blockHeight: 7980213,
      verificationTimestamp: "2023-06-15T09:47:32Z",
      geoCoordinates: {
        latitude: 36.1699,
        longitude: -115.1398
      },
      humidityPercentage: 48,
      shockEvents: [
        { timestamp: "2023-06-15T12:32:15Z", gForce: 1.8, location: "Interstate 15" }
      ],
      notes: "Shipped to pharmacy with continuous temperature monitoring"
    }
  }
];
