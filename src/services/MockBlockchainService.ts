import { BaseBlockchainService } from './BaseBlockchainService';
import { Drug, TrackingEvent, DrugStatus } from './types';

// Mock data for demonstration purposes
const mockDrugs: Drug[] = [
  {
    id: '1',
    name: 'Paracetamol',
    manufacturer: 'ZenPharma Inc.',
    batchNumber: 'BATCH-001',
    expiryDate: '2024-12-31',
    licenseNumber: 'LP001',
    sgtin: 'SGTIN001',
    ownerId: 'user1', // John Manufacturer
    ownerName: 'ZenPharma Inc.',
    ownerRole: 'manufacturer',
    status: 'manufactured'
  },
  {
    id: '2',
    name: 'Amoxicillin',
    manufacturer: 'ZenPharma Inc.',
    batchNumber: 'BATCH-002',
    expiryDate: '2025-06-30',
    licenseNumber: 'LP002',
    sgtin: 'SGTIN002',
    ownerId: 'user2', // Jane Distributor
    ownerName: 'MediDistribute LLC',
    ownerRole: 'distributor',
    status: 'shipped'
  },
  {
    id: '3',
    name: 'Ibuprofen',
    manufacturer: 'ZenPharma Inc.',
    batchNumber: 'BATCH-003',
    expiryDate: '2024-11-15',
    licenseNumber: 'LP003',
    sgtin: 'SGTIN003',
    ownerId: 'user3', // Sam Pharmacist
    ownerName: 'ZenMed Pharmacy',
    ownerRole: 'dispenser',
    status: 'received'
  },
  {
    id: '4',
    name: 'Aspirin',
    manufacturer: 'ZenPharma Inc.',
    batchNumber: 'BATCH-004',
    expiryDate: '2025-01-01',
    licenseNumber: 'LP004',
    sgtin: 'SGTIN004',
    ownerId: 'user1', // John Manufacturer
    ownerName: 'ZenPharma Inc.',
    ownerRole: 'manufacturer',
    status: 'manufactured'
  },
  {
    id: '5',
    name: 'Vitamin C',
    manufacturer: 'ZenPharma Inc.',
    batchNumber: 'BATCH-005',
    expiryDate: '2026-03-01',
    licenseNumber: 'LP005',
    sgtin: 'SGTIN005',
    ownerId: 'user2', // Jane Distributor
    ownerName: 'MediDistribute LLC',
    ownerRole: 'distributor',
    status: 'in-transit'
  }
];

const mockEvents: TrackingEvent[] = [
  {
    id: 'event1',
    drugId: '1',
    type: 'Manufactured',
    timestamp: '2023-01-01T00:00:00.000Z',
    location: 'ZenPharma Manufacturing Facility',
    actor: 'John Manufacturer',
    details: { notes: 'Initial production completed' }
  },
  {
    id: 'event2',
    drugId: '2',
    type: 'Manufactured',
    timestamp: '2023-01-10T00:00:00.000Z',
    location: 'ZenPharma Manufacturing Facility',
    actor: 'John Manufacturer',
    details: { notes: 'Initial production completed' }
  },
  {
    id: 'event3',
    drugId: '2',
    type: 'Shipped',
    timestamp: '2023-01-15T00:00:00.000Z',
    location: 'ZenPharma Distribution Center',
    actor: 'John Manufacturer',
    details: { notes: 'Transferred to MediDistribute LLC' }
  },
  {
    id: 'event4',
    drugId: '2',
    type: 'Received',
    timestamp: '2023-01-17T00:00:00.000Z',
    location: 'MediDistribute Warehouse',
    actor: 'Jane Distributor',
    details: { notes: 'Received from ZenPharma Inc.' }
  },
  {
    id: 'event5',
    drugId: '3',
    type: 'Manufactured',
    timestamp: '2023-02-01T00:00:00.000Z',
    location: 'ZenPharma Manufacturing Facility',
    actor: 'John Manufacturer',
    details: { notes: 'Initial production completed' }
  },
  {
    id: 'event6',
    drugId: '3',
    type: 'Shipped',
    timestamp: '2023-02-05T00:00:00.000Z',
    location: 'ZenPharma Distribution Center',
    actor: 'John Manufacturer',
    details: { notes: 'Transferred to MediDistribute LLC' }
  },
  {
    id: 'event7',
    drugId: '3',
    type: 'Received',
    timestamp: '2023-02-07T00:00:00.000Z',
    location: 'MediDistribute Warehouse',
    actor: 'Jane Distributor',
    details: { notes: 'Received from ZenPharma Inc.' }
  },
  {
    id: 'event8',
    drugId: '3',
    type: 'Shipped',
    timestamp: '2023-02-10T00:00:00.000Z',
    location: 'MediDistribute Warehouse',
    actor: 'Jane Distributor',
    details: { notes: 'Transferred to ZenMed Pharmacy' }
  },
  {
    id: 'event9',
    drugId: '3',
    type: 'Received',
    timestamp: '2023-02-12T00:00:00.000Z',
    location: 'ZenMed Pharmacy',
    actor: 'Sam Pharmacist',
    details: { notes: 'Received from MediDistribute LLC' }
  },
  {
    id: 'event10',
    drugId: '5',
    type: 'Manufactured',
    timestamp: '2023-03-01T00:00:00.000Z',
    location: 'ZenPharma Manufacturing Facility',
    actor: 'John Manufacturer',
    details: { notes: 'Initial production completed' }
  },
  {
    id: 'event11',
    drugId: '5',
    type: 'Shipped',
    timestamp: '2023-03-05T00:00:00.000Z',
    location: 'ZenPharma Distribution Center',
    actor: 'John Manufacturer',
    details: { notes: 'Transferred to MediDistribute LLC' }
  },
  {
    id: 'event12',
    drugId: '5',
    type: 'In Transit',
    timestamp: '2023-03-07T00:00:00.000Z',
    location: 'Shipping Carrier',
    actor: 'Logistics System',
    details: { notes: 'Package in transit to MediDistribute LLC' }
  }
];

interface DrugRecallStatus {
  sgtin: string;
  isRecalled: boolean;
  reason: string;
  verifiedBy: string;
  timestamp: string;
}

const mockDrugStatuses: DrugRecallStatus[] = [
  {
    sgtin: 'SGTIN001',
    isRecalled: false,
    reason: '',
    verifiedBy: 'Mock Verification Service',
    timestamp: '2023-01-01T00:00:00.000Z'
  },
  {
    sgtin: 'SGTIN002',
    isRecalled: true,
    reason: 'Incorrect dosage',
    verifiedBy: 'Mock Verification Service',
    timestamp: '2023-01-05T00:00:00.000Z'
  },
  {
    sgtin: 'SGTIN003',
    isRecalled: false,
    reason: '',
    verifiedBy: 'Mock Verification Service',
    timestamp: '2023-02-01T00:00:00.000Z'
  },
  {
    sgtin: 'SGTIN004',
    isRecalled: false,
    reason: '',
    verifiedBy: 'Mock Verification Service',
    timestamp: '2023-02-03T00:00:00.000Z'
  },
  {
    sgtin: 'SGTIN005',
    isRecalled: false,
    reason: '',
    verifiedBy: 'Mock Verification Service',
    timestamp: '2023-02-07T00:00:00.000Z'
  }
];

export class MockBlockchainService extends BaseBlockchainService {
  constructor() {
    super();
    console.log('MockBlockchainService initialized');
  }

  async connect(): Promise<boolean> {
    this.gatewayConnected = true;
    return true;
  }

  async registerDrug(drugData: Omit<Drug, 'id'>): Promise<Drug> {
    const newDrug: Drug = {
      id: Math.random().toString(36).substring(2, 15), // Generate a random ID
      ...drugData
    };
    mockDrugs.push(newDrug);
    return newDrug;
  }

  async getAllDrugs(): Promise<Drug[]> {
    return mockDrugs;
  }

  async getDrugsByOwner(ownerId: string): Promise<Drug[]> {
    return mockDrugs.filter(drug => drug.ownerId === ownerId);
  }

  async getDrugById(id: string): Promise<Drug | null> {
    return mockDrugs.find(drug => drug.id === id) || null;
  }

  async getDrugBySGTIN(sgtin: string): Promise<Drug | null> {
    return mockDrugs.find(drug => drug.sgtin === sgtin) || null;
  }

  async createEvent(eventData: Omit<TrackingEvent, 'id'>): Promise<TrackingEvent> {
    const newEvent: TrackingEvent = {
      id: Math.random().toString(36).substring(2, 15), // Generate a random ID
      ...eventData
    };
    mockEvents.push(newEvent);
    return newEvent;
  }

  async getEventsByDrug(drugId: string): Promise<TrackingEvent[]> {
    return mockEvents.filter(event => event.drugId === drugId);
  }

  async getAllEvents(): Promise<TrackingEvent[]> {
    return mockEvents;
  }

  async getRecentEvents(limit: number = 10): Promise<TrackingEvent[]> {
    return mockEvents.slice(-limit);
  }

  async transferDrug(drugId: string, fromId: string, toId: string, toName: string, toRole: string, location: string, details: Record<string, any>): Promise<boolean> {
    const drugIndex = mockDrugs.findIndex(drug => drug.id === drugId);
    if (drugIndex === -1) {
      return false;
    }

    mockDrugs[drugIndex] = {
      ...mockDrugs[drugIndex],
      ownerId: toId,
      ownerName: toName,
      ownerRole: toRole
    };

    // Create a transfer event
    await this.createEvent({
      drugId: drugId,
      type: 'Transfer',
      timestamp: new Date().toISOString(),
      location: location,
      actor: fromId,
      details: {
        toId: toId,
        notes: `Transferred to ${toName} (${toRole})`
      }
    });

    return true;
  }

  async receiveDrug(drugId: string, receiverId: string, receiverName: string, receiverRole: string, location: string, details: Record<string, any>): Promise<boolean> {
    const drugIndex = mockDrugs.findIndex(drug => drug.id === drugId);
    if (drugIndex === -1) {
      return false;
    }

    // Create a receive event
    await this.createEvent({
      drugId: drugId,
      type: 'Receive',
      timestamp: new Date().toISOString(),
      location: location,
      actor: receiverId,
      details: {
        notes: `Received by ${receiverName} (${receiverRole})`
      }
    });

    return true;
  }

  async initiateRecall(sgtin: string, reason: string, initiator: any): Promise<boolean> {
    const status = mockDrugStatuses.find(status => status.sgtin === sgtin);
    if (!status) {
      return false;
    }

    status.isRecalled = true;
    status.reason = reason;
    status.timestamp = new Date().toISOString();

    return true;
  }

  async checkRecallStatus(sgtin: string): Promise<any> {
    const status = mockDrugStatuses.find(status => status.sgtin === sgtin);
    if (!status) {
      return { isRecalled: false, reason: '' };
    }

    return {
      isRecalled: status.isRecalled,
      reason: status.reason
    };
  }

  async getDrugDetailsBySGTIN(sgtin: string): Promise<any> {
    const allDrugs = await this.getAllDrugs();
    const drug = allDrugs.find(d => d.sgtin === sgtin);
    
    if (!drug) {
      return null;
    }
    
    // Get events for this drug
    const events = await this.getEventsByDrug(drug.id);
    
    // Check if drug is recalled
    const recallStatus = await this.checkRecallStatus(sgtin);
    
    // Format the response as expected by the tracking UI
    return {
      drug: {
        name: drug.name,
        manufacturer: drug.manufacturer,
        batchId: drug.batchNumber,
        expiry: drug.expiryDate,
        license: drug.licenseNumber,
        sgtin: drug.sgtin
      },
      events: events.map(event => ({
        step: event.type,
        timestamp: event.timestamp,
        location: event.location,
        handler: event.actor,
        notes: event.details.notes || ''
      })),
      status: {
        isRecalled: recallStatus.isRecalled,
        message: recallStatus.isRecalled 
          ? `⚠️ This product has been recalled. Reason: ${recallStatus.reason}` 
          : "✅ This product is verified genuine and has a valid chain of custody.",
        verifiedBy: "Zenblock Labs Verification Service"
      }
    };
  }

  async getLatestComplianceReport(): Promise<any> {
    return {
      id: 'comp1',
      title: 'Q1 2023 Compliance Report',
      period: 'Q1 2023',
      timestamp: new Date().toISOString(),
      violations: 3,
      complianceScore: 92.5,
      details: {
        totalTransactions: 120,
        successfulValidations: 117,
        recommendations: 'Improve temperature tracking during transit'
      }
    };
  }
}

export const mockBlockchainService = new MockBlockchainService();
