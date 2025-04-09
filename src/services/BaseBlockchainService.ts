
import { IFabricService, Drug, TrackingEvent } from './types';
import { supabase } from '@/integrations/supabase/client';

export abstract class BaseBlockchainService implements IFabricService {
  protected gatewayConnected: boolean = false;

  abstract connect(): Promise<boolean>;
  
  protected async ensureConnection(): Promise<boolean> {
    if (!this.gatewayConnected) {
      return this.connect();
    }
    return true;
  }

  // Abstract methods to be implemented by concrete classes
  abstract registerDrug(drugData: any): Promise<Drug>;
  abstract getAllDrugs(): Promise<Drug[]>;
  abstract getDrugsByOwner(ownerId: string): Promise<Drug[]>;
  abstract getDrugById(id: string): Promise<Drug | null>;
  abstract getDrugBySGTIN(sgtin: string): Promise<Drug | null>;
  abstract createEvent(eventData: any): Promise<TrackingEvent>;
  abstract getEventsByDrug(drugId: string): Promise<TrackingEvent[]>;
  abstract getAllEvents(): Promise<TrackingEvent[]>;
  abstract getRecentEvents(limit?: number): Promise<TrackingEvent[]>;
  abstract transferDrug(drugId: string, fromId: string, toId: string, toName: string, toRole: string, location: string, details: Record<string, any>): Promise<boolean>;
  abstract receiveDrug(drugId: string, receiverId: string, receiverName: string, receiverRole: string, location: string, details: Record<string, any>): Promise<boolean>;
  abstract initiateRecall(sgtin: string, reason: string, initiator: any): Promise<boolean>;
  abstract checkRecallStatus(sgtin: string): Promise<any>;
  abstract getDrugDetailsBySGTIN(sgtin: string): Promise<any>;
}
