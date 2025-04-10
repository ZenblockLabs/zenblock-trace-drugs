import { BaseBlockchainService } from './BaseBlockchainService';
import { Drug, TrackingEvent } from './types';
import { NetworkService } from './fabric/NetworkService';
import { DrugService } from './fabric/DrugService';
import { EventService } from './fabric/EventService';
import { TransferService } from './fabric/TransferService';
import { RecallService } from './fabric/RecallService';

export class FabricService extends BaseBlockchainService {
  private endpoint: string;
  private token: string | null;
  
  private networkService: NetworkService;
  private drugService: DrugService;
  private eventService: EventService;
  private transferService: TransferService;
  private recallService: RecallService;

  constructor(endpoint: string = '', token: string | null = null) {
    super();
    this.endpoint = endpoint;
    this.token = token;
    this.gatewayConnected = false;
    
    // Initialize services
    this.networkService = new NetworkService();
    this.drugService = new DrugService();
    this.eventService = new EventService();
    this.transferService = new TransferService();
    this.recallService = new RecallService();
  }

  async connect(): Promise<boolean> {
    const connected = await this.networkService.connect();
    this.gatewayConnected = connected;
    return connected;
  }

  protected async ensureConnection(): Promise<boolean> {
    if (!this.gatewayConnected) {
      return this.connect();
    }
    return true;
  }

  async registerDrug(drugData: any): Promise<Drug> {
    await this.ensureConnection();
    return this.drugService.registerDrug(drugData);
  }

  async getAllDrugs(): Promise<Drug[]> {
    await this.ensureConnection();
    return this.drugService.getAllDrugs();
  }

  async getDrugsByOwner(ownerId: string): Promise<Drug[]> {
    await this.ensureConnection();
    return this.drugService.getDrugsByOwner(ownerId);
  }

  async getDrugById(id: string): Promise<Drug | null> {
    await this.ensureConnection();
    return this.drugService.getDrugById(id);
  }

  async getDrugBySGTIN(sgtin: string): Promise<Drug | null> {
    await this.ensureConnection();
    return this.drugService.getDrugBySGTIN(sgtin);
  }

  async getDrugDetailsBySGTIN(sgtin: string): Promise<any> {
    await this.ensureConnection();
    return this.drugService.getDrugDetailsBySGTIN(sgtin);
  }

  async createEvent(eventData: any): Promise<TrackingEvent> {
    await this.ensureConnection();
    return this.eventService.createEvent(eventData);
  }

  async getEventsByDrug(drugId: string): Promise<TrackingEvent[]> {
    await this.ensureConnection();
    return this.eventService.getEventsByDrug(drugId);
  }

  async getAllEvents(): Promise<TrackingEvent[]> {
    await this.ensureConnection();
    return this.eventService.getAllEvents();
  }

  async getRecentEvents(limit: number = 10): Promise<TrackingEvent[]> {
    await this.ensureConnection();
    return this.eventService.getRecentEvents(limit);
  }

  async transferDrug(
    drugId: string, 
    fromId: string, 
    toId: string, 
    toName: string, 
    toRole: string, 
    location: string, 
    details: Record<string, any>
  ): Promise<boolean> {
    await this.ensureConnection();
    return this.transferService.transferDrug(drugId, fromId, toId, toName, toRole, location, details);
  }

  async receiveDrug(
    drugId: string, 
    receiverId: string, 
    receiverName: string, 
    receiverRole: string, 
    location: string, 
    details: Record<string, any>
  ): Promise<boolean> {
    await this.ensureConnection();
    return this.transferService.receiveDrug(drugId, receiverId, receiverName, receiverRole, location, details);
  }

  async initiateRecall(sgtin: string, reason: string, initiator: any): Promise<boolean> {
    await this.ensureConnection();
    return this.recallService.initiateRecall(sgtin, reason, initiator);
  }

  async checkRecallStatus(sgtin: string): Promise<any> {
    await this.ensureConnection();
    return this.recallService.checkRecallStatus(sgtin);
  }

  async getLatestComplianceReport(): Promise<any> {
    await this.ensureConnection();
    return {
      id: 'fabric-comp-1',
      title: 'DSCSA Compliance Audit - Q1 2025',
      period: 'Q1 2025',
      timestamp: new Date().toISOString(),
      violations: 2,
      complianceScore: 96.5,
      details: {
        totalTransactions: 140,
        successfulValidations: 137,
        recommendations: 'Ensure all trading partners have proper verification systems'
      }
    };
  }
}
