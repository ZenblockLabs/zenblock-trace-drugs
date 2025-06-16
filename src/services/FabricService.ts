
import { BaseBlockchainService } from './BaseBlockchainService';
import { Drug, TrackingEvent, ComplianceReport } from './types';
import { NetworkService } from './fabric/NetworkService';
import { DrugService } from './fabric/DrugService';
import { EventService } from './fabric/EventService';
import { TransferService } from './fabric/TransferService';
import { RecallService } from './fabric/RecallService';
import { EnhancedFabricGateway } from './fabric/EnhancedFabricGateway';

export class FabricService extends BaseBlockchainService {
  private endpoint: string;
  private token: string | null;
  private gateway: EnhancedFabricGateway;
  
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
    
    // Initialize Enhanced Fabric gateway
    this.gateway = new EnhancedFabricGateway();
    
    // Initialize services
    this.networkService = new NetworkService();
    this.drugService = new DrugService();
    this.eventService = new EventService();
    this.transferService = new TransferService();
    this.recallService = new RecallService();
  }

  async connect(): Promise<boolean> {
    try {
      console.log('FabricService: Attempting to connect to Hyperledger Fabric...');
      
      // Try to connect via the enhanced gateway first
      const gatewayConnected = await this.gateway.connect();
      
      if (gatewayConnected) {
        console.log('FabricService: Connected via Enhanced Fabric Gateway');
        this.gatewayConnected = true;
        return true;
      }
      
      // Fallback to network service
      console.log('FabricService: Enhanced gateway failed, trying network service...');
      const networkConnected = await this.networkService.connect();
      this.gatewayConnected = networkConnected;
      
      if (networkConnected) {
        console.log('FabricService: Connected via Network Service');
      } else {
        console.log('FabricService: All connection methods failed');
      }
      
      return networkConnected;
    } catch (error) {
      console.error('FabricService: Connection error:', error);
      this.gatewayConnected = false;
      return false;
    }
  }

  protected async ensureConnection(): Promise<boolean> {
    if (!this.gatewayConnected) {
      return this.connect();
    }
    return true;
  }

  async registerDrug(drugData: any): Promise<Drug> {
    await this.ensureConnection();
    
    if (this.gateway.isConnected()) {
      console.log('FabricService: Using enhanced gateway for drug registration');
      const transaction = await this.gateway.submitTransaction({
        fcn: 'RegisterDrug',
        args: [JSON.stringify(drugData)]
      });
      return transaction.payload as Drug;
    }
    
    return this.drugService.registerDrug(drugData);
  }

  async getAllDrugs(): Promise<Drug[]> {
    await this.ensureConnection();
    
    if (this.gateway.isConnected()) {
      return await this.gateway.evaluateTransaction({ fcn: 'GetAllDrugs', args: [] });
    }
    
    return this.drugService.getAllDrugs();
  }

  async getDrugsByOwner(ownerId: string): Promise<Drug[]> {
    await this.ensureConnection();
    
    if (this.gateway.isConnected()) {
      return await this.gateway.evaluateTransaction({ fcn: 'GetDrugsByOwner', args: [ownerId] });
    }
    
    return this.drugService.getDrugsByOwner(ownerId);
  }

  async getDrugById(id: string): Promise<Drug | null> {
    await this.ensureConnection();
    
    if (this.gateway.isConnected()) {
      return await this.gateway.evaluateTransaction({ fcn: 'ReadDrug', args: [id] });
    }
    
    return this.drugService.getDrugById(id);
  }

  async getDrugBySGTIN(sgtin: string): Promise<Drug | null> {
    await this.ensureConnection();
    
    if (this.gateway.isConnected()) {
      return await this.gateway.evaluateTransaction({ fcn: 'GetDrugBySGTIN', args: [sgtin] });
    }
    
    return this.drugService.getDrugBySGTIN(sgtin);
  }

  async getDrugDetailsBySGTIN(sgtin: string): Promise<any> {
    await this.ensureConnection();
    
    if (this.gateway.isConnected()) {
      return await this.gateway.evaluateTransaction({ fcn: 'GetDrugDetails', args: [sgtin] });
    }
    
    return this.drugService.getDrugDetailsBySGTIN(sgtin);
  }

  async createEvent(eventData: any): Promise<TrackingEvent> {
    await this.ensureConnection();
    
    if (this.gateway.isConnected()) {
      const transaction = await this.gateway.submitTransaction({
        fcn: 'CreateEvent',
        args: [JSON.stringify(eventData)]
      });
      return transaction.payload as TrackingEvent;
    }
    
    return this.eventService.createEvent(eventData);
  }

  async getEventsByDrug(drugId: string): Promise<TrackingEvent[]> {
    await this.ensureConnection();
    
    if (this.gateway.isConnected()) {
      return await this.gateway.evaluateTransaction({ fcn: 'GetEventsByDrug', args: [drugId] });
    }
    
    return this.eventService.getEventsByDrug(drugId);
  }

  async getAllEvents(): Promise<TrackingEvent[]> {
    await this.ensureConnection();
    
    if (this.gateway.isConnected()) {
      return await this.gateway.evaluateTransaction({ fcn: 'GetAllEvents', args: [] });
    }
    
    return this.eventService.getAllEvents();
  }

  async getRecentEvents(limit: number = 10): Promise<TrackingEvent[]> {
    await this.ensureConnection();
    
    if (this.gateway.isConnected()) {
      return await this.gateway.evaluateTransaction({ fcn: 'GetRecentEvents', args: [limit.toString()] });
    }
    
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
    
    if (this.gateway.isConnected()) {
      const transferData = { drugId, fromId, toId, toName, toRole, location, details };
      const transaction = await this.gateway.submitTransaction({
        fcn: 'TransferDrug',
        args: [JSON.stringify(transferData)]
      });
      return transaction.payload as boolean;
    }
    
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
    
    if (this.gateway.isConnected()) {
      const receiveData = { drugId, receiverId, receiverName, receiverRole, location, details };
      const transaction = await this.gateway.submitTransaction({
        fcn: 'ReceiveDrug',
        args: [JSON.stringify(receiveData)]
      });
      return transaction.payload as boolean;
    }
    
    return this.transferService.receiveDrug(drugId, receiverId, receiverName, receiverRole, location, details);
  }

  async initiateRecall(sgtin: string, reason: string, initiator: any): Promise<boolean> {
    await this.ensureConnection();
    
    if (this.gateway.isConnected()) {
      const recallData = { sgtin, reason, initiator, timestamp: new Date().toISOString() };
      const transaction = await this.gateway.submitTransaction({
        fcn: 'InitiateRecall',
        args: [JSON.stringify(recallData)]
      });
      return transaction.payload as boolean;
    }
    
    return this.recallService.initiateRecall(sgtin, reason, initiator);
  }

  async checkRecallStatus(sgtin: string): Promise<any> {
    await this.ensureConnection();
    
    if (this.gateway.isConnected()) {
      return await this.gateway.evaluateTransaction({ fcn: 'IsRecalled', args: [sgtin] });
    }
    
    return this.recallService.checkRecallStatus(sgtin);
  }

  async getLatestComplianceReport(): Promise<ComplianceReport> {
    await this.ensureConnection();
    
    if (this.gateway.isConnected()) {
      const report = await this.gateway.evaluateTransaction({ fcn: 'GetComplianceReport', args: [] });
      return report as ComplianceReport;
    }
    
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

  // Enhanced method to get gateway connection status
  getGatewayStatus(): { connected: boolean; mode: string; networkInfo?: any } {
    return {
      connected: this.gateway.isConnected(),
      mode: this.gateway.isConnected() ? 'enhanced-fabric-gateway' : 'mock-service',
      networkInfo: this.gateway.isConnected() ? this.gateway.getNetworkInfo() : null
    };
  }

  // New method to get the enhanced gateway instance for admin purposes
  getEnhancedGateway(): EnhancedFabricGateway {
    return this.gateway;
  }
}
