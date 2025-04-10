
import { BaseBlockchainService } from './BaseBlockchainService';
import { Drug, TrackingEvent, DrugStatus, UserRole } from './types';
import { mockDrugs as initialMockDrugs, mockEvents, computeDrugStatus, filterEventsByRole } from '../utils/mockDataHelper';

export class MockBlockchainService extends BaseBlockchainService {
  private drugs: Drug[] = [];
  private events: TrackingEvent[] = [];
  private userRole: UserRole = 'regulator'; // Default to regulator which sees everything

  constructor() {
    super();
    console.log('MockBlockchainService initialized');
    this.initializeData();
  }

  // Set the current user role for filtering
  setUserRole(role: UserRole) {
    this.userRole = role;
    console.log(`MockBlockchainService: User role set to ${role}`);
  }

  // Initialize the service with mock data and compute current statuses
  private initializeData() {
    // Deep clone the initial data to avoid modifying the source
    this.events = JSON.parse(JSON.stringify(mockEvents));
    
    // Initialize drugs with computed statuses
    this.drugs = initialMockDrugs.map(drug => {
      const { status, currentOwnerId, currentOwnerName, currentOwnerRole } = 
        computeDrugStatus(drug.id);
      
      return {
        ...drug,
        status,
        currentOwnerId,
        currentOwnerName, 
        currentOwnerRole
      };
    });
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
    this.drugs.push(newDrug);
    return newDrug;
  }

  async getAllDrugs(): Promise<Drug[]> {
    return this.drugs;
  }

  async getDrugsByOwner(ownerId: string): Promise<Drug[]> {
    return this.drugs.filter(drug => drug.currentOwnerId === ownerId);
  }

  async getDrugById(id: string): Promise<Drug | null> {
    return this.drugs.find(drug => drug.id === id) || null;
  }

  async getDrugBySGTIN(sgtin: string): Promise<Drug | null> {
    return this.drugs.find(drug => drug.sgtin === sgtin) || null;
  }

  async createEvent(eventData: Omit<TrackingEvent, 'id'>): Promise<TrackingEvent> {
    const newEvent: TrackingEvent = {
      id: Math.random().toString(36).substring(2, 15), // Generate a random ID
      ...eventData
    };
    this.events.push(newEvent);
    
    // Update the drug's status based on the new event
    this.updateDrugStatus(eventData.drugId);
    
    return newEvent;
  }

  async getEventsByDrug(drugId: string): Promise<TrackingEvent[]> {
    const allEvents = this.events.filter(event => event.drugId === drugId);
    
    // Apply role-based filtering if not a regulator
    if (this.userRole !== 'regulator') {
      return filterEventsByRole(allEvents, this.userRole);
    }
    
    return allEvents;
  }

  async getAllEvents(): Promise<TrackingEvent[]> {
    // Apply role-based filtering if not a regulator
    if (this.userRole !== 'regulator') {
      return filterEventsByRole(this.events, this.userRole);
    }
    
    return this.events;
  }

  async getRecentEvents(limit: number = 10): Promise<TrackingEvent[]> {
    const sortedEvents = [...this.events]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Apply role-based filtering if not a regulator
    const filteredEvents = this.userRole !== 'regulator' 
      ? filterEventsByRole(sortedEvents, this.userRole)
      : sortedEvents;
    
    return filteredEvents.slice(0, limit);
  }

  // Update a drug's status based on its latest event
  private updateDrugStatus(drugId: string): void {
    const drugIndex = this.drugs.findIndex(d => d.id === drugId);
    if (drugIndex === -1) return;
    
    const { status, currentOwnerId, currentOwnerName, currentOwnerRole } = 
      computeDrugStatus(drugId);
    
    this.drugs[drugIndex] = {
      ...this.drugs[drugIndex],
      status,
      currentOwnerId,
      currentOwnerName,
      currentOwnerRole
    };
  }

  async transferDrug(drugId: string, fromId: string, toId: string, toName: string, toRole: string, location: string, details: Record<string, any>): Promise<boolean> {
    const drugIndex = this.drugs.findIndex(drug => drug.id === drugId);
    if (drugIndex === -1) {
      return false;
    }

    // Create a transfer event
    await this.createEvent({
      drugId: drugId,
      type: 'ship',
      timestamp: new Date().toISOString(),
      location: location,
      actor: {
        id: fromId,
        name: this.drugs[drugIndex].currentOwnerName,
        role: this.drugs[drugIndex].currentOwnerRole,
        organization: this.drugs[drugIndex].currentOwnerName
      },
      details: {
        toId: toId,
        toName: toName,
        toRole: toRole,
        ...details
      }
    });

    return true;
  }

  async receiveDrug(drugId: string, receiverId: string, receiverName: string, receiverRole: string, location: string, details: Record<string, any>): Promise<boolean> {
    const drugIndex = this.drugs.findIndex(drug => drug.id === drugId);
    if (drugIndex === -1) {
      return false;
    }

    // Create a receive event
    await this.createEvent({
      drugId: drugId,
      type: 'receive',
      timestamp: new Date().toISOString(),
      location: location,
      actor: {
        id: receiverId,
        name: receiverName,
        role: receiverRole,
        organization: receiverName
      },
      details: {
        notes: `Received by ${receiverName} (${receiverRole})`,
        ...details
      }
    });

    return true;
  }

  async initiateRecall(sgtin: string, reason: string, initiator: any): Promise<boolean> {
    const drug = this.drugs.find(d => d.sgtin === sgtin);
    if (!drug) {
      return false;
    }

    // Create a recall event
    await this.createEvent({
      drugId: drug.id,
      type: 'recall',
      timestamp: new Date().toISOString(),
      location: 'System',
      actor: {
        id: typeof initiator === 'string' ? initiator : initiator.id,
        name: typeof initiator === 'string' ? 'Regulatory Authority' : initiator.name,
        role: typeof initiator === 'string' ? 'regulator' : initiator.role,
        organization: typeof initiator === 'string' ? 'Regulatory Authority' : initiator.organization
      },
      details: {
        reason,
        recallId: Math.random().toString(36).substring(2, 10)
      }
    });

    return true;
  }

  async checkRecallStatus(sgtin: string): Promise<any> {
    const drug = this.drugs.find(d => d.sgtin === sgtin);
    if (!drug) {
      return { isRecalled: false, reason: '' };
    }

    // Check if there are any recall events for this drug
    const recallEvents = this.events.filter(
      e => e.drugId === drug.id && e.type.toLowerCase() === 'recall'
    );

    if (recallEvents.length > 0) {
      // Sort by timestamp (newest first) to get the most recent recall
      const latestRecall = recallEvents.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];

      return {
        isRecalled: true,
        reason: latestRecall.details.reason || 'Unspecified reason'
      };
    }

    return { isRecalled: false, reason: '' };
  }

  async getDrugDetailsBySGTIN(sgtin: string): Promise<any> {
    const drug = this.drugs.find(d => d.sgtin === sgtin);
    
    if (!drug) {
      return null;
    }
    
    // Get events for this drug
    const allEvents = this.events.filter(e => e.drugId === drug.id);
    
    // Sort events by timestamp
    const sortedEvents = [...allEvents].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Apply role-based filtering if applicable
    const events = this.userRole !== 'regulator' 
      ? filterEventsByRole(sortedEvents, this.userRole) 
      : sortedEvents;
    
    // Check if drug is recalled
    const recallStatus = await this.checkRecallStatus(sgtin);
    
    // Format the response as expected by the tracking UI
    return {
      drug: {
        name: drug.productName,
        manufacturer: drug.manufacturerName,
        batchId: drug.batchNumber,
        expiry: drug.expiryDate,
        license: drug.id, // Using ID as a stand-in for license
        sgtin: drug.sgtin
      },
      events: events.map(event => ({
        step: event.type.charAt(0).toUpperCase() + event.type.slice(1),
        timestamp: event.timestamp,
        location: event.location,
        handler: typeof event.actor === 'string' ? event.actor : event.actor.name,
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
