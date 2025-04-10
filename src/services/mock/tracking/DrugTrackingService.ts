
import { MockDrugService } from '../DrugService';
import { MockEventService } from '../EventService';
import { DrugTraceability } from '../../types/TrackingTypes';
import { RecallTrackingService } from './RecallTrackingService';

export class DrugTrackingService {
  private drugService: MockDrugService;
  private eventService: MockEventService;
  private recallService: RecallTrackingService;

  constructor(
    drugService: MockDrugService,
    eventService: MockEventService,
    recallService: RecallTrackingService
  ) {
    this.drugService = drugService;
    this.eventService = eventService;
    this.recallService = recallService;
  }

  async getDrugDetailsBySGTIN(sgtin: string): Promise<DrugTraceability | null> {
    const drug = await this.drugService.getDrugBySGTIN(sgtin);
    
    if (!drug) {
      return null;
    }
    
    // Get events for this drug
    const allEvents = await this.eventService.getEventsByDrug(drug.id);
    
    // Sort events by timestamp
    const sortedEvents = [...allEvents].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Check if drug is recalled
    const recallStatus = await this.recallService.checkDrugRecallStatus(sgtin);
    
    // Format the response as expected by the tracking UI
    return {
      drug: {
        name: drug.productName || drug.name,
        manufacturer: drug.manufacturerName || drug.manufacturer,
        batchId: drug.batchNumber,
        expiry: drug.expiryDate,
        license: drug.licenseNumber || drug.id,
        sgtin: drug.sgtin
      },
      events: sortedEvents.map(event => ({
        step: event.type.charAt(0).toUpperCase() + event.type.slice(1),
        timestamp: event.timestamp,
        location: event.location || '',
        handler: typeof event.actor === 'string' ? event.actor : event.actor.name,
        notes: event.details?.notes || ''
      })),
      status: recallStatus
    };
  }
}
