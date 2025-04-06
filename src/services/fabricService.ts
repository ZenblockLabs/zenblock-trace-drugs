
import { Drug, TrackingEvent, DrugStatus } from './mockBlockchainService';
import { supabase } from '@/integrations/supabase/client';

// This interface defines the methods we'll implement when connecting to a real Fabric network
export interface IFabricService {
  // Drug management
  registerDrug: (drugData: any) => Promise<Drug>;
  getAllDrugs: () => Promise<Drug[]>;
  getDrugsByOwner: (ownerId: string) => Promise<Drug[]>;
  getDrugById: (id: string) => Promise<Drug | null>;
  getDrugBySGTIN: (sgtin: string) => Promise<Drug | null>;
  
  // Event tracking
  createEvent: (eventData: any) => Promise<TrackingEvent>;
  getEventsByDrug: (drugId: string) => Promise<TrackingEvent[]>;
  getAllEvents: () => Promise<TrackingEvent[]>;
  getRecentEvents: (limit?: number) => Promise<TrackingEvent[]>;
  
  // Drug transfers
  transferDrug: (drugId: string, fromId: string, toId: string, toName: string, toRole: string, location: string, details: Record<string, any>) => Promise<boolean>;
  receiveDrug: (drugId: string, receiverId: string, receiverName: string, receiverRole: string, location: string, details: Record<string, any>) => Promise<boolean>;
}

// This class implements the IFabricService interface using Supabase Edge Functions as a bridge to Hyperledger Fabric
export class FabricService implements IFabricService {
  private gatewayConnected: boolean = false;

  constructor() {
    console.log('FabricService initialized - Will connect to Fabric network via Supabase Edge Functions');
  }

  async connect(): Promise<boolean> {
    try {
      // In a real implementation, we would validate the connection to Fabric
      // Here we're just simulating successful connection
      console.log('Connecting to Fabric network via Supabase Edge Functions');
      
      // Check if the edge function endpoint is available
      const { data, error } = await supabase.functions.invoke('fabric-ping', {
        body: { action: 'ping' }
      });
      
      if (error) {
        console.error('Failed to connect to Fabric network:', error);
        return false;
      }
      
      console.log('Connected to Fabric network', data);
      this.gatewayConnected = true;
      return true;
    } catch (error) {
      console.error('Failed to connect to Fabric network:', error);
      return false;
    }
  }

  // Check connection status and connect if needed
  private async ensureConnection(): Promise<boolean> {
    if (!this.gatewayConnected) {
      return this.connect();
    }
    return true;
  }

  // Drug management methods
  async registerDrug(drugData: any): Promise<Drug> {
    await this.ensureConnection();
    console.log('FabricService.registerDrug called with:', drugData);
    
    const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
      body: { 
        action: 'invoke',
        chaincodeFcn: 'RegisterDrug',
        args: [JSON.stringify(drugData)]
      }
    });
    
    if (error) {
      console.error('Error registering drug:', error);
      throw new Error(`Failed to register drug: ${error.message}`);
    }
    
    return data as Drug;
  }

  async getAllDrugs(): Promise<Drug[]> {
    await this.ensureConnection();
    console.log('FabricService.getAllDrugs called');
    
    const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
      body: { 
        action: 'query',
        chaincodeFcn: 'GetAllDrugs',
        args: []
      }
    });
    
    if (error) {
      console.error('Error getting all drugs:', error);
      throw new Error(`Failed to get all drugs: ${error.message}`);
    }
    
    return data as Drug[];
  }

  async getDrugsByOwner(ownerId: string): Promise<Drug[]> {
    await this.ensureConnection();
    console.log('FabricService.getDrugsByOwner called for:', ownerId);
    
    const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
      body: { 
        action: 'query',
        chaincodeFcn: 'GetDrugsByOwner',
        args: [ownerId]
      }
    });
    
    if (error) {
      console.error('Error getting drugs by owner:', error);
      throw new Error(`Failed to get drugs by owner: ${error.message}`);
    }
    
    return data as Drug[];
  }

  async getDrugById(id: string): Promise<Drug | null> {
    await this.ensureConnection();
    console.log('FabricService.getDrugById called for:', id);
    
    const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
      body: { 
        action: 'query',
        chaincodeFcn: 'ReadDrug',
        args: [id]
      }
    });
    
    if (error) {
      console.error('Error getting drug by ID:', error);
      throw new Error(`Failed to get drug by ID: ${error.message}`);
    }
    
    return data as Drug;
  }

  async getDrugBySGTIN(sgtin: string): Promise<Drug | null> {
    await this.ensureConnection();
    console.log('FabricService.getDrugBySGTIN called for:', sgtin);
    
    const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
      body: { 
        action: 'query',
        chaincodeFcn: 'GetDrugBySGTIN',
        args: [sgtin]
      }
    });
    
    if (error) {
      console.error('Error getting drug by SGTIN:', error);
      throw new Error(`Failed to get drug by SGTIN: ${error.message}`);
    }
    
    return data as Drug;
  }

  // Event tracking methods
  async createEvent(eventData: any): Promise<TrackingEvent> {
    await this.ensureConnection();
    console.log('FabricService.createEvent called with:', eventData);
    
    const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
      body: { 
        action: 'invoke',
        chaincodeFcn: 'CreateEvent',
        args: [JSON.stringify(eventData)]
      }
    });
    
    if (error) {
      console.error('Error creating event:', error);
      throw new Error(`Failed to create event: ${error.message}`);
    }
    
    return data as TrackingEvent;
  }

  async getEventsByDrug(drugId: string): Promise<TrackingEvent[]> {
    await this.ensureConnection();
    console.log('FabricService.getEventsByDrug called for:', drugId);
    
    const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
      body: { 
        action: 'query',
        chaincodeFcn: 'GetEventsByDrug',
        args: [drugId]
      }
    });
    
    if (error) {
      console.error('Error getting events by drug:', error);
      throw new Error(`Failed to get events by drug: ${error.message}`);
    }
    
    return data as TrackingEvent[];
  }

  async getAllEvents(): Promise<TrackingEvent[]> {
    await this.ensureConnection();
    console.log('FabricService.getAllEvents called');
    
    const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
      body: { 
        action: 'query',
        chaincodeFcn: 'GetAllEvents',
        args: []
      }
    });
    
    if (error) {
      console.error('Error getting all events:', error);
      throw new Error(`Failed to get all events: ${error.message}`);
    }
    
    return data as TrackingEvent[];
  }

  async getRecentEvents(limit: number = 10): Promise<TrackingEvent[]> {
    await this.ensureConnection();
    console.log('FabricService.getRecentEvents called with limit:', limit);
    
    const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
      body: { 
        action: 'query',
        chaincodeFcn: 'GetRecentEvents',
        args: [limit.toString()]
      }
    });
    
    if (error) {
      console.error('Error getting recent events:', error);
      throw new Error(`Failed to get recent events: ${error.message}`);
    }
    
    return data as TrackingEvent[];
  }

  // Drug transfer methods
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
    console.log('FabricService.transferDrug called with:', { drugId, fromId, toId });
    
    const transferData = {
      drugId,
      fromId,
      toId,
      toName,
      toRole,
      location,
      details
    };
    
    const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
      body: { 
        action: 'invoke',
        chaincodeFcn: 'TransferDrug',
        args: [JSON.stringify(transferData)]
      }
    });
    
    if (error) {
      console.error('Error transferring drug:', error);
      throw new Error(`Failed to transfer drug: ${error.message}`);
    }
    
    return data as boolean;
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
    console.log('FabricService.receiveDrug called with:', { drugId, receiverId });
    
    const receiveData = {
      drugId,
      receiverId,
      receiverName,
      receiverRole,
      location,
      details
    };
    
    const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
      body: { 
        action: 'invoke',
        chaincodeFcn: 'ReceiveDrug',
        args: [JSON.stringify(receiveData)]
      }
    });
    
    if (error) {
      console.error('Error receiving drug:', error);
      throw new Error(`Failed to receive drug: ${error.message}`);
    }
    
    return data as boolean;
  }
}
