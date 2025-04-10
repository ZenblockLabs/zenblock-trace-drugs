
import { TrackingEvent } from '../types';

// First set of events (drugs 1-3)
export const drugEventsSet1: TrackingEvent[] = [
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
  }
];
