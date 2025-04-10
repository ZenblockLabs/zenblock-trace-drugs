import { BaseBlockchainService } from './BaseBlockchainService';
import { Drug, TrackingEvent, DrugStatus, ComplianceReport } from './types';
import { MockDrugService } from './mock/DrugService';
import { MockEventService } from './mock/EventService';
import { MockTransferService } from './mock/TransferService';
import { MockRecallService } from './mock/RecallService';
import { MockTrackingService } from './mock/TrackingService';

export class MockBlockchainService extends BaseBlockchainService {
  private drugService: MockDrugService;
  private eventService: MockEventService;
  private transferService: MockTransferService;
  private recallService: MockRecallService;
  private trackingService: MockTrackingService;

  constructor() {
    super();
    console.log('MockBlockchainService initialized');
    
    // Initialize service modules
    this.drugService = new MockDrugService();
    this.eventService = new MockEventService();
    this.transferService = new MockTransferService(this.drugService, this.eventService);
    this.recallService = new MockRecallService(this.drugService, this.eventService);
    this.trackingService = new MockTrackingService(
      this.drugService, 
      this.eventService,
      this.recallService
    );
  }

  // Set the current user role for filtering
  setUserRole(role: string) {
    this.eventService.setUserRole(role);
    console.log(`MockBlockchainService: User role set to ${role}`);
  }

  async connect(): Promise<boolean> {
    this.gatewayConnected = true;
    return true;
  }

  // Drug Management Methods
  async registerDrug(drugData: Omit<Drug, 'id'>): Promise<Drug> {
    return this.drugService.registerDrug(drugData);
  }

  async getAllDrugs(): Promise<Drug[]> {
    return this.drugService.getAllDrugs();
  }

  async getDrugsByOwner(ownerId: string): Promise<Drug[]> {
    return this.drugService.getDrugsByOwner(ownerId);
  }

  async getDrugById(id: string): Promise<Drug | null> {
    return this.drugService.getDrugById(id);
  }

  async getDrugBySGTIN(sgtin: string): Promise<Drug | null> {
    return this.drugService.getDrugBySGTIN(sgtin);
  }

  // Event Management Methods
  async createEvent(eventData: Omit<TrackingEvent, 'id'>): Promise<TrackingEvent> {
    const newEvent = await this.eventService.createEvent(eventData);
    
    // Update the drug's status based on the new event
    const drug = await this.drugService.getDrugById(eventData.drugId);
    if (drug) {
      const { status, currentOwnerId, currentOwnerName, currentOwnerRole } = 
        { status: drug.status || 'manufactured', currentOwnerId: drug.currentOwnerId || '', 
          currentOwnerName: drug.currentOwnerName || 'Unknown', currentOwnerRole: drug.currentOwnerRole || 'unknown' };
      
      const updatedDrug: Drug = {
        ...drug,
        status,
        currentOwnerId,
        currentOwnerName,
        currentOwnerRole
      };
      
      this.drugService.updateDrug(updatedDrug);
    }
    
    return newEvent;
  }

  async getEventsByDrug(drugId: string): Promise<TrackingEvent[]> {
    return this.eventService.getEventsByDrug(drugId);
  }

  async getAllEvents(): Promise<TrackingEvent[]> {
    return this.eventService.getAllEvents();
  }

  async getRecentEvents(limit: number = 10): Promise<TrackingEvent[]> {
    return this.eventService.getRecentEvents(limit);
  }

  // Transfer Methods
  async transferDrug(
    drugId: string, 
    fromId: string, 
    toId: string, 
    toName: string, 
    toRole: string, 
    location: string, 
    details: Record<string, any>
  ): Promise<boolean> {
    return this.transferService.transferDrug(
      drugId, fromId, toId, toName, toRole, location, details
    );
  }

  async receiveDrug(
    drugId: string, 
    receiverId: string, 
    receiverName: string, 
    receiverRole: string, 
    location: string, 
    details: Record<string, any>
  ): Promise<boolean> {
    return this.transferService.receiveDrug(
      drugId, receiverId, receiverName, receiverRole, location, details
    );
  }

  // Recall Methods
  async initiateRecall(sgtin: string, reason: string, initiator: any): Promise<boolean> {
    return this.recallService.initiateRecall(sgtin, reason, initiator);
  }

  async checkRecallStatus(sgtin: string): Promise<any> {
    return this.recallService.checkRecallStatus(sgtin);
  }

  // Tracking Methods
  async getDrugDetailsBySGTIN(sgtin: string): Promise<any> {
    return this.trackingService.getDrugDetailsBySGTIN(sgtin);
  }

  async getLatestComplianceReport(): Promise<ComplianceReport> {
    return this.trackingService.getLatestComplianceReport();
  }
}

export const mockBlockchainService = new MockBlockchainService();
