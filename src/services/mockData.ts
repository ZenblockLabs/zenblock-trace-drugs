import { Drug, TrackingEvent, DrugStatus } from './types';

// Mock data for testing
export const mockDrugs: Drug[] = [
  {
    id: "d1",
    name: "ZenRelief",
    manufacturer: "ZenPharma Inc.",
    batchNumber: "BATCH-1234",
    expiryDate: "2025-12-31",
    licenseNumber: "LIC-12345",
    sgtin: "sgtin:01234567890123.123456",
    ownerId: "user1",
    ownerName: "ZenPharma Inc.",
    ownerRole: "manufacturer",
    gtin: "01234567890123",
    manufacturerId: "user1",
    manufacturerName: "ZenPharma Inc.",
    productName: "ZenRelief",
    dosage: "10mg",
    status: "manufactured",
    currentOwnerId: "user1",
    currentOwnerName: "ZenPharma Inc.",
    currentOwnerRole: "manufacturer"
  },
  {
    id: "d2",
    name: "CardioZen",
    manufacturer: "ZenPharma Inc.",
    batchNumber: "BATCH-1235",
    expiryDate: "2026-01-15",
    licenseNumber: "LIC-12346",
    sgtin: "sgtin:01234567890124.123457",
    ownerId: "user2",
    ownerName: "MediDistribute LLC",
    ownerRole: "distributor",
    gtin: "01234567890124",
    manufacturerId: "user1",
    manufacturerName: "ZenPharma Inc.",
    productName: "CardioZen",
    dosage: "25mg",
    status: "shipped",
    currentOwnerId: "user2",
    currentOwnerName: "MediDistribute LLC",
    currentOwnerRole: "distributor"
  },
  {
    id: "d3",
    name: "PainEase",
    manufacturer: "ZenPharma Inc.",
    batchNumber: "BATCH-1236",
    expiryDate: "2025-06-30",
    licenseNumber: "LIC-12347",
    sgtin: "sgtin:01234567890125.123458",
    ownerId: "user3",
    ownerName: "ZenMed Pharmacy",
    ownerRole: "dispenser",
    gtin: "01234567890125",
    manufacturerId: "user1",
    manufacturerName: "ZenPharma Inc.",
    productName: "PainEase",
    dosage: "50mg",
    status: "received",
    currentOwnerId: "user3",
    currentOwnerName: "ZenMed Pharmacy",
    currentOwnerRole: "dispenser"
  },
  // A drug with an anomalous flow (skips distributor)
  {
    id: "d4",
    name: "AnomalyMed",
    manufacturer: "ZenPharma Inc.",
    batchNumber: "BATCH-1237",
    expiryDate: "2025-08-15",
    licenseNumber: "LIC-12348",
    sgtin: "sgtin:01234567890126.123459",
    ownerId: "user3",
    ownerName: "ZenMed Pharmacy",
    ownerRole: "dispenser",
    gtin: "01234567890126",
    manufacturerId: "user1",
    manufacturerName: "ZenPharma Inc.",
    productName: "AnomalyMed",
    dosage: "100mg",
    status: "dispensed",
    currentOwnerId: "user3",
    currentOwnerName: "ZenMed Pharmacy",
    currentOwnerRole: "dispenser"
  },
  // A drug with a gap in its timeline
  {
    id: "d5",
    name: "TimeGapMed",
    manufacturer: "ZenPharma Inc.",
    batchNumber: "BATCH-1238",
    expiryDate: "2025-10-20",
    licenseNumber: "LIC-12349",
    sgtin: "sgtin:01234567890127.123460",
    ownerId: "user2",
    ownerName: "MediDistribute LLC",
    ownerRole: "distributor",
    gtin: "01234567890127",
    manufacturerId: "user1",
    manufacturerName: "ZenPharma Inc.",
    productName: "TimeGapMed",
    dosage: "75mg",
    status: "in-transit",
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
      role: "manufacturer"
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
      role: "manufacturer"
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
      role: "manufacturer"
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
      role: "manufacturer"
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
      role: "manufacturer"
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
      role: "distributor"
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

  // Normal flow - Drug 3 (PainEase) - Full supply chain to pharmacy
  {
    id: "e5",
    timestamp: "2023-04-10T11:30:00Z",
    drugId: "d3",
    type: "commission",
    location: "ZenPharma Manufacturing Facility, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer"
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
    type: "qa-passed",
    location: "ZenPharma QA Lab, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer"
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
      role: "manufacturer"
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
  
  // Adding additional events to complete the timelines
  // Complete Drug 1 timeline - adding shipping and receiving events
  {
    id: "e1c",
    timestamp: "2023-04-05T09:00:00Z",
    drugId: "d1",
    type: "ship",
    location: "ZenPharma Distribution Center, CA, USA",
    actor: {
      id: "user1",
      name: "John Manufacturer",
      role: "manufacturer"
    },
    details: {
      destination: "MediDistribute LLC, NV, USA",
      shipmentId: "SHP-54324",
      carrier: "SecurePharmLogistics",
      temperatureCheckPassed: true,
      temperatureLog: [
        { timestamp: "2023-04-05T09:30:00Z", temperature: 5.2, unit: "Celsius" },
        { timestamp: "2023-04-05T12:30:00Z", temperature: 5.5, unit: "Celsius" },
        { timestamp: "2023-04-05T15:30:00Z", temperature: 5.3, unit: "Celsius" }
      ],
      digitalSignature: "0xabc123ghi456",
      isOnChain: true,
      blockchainHash: "0xf7e8d9c0b1a2345678901234567890abcdef1234",
      blockHeight: 7845623,
      verificationTimestamp: "2023-04-05T09:05:23Z",
      geoCoordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      humidityPercentage: 45,
      notes: "Shipped with real-time temperature monitoring"
    }
  },
  {
    id: "e1d",
    timestamp: "2023-04-07T11:00:00Z",
    drugId: "d1",
    type: "receive",
    location: "MediDistribute Warehouse, NV, USA",
    actor: {
      id: "user2",
      name: "Jane Distributor",
      role: "distributor"
    },
    details: {
      shipmentId: "SHP-54324",
      condition: "Good",
      temperatureCheckPassed: true,
      temperatureLog: [
        { timestamp: "2023-04-06T09:30:00Z", temperature: 5.1, unit: "Celsius" },
        { timestamp: "2023-04-06T15:30:00Z", temperature: 5.4, unit: "Celsius" },
        { timestamp: "2023-04-07T08:30:00Z", temperature: 5.2, unit: "Celsius" }
      ],
      digitalSignature: "0xdef456jkl789",
      isOnChain: true,
      blockchainHash: "0xa1b2c3d4e5f67890123456789abcdef0123456",
      blockHeight: 7845780,
      verificationTimestamp: "2023-04-07T11:05:13Z",
      geoCoordinates: {
        latitude: 36.1699,
        longitude: -115.1398
      },
      humidityPercentage: 42,
      notes: "All packages verified and temperature compliance confirmed"
    }
  },
  
  // Additional warehousing event for Drug 2
  {
    id: "e4b",
    timestamp: "2023-04-06T14:15:00Z",
    drugId: "d2",
    type: "warehouse",
    location: "MediDistribute Secure Storage, NV, USA",
    actor: {
      id: "user2",
      name: "Jane Distributor",
      role: "distributor"
    },
    details: {
      storageLocation: "Zone A, Rack 23",
      temperatureCheckPassed: true,
      storageConditions: "5°C ± 1°C, 40-60% humidity",
      digitalSignature: "0xmno345pqr678",
      isOnChain: true,
      blockchainHash: "0x123456789abcdef0123456789abcdef012345678",
      blockHeight: 7846102,
      verificationTimestamp: "2023-04-06T14:17:05Z",
      geoCoordinates: {
        latitude: 36.1699,
        longitude: -115.1398
      },
      humidityPercentage: 45,
      notes: "Stored in temperature-monitored cold storage facility"
    }
  },
  
  // Dispense event for Drug 3
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
  
  // Ship event for gap flow drug
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

// A utility function to generate the current
