
import { BaseBlockchainService } from './BaseBlockchainService';
import { Drug, TrackingEvent, DrugStatus } from './types';

// Mock data for demonstration purposes
const mockDrugs: Drug[] = [
  {
    id: '1',
    name: 'Paracetamol',
    manufacturer: 'Mock Pharma',
    batchNumber: 'Batch001',
    expiryDate: '2024-12-31',
    licenseNumber: 'LP001',
    sgtin: 'SGTIN001',
    ownerId: 'manufacturer123',
    ownerName: 'Mock Pharma',
    ownerRole: 'manufacturer'
  },
  {
    id: '2',
    name: 'Amoxicillin',
    manufacturer: 'Mock Pharma',
    batchNumber: 'Batch002',
    expiryDate: '2025-06-30',
    licenseNumber: 'LP002',
    sgtin: 'SGTIN002',
    ownerId: 'distributor456',
    ownerName: 'Mock Dist',
    ownerRole: 'distributor'
  },
  {
    id: '3',
    name: 'Ibuprofen',
    manufacturer: 'Another Pharma',
    batchNumber: 'Batch003',
    expiryDate: '2024-11-15',
    licenseNumber: 'LP003',
    sgtin: 'SGTIN003',
    ownerId: 'pharmacy789',
    ownerName: 'Mock Pharmacy',
    ownerRole: 'dispenser'
  },
  {
    id: '4',
    name: 'Aspirin',
    manufacturer: 'Bayer',
    batchNumber: 'Batch004',
    expiryDate: '2025-01-01',
    licenseNumber: 'LP004',
    sgtin: 'SGTIN004',
    ownerId: 'manufacturer123',
    ownerName: 'Mock Pharma',
    ownerRole: 'manufacturer'
  },
  {
    id: '5',
    name: 'Vitamin C',
    manufacturer: 'Healthy Life',
    batchNumber: 'Batch005',
    expiryDate: '2026-03-01',
    licenseNumber: 'LP005',
    sgtin: 'SGTIN005',
    ownerId: 'distributor456',
    ownerName: 'Mock Dist',
    ownerRole: 'distributor'
  }
];

const mockEvents: TrackingEvent[] = [
  {
    id: 'event1',
    drugId: '1',
    type: 'Manufactured',
    timestamp: '2023-01-01T00:00:00.000Z',
    location: 'Factory A',
    actor: 'Manufacturer 1',
    details: { notes: 'Manufacturing completed' }
  },
  {
    id: 'event2',
    drugId: '1',
    type: 'Shipped',
    timestamp: '2023-01-02T00:00:00.000Z',
    location: 'Warehouse B',
    actor: 'Distributor 1',
    details: { notes: 'Shipped to distributor' }
  },
  {
    id: 'event3',
    drugId: '2',
    type: 'Received',
    timestamp: '2023-01-05T00:00:00.000Z',
    location: 'Pharmacy C',
    actor: 'Pharmacy 1',
    details: { notes: 'Received at pharmacy' }
  },
  {
    id: 'event4',
    drugId: '3',
    type: 'Manufactured',
    timestamp: '2023-02-01T00:00:00.000Z',
    location: 'Factory D',
    actor: 'Manufacturer 2',
    details: { notes: 'Manufacturing completed' }
  },
  {
    id: 'event5',
    drugId: '4',
    type: 'Shipped',
    timestamp: '2023-02-03T00:00:00.000Z',
    location: 'Warehouse E',
    actor: 'Distributor 2',
    details: { notes: 'Shipped to distributor' }
  },
  {
    id: 'event6',
    drugId: '5',
    type: 'Received',
    timestamp: '2023-02-07T00:00:00.000Z',
    location: 'Pharmacy F',
    actor: 'Pharmacy 2',
    details: { notes: 'Received at pharmacy' }
  },
  {
    id: 'event7',
    drugId: '1',
    type: 'Delivered',
    timestamp: '2023-02-08T00:00:00.000Z',
    location: 'Patient Home',
    actor: 'Delivery Service',
    details: { notes: 'Delivered to patient' }
  },
  {
    id: 'event8',
    drugId: '2',
    type: 'Sold',
    timestamp: '2023-02-10T00:00:00.000Z',
    location: 'Pharmacy C',
    actor: 'Pharmacist',
    details: { notes: 'Sold to patient' }
  },
  {
    id: 'event9',
    drugId: '3',
    type: 'Delivered',
    timestamp: '2023-02-12T00:00:00.000Z',
    location: 'Patient Home',
    actor: 'Delivery Service',
    details: { notes: 'Delivered to patient' }
  },
  {
    id: 'event10',
    drugId: '4',
    type: 'Sold',
    timestamp: '2023-02-15T00:00:00.000Z',
    location: 'Pharmacy F',
    actor: 'Pharmacist',
    details: { notes: 'Sold to patient' }
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

  // Drug management methods
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

  // Event tracking methods
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

  // Drug transfer methods
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

  // Recall methods
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

  // Additional method for ComplianceReport
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

// Create and export the singleton instance
export const mockBlockchainService = new MockBlockchainService();
