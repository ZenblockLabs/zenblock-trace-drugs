import { BaseBlockchainService } from './BaseBlockchainService';
import { Drug, TrackingEvent } from './types';
import { supabase } from '@/integrations/supabase/client';

export class FabricService extends BaseBlockchainService {
  private endpoint: string;
  private token: string | null;

  constructor(endpoint: string, token: string | null = null) {
    super();
    this.endpoint = endpoint;
    this.token = token;
    this.gatewayConnected = false;
  }

  async connect(): Promise<boolean> {
    try {
      // Check if the Fabric service is accessible via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('fabric-ping', {
        method: 'GET'
      });

      if (error) {
        console.error('Failed to connect to fabric service:', error);
        return false;
      }

      this.gatewayConnected = true;
      return true;
    } catch (err) {
      console.error('Error connecting to fabric service:', err);
      return false;
    }
  }

  private async callChaincode(functionName: string, args: any = {}): Promise<any> {
    const connected = await this.ensureConnection();
    if (!connected) {
      throw new Error('Not connected to blockchain network');
    }

    try {
      const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          functionName,
          args
        }
      });

      if (error) {
        throw new Error(`Chaincode error: ${error.message}`);
      }

      return data;
    } catch (err) {
      console.error(`Error calling chaincode function ${functionName}:`, err);
      throw err;
    }
  }

  async registerDrug(drugData: any): Promise<Drug> {
    await this.ensureConnection();
    console.log('FabricService.registerDrug called with:', drugData);
    
    const { data, error } = await this.callChaincode('RegisterDrug', [JSON.stringify(drugData)]);
    
    if (error) {
      console.error('Error registering drug:', error);
      throw new Error(`Failed to register drug: ${error.message}`);
    }
    
    return data as Drug;
  }

  async getAllDrugs(): Promise<Drug[]> {
    await this.ensureConnection();
    console.log('FabricService.getAllDrugs called');
    
    const { data, error } = await this.callChaincode('GetAllDrugs');
    
    if (error) {
      console.error('Error getting all drugs:', error);
      throw new Error(`Failed to get all drugs: ${error.message}`);
    }
    
    return data as Drug[];
  }

  async getDrugsByOwner(ownerId: string): Promise<Drug[]> {
    await this.ensureConnection();
    console.log('FabricService.getDrugsByOwner called for:', ownerId);
    
    const { data, error } = await this.callChaincode('GetDrugsByOwner', [ownerId]);
    
    if (error) {
      console.error('Error getting drugs by owner:', error);
      throw new Error(`Failed to get drugs by owner: ${error.message}`);
    }
    
    return data as Drug[];
  }

  async getDrugById(id: string): Promise<Drug | null> {
    await this.ensureConnection();
    console.log('FabricService.getDrugById called for:', id);
    
    const { data, error } = await this.callChaincode('ReadDrug', [id]);
    
    if (error) {
      console.error('Error getting drug by ID:', error);
      throw new Error(`Failed to get drug by ID: ${error.message}`);
    }
    
    return data as Drug;
  }

  async getDrugBySGTIN(sgtin: string): Promise<Drug | null> {
    await this.ensureConnection();
    console.log('FabricService.getDrugBySGTIN called for:', sgtin);
    
    const { data, error } = await this.callChaincode('GetDrugBySGTIN', [sgtin]);
    
    if (error) {
      console.error('Error getting drug by SGTIN:', error);
      throw new Error(`Failed to get drug by SGTIN: ${error.message}`);
    }
    
    return data as Drug;
  }

  async createEvent(eventData: any): Promise<TrackingEvent> {
    await this.ensureConnection();
    console.log('FabricService.createEvent called with:', eventData);
    
    const { data, error } = await this.callChaincode('CreateEvent', [JSON.stringify(eventData)]);
    
    if (error) {
      console.error('Error creating event:', error);
      throw new Error(`Failed to create event: ${error.message}`);
    }
    
    return data as TrackingEvent;
  }

  async getEventsByDrug(drugId: string): Promise<TrackingEvent[]> {
    await this.ensureConnection();
    console.log('FabricService.getEventsByDrug called for:', drugId);
    
    const { data, error } = await this.callChaincode('GetEventsByDrug', [drugId]);
    
    if (error) {
      console.error('Error getting events by drug:', error);
      throw new Error(`Failed to get events by drug: ${error.message}`);
    }
    
    return data as TrackingEvent[];
  }

  async getAllEvents(): Promise<TrackingEvent[]> {
    await this.ensureConnection();
    console.log('FabricService.getAllEvents called');
    
    const { data, error } = await this.callChaincode('GetAllEvents');
    
    if (error) {
      console.error('Error getting all events:', error);
      throw new Error(`Failed to get all events: ${error.message}`);
    }
    
    return data as TrackingEvent[];
  }

  async getRecentEvents(limit: number = 10): Promise<TrackingEvent[]> {
    await this.ensureConnection();
    console.log('FabricService.getRecentEvents called with limit:', limit);
    
    const { data, error } = await this.callChaincode('GetRecentEvents', [limit.toString()]);
    
    if (error) {
      console.error('Error getting recent events:', error);
      throw new Error(`Failed to get recent events: ${error.message}`);
    }
    
    return data as TrackingEvent[];
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
    
    const { data, error } = await this.callChaincode('TransferDrug', [JSON.stringify(transferData)]);
    
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
    
    const { data, error } = await this.callChaincode('ReceiveDrug', [JSON.stringify(receiveData)]);
    
    if (error) {
      console.error('Error receiving drug:', error);
      throw new Error(`Failed to receive drug: ${error.message}`);
    }
    
    return data as boolean;
  }

  async initiateRecall(sgtin: string, reason: string, initiator: any): Promise<boolean> {
    await this.ensureConnection();
    console.log('FabricService.initiateRecall called with:', { sgtin, reason, initiator });
    
    const recallData = {
      sgtin,
      reason,
      initiatedBy: initiator,
      timestamp: new Date().toISOString()
    };
    
    try {
      const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
        method: 'POST',
        body: { 
          sgtin,
          reason,
          initiatedBy: initiator,
          timestamp: new Date().toISOString()
        },
        headers: {
          'Content-Type': 'application/json',
          path: '/recall'
        }
      });
      
      if (error) {
        console.error('Error initiating recall:', error);
        throw new Error(`Failed to initiate recall: ${error.message}`);
      }
      
      return data.success as boolean;
    } catch (directCallError) {
      console.error('Error with direct API call, falling back to chaincode invoke:', directCallError);
      
      // Fallback to chaincode invoke
      const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
        body: { 
          action: 'invoke',
          chaincodeFcn: 'InitiateRecall',
          args: [JSON.stringify(recallData)]
        }
      });
      
      if (error) {
        console.error('Error initiating recall via chaincode:', error);
        throw new Error(`Failed to initiate recall: ${error.message}`);
      }
      
      return data.success as boolean;
    }
  }

  async checkRecallStatus(sgtin: string): Promise<any> {
    await this.ensureConnection();
    console.log('FabricService.checkRecallStatus called for:', sgtin);
    
    try {
      // Try direct API call first
      const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
        method: 'GET',
        headers: {
          path: `/recall/${sgtin}`
        }
      });
      
      if (error) {
        console.error('Error checking recall status:', error);
        throw new Error(`Failed to check recall status: ${error.message}`);
      }
      
      return data;
    } catch (directCallError) {
      console.error('Error with direct API call, falling back to chaincode query:', directCallError);
      
      // Fallback to chaincode query
      const { data, error } = await supabase.functions.invoke('fabric-chaincode', {
        body: { 
          action: 'query',
          chaincodeFcn: 'IsRecalled',
          args: [sgtin]
        }
      });
      
      if (error) {
        console.error('Error checking recall status via chaincode:', error);
        throw new Error(`Failed to check recall status: ${error.message}`);
      }
      
      return data;
    }
  }

  async getDrugDetailsBySGTIN(sgtin: string): Promise<any> {
    try {
      // Call the Edge Function to get drug details for public tracking
      const { data, error } = await supabase.functions.invoke('track-drug', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        params: { code: sgtin }
      });

      if (error) {
        throw new Error(`Error fetching drug details: ${error.message}`);
      }

      return data;
    } catch (err) {
      console.error('Error in getDrugDetailsBySGTIN:', err);
      throw err;
    }
  }
}
