
import { TrackingEvent } from '../types';
import { ChainCodeService } from './ChainCodeService';

export class EventService extends ChainCodeService {
  /**
   * Create a new tracking event
   */
  async createEvent(eventData: any): Promise<TrackingEvent> {
    console.log('EventService.createEvent called with:', eventData);
    
    const data = await this.callChaincode('CreateEvent', [JSON.stringify(eventData)]);
    return data as TrackingEvent;
  }

  /**
   * Get events by drug ID
   */
  async getEventsByDrug(drugId: string): Promise<TrackingEvent[]> {
    console.log('EventService.getEventsByDrug called for:', drugId);
    
    const data = await this.callChaincode('GetEventsByDrug', [drugId]);
    return data as TrackingEvent[];
  }

  /**
   * Get all events
   */
  async getAllEvents(): Promise<TrackingEvent[]> {
    console.log('EventService.getAllEvents called');
    
    const data = await this.callChaincode('GetAllEvents');
    return data as TrackingEvent[];
  }

  /**
   * Get recent events with optional limit
   */
  async getRecentEvents(limit: number = 10): Promise<TrackingEvent[]> {
    console.log('EventService.getRecentEvents called with limit:', limit);
    
    const data = await this.callChaincode('GetRecentEvents', [limit.toString()]);
    return data as TrackingEvent[];
  }
}
