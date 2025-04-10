
import { TrackingEvent } from '../types';
import { mockEvents, filterEventsByRole } from '../mockData/index';

export class MockEventService {
  private events: TrackingEvent[] = [];
  private userRole: string = 'regulator'; // Default to regulator which sees everything

  constructor() {
    this.events = [...mockEvents];
  }

  setUserRole(role: string): void {
    this.userRole = role;
  }

  async createEvent(eventData: Omit<TrackingEvent, 'id'>): Promise<TrackingEvent> {
    const newEvent: TrackingEvent = {
      id: Math.random().toString(36).substring(2, 15), // Generate a random ID
      ...eventData
    };
    this.events.push(newEvent);
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
}
